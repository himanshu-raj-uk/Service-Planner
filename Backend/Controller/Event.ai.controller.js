const Event = require("../Model/EventModel");
const ApiError = require("../Utilities/ApiError");
const Notification = require("../Model/AppNotificationModel");
const { eventSchema } = require("../ValidateJoi/Validate");
const { ai } = require("../Config/OpenAi");

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getGeminiPlanConfig = (people) => {
  const numericPeople = Number(people) || 0;

  if (numericPeople <= 50) {
    return {
      models: [
        "gemini-3.5-flash-lite",
        "gemini-3.6-flash",
      ],
      maxOutputTokens: 8192,
    };
  }

  if (numericPeople <= 200) {
    return {
      models: [
        "gemini-3.6-flash",
        "gemini-3.5-flash-lite",
      ],
      maxOutputTokens: 12288,
    };
  }

  return {
    models: [
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite",
    ],
    maxOutputTokens: 16384,
  };
};

const isQuotaError = (error) => {
  const status = Number(error?.status);

  const message = String(
    error?.message ||
      error?.error?.message ||
      "",
  ).toLowerCase();

  return (
    status === 429 ||
    message.includes("resource_exhausted") ||
    message.includes("quota exceeded") ||
    message.includes("rate limit") ||
    message.includes("too many requests")
  );
};

const isTemporaryError = (error) => {
  const status = Number(error?.status);

  const message = String(
    error?.message ||
      error?.error?.message ||
      "",
  ).toLowerCase();

  return (
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes("high demand") ||
    message.includes("temporarily unavailable") ||
    message.includes("service unavailable") ||
    message.includes("fetch failed") ||
    message.includes("overloaded")
  );
};

const cleanJsonResponse = (text) => {
  if (!text) {
    throw new ApiError(
      500,
      "No event plan was returned. Please try again.",
    );
  }

  let cleaned = String(text).trim();

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    cleaned = cleaned.slice(
      firstBrace,
      lastBrace + 1,
    );
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "EVENT AI JSON PARSE ERROR:",
      error,
    );

    throw new ApiError(
      500,
      "The event plan could not be processed correctly. Please try again.",
    );
  }
};

const generateEventPlan = async (
  prompt,
  people,
) => {
  const {
    models,
    maxOutputTokens,
  } = getGeminiPlanConfig(people);

  let lastError = null;

  for (const modelName of models) {
    let modelExhausted = false;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(
          `Gemini ${modelName} attempt ${attempt}/2`,
        );

        const model =
          ai.getGenerativeModel({
            model: modelName,
          });

        const result =
          await model.generateContent({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens,
              responseMimeType:
                "application/json",
            },
          });

        const responseText =
          result?.response?.text?.() ||
          result?.response?.candidates?.[0]
            ?.content?.parts?.[0]?.text;

        if (!responseText?.trim()) {
          throw new Error(
            "Empty Gemini response.",
          );
        }

        console.log(
          `Gemini ${modelName} succeeded on attempt ${attempt}/2`,
        );

        return cleanJsonResponse(
          responseText,
        );
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini ${modelName} attempt ${attempt}/2 failed:`,
          Number(error?.status),
          error?.message || error,
        );

        if (isQuotaError(error)) {
          console.log(
            `Quota/rate limit reached for ${modelName}. Switching model.`,
          );

          modelExhausted = true;
          break;
        }

        if (
          isTemporaryError(error)
        ) {
          modelExhausted = true;

          if (attempt === 1) {
            const retryDelay = 2500;

            console.log(
              `Retrying ${modelName} in ${retryDelay}ms`,
            );

            await delay(retryDelay);
            continue;
          }

          break;
        }

        throw error;
      }
    }

    if (modelExhausted) {
      console.log(
        `Gemini ${modelName} exhausted. Trying next model...`,
      );
    }

    if (
      modelName !==
      models[models.length - 1]
    ) {
      await delay(1000);
    }
  }

  throw (
    lastError ||
    new Error("All Gemini models failed.")
  );
};

const normalizePlaceName = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildGoogleMapsUrl = (
  latitude,
  longitude,
) => {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return "";
  }

  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
};

const getGeoapifyAddress = (
  properties,
) =>
  properties?.formatted ||
  properties?.address_line1 ||
  properties?.address_line2 ||
  "";

const geocodeEventLocation = async (
  location,
) => {
  const apiKey =
    process.env.GEOAPIFY_API_KEY;

  if (!apiKey || !location) {
    return null;
  }

  const locationText = [
    location?.area,
    location?.state,
    location?.country || "India",
  ]
    .filter(Boolean)
    .join(", ");

  if (!locationText) {
    return null;
  }

  const params = new URLSearchParams({
    text: locationText,
    type: "city",
    format: "json",
    limit: "1",
    apiKey,
  });

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(
      `Geoapify event location geocoding failed: ${response.status}`,
    );
  }

  const data = await response.json();

  const result =
    data?.results?.[0];

  const latitude = Number(
    result?.lat,
  );

  const longitude = Number(
    result?.lon,
  );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
};

const searchGeoapifyPlaces = async ({
  latitude,
  longitude,
  categories,
  limit = 50,
  radius = 50000,
}) => {
  const apiKey =
    process.env.GEOAPIFY_API_KEY;

  if (
    !apiKey ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !categories
  ) {
    return [];
  }

  const params = new URLSearchParams({
    categories,
    filter: `circle:${longitude},${latitude},${radius}`,
    bias: `proximity:${longitude},${latitude}`,
    limit: String(limit),
    lang: "en",
    apiKey,
  });

  const response = await fetch(
    `https://api.geoapify.com/v2/places?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(
      `Geoapify places search failed: ${response.status}`,
    );
  }

  const data =
    await response.json();

  return Array.isArray(
    data?.features,
  )
    ? data.features
    : [];
};

const searchGeoapifyPlaceByName =
  async ({
    latitude,
    longitude,
    categories,
    name,
    radius = 50000,
  }) => {
    const apiKey =
      process.env.GEOAPIFY_API_KEY;

    if (
      !apiKey ||
      !name ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return null;
    }

    const params = new URLSearchParams({
      categories,
      name: String(name).trim(),
      filter: `circle:${longitude},${latitude},${radius}`,
      bias: `proximity:${longitude},${latitude}`,
      limit: "1",
      lang: "en",
      apiKey,
    });

    const response = await fetch(
      `https://api.geoapify.com/v2/places?${params.toString()}`,
    );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    return (
      data?.features?.[0] ||
      null
    );
  };

const findMatchingGeoapifyPlace = (
  name,
  features,
) => {
  const target =
    normalizePlaceName(name);

  if (
    !target ||
    !Array.isArray(features)
  ) {
    return null;
  }

  const exact = features.find(
    (feature) =>
      normalizePlaceName(
        feature?.properties?.name,
      ) === target,
  );

  if (exact) {
    return exact;
  }

  const partial = features.find(
    (feature) => {
      const candidate =
        normalizePlaceName(
          feature?.properties?.name,
        );

      if (!candidate) {
        return false;
      }

      return (
        candidate.includes(target) ||
        target.includes(candidate)
      );
    },
  );

  return partial || null;
};

const getPlaceDetails = async (
  placeId,
) => {
  const apiKey =
    process.env.GEOAPIFY_API_KEY;

  if (!apiKey || !placeId) {
    return null;
  }

  const params = new URLSearchParams({
    id: String(placeId),
    features: "details",
    lang: "en",
    apiKey,
  });

  const response = await fetch(
    `https://api.geoapify.com/v2/place-details?${params.toString()}`,
  );

  if (!response.ok) {
    return null;
  }

  const data =
    await response.json();

  const detailsFeature =
    data?.features?.find(
      (feature) =>
        feature?.properties
          ?.feature_type === "details",
    );

  return (
    detailsFeature?.properties ||
    null
  );
};

const getGeoapifyWebsite = async (
  placeId,
) => {
  try {
    const details =
      await getPlaceDetails(
        placeId,
      );

    return (
      details?.website ||
      details?.brand_details
        ?.website ||
      details?.operator_details
        ?.website ||
      details?.owner_details
        ?.website ||
      ""
    );
  } catch (error) {
    console.error(
      "GEOAPIFY WEBSITE LOOKUP ERROR:",
      error?.message || error,
    );

    return "";
  }
};

const convertGeoapifyPlace = (
  feature,
) => {
  const properties =
    feature?.properties || {};

  const latitude = Number(
    properties.lat,
  );

  const longitude = Number(
    properties.lon,
  );

  const placeId =
    properties.place_id || "";

  return {
    placeId,
    address:
      getGeoapifyAddress(
        properties,
      ),
    googleMapsUrl:
      buildGoogleMapsUrl(
        latitude,
        longitude,
      ),
    latitude: Number.isFinite(
      latitude,
    )
      ? latitude
      : null,
    longitude: Number.isFinite(
      longitude,
    )
      ? longitude
      : null,
  };
};

const enrichVenueRecommendations =
  async (
    recommendations,
    venueFeatures,
    location,
  ) => {
    if (
      !Array.isArray(
        recommendations,
      ) ||
      !recommendations.length
    ) {
      return recommendations;
    }

    return Promise.all(
      recommendations.map(
        async (venue) => {
          let feature =
            findMatchingGeoapifyPlace(
              venue?.name,
              venueFeatures,
            );

          if (
            !feature &&
            location
          ) {
            feature =
              await searchGeoapifyPlaceByName(
                {
                  latitude:
                    location.latitude,
                  longitude:
                    location.longitude,
                  categories:
                    "accommodation.hotel,accommodation.guest_house,accommodation.resort,catering.restaurant,catering.cafe,leisure.sports_centre,leisure.stadium,building,entertainment",
                  name:
                    venue?.name,
                },
              );
          }

          if (!feature) {
            return {
              ...venue,
              placeId: "",
              address: venue?.address || "",
              googleMapsUrl: "",
              websiteUrl: "",
            };
          }

          const place =
            convertGeoapifyPlace(
              feature,
            );

          let websiteUrl = "";

          if (place.placeId) {
            websiteUrl =
              await getGeoapifyWebsite(
                place.placeId,
              );
          }

          return {
            ...venue,
            placeId:
              place.placeId,
            address:
              place.address ||
              venue?.address ||
              "",
            googleMapsUrl:
              place.googleMapsUrl,
            websiteUrl,
          };
        },
      ),
    );
  };

const enrichCateringRecommendations =
  async (
    recommendations,
    cateringFeatures,
    location,
  ) => {
    if (
      !Array.isArray(
        recommendations,
      ) ||
      !recommendations.length
    ) {
      return recommendations;
    }

    return Promise.all(
      recommendations.map(
        async (catering) => {
          let feature =
            findMatchingGeoapifyPlace(
              catering?.name,
              cateringFeatures,
            );

          if (
            !feature &&
            location
          ) {
            feature =
              await searchGeoapifyPlaceByName(
                {
                  latitude:
                    location.latitude,
                  longitude:
                    location.longitude,
                  categories:
                    "catering.restaurant,catering.cafe,catering.fast_food",
                  name:
                    catering?.name,
                },
              );
          }

          if (!feature) {
            return {
              ...catering,
              placeId: "",
              address: "",
              googleMapsUrl: "",
              websiteUrl: "",
            };
          }

          const place =
            convertGeoapifyPlace(
              feature,
            );

          let websiteUrl = "";

          if (place.placeId) {
            websiteUrl =
              await getGeoapifyWebsite(
                place.placeId,
              );
          }

          return {
            ...catering,
            placeId:
              place.placeId,
            address:
              place.address,
            googleMapsUrl:
              place.googleMapsUrl,
            websiteUrl,
          };
        },
      ),
    );
  };

const enrichGeoapifyRecommendations =
  async (
    aiPlan,
    location,
  ) => {
    if (
      !process.env.GEOAPIFY_API_KEY
    ) {
      console.warn(
        "GEOAPIFY_API_KEY is not configured. Event map and website links will be unavailable.",
      );

      aiPlan.venueRecommendations =
        Array.isArray(
          aiPlan.venueRecommendations,
        )
          ? aiPlan.venueRecommendations.map(
              (venue) => ({
                ...venue,
                placeId: "",
                googleMapsUrl: "",
                websiteUrl: "",
              }),
            )
          : aiPlan.venueRecommendations;

      aiPlan.cateringRecommendations =
        Array.isArray(
          aiPlan.cateringRecommendations,
        )
          ? aiPlan.cateringRecommendations.map(
              (catering) => ({
                ...catering,
                placeId: "",
                address: "",
                googleMapsUrl: "",
                websiteUrl: "",
              }),
            )
          : aiPlan.cateringRecommendations;

      return aiPlan;
    }

    try {
      const coordinates =
        await geocodeEventLocation(
          location,
        );

      if (!coordinates) {
        return aiPlan;
      }

      const [
        venueFeatures,
        cateringFeatures,
      ] = await Promise.all([
        searchGeoapifyPlaces({
          latitude:
            coordinates.latitude,
          longitude:
            coordinates.longitude,
          categories:
            "accommodation.hotel,accommodation.guest_house,accommodation.resort,catering.restaurant,catering.cafe,leisure.sports_centre,leisure.stadium,building,entertainment",
          limit: 50,
          radius: 50000,
        }),

        searchGeoapifyPlaces({
          latitude:
            coordinates.latitude,
          longitude:
            coordinates.longitude,
          categories:
            "catering.restaurant,catering.cafe,catering.fast_food",
          limit: 50,
          radius: 50000,
        }),
      ]);

      const [
        venueRecommendations,
        cateringRecommendations,
      ] = await Promise.all([
        enrichVenueRecommendations(
          aiPlan.venueRecommendations,
          venueFeatures,
          coordinates,
        ),

        enrichCateringRecommendations(
          aiPlan.cateringRecommendations,
          cateringFeatures,
          coordinates,
        ),
      ]);

      aiPlan.venueRecommendations =
        venueRecommendations;

      aiPlan.cateringRecommendations =
        cateringRecommendations;

      return aiPlan;
    } catch (error) {
      console.error(
        "GEOAPIFY EVENT RECOMMENDATION ENRICHMENT ERROR:",
        error?.message || error,
      );

      return aiPlan;
    }
  };

const validateEventPlan = (
  aiPlan,
) => {
  if (
    !aiPlan ||
    typeof aiPlan !== "object" ||
    Array.isArray(aiPlan)
  ) {
    throw new ApiError(
      500,
      "Invalid event plan received. Please try again.",
    );
  }

  const requiredArrays = [
    "venueRecommendations",
    "cateringRecommendations",
    "decorationIdeas",
    "entertainmentIdeas",
    "photographyRecommendations",
    "musicRecommendations",
    "activities",
    "shoppingList",
    "foodMenu",
    "checklist",
    "timeline",
    "eventTips",
  ];

  for (const field of requiredArrays) {
    if (
      !Array.isArray(
        aiPlan[field],
      )
    ) {
      throw new ApiError(
        500,
        "The event plan is incomplete. Please try generating the plan again.",
      );
    }
  }

  const recommendationFields = [
    "venueRecommendations",
    "cateringRecommendations",
    "decorationIdeas",
    "entertainmentIdeas",
    "photographyRecommendations",
    "musicRecommendations",
  ];

  for (const field of recommendationFields) {
    if (
      aiPlan[field].length < 5
    ) {
      throw new ApiError(
        500,
        "The event plan returned fewer than 5 recommendations. Please try again.",
      );
    }
  }

  if (
    aiPlan.activities.length <
    3
  ) {
    throw new ApiError(
      500,
      "The event activity plan is incomplete. Please try again.",
    );
  }

  if (
    aiPlan.foodMenu.length <
    3
  ) {
    throw new ApiError(
      500,
      "The event food plan is incomplete. Please try again.",
    );
  }

  if (
    aiPlan.timeline.length <
    3
  ) {
    throw new ApiError(
      500,
      "The event timeline is incomplete. Please try again.",
    );
  }

  if (
    !aiPlan.budgetBreakdown ||
    typeof aiPlan.budgetBreakdown !==
      "object"
  ) {
    throw new ApiError(
      500,
      "The event budget breakdown is incomplete. Please try again.",
    );
  }

  if (!aiPlan.summary) {
    throw new ApiError(
      500,
      "The event plan summary is missing. Please try again.",
    );
  }

  return true;
};

const createEvent = async (
  req,
  res,
  next,
) => {
  try {
    const {
      error,
      value,
    } = eventSchema.validate(
      req.body,
      {
        abortEarly: false,
        stripUnknown: true,
      },
    );

    if (error) {
      throw new ApiError(
        400,
        error.details
          .map(
            (detail) =>
              detail.message,
          )
          .join(", "),
      );
    }

    const {
      eventName,
      eventType,
      eventDate,
      startTime,
      endTime,
      people,
      budget,
      location,
      venueType,
      theme,
      foodPreference,
      catering,
      decoration,
      photography,
      entertainment,
      music,
      specialRequest,
    } = value;

    if (!req.user?._id) {
      throw new ApiError(
        401,
        "Authentication is required to create an event plan.",
      );
    }

    const numericPeople =
      Number(people);

    const numericBudget =
      Number(budget);

    if (
      !Number.isInteger(
        numericPeople,
      ) ||
      numericPeople < 10
    ) {
      throw new ApiError(
        400,
        "An event plan requires at least 10 people.",
      );
    }

    if (
      !Number.isFinite(
        numericBudget,
      ) ||
      numericBudget < 10000
    ) {
      throw new ApiError(
        400,
        "Minimum event budget is ₹10,000.",
      );
    }

    if (
      !process.env.GEMINI_API_KEY
    ) {
      throw new ApiError(
        500,
        "The event planning service is currently unavailable.",
      );
    }

    const budgetPerPerson =
      numericBudget /
      numericPeople;

    const locationText = [
      location?.area,
      location?.state,
      location?.country ||
        "India",
    ]
      .filter(Boolean)
      .join(", ");

    const prompt = `
You are an expert event planning assistant.

Create a realistic, practical and detailed event plan using the user's exact requirements.

EVENT DETAILS:

Event Name: ${eventName}

Event Type: ${eventType}

Event Date: ${eventDate}

Start Time: ${startTime}

End Time: ${endTime || "Not specified"}

Number of People: ${numericPeople}

Total Budget: ₹${numericBudget.toLocaleString(
      "en-IN",
    )}

Approximate Budget Per Person: ₹${budgetPerPerson.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      },
    )}

Country: ${
      location?.country || "India"
    }

State: ${location?.state}

Area: ${location?.area}

Address: ${
      location?.address ||
      "Not specified"
    }

Venue Type: ${venueType}

Theme: ${
      theme || "Not specified"
    }

Food Preference: ${foodPreference}

Catering Required: ${
      catering ? "Yes" : "No"
    }

Decoration Required: ${
      decoration ? "Yes" : "No"
    }

Photography Required: ${
      photography ? "Yes" : "No"
    }

Entertainment Required: ${
      entertainment ? "Yes" : "No"
    }

Music Required: ${
      music ? "Yes" : "No"
    }

Special Request:
${
      specialRequest ||
      "None"
    }

EVENT PLANNING RULES:

1. Plan specifically for the requested event type.
2. Do not treat this as a birthday planner.
3. Do not add birthday-specific planning unless explicitly requested.
4. Do not use birthday cake, birthday prank or birthday-age logic.
5. Use the exact requested location when recommending venues and services.
6. Prefer real and recognizable venues and service categories in or near the requested area.
7. The event must be suitable for the requested number of people.
8. Respect the requested venue type.
9. Respect the requested food preference.
10. Respect the requested services.
11. Treat the user's budget as a real budget, not a forced spending target.
12. Do not invent unrealistic prices to keep the event under budget.
13. Do not artificially reduce real-world prices.
14. If realistic event costs exceed the budget, clearly state that the budget may be insufficient.
15. estimatedCost may be higher than the user's budget.
16. remaining may be negative.
17. Suggest practical cost reductions when appropriate.
18. Do not remove important requested services only to make the event appear within budget.
19. Do not claim exact-date availability unless it is actually verified.
20. Use approximate pricing when exact current prices cannot be verified.
21. Use "Price not verified" when a reliable estimate is unavailable.
22. Keep recommendations relevant to the selected location.
23. Do not duplicate recommendations.
24. Keep the timeline realistic.
25. Make the checklist practical.
26. Make the food menu suitable for the number of people.
27. Make decoration suitable for the event type and theme.
28. Make entertainment suitable for the audience and event.
29. Make photography recommendations relevant to the event.
30. Make music recommendations appropriate for the event.
31. If catering is false, do not create a mandatory catering expense.
32. If decoration is false, do not create a mandatory decoration expense.
33. If photography is false, do not create a mandatory photography expense.
34. If entertainment is false, do not create a mandatory entertainment expense.
35. If music is false, do not create a mandatory music expense.

RECOMMENDATION COUNT REQUIREMENTS:

36. Return AT LEAST 5 venue recommendations.
37. Return AT LEAST 5 catering recommendations.
38. Return AT LEAST 5 decoration ideas.
39. Return AT LEAST 5 entertainment ideas.
40. Return AT LEAST 5 photography recommendations.
41. Return AT LEAST 5 music recommendations.
42. NEVER return fewer than 5 items in any recommendation category.
43. You MAY return more than 5 recommendations when useful.
44. NEVER return an empty recommendation array.
45. Do not duplicate recommendations.
46. Recommendations must be realistic for the selected location.
47. Venue recommendations must match the requested venue type as closely as possible.
48. Catering recommendations must respect the requested food preference.
49. Decoration recommendations must match the event type and theme.
50. Entertainment recommendations must match the event type and audience.
51. Photography recommendations must be relevant to the event.
52. Music recommendations must be appropriate for the event type.
53. Do not recommend the same business repeatedly unless genuinely appropriate.

MAP AND PLACE INFORMATION:

54. Venue and catering recommendations will be matched against Geoapify place data by the backend.
55. Do not invent place IDs.
56. Do not invent coordinates.
57. Do not invent Google Maps URLs.
58. Do not invent website URLs.
59. The backend will add Google Maps URLs when Geoapify matching is available.
60. The backend may add official website URLs when Geoapify provides them.
61. Venue names should be real recognizable venues whenever possible.
62. Catering recommendations should be real recognizable restaurants, cafes or catering-related businesses whenever possible.
63. Do not claim that a place is available on the event date unless verified.

BUDGET REALITY:

Return a budgetReality object:

{
  "budget": 0,
  "estimatedCost": 0,
  "remaining": 0,
  "isWithinBudget": true,
  "message": ""
}

Do not manipulate prices to make isWithinBudget true.

RETURN ONLY VALID JSON.

Use exactly this structure:

{
  "summary": "",
  "estimatedCost": 0,

  "budgetReality": {
    "budget": 0,
    "estimatedCost": 0,
    "remaining": 0,
    "isWithinBudget": true,
    "message": ""
  },

  "budgetBreakdown": {
    "venue": 0,
    "decoration": 0,
    "food": 0,
    "photography": 0,
    "entertainment": 0,
    "music": 0,
    "other": 0,
    "remaining": 0
  },

  "venueRecommendations": [
    {
      "name": "",
      "type": "",
      "address": "",
      "price": "",
      "capacity": "",
      "reason": ""
    }
  ],

  "cateringRecommendations": [
    {
      "name": "",
      "speciality": "",
      "price": "",
      "rating": "",
      "reason": ""
    }
  ],

  "decorationIdeas": [
    {
      "name": "",
      "description": "",
      "estimatedCost": ""
    }
  ],

  "entertainmentIdeas": [
    {
      "name": "",
      "description": "",
      "estimatedCost": ""
    }
  ],

  "photographyRecommendations": [
    {
      "name": "",
      "service": "",
      "price": "",
      "reason": ""
    }
  ],

  "musicRecommendations": [
    {
      "name": "",
      "type": "",
      "estimatedCost": "",
      "reason": ""
    }
  ],

  "activities": [
    {
      "name": "",
      "description": "",
      "duration": ""
    }
  ],

  "shoppingList": [
    ""
  ],

  "foodMenu": [
    {
      "name": "",
      "category": "",
      "quantity": "",
      "estimatedCost": ""
    }
  ],

  "checklist": [
    {
      "item": "",
      "priority": "",
      "completed": false
    }
  ],

  "timeline": [
    {
      "time": "",
      "activity": ""
    }
  ],

  "eventTips": [
    ""
  ]
}

ADDITIONAL JSON RULES:

64. estimatedCost must represent the realistic estimated total event cost.
65. Do not artificially cap estimatedCost at the user's budget.
66. budgetBreakdown must represent realistic approximate allocation.
67. remaining equals total budget minus estimatedCost.
68. budgetReality.budget equals the user's total budget.
69. budgetReality.estimatedCost equals estimatedCost.
70. budgetReality.remaining equals total budget minus estimatedCost.
71. If estimatedCost is greater than the budget, isWithinBudget must be false.
72. If estimatedCost is within the budget, isWithinBudget must be true.
73. Explain budget limitations professionally.
74. Keep descriptions concise and useful.
75. Keep recommendations practical.
76. Keep daily/event activities realistic.
77. Do not include unsupported claims.
78. Do not include comments outside or inside the JSON.
79. Do not return markdown fences.
80. Return valid JSON only.
`;

    let aiPlan;

    try {
      aiPlan =
        await generateEventPlan(
          prompt,
          numericPeople,
        );
    } catch (aiError) {
      console.error(
        "ALL GEMINI MODELS FAILED:",
        aiError,
      );

      if (
        isQuotaError(aiError)
      ) {
        throw new ApiError(
          503,
          "The event planning service is currently busy. Please try again in a moment.",
        );
      }

      if (
        isTemporaryError(
          aiError,
        )
      ) {
        throw new ApiError(
          503,
          "The event planning service is temporarily unavailable. Please try again shortly.",
        );
      }

      throw new ApiError(
        503,
        "Unable to generate your event plan at this time. Please try again.",
      );
    }

    validateEventPlan(
      aiPlan,
    );

    const estimatedCost =
      Number(
        aiPlan.estimatedCost,
      ) || 0;

    if (
      !aiPlan.budgetReality
    ) {
      aiPlan.budgetReality =
        {};
    }

    aiPlan.budgetReality.budget =
      numericBudget;

    aiPlan.budgetReality.estimatedCost =
      estimatedCost;

    aiPlan.budgetReality.remaining =
      numericBudget -
      estimatedCost;

    aiPlan.budgetReality.isWithinBudget =
      estimatedCost <=
      numericBudget;

    aiPlan.budgetReality.message =
      estimatedCost <=
      numericBudget
        ? "The estimated event cost is within the selected budget."
        : "The estimated event cost is higher than the selected budget. Consider reducing optional services or increasing the budget.";

    if (
      aiPlan.budgetBreakdown
    ) {
      aiPlan.budgetBreakdown.remaining =
        numericBudget -
        estimatedCost;
    }

    if (
      estimatedCost >
        numericBudget &&
      Array.isArray(
        aiPlan.eventTips,
      )
    ) {
      aiPlan.eventTips.unshift(
        "The estimated event cost is above the selected budget. Review optional services or increase the budget before booking.",
      );
    }

    aiPlan =
      await enrichGeoapifyRecommendations(
        aiPlan,
        location,
      );

    const event =
      await Event.create({
        user: req.user._id,

        eventName,
        eventType,
        eventDate,
        startTime,
        endTime,

        people: numericPeople,
        budget: numericBudget,

        location: {
          country:
            location?.country ||
            "India",
          state:
            location.state,
          area:
            location.area,
          address:
            location?.address ||
            "",
        },

        venueType,
        theme:
          theme || "",

        foodPreference,

        catering:
          Boolean(catering),
        decoration:
          Boolean(decoration),
        photography:
          Boolean(photography),
        entertainment:
          Boolean(entertainment),
        music:
          Boolean(music),

        specialRequest:
          specialRequest || "",

        status: "Created",

        estimatedCost,

        aiPlan,

        isBooked: false,
        isPaid: false,
      });

    try {
      await Notification.create({
        user: req.user._id,
        eventId: event._id,
        title: "Event Plan Ready",
        message: `Your ${String(
          eventName,
        ).trim()} event plan has been generated successfully.`,
        type: "Event",
      });
    } catch (
      notificationError
    ) {
      console.error(
        "Event notification creation failed:",
        notificationError?.message ||
          notificationError,
      );
    }

    return res.status(201).json({
      status: true,
      data: {
        eventId: event._id,
        eventName:
          event.eventName,
        eventType:
          event.eventType,
        eventDate:
          event.eventDate,
        startTime:
          event.startTime,
        endTime:
          event.endTime,
        people:
          event.people,
        budget:
          event.budget,
        location:
          event.location,
        venueType:
          event.venueType,
        theme:
          event.theme,
        foodPreference:
          event.foodPreference,
        catering:
          event.catering,
        decoration:
          event.decoration,
        photography:
          event.photography,
        entertainment:
          event.entertainment,
        music:
          event.music,
        specialRequest:
          event.specialRequest,
        eventPlan:
          event.aiPlan,
      },
    });
  } catch (error) {
    console.error(
      "CREATE EVENT ERROR:",
      error?.message ||
        error,
    );

    next(error);
  }
};

module.exports = {
  createEvent,
};