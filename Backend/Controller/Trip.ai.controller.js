const Tour = require("../Model/TripModel");
const ApiError = require("../Utilities/ApiError");
const Notification = require("../Model/AppNotificationModel");

const ai = require("../Config/OpenAi");

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const generateTravelPlan = async (prompt) => {
  const models = [
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
  ];

  let lastError = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(
          `Gemini ${model} attempt ${attempt + 1}/3`,
        );

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            maxOutputTokens: 16384,
            responseMimeType: "application/json",
          },
        });

        return response;
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini ${model} attempt ${attempt + 1} failed:`,
          error?.status,
          error?.message,
        );

        const status = error?.status;

        const message = String(
          error?.message || "",
        ).toLowerCase();

        const canRetry =
          status === 429 ||
          status === 500 ||
          status === 502 ||
          status === 503 ||
          status === 504 ||
          message.includes("high demand") ||
          message.includes("unavailable") ||
          message.includes("fetch failed");

        if (!canRetry) {
          throw error;
        }

        if (attempt < 2) {
          const waitTime = 3000 * Math.pow(2, attempt);

          console.log(
            `Retrying ${model} in ${waitTime / 1000}s...`,
          );

          await delay(waitTime);
        }
      }
    }

    console.log(
      `Gemini ${model} exhausted. Trying next model...`,
    );
  }

  throw lastError;
};

const createTrip = async (req, res, next) => {
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

    if (!destination || budget === undefined || !people || !days) {
      throw new ApiError(
        400,
        "Destination, budget, people and days are required.",
      );
    }

    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    const numericBudget = Number(budget);
    const numericPeople = Number(people);
    const numericDays = Number(days);

    if (!Number.isFinite(numericBudget)) {
      throw new ApiError(400, "Please enter a valid travel budget.");
    }

    if (numericBudget < 5000) {
      throw new ApiError(
        400,
        "Travel budget must be at least ₹5,000.",
      );
    }

    if (!Number.isInteger(numericPeople) || numericPeople < 1) {
      throw new ApiError(400, "People must be at least 1.");
    }

    if (!Number.isInteger(numericDays) || numericDays < 1) {
      throw new ApiError(400, "Days must be at least 1.");
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new ApiError(500, "Gemini API key is not configured.");
    }

    const prompt = `
You are an expert professional travel consultant.

Create a complete, practical and realistic travel plan using the user's information.

IMPORTANT RULES:

1. Return ONLY one valid JSON object.
2. Do not return markdown.
3. Do not return code fences.
4. Do not write anything before or after the JSON.
5. Never mention AI, artificial intelligence, chatbot, language model, ChatGPT, or generated content.
6. Understand spelling mistakes, grammar mistakes, abbreviations, Hinglish and informal input.
7. Correct unclear spelling internally.
8. Do not mention that corrections were made.
9. If minor information is missing, make a reasonable assumption.
10. Stay within the user's total budget as closely as realistically possible.
11. Consider number of people and number of days when calculating costs.
12. Match the travel style, hotel type, transport and food preference.
13. Recommend realistic hotels, restaurants and tourist places.
14. Every hotel must have a reason.
15. Every restaurant must have a speciality.
16. Every tourist place must have a description.
17. Create a useful day-by-day itinerary.
18. Never return null values.
19. Never return undefined values.
20. Arrays must always contain useful values.
21. Numeric cost fields must contain numbers only.
22. estimatedCost must be a realistic total estimated trip cost.
23. remaining must be calculated from the budget.
24. Do not make the estimated cost unnecessarily higher than the user's budget.
25. Make the plan practical for the selected transport.
26. Consider the selected food preference.
27. Consider the selected hotel type.
28. Consider the selected travel type.
29. Include emergency information appropriate for the destination.
30. Keep descriptions concise but useful.
31. The user's budget is the maximum total spending target.
32. Never create an estimatedCost substantially higher than the user's budget.
33. Ensure the budgetBreakdown is consistent with estimatedCost.
34. Create exactly one dailyPlan entry for each travel day.
35. Do not create more dailyPlan entries than the number of days.
36. Keep all costs realistic for the destination.
37. Use numeric values only for estimatedCost and budgetBreakdown numeric fields.

RECOMMENDATION COUNT REQUIREMENTS:

38. Return AT LEAST 5 hotel recommendations.
39. Return AT LEAST 5 restaurant recommendations.
40. Return AT LEAST 5 tourist place recommendations.
41. Return AT LEAST 5 hidden gem recommendations.
42. Return AT LEAST 5 shopping place recommendations.
43. Return AT LEAST 5 local food recommendations.
44. Prefer 5 to 8 useful recommendations in each recommendation category.
45. Do not fill the arrays with duplicate places, restaurants, hotels or foods.
46. Every recommendation must be relevant to the selected destination.
47. Recommendations should be realistic and currently recognizable places or categories in the destination.
48. Hotel recommendations must match the requested hotel type and user's budget as closely as possible.
49. Restaurant recommendations must respect the user's food preference whenever applicable.
50. Tourist places should be suitable for the number of travel days.
51. Hidden gems should be different from the main tourist places.
52. Shopping recommendations should be relevant to the destination.
53. Local foods should be authentic or strongly associated with the destination.
54. Do not recommend the same place in multiple categories unless it is genuinely appropriate.
55. Do not invent obviously fake hotels, restaurants or attractions.
56. When exact pricing is unavailable, provide a reasonable approximate value rather than leaving the field empty.
57. Keep recommendation descriptions concise and useful.
58. Make recommendations useful for the user's actual trip rather than simply listing famous names.

USER INFORMATION:

Destination: ${String(destination).trim()}
Starting Location: ${String(startLocation || "Not Provided").trim()}
Budget: ₹${numericBudget}
People: ${numericPeople}
Days: ${numericDays}
Travel Type: ${String(travelType || "General").trim()}
Hotel Type: ${String(hotelType || "Standard").trim()}
Transport: ${String(transport || "Any").trim()}
Food Preference: ${String(foodPreference || "Any").trim()}
Special Request: ${String(specialRequest || "None").trim()}

RETURN EXACTLY THIS JSON STRUCTURE:

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

  "hotels": [
    {
      "name": "",
      "pricePerNight": "",
      "rating": "",
      "reason": ""
    },
    {
      "name": "",
      "pricePerNight": "",
      "rating": "",
      "reason": ""
    },
    {
      "name": "",
      "pricePerNight": "",
      "rating": "",
      "reason": ""
    },
    {
      "name": "",
      "pricePerNight": "",
      "rating": "",
      "reason": ""
    },
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
    },
    {
      "name": "",
      "speciality": "",
      "rating": ""
    },
    {
      "name": "",
      "speciality": "",
      "rating": ""
    },
    {
      "name": "",
      "speciality": "",
      "rating": ""
    },
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
    },
    {
      "name": "",
      "description": "",
      "entryFee": ""
    },
    {
      "name": "",
      "description": "",
      "entryFee": ""
    },
    {
      "name": "",
      "description": "",
      "entryFee": ""
    },
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
    },
    {
      "name": "",
      "description": ""
    },
    {
      "name": "",
      "description": ""
    },
    {
      "name": "",
      "description": ""
    },
    {
      "name": "",
      "description": ""
    }
  ],

  "shoppingPlaces": [
    "",
    "",
    "",
    "",
    ""
  ],

  "localFoods": [
    "",
    "",
    "",
    "",
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
`;

    let response;

    try {
      response = await generateTravelPlan(prompt);
    } catch (aiError) {
      console.error("ALL GEMINI MODELS FAILED:", aiError);

      if (aiError?.status === 429) {
        throw new ApiError(
          503,
          "😅 Our Team member is receiving too many requests right now. Please try again in a moment.",
        );
      }

      if (aiError?.status === 503) {
        throw new ApiError(
          503,
          "😅 Our Team member is busy to protect her relationship right now. Please try again in a moment.",
        );
      }

      if (
        String(aiError?.message || "")
          .toLowerCase()
          .includes("fetch failed")
      ) {
        throw new ApiError(
          503,
          "🌐 Our travel planner connection is temporarily unavailable. Please try again.",
        );
      }

      throw new ApiError(
        503,
        "Unable to generate your travel plan right now. Please try again.",
      );
    }

    const content = response?.text?.trim();

    if (!content) {
      throw new ApiError(
        503,
        "No travel plan was returned. Please try again.",
      );
    }

    let aiPlan;

    try {
      aiPlan = JSON.parse(content);
    } catch (error) {
      console.error("GEMINI JSON ERROR:", error);
      console.error("GEMINI RESPONSE:", content);

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

    const trip = await Tour.create({
      user: req.user._id,
      destination: String(destination).trim(),
      startLocation: String(startLocation || "").trim(),
      budget: numericBudget,
      people: numericPeople,
      days: numericDays,
      travelType: String(travelType || "").trim(),
      hotelType: String(hotelType || "").trim(),
      transport: String(transport || "").trim(),
      foodPreference: String(foodPreference || "").trim(),
      specialRequest: String(specialRequest || "").trim(),
      aiPlan,
    });

    try {
      await Notification.create({
        user: req.user._id,
        tripId: trip._id,
        title: "Tour Plan Ready",
        message: `Your ${String(destination).trim()} tour plan has been generated successfully.`,
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
      message: "Tour plan created successfully.",
      data: {
        tripId: trip._id,
        destination: trip.destination,
        startLocation: trip.startLocation,
        people: trip.people,
        days: trip.days,
        budget: trip.budget,
        travelType: trip.travelType,
        hotelType: trip.hotelType,
        transport: trip.transport,
        foodPreference: trip.foodPreference,
        specialRequest: trip.specialRequest,
        tripPlan: trip.aiPlan,
      },
    });
  } catch (err) {
    console.error("CREATE TRIP ERROR:", err);
    next(err);
  }
};

module.exports = {
  createTrip,
};