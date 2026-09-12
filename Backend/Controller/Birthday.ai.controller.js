const Birthday = require("../Model/BirthdayModel");
const ApiError = require("../Utilities/ApiError");
const Notification = require("../Model/AppNotificationModel");

const ai = require("../Config/OpenAi");

const getBudgetMessage = (budget) => {
  const formattedBudget = Number(budget).toLocaleString("en-IN");

  if (budget < 100) {
    return `😂 ₹${formattedBudget}? Are you planning a birthday party or just buying one single samosa?`;
  }

  if (budget < 500) {
    return `😂 ₹${formattedBudget}? Are you planning a birthday party or just going for a walk around the neighborhood?`;
  }

  if (budget < 800) {
    return `😅 ₹${formattedBudget} is a little tight for a proper birthday celebration. Your hotel might ask you to sleep in the lobby!`;
  }

  return `😄 ₹${formattedBudget} is almost there! Just add a little more. Your birthday celebration will thank you!`;
};

const getPrankAgeRules = (age) => {
  if (age <= 12) {
    return `
AGE GROUP: CHILD 1-12

Pranks must be extremely simple, playful and child-friendly.

Suitable examples include:
- silly surprise reveals
- funny birthday signs
- harmless gift-box surprises
- playful room decorations
- funny birthday messages
- safe family jokes

All ideas must be supervised by a responsible adult when appropriate.
Never create fear, panic, physical contact, dangerous challenges or humiliation.
`;
  }

  if (age <= 17) {
    return `
AGE GROUP: TEENAGER 13-17

Pranks can be more creative and funny but must remain completely harmless.

Suitable examples include:
- funny surprise setups
- harmless fake award ceremonies
- playful birthday decorations
- funny but respectful messages
- surprise group activities
- harmless gift surprises
- coordinated friend/family jokes

Never involve dangerous challenges, physical contact, public humiliation,
fake emergencies, threats, property damage, food tampering or anything illegal.
`;
  }

  if (age <= 30) {
    return `
AGE GROUP: YOUNG ADULT 18-30

Create creative, memorable and genuinely fun birthday pranks.

The ideas can be more elaborate and social, such as:
- coordinated friend surprises
- funny fake award ceremonies
- playful mystery reveals
- unexpected themed entrances
- harmless room transformations
- funny childhood-photo presentations
- fake-but-obviously-playful birthday announcements
- surprise mini-games
- harmless gift-box tricks
- coordinated celebration moments

Focus on helping the birthday person enjoy the moment and create memorable
stories with friends and family.

The prank must never depend on fear, humiliation, emotional distress,
physical danger or damaging someone's belongings.
`;
  }

  if (age <= 50) {
    return `
AGE GROUP: ADULT 31-50

Create mature, funny and comfortable birthday pranks suitable for adults.

Prefer:
- playful surprise reveals
- funny award ceremonies
- harmless themed decorations
- amusing gift presentations
- coordinated family/friend jokes
- nostalgic surprises
- lighthearted party games
- funny but respectful birthday announcements

Avoid anything frightening, physically risky, humiliating, invasive or destructive.
`;
  }

  return `
AGE GROUP: 51+

Create gentle, comfortable and respectful birthday pranks.

Prefer:
- nostalgic surprises
- funny family messages
- playful gift reveals
- harmless decorations
- funny birthday awards
- memory-based jokes
- simple group surprises

Keep the experience comfortable, respectful and easy to participate in.
Avoid fear, physical challenges, loud shocks, embarrassment, stress or anything
that could create discomfort.
`;
};

const fetchNearbyVenues = async (userArea, venueType, foodPreference) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) return [];

    const query = `${venueType} ${
      foodPreference !== "Any" ? foodPreference : ""
    } in ${userArea}`;

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query,
    )}&key=${apiKey}`;

    const response = await axios.get(url);

    if (!response.data?.results) return [];

    return response.data.results.slice(0, 5).map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating || "N/A",
      userRatingsTotal: place.user_ratings_total || 0,
      priceLevel: place.price_level
        ? "$".repeat(place.price_level)
        : "Moderate",
    }));
  } catch (error) {
    console.error("GOOGLE PLACES API ERROR:", error.message);

    return [];
  }
};

const generateBirthdayPlan = async (prompt) => {
  const models = ["gemini-3.5-flash-lite", "gemini-3.6-flash"];

  let lastError = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      });

      return response;
    } catch (error) {
      lastError = error;

      const status = error?.status;
      const message = String(error?.message || "").toLowerCase();

      const canUseFallback =
        status === 404 ||
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        message.includes("high demand") ||
        message.includes("unavailable") ||
        message.includes("fetch failed");

      if (!canUseFallback) {
        throw error;
      }
    }
  }

  throw lastError;
};

const validateBirthdayPlan = (plan, prankPreference) => {
  if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
    return false;
  }

  const requiredArrays = [
    "themeSuggestions",
    "recommendedVenues",
    "cakeIdeas",
    "decorationIdeas",
    "gamesAndActivities",
    "eventTimeline",
    "foodMenuSuggestions",
    "checklist",
  ];

  for (const key of requiredArrays) {
    if (!Array.isArray(plan[key]) || plan[key].length < 4) {
      return false;
    }
  }

  if (!Array.isArray(plan.prankIdeas)) {
    return false;
  }

  if (prankPreference === "Yes" && plan.prankIdeas.length !== 5) {
    return false;
  }

  if (prankPreference === "No" && plan.prankIdeas.length !== 0) {
    return false;
  }

  return true;
};

const createBirthday = async (req, res, next) => {
  try {
    const {
      name,
      age,
      area,
      budget,
      people,
      cakeFlavour,
      cakeWeight,
      prank,
      eventType,
      venueType,
      foodPreference,
      specialRequest,
    } = req.body;

    if (
      !name ||
      !age ||
      !area ||
      budget === undefined ||
      budget === "" ||
      !people ||
      !cakeFlavour ||
      cakeWeight === undefined ||
      cakeWeight === ""
    ) {
      throw new ApiError(
        400,
        "Name, age, area, budget, people, cake flavour and cake weight are required.",
      );
    }

    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    const numericBudget = Number(budget);
    const numericPeople = Number(people);
    const numericAge = Number(age);
    const numericCakeWeight = Number(cakeWeight);

    const prankPreference = prank === "Yes" ? "Yes" : "No";

    if (!Number.isFinite(numericBudget)) {
      throw new ApiError(400, "Please enter a valid birthday budget.");
    }

    if (numericBudget < 1000) {
      throw new ApiError(400, getBudgetMessage(numericBudget));
    }

    if (!Number.isInteger(numericPeople) || numericPeople < 1) {
      throw new ApiError(400, "People must be at least 1.");
    }

    if (!Number.isInteger(numericAge) || numericAge < 1) {
      throw new ApiError(400, "Age must be at least 1.");
    }

    if (!Number.isFinite(numericCakeWeight) || numericCakeWeight <= 0) {
      throw new ApiError(400, "Please select a valid cake weight.");
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new ApiError(500, "Gemini API key is not configured.");
    }

    const realVenues = await fetchNearbyVenues(
      String(area).trim(),
      String(venueType || "Any").trim(),
      String(foodPreference || "Any").trim(),
    );

    const prankAgeRules = getPrankAgeRules(numericAge);

    const prompt = `
You are an expert professional party and event planner.

Create a complete, practical and realistic birthday party plan using the user's information and real nearby venue data.

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
11. Consider number of people when calculating costs.
12. Consider the person's age when planning activities and themes.
13. Match the event type, venue preference and food preference.
14. Recommend realistic birthday venues, themes, games and cake ideas.
15. Every venue must have a useful reason.
16. Every cake idea must have a realistic estimated cost.
17. Create a useful event timeline.
18. Never return null values except where explicitly allowed.
19. Never return undefined values.
20. Arrays must always contain useful values.
21. Numeric cost fields must contain numbers only.
22. estimatedCost must be a realistic total estimated birthday celebration cost.
23. remaining must be calculated from the budget.
24. Do not make the estimated cost unnecessarily higher than the user's budget.
25. Make the plan practical for the selected venue preference.
26. Consider the selected food preference.
27. Consider the selected event type.
28. Consider the birthday person's age.
29. Use the nearby venue data when recommending venues.
30. Keep descriptions concise but useful.
31. The user's budget is the maximum total spending target.
32. Never create an estimatedCost substantially higher than the user's budget.
33. Ensure the budgetBreakdown is consistent with estimatedCost.
34. Keep all costs realistic for the user's area.
35. Numeric values must contain numbers only.

ARRAY REQUIREMENTS:

36. themeSuggestions MUST contain at least 4 different useful options.
37. recommendedVenues MUST contain at least 4 different venues.
38. cakeIdeas MUST contain at least 4 different cake ideas.
39. decorationIdeas MUST contain at least 4 different decoration ideas.
40. gamesAndActivities MUST contain at least 4 different activities.
41. eventTimeline MUST contain at least 4 different timeline steps.
42. foodMenuSuggestions MUST contain at least 4 different food options.
43. checklist MUST contain at least 4 different checklist items.
44. Never return fewer than 4 items in any required array.
45. Prefer exactly 4 items for the normal recommendation arrays.
46. Every recommendation must be meaningfully different.
47. Never duplicate the same recommendation using different wording.

PRANK REQUIREMENTS:

48. Prank Preference is: ${prankPreference}

49. ${prankPreference === "Yes" ? "prankIdeas MUST contain EXACTLY 5 different prank ideas." : "prankIdeas MUST be an empty array because the user selected No."}

50. Every prank must be completely harmless and safe.
51. Every prank must be appropriate for the birthday person's age.
52. Pranks must be designed to create fun, laughter and memorable birthday moments.
53. The birthday person should be able to enjoy the joke rather than becoming the target of serious embarrassment or distress.
54. Never suggest physical injury, violence, dangerous activities or unsafe challenges.
55. Never suggest fire, explosives, weapons, choking hazards or dangerous chemicals.
56. Never suggest poisoning, food tampering or intentionally exposing someone to allergens.
57. Never suggest fake emergencies, fake accidents, fake arrests, threats or panic-inducing situations.
58. Never suggest damaging, hiding, stealing or modifying someone's personal property.
59. Never suggest illegal activity.
60. Never involve unwilling strangers.
61. Never suggest secretly recording or publicly posting someone without consent.
62. Never suggest sexual, degrading or humiliating pranks.
63. Never use alcohol, drugs or intoxication as part of a prank.
64. Never create a prank that could cause a person to run, fall, crash, panic or physically react dangerously.
65. Avoid excessive noise or sudden scares.
66. Prefer playful, social, creative and celebration-focused ideas.
67. Each prank must include a clear safe way to perform it.
68. Each prank must explain why it is fun.
69. Each prank must include a safety note.
70. Do not repeat the same prank concept.
71. Follow the age-specific prank rules provided below.

AGE-SPECIFIC PRANK RULES:

${prankAgeRules}

USER INFORMATION:

Person Name: ${String(name).trim()}
Turning Age: ${numericAge}
User Area/Location: ${String(area).trim()}
Budget: ₹${numericBudget}
Guests Count: ${numericPeople}
Cake Flavour: ${String(cakeFlavour).trim()}
Cake Weight: ${numericCakeWeight} kg
Prank Preference: ${prankPreference}
Event Type: ${String(eventType || "General").trim()}
Venue Preference: ${String(venueType || "Any").trim()}
Food Preference: ${String(foodPreference || "Any").trim()}
Special Request: ${String(specialRequest || "None").trim()}

FETCHED GOOGLE MAPS VENUES IN THE AREA:

${JSON.stringify(realVenues, null, 2)}

RETURN EXACTLY THIS JSON STRUCTURE:

{
  "summary": "",
  "estimatedCost": 0,
  "themeSuggestions": [
    "",
    "",
    "",
    ""
  ],
  "budgetBreakdown": {
    "venueAndFood": 0,
    "cakeAndDecorations": 0,
    "entertainment": 0,
    "miscellaneous": 0,
    "remaining": 0
  },
  "recommendedVenues": [
    {
      "name": "",
      "address": "",
      "rating": "",
      "reason": ""
    },
    {
      "name": "",
      "address": "",
      "rating": "",
      "reason": ""
    },
    {
      "name": "",
      "address": "",
      "rating": "",
      "reason": ""
    },
    {
      "name": "",
      "address": "",
      "rating": "",
      "reason": ""
    }
  ],
  "cakeIdeas": [
    {
      "flavor": "",
      "design": "",
      "estimatedCost": 0
    },
    {
      "flavor": "",
      "design": "",
      "estimatedCost": 0
    },
    {
      "flavor": "",
      "design": "",
      "estimatedCost": 0
    },
    {
      "flavor": "",
      "design": "",
      "estimatedCost": 0
    }
  ],
  "decorationIdeas": [
    "",
    "",
    "",
    ""
  ],
  "gamesAndActivities": [
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
  "prankIdeas": ${
    prankPreference === "Yes"
      ? `[
    {
      "name": "",
      "description": "",
      "howToDo": "",
      "safetyNote": ""
    },
    {
      "name": "",
      "description": "",
      "howToDo": "",
      "safetyNote": ""
    },
    {
      "name": "",
      "description": "",
      "howToDo": "",
      "safetyNote": ""
    },
    {
      "name": "",
      "description": "",
      "howToDo": "",
      "safetyNote": ""
    },
    {
      "name": "",
      "description": "",
      "howToDo": "",
      "safetyNote": ""
    }
  ]`
      : `[]`
  },
  "eventTimeline": [
    {
      "time": "",
      "activity": ""
    },
    {
      "time": "",
      "activity": ""
    },
    {
      "time": "",
      "activity": ""
    },
    {
      "time": "",
      "activity": ""
    }
  ],
  "foodMenuSuggestions": [
    "",
    "",
    "",
    ""
  ],
  "checklist": [
    "",
    "",
    "",
    ""
  ]
}
`;

    let response;

    try {
      response = await generateBirthdayPlan(prompt);
    } catch (aiError) {
      if (aiError?.status === 429) {
        throw new ApiError(
          503,
          "😅 Our birthday planner team is receiving too many requests right now. Please try again in a moment.",
        );
      }

      if (aiError?.status === 503) {
        throw new ApiError(
          503,
          "😅 Our birthday planner is busy right now. Please try again in a moment.",
        );
      }

      if (
        String(aiError?.message || "")
          .toLowerCase()
          .includes("fetch failed")
      ) {
        throw new ApiError(
          503,
          "🌐 Our birthday planner connection is temporarily unavailable. Please try again.",
        );
      }

      throw new ApiError(
        503,
        "Unable to generate your birthday plan right now. Please try again.",
      );
    }

    const content = response?.text?.trim();

    if (!content) {
      throw new ApiError(
        503,
        "No birthday plan was returned. Please try again.",
      );
    }

    let aiPlan;

    try {
      aiPlan = JSON.parse(content);
    } catch (error) {
      throw new ApiError(
        500,
        "Birthday plan could not be generated correctly. Please try again.",
      );
    }

    if (!validateBirthdayPlan(aiPlan, prankPreference)) {
      throw new ApiError(
        500,
        prankPreference === "Yes"
          ? "Birthday plan did not contain enough recommendations or 5 valid prank ideas. Please try again."
          : "Birthday plan did not contain enough recommendations. Please try again.",
      );
    }

    const birthday = await Birthday.create({
      user: req.user._id,
      Name: String(name).trim(),
      Age: numericAge,
      Area: String(area).trim(),
      budget: numericBudget,
      people: numericPeople,
      cakeFlavour: String(cakeFlavour).trim(),
      cakeWeight: numericCakeWeight,
      prank: prankPreference,
      eventType: String(eventType || "").trim(),
      venueType: String(venueType || "Any").trim(),
      foodPreference: String(foodPreference || "Any").trim(),
      specialRequest: String(specialRequest || "").trim(),
      estimatedCost: Number(aiPlan.estimatedCost) || numericBudget,
      aiPlan,
    });

    try {
      await Notification.create({
        user: req.user._id,
        birthdayId: birthday._id,
        title: "Birthday Plan Ready 🎉",
        message: `Your birthday plan for ${String(
          name,
        ).trim()} has been generated successfully.`,
        type: "Birthday",
      });
    } catch (notificationError) {}

    return res.status(201).json({
      status: true,
      message: "Birthday plan created successfully.",
      data: {
        birthdayId: birthday._id,
        Name: birthday.Name,
        Age: birthday.Age,
        Area: birthday.Area,
        budget: birthday.budget,
        people: birthday.people,
        cakeFlavour: birthday.cakeFlavour,
        cakeWeight: birthday.cakeWeight,
        prank: birthday.prank,
        eventType: birthday.eventType,
        venueType: birthday.venueType,
        foodPreference: birthday.foodPreference,
        specialRequest: birthday.specialRequest,
        birthdayPlan: birthday.aiPlan,
      },
    });
  } catch (err) {
    console.error("CREATE BIRTHDAY ERROR:", err);

    next(err);
  }
};

module.exports = {
  createBirthday,
};
