const Tour = require("../Model/TripModel");
const ApiError = require("../Utilities/ApiError");
const Notification = require("../Model/AppNotificationModel");

const ai = require("../Config/OpenAi");

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getGeminiPlanConfig = (people, days) => {
  const workload = Number(people) * Number(days);

  if (Number(days) <= 3 && workload <= 8) {
    return {
      models: [
        "gemini-3.5-flash-lite",
        "gemini-3.6-flash",
      ],
      maxOutputTokens: 8192,
    };
  }

  if (Number(days) <= 7 && workload <= 21) {
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

const generateTravelPlan = async (
  prompt,
  people,
  days,
) => {
  const {
    models,
    maxOutputTokens,
  } = getGeminiPlanConfig(
    people,
    days,
  );

  let lastError = null;

  for (const model of models) {
    let modelFailedWithTemporaryError = false;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(
          `Gemini ${model} attempt ${attempt + 1}/2`,
        );

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            maxOutputTokens,
            responseMimeType: "application/json",
          },
        });

        if (!response?.text?.trim()) {
          throw new Error(
            "Gemini returned an empty response.",
          );
        }

        console.log(
          `Gemini ${model} succeeded on attempt ${attempt + 1}/2`,
        );

        return response;
      } catch (error) {
        lastError = error;

        const status = Number(error?.status);

        const message = String(
          error?.message || "",
        ).toLowerCase();

        console.error(
          `Gemini ${model} attempt ${attempt + 1}/2 failed:`,
          status,
          error?.message,
        );

        const isQuotaError =
          status === 429 ||
          message.includes("quota exceeded") ||
          message.includes("resource_exhausted") ||
          message.includes("rate limit");

        const isTemporaryError =
          status === 500 ||
          status === 502 ||
          status === 503 ||
          status === 504 ||
          message.includes("high demand") ||
          message.includes("unavailable") ||
          message.includes("overloaded") ||
          message.includes("temporarily") ||
          message.includes("fetch failed");

        if (isQuotaError) {
          console.warn(
            `Gemini ${model} quota/rate limit reached. Switching model without retrying.`,
          );

          modelFailedWithTemporaryError = true;
          break;
        }

        if (!isTemporaryError) {
          throw error;
        }

        modelFailedWithTemporaryError = true;

        if (attempt === 0) {
          const waitTime = 2500;

          console.log(
            `Retrying ${model} in ${waitTime / 1000}s...`,
          );

          await delay(waitTime);
        }
      }
    }

    if (modelFailedWithTemporaryError) {
      console.log(
        `Gemini ${model} exhausted. Trying next model...`,
      );
    }

    if (model !== models[models.length - 1]) {
      await delay(1000);
    }
  }

  throw lastError;
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

const getGeoapifyAddress = (properties) =>
  properties?.formatted ||
  properties?.address_line1 ||
  properties?.address_line2 ||
  "";

const geocodeDestination = async (
  destination,
) => {
  const apiKey =
    process.env.GEOAPIFY_API_KEY;

  if (!apiKey || !destination) {
    return null;
  }

  const params = new URLSearchParams({
    text: String(destination).trim(),
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
      `Geoapify destination geocoding failed: ${response.status}`,
    );
  }

  const data = await response.json();

  const result = data?.results?.[0];

  const latitude = Number(result?.lat);
  const longitude = Number(result?.lon);

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

  const data = await response.json();

  return Array.isArray(data?.features)
    ? data.features
    : [];
};

const searchGeoapifyPlaceByName = async ({
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

  const data = await response.json();

  return data?.features?.[0] || null;
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

  const data = await response.json();

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
      await getPlaceDetails(placeId);

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

const enrichHotelsWithGeoapify = async (
  hotels,
  hotelFeatures,
  location,
) => {
  if (
    !Array.isArray(hotels) ||
    !hotels.length
  ) {
    return hotels;
  }

  const enrichedHotels =
    await Promise.all(
      hotels.map(
        async (hotel) => {
          let feature =
            findMatchingGeoapifyPlace(
              hotel?.name,
              hotelFeatures,
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
                    "accommodation.hotel,accommodation.guest_house,accommodation.hostel,accommodation.motel",
                  name:
                    hotel?.name,
                },
              );
          }

          if (!feature) {
            return {
              ...hotel,
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
            ...hotel,
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

  return enrichedHotels;
};

const enrichRestaurantsWithGeoapify =
  async (
    restaurants,
    restaurantFeatures,
    location,
  ) => {
    if (
      !Array.isArray(
        restaurants,
      ) ||
      !restaurants.length
    ) {
      return restaurants;
    }

    return Promise.all(
      restaurants.map(
        async (restaurant) => {
          let feature =
            findMatchingGeoapifyPlace(
              restaurant?.name,
              restaurantFeatures,
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
                    restaurant?.name,
                },
              );
          }

          if (!feature) {
            return {
              ...restaurant,
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

          return {
            ...restaurant,
            placeId:
              place.placeId,
            address:
              place.address,
            googleMapsUrl:
              place.googleMapsUrl,
            websiteUrl: "",
          };
        },
      ),
    );
  };

const enrichTouristPlacesWithGeoapify =
  async (
    touristPlaces,
    touristFeatures,
    location,
  ) => {
    if (
      !Array.isArray(
        touristPlaces,
      ) ||
      !touristPlaces.length
    ) {
      return touristPlaces;
    }

    return Promise.all(
      touristPlaces.map(
        async (placeItem) => {
          let feature =
            findMatchingGeoapifyPlace(
              placeItem?.name,
              touristFeatures,
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
                    "tourism,tourism.attraction,tourism.sights,leisure,natural,national_park,entertainment",
                  name:
                    placeItem?.name,
                },
              );
          }

          if (!feature) {
            return {
              ...placeItem,
              placeId: "",
              address: "",
              googleMapsUrl: "",
            };
          }

          const place =
            convertGeoapifyPlace(
              feature,
            );

          return {
            ...placeItem,
            placeId:
              place.placeId,
            address:
              place.address,
            googleMapsUrl:
              place.googleMapsUrl,
          };
        },
      ),
    );
  };

const enrichHiddenGemsWithGeoapify =
  async (
    hiddenGems,
    touristFeatures,
    location,
  ) => {
    if (
      !Array.isArray(
        hiddenGems,
      ) ||
      !hiddenGems.length
    ) {
      return hiddenGems;
    }

    return Promise.all(
      hiddenGems.map(
        async (gem) => {
          let feature =
            findMatchingGeoapifyPlace(
              gem?.name,
              touristFeatures,
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
                    "tourism,tourism.attraction,tourism.sights,leisure,natural,national_park,entertainment",
                  name:
                    gem?.name,
                },
              );
          }

          if (!feature) {
            return {
              ...gem,
              placeId: "",
              address: "",
              googleMapsUrl: "",
            };
          }

          const place =
            convertGeoapifyPlace(
              feature,
            );

          return {
            ...gem,
            placeId:
              place.placeId,
            address:
              place.address,
            googleMapsUrl:
              place.googleMapsUrl,
          };
        },
      ),
    );
  };

const enrichGeoapifyRecommendations =
  async (
    aiPlan,
    destination,
  ) => {
    if (
      !process.env.GEOAPIFY_API_KEY
    ) {
      console.warn(
        "GEOAPIFY_API_KEY is not configured. Map and hotel website links will be unavailable.",
      );

      aiPlan.hotels =
        Array.isArray(
          aiPlan.hotels,
        )
          ? aiPlan.hotels.map(
            (hotel) => ({
              ...hotel,
              placeId: "",
              address: "",
              googleMapsUrl: "",
              websiteUrl: "",
            }),
          )
          : aiPlan.hotels;

      aiPlan.restaurants =
        Array.isArray(
          aiPlan.restaurants,
        )
          ? aiPlan.restaurants.map(
            (restaurant) => ({
              ...restaurant,
              placeId: "",
              address: "",
              googleMapsUrl: "",
              websiteUrl: "",
            }),
          )
          : aiPlan.restaurants;

      aiPlan.touristPlaces =
        Array.isArray(
          aiPlan.touristPlaces,
        )
          ? aiPlan.touristPlaces.map(
            (place) => ({
              ...place,
              placeId: "",
              address: "",
              googleMapsUrl: "",
            }),
          )
          : aiPlan.touristPlaces;

      aiPlan.hiddenGems =
        Array.isArray(
          aiPlan.hiddenGems,
        )
          ? aiPlan.hiddenGems.map(
            (gem) => ({
              ...gem,
              placeId: "",
              address: "",
              googleMapsUrl: "",
            }),
          )
          : aiPlan.hiddenGems;

      return aiPlan;
    }

    try {
      const location =
        await geocodeDestination(
          destination,
        );

      if (!location) {
        return aiPlan;
      }

      const [
        hotelFeatures,
        restaurantFeatures,
        touristFeatures,
      ] = await Promise.all([
        searchGeoapifyPlaces({
          latitude:
            location.latitude,
          longitude:
            location.longitude,
          categories:
            "accommodation.hotel,accommodation.guest_house,accommodation.hostel,accommodation.motel",
          limit: 50,
          radius: 50000,
        }),

        searchGeoapifyPlaces({
          latitude:
            location.latitude,
          longitude:
            location.longitude,
          categories:
            "catering.restaurant,catering.cafe,catering.fast_food",
          limit: 50,
          radius: 50000,
        }),

        searchGeoapifyPlaces({
          latitude:
            location.latitude,
          longitude:
            location.longitude,
          categories:
            "tourism,tourism.attraction,tourism.sights,leisure,natural,national_park,entertainment",
          limit: 50,
          radius: 50000,
        }),
      ]);

      const [
        hotels,
        restaurants,
        touristPlaces,
        hiddenGems,
      ] = await Promise.all([
        enrichHotelsWithGeoapify(
          aiPlan.hotels,
          hotelFeatures,
          location,
        ),

        enrichRestaurantsWithGeoapify(
          aiPlan.restaurants,
          restaurantFeatures,
          location,
        ),

        enrichTouristPlacesWithGeoapify(
          aiPlan.touristPlaces,
          touristFeatures,
          location,
        ),

        enrichHiddenGemsWithGeoapify(
          aiPlan.hiddenGems,
          touristFeatures,
          location,
        ),
      ]);

      aiPlan.hotels = hotels;
      aiPlan.restaurants =
        restaurants;
      aiPlan.touristPlaces =
        touristPlaces;
      aiPlan.hiddenGems =
        hiddenGems;

      return aiPlan;
    } catch (error) {
      console.error(
        "GEOAPIFY RECOMMENDATION ENRICHMENT ERROR:",
        error?.message || error,
      );

      return aiPlan;
    }
  };

const createTrip = async (
  req,
  res,
  next,
) => {
  try {
    const {
      destination,
      startLocation,
      budget,
      people,
      days,
      travelType,
      hotelType,
      transport,
      foodPreference,
      specialRequest,
    } = req.body;

    if (
      !destination ||
      budget === undefined ||
      !people ||
      !days
    ) {
      throw new ApiError(
        400,
        "Destination, budget, people and days are required.",
      );
    }

    if (!req.user?._id) {
      throw new ApiError(
        401,
        "User authentication is required.",
      );
    }

    const numericBudget =
      Number(budget);

    const numericPeople =
      Number(people);

    const numericDays =
      Number(days);

    if (
      !Number.isFinite(
        numericBudget,
      )
    ) {
      throw new ApiError(
        400,
        "Please enter a valid travel budget.",
      );
    }

    if (numericBudget < 5000) {
      throw new ApiError(
        400,
        "Travel budget must be at least ₹5,000.",
      );
    }

    if (
      !Number.isInteger(
        numericPeople,
      ) ||
      numericPeople < 1
    ) {
      throw new ApiError(
        400,
        "People must be at least 1.",
      );
    }

    if (
      !Number.isInteger(
        numericDays,
      ) ||
      numericDays < 1
    ) {
      throw new ApiError(
        400,
        "Days must be at least 1.",
      );
    }

    if (
      !process.env.GEMINI_API_KEY
    ) {
      throw new ApiError(
        500,
        "The travel planning service is currently unavailable.",
      );
    }

    const budgetPerPerson =
      numericBudget /
      numericPeople;

    const budgetPerPersonPerDay =
      numericBudget /
      numericPeople /
      numericDays;

    const prompt = `
You are a professional travel planning assistant.

Create a realistic travel plan using the user's exact requirements.

USER TRIP DETAILS:

Destination: ${String(
      destination,
    ).trim()}

Starting Location: ${String(
      startLocation || "",
    ).trim()}

Total Budget: ₹${numericBudget.toLocaleString(
      "en-IN",
    )}

People: ${numericPeople}

Days: ${numericDays}

Travel Type: ${String(
      travelType || "",
    ).trim()}

Hotel Type: ${String(
      hotelType || "",
    ).trim()}

Transport: ${String(
      transport || "",
    ).trim()}

Food Preference: ${String(
      foodPreference || "",
    ).trim()}

Special Request: ${String(
      specialRequest || "",
    ).trim()}

BUDGET CALCULATION:

Total budget: ₹${numericBudget.toLocaleString(
      "en-IN",
    )}

Budget per person: ₹${budgetPerPerson.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      },
    )}

Budget per person per day: ₹${budgetPerPersonPerDay.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      },
    )}

IMPORTANT BUDGET RULES:

1. Treat the user's budget as a real budget, not as a target that must always be met.

2. NEVER invent or manipulate prices to make an expensive hotel, restaurant, attraction, activity or transport option appear affordable.

3. NEVER reduce a real-world price simply because it exceeds the user's budget.

4. NEVER claim a hotel, restaurant, cafe, attraction or activity is within budget when its realistic price is substantially higher.

5. NEVER invent exact current prices.

6. Hotel prices must be written as approximate ranges when reasonable:
   "Approx. ₹X–₹Y per night (verify before booking)"

7. If a current price cannot be reasonably estimated:
   "Price not verified"

8. Entry fees must also be approximate or:
   "Price not verified"

9. If realistic trip costs exceed the user's budget, do NOT fake an under-budget plan.

10. If the selected hotel type is too expensive for the budget, clearly explain that in the plan and recommend realistic lower-cost alternatives only when appropriate.

11. If the user's budget is tight, prefer genuinely affordable transport, food and activities.

12. Free attractions may be recommended when they are genuinely suitable, but do not falsely claim paid attractions are free.

13. The estimatedCost may be higher than the user's budget when that is the realistic result.

14. budgetBreakdown.remaining may be negative when the realistic trip cost exceeds the budget.

15. Use realistic estimates and clearly communicate budget limitations.

16. Do not promise live availability, live pricing, discounts or booking rates.

17. Do not fabricate hotels, restaurants, cafes, tourist attractions or hidden gems.

18. Recommendations must be recognizable and relevant to the destination.

19. Recommendations should be different from each other.

20. Do not force luxury options into a low budget.

21. Do not force the plan under the user's budget just to make the result look successful.

22. If the budget is insufficient, explain the limitation professionally in the summary or travelTips.

RECOMMENDATION REQUIREMENTS:

23. Return AT LEAST 5 hotel recommendations.

24. Return AT LEAST 5 restaurant recommendations.

25. Return AT LEAST 5 tourist place recommendations.

26. Return AT LEAST 5 hidden gem recommendations.

27. Return AT LEAST 5 shopping place recommendations.

28. Return AT LEAST 5 local food recommendations.

29. NEVER return fewer than 5 items in any recommendation category.

30. You MAY return more than 5 recommendations when useful.

31. NEVER return an empty recommendation array.

32. Do not duplicate recommendations.

33. Hotel recommendations should match the requested hotel type as closely as realistically possible.

34. Restaurant recommendations should respect the requested food preference whenever applicable.

35. Tourist places should be suitable for the number of travel days.

36. Hidden gems must be different from the main tourist places.

37. Shopping places must be relevant to the destination.

38. Local foods should be authentic or strongly associated with the destination.

39. Do not recommend the same place in multiple categories unless genuinely appropriate.

40. Hotel names should be real recognizable properties whenever possible.

41. Restaurant and cafe names should be real recognizable places whenever possible.

42. Tourist place names should be real recognizable destinations whenever possible.

43. Hidden gems should be realistic local places rather than invented attractions.

44. Shopping places should be real recognizable markets, malls or shopping areas whenever possible.

MAP AND PLACE INFORMATION:

45. Hotels, restaurants, cafes, tourist places and hidden gems will be matched against Geoapify place data by the backend.

46. Do not invent place IDs, coordinates, map URLs or website URLs.

47. The backend will add Google Maps URLs when matching Geoapify data is available.

48. The backend may add official hotel website URLs when Geoapify provides them.

49. Do not create fake website URLs.

50. Restaurant recommendations may include cafes when relevant to the destination and food preference.

OUTPUT:

Return ONLY valid JSON.

Do not wrap the JSON in markdown.

Use exactly this structure:

{
  "summary": "",
  "estimatedCost": 0,
  "bestTimeToVisit": "",
  "weather": "",
  "budgetBreakdown": {
    "hotel": 0,
    "food": 0,
    "transport": 0,
    "activities": 0,
    "shopping": 0,
    "remaining": 0
  },
  "budgetReality": {
    "status": "",
    "message": ""
  },
  "hotels": [
    {
      "name": "",
      "pricePerNight": "",
      "rating": "",
      "reason": ""
    }
  ],
  "restaurants": [
    {
      "name": "",
      "speciality": "",
      "rating": ""
    }
  ],
  "touristPlaces": [
    {
      "name": "",
      "description": "",
      "entryFee": ""
    }
  ],
  "hiddenGems": [
    {
      "name": "",
      "description": ""
    }
  ],
  "shoppingPlaces": [
    ""
  ],
  "localFoods": [
    ""
  ],
  "packingList": [
    ""
  ],
  "travelTips": [
    ""
  ],
  "dailyPlan": [
    {
      "day": 1,
      "title": "",
      "activities": [
        ""
      ]
    }
  ],
  "emergencyContacts": {
    "hospital": "",
    "police": "",
    "helpline": ""
  }
}

ADDITIONAL JSON RULES:

51. estimatedCost must represent the realistic estimated total trip cost.

52. Do not artificially cap estimatedCost at the user's budget.

53. budgetBreakdown must represent realistic approximate allocation.

54. remaining equals total budget minus estimatedCost.

55. budgetReality.status should be either:
   "Within budget"
   or
   "Budget may be insufficient"

56. budgetReality.message must clearly explain the budget situation.

57. If realistic estimatedCost is greater than the user's budget, budgetReality.status must be "Budget may be insufficient".

58. If realistic estimatedCost is within the user's budget, budgetReality.status must be "Within budget".

59. Keep descriptions concise and useful.

60. Keep daily activities practical and realistic.

61. Do not include unsupported claims.

62. Do not include comments outside or inside the JSON.

63. Do not return markdown fences.

64. Return valid JSON only.
`;

    let response;

    try {
      response =
        await generateTravelPlan(
          prompt,
          numericPeople,
          numericDays,
        );
    } catch (aiError) {
      console.error(
        "ALL GEMINI MODELS FAILED:",
        aiError,
      );

      const status =
        Number(aiError?.status);

      const message = String(
        aiError?.message || "",
      ).toLowerCase();

      if (
        status === 429 ||
        message.includes(
          "quota exceeded",
        ) ||
        message.includes(
          "resource_exhausted",
        )
      ) {
        throw new ApiError(
          503,
          "The travel planning service has reached its current request limit. Please try again later.",
        );
      }

      if (
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        message.includes(
          "high demand",
        ) ||
        message.includes(
          "temporarily",
        ) ||
        message.includes(
          "unavailable",
        ) ||
        message.includes(
          "overloaded",
        ) ||
        message.includes(
          "fetch failed",
        )
      ) {
        throw new ApiError(
          503,
          "The travel planning service is temporarily unavailable. Please try again shortly.",
        );
      }

      throw new ApiError(
        503,
        "Unable to generate your travel plan at this time. Please try again.",
      );
    }

    const content =
      response?.text?.trim();

    if (!content) {
      throw new ApiError(
        503,
        "No travel plan was returned. Please try again.",
      );
    }

    let aiPlan;

    try {
      aiPlan = JSON.parse(
        content,
      );
    } catch (error) {
      console.error(
        "GEMINI JSON ERROR:",
        error,
      );

      console.error(
        "GEMINI RESPONSE:",
        content,
      );

      throw new ApiError(
        500,
        "Travel plan could not be generated correctly. Please try again.",
      );
    }

    if (
      !aiPlan ||
      typeof aiPlan !== "object" ||
      Array.isArray(aiPlan)
    ) {
      throw new ApiError(
        500,
        "Invalid travel plan received. Please try again.",
      );
    }

    const minimumRecommendations = 5;

    const recommendationFields = [
      "hotels",
      "restaurants",
      "touristPlaces",
      "hiddenGems",
      "shoppingPlaces",
      "localFoods",
    ];

    for (const field of recommendationFields) {
      if (
        !Array.isArray(
          aiPlan[field],
        )
      ) {
        throw new ApiError(
          500,
          "The travel plan returned an incomplete recommendation list. Please try again.",
        );
      }

      if (
        aiPlan[field].length <
        minimumRecommendations
      ) {
        throw new ApiError(
          500,
          "The travel plan returned fewer than 5 recommendations. Please try again.",
        );
      }
    }

    if (
      !aiPlan.budgetReality ||
      typeof aiPlan.budgetReality !==
      "object"
    ) {
      aiPlan.budgetReality = {
        status:
          Number(
            aiPlan.estimatedCost,
          ) > numericBudget
            ? "Budget may be insufficient"
            : "Within budget",
        message:
          Number(
            aiPlan.estimatedCost,
          ) > numericBudget
            ? `The realistic estimated trip cost may exceed the ₹${numericBudget.toLocaleString(
              "en-IN",
            )} budget.`
            : "The realistic estimated trip cost is within the requested budget.",
      };
    }

    const estimatedCost =
      Number(
        aiPlan.estimatedCost,
      );

    if (
      Number.isFinite(
        estimatedCost,
      )
    ) {
      aiPlan.budgetReality.status =
        estimatedCost >
          numericBudget
          ? "Budget may be insufficient"
          : "Within budget";

      if (
        estimatedCost >
        numericBudget
      ) {
        aiPlan.budgetReality.message =
          `The realistic estimated trip cost may exceed the ₹${numericBudget.toLocaleString(
            "en-IN",
          )} budget. Prices are estimates and should be verified before booking.`;
      }
    }

    if (
      !Array.isArray(
        aiPlan.travelTips,
      )
    ) {
      aiPlan.travelTips = [];
    }

    if (
      Number.isFinite(
        estimatedCost,
      ) &&
      estimatedCost >
      numericBudget
    ) {
      const budgetWarning =
        `The selected destination and preferences may require more than the ₹${numericBudget.toLocaleString(
          "en-IN",
        )} budget. Consider lower-cost accommodation, transport or activities if you need to stay within budget.`;

      if (
        !aiPlan.travelTips.includes(
          budgetWarning,
        )
      ) {
        aiPlan.travelTips.unshift(
          budgetWarning,
        );
      }
    }

    aiPlan =
      await enrichGeoapifyRecommendations(
        aiPlan,
        String(destination).trim(),
      );

    const trip =
      await Tour.create({
        user: req.user._id,
        destination:
          String(
            destination,
          ).trim(),
        startLocation:
          String(
            startLocation || "",
          ).trim(),
        budget:
          numericBudget,
        people:
          numericPeople,
        days:
          numericDays,
        travelType:
          String(
            travelType || "",
          ).trim(),
        hotelType:
          String(
            hotelType || "",
          ).trim(),
        transport:
          String(
            transport || "",
          ).trim(),
        foodPreference:
          String(
            foodPreference || "",
          ).trim(),
        specialRequest:
          String(
            specialRequest || "",
          ).trim(),
        aiPlan,
      });

    try {
      await Notification.create({
        user: req.user._id,
        tripId: trip._id,
        title: "Tour Plan Ready",
        message: `Your ${String(
          destination,
        ).trim()} tour plan has been generated successfully.`,
        type: "Tour",
      });
    } catch (notificationError) {
      console.error(
        "NOTIFICATION CREATION ERROR:",
        notificationError,
      );
    }

    return res.status(201).json({
      status: true,
      data: {
        tripId: trip._id,
        destination:
          trip.destination,
        startLocation:
          trip.startLocation,
        people:
          trip.people,
        days:
          trip.days,
        budget:
          trip.budget,
        travelType:
          trip.travelType,
        hotelType:
          trip.hotelType,
        transport:
          trip.transport,
        foodPreference:
          trip.foodPreference,
        specialRequest:
          trip.specialRequest,
        tripPlan:
          trip.aiPlan,
      },
    });
  } catch (err) {
    console.error(
      "CREATE TRIP ERROR:",
      err,
    );

    next(err);
  }
};

module.exports = {
  createTrip,
};