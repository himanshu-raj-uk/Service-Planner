const Birthday = require("../Model/BirthdayModel");
const ApiError = require("../Utilities/ApiError");
const Notification = require("../Model/AppNotificationModel");

const ai = require("../Config/OpenAi");

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

const fetchNearbyVenues = async (
  userArea,
  venueType,
  foodPreference,
) => {
  try {
    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return [];
    }

    const query = `${venueType} ${foodPreference !== "Any"
        ? foodPreference
        : ""
      } in ${userArea}`;

    const url =
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query,
      )}&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        "GOOGLE PLACES API ERROR:",
        response.status,
      );

      return [];
    }

    const data =
      await response.json();

    if (!Array.isArray(data?.results)) {
      return [];
    }

    return data.results
      .slice(0, 5)
      .map((place) => ({
        name:
          place.name || "",
        address:
          place.formatted_address ||
          "",
        rating:
          place.rating || "N/A",
        userRatingsTotal:
          place.user_ratings_total ||
          0,
        priceLevel:
          place.price_level
            ? "$".repeat(
              place.price_level,
            )
            : "Moderate",
      }));
  } catch (error) {
    console.error(
      "GOOGLE PLACES API ERROR:",
      error?.message || error,
    );

    return [];
  }
};

const getBirthdayPlanConfig = (
  people,
  age,
) => {
  const workload =
    Number(people) +
    Math.ceil(Number(age) / 10);

  if (
    Number(people) <= 6 &&
    workload <= 10
  ) {
    return {
      models: [
        "gemini-3.5-flash-lite",
        "gemini-3.6-flash",
      ],
      maxOutputTokens: 8192,
    };
  }

  if (
    Number(people) <= 20 &&
    workload <= 25
  ) {
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

const generateBirthdayPlan = async (
  prompt,
  people,
  age,
) => {
  const {
    models,
    maxOutputTokens,
  } = getBirthdayPlanConfig(
    people,
    age,
  );

  let lastError = null;

  for (const model of models) {
    let modelHadTemporaryFailure =
      false;

    for (
      let attempt = 0;
      attempt < 2;
      attempt++
    ) {
      try {
        console.log(
          `Gemini ${model} attempt ${attempt + 1
          }/2`,
        );

        const response =
          await ai.models.generateContent(
            {
              model,
              contents: prompt,
              config: {
                maxOutputTokens,
                responseMimeType:
                  "application/json",
              },
            },
          );

        if (
          !response?.text?.trim()
        ) {
          throw new Error(
            "Gemini returned an empty response.",
          );
        }

        console.log(
          `Gemini ${model} succeeded on attempt ${attempt + 1
          }/2`,
        );

        return response;
      } catch (error) {
        lastError = error;

        const status =
          Number(error?.status);

        const message = String(
          error?.message || "",
        ).toLowerCase();

        console.error(
          `Gemini ${model} attempt ${attempt + 1
          }/2 failed:`,
          status,
          error?.message,
        );

        const isQuotaError =
          status === 429 ||
          message.includes(
            "quota exceeded",
          ) ||
          message.includes(
            "resource_exhausted",
          ) ||
          message.includes(
            "rate limit",
          );

        const isTemporaryError =
          status === 500 ||
          status === 502 ||
          status === 503 ||
          status === 504 ||
          message.includes(
            "high demand",
          ) ||
          message.includes(
            "unavailable",
          ) ||
          message.includes(
            "overloaded",
          ) ||
          message.includes(
            "temporarily",
          ) ||
          message.includes(
            "fetch failed",
          );

        if (isQuotaError) {
          console.warn(
            `Gemini ${model} quota/rate limit reached. Switching model without retrying.`,
          );

          modelHadTemporaryFailure =
            true;

          break;
        }

        if (!isTemporaryError) {
          throw error;
        }

        modelHadTemporaryFailure =
          true;

        if (attempt === 0) {
          const waitTime = 2500;

          console.log(
            `Retrying ${model} in ${waitTime / 1000
            }s...`,
          );

          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                waitTime,
              ),
          );
        }
      }
    }

    if (modelHadTemporaryFailure) {
      console.log(
        `Gemini ${model} exhausted. Trying next model...`,
      );
    }

    if (
      model !==
      models[models.length - 1]
    ) {
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            1000,
          ),
      );
    }
  }

  throw lastError;
};

const validateBirthdayPlan = (
  plan,
  prankPreference,
) => {
  if (
    !plan ||
    typeof plan !== "object" ||
    Array.isArray(plan)
  ) {
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
    if (
      !Array.isArray(plan[key]) ||
      plan[key].length < 4
    ) {
      return false;
    }
  }

  if (
    !Array.isArray(
      plan.prankIdeas,
    )
  ) {
    return false;
  }

  if (
    prankPreference === "Yes" &&
    plan.prankIdeas.length !== 5
  ) {
    return false;
  }

  if (
    prankPreference === "No" &&
    plan.prankIdeas.length !== 0
  ) {
    return false;
  }

  return true;
};

const createBirthday = async (
  req,
  res,
  next,
) => {
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
      throw new ApiError(
        401,
        "User authentication is required.",
      );
    }

    const numericBudget =
      Number(budget);

    const numericPeople =
      Number(people);

    const numericAge =
      Number(age);

    const numericCakeWeight =
      Number(cakeWeight);

    const prankPreference =
      prank === "Yes"
        ? "Yes"
        : "No";

    if (
      !Number.isFinite(
        numericBudget,
      )
    ) {
      throw new ApiError(
        400,
        "Please enter a valid birthday budget.",
      );
    }

    if (numericBudget < 1000) {
      throw new ApiError(
        400,
        "Birthday budget must be at least ₹1,000.",
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
        numericAge,
      ) ||
      numericAge < 1
    ) {
      throw new ApiError(
        400,
        "Age must be at least 1.",
      );
    }

    if (
      !Number.isFinite(
        numericCakeWeight,
      ) ||
      numericCakeWeight <= 0
    ) {
      throw new ApiError(
        400,
        "Please select a valid cake weight.",
      );
    }

    if (
      !process.env.GEMINI_API_KEY
    ) {
      throw new ApiError(
        500,
        "The birthday planning service is currently unavailable.",
      );
    }

    const realVenues =
      await fetchNearbyVenues(
        String(area).trim(),
        String(
          venueType || "Any",
        ).trim(),
        String(
          foodPreference || "Any",
        ).trim(),
      );

    const prankAgeRules =
      getPrankAgeRules(
        numericAge,
      );

    const budgetPerPerson =
      numericBudget /
      numericPeople;

    const prompt = `
You are an expert professional party and event planner.

Create a complete, practical and realistic birthday party plan using the user's information and the available nearby venue data.

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
10. Consider the user's total budget realistically.
11. Consider the number of people when calculating costs.
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
22. estimatedCost must represent the realistic total estimated birthday celebration cost.
23. remaining must equal budget minus estimatedCost.
24. Do not manipulate real-world prices just to make an expensive option fit the budget.
25. Keep the plan practical for the selected venue preference.
26. Consider the selected food preference.
27. Consider the selected event type.
28. Consider the birthday person's age.
29. Use the nearby venue data when recommending venues.
30. Keep descriptions concise but useful.
31. The user's budget is the maximum preferred spending target.
32. Do not falsely claim an expensive birthday celebration fits inside a low budget.
33. Ensure budgetBreakdown is consistent with estimatedCost.
34. Keep costs realistic for the user's area.
35. Numeric values must contain numbers only.
36. Do not invent exact current venue, food or cake prices.
37. If a price is not reliably known, use a reasonable approximate value and make it clear that it is an estimate.
38. Do not reduce a realistic price simply to fit the user's budget.
39. If the realistic celebration cost exceeds the budget, keep the realistic cost and clearly explain the limitation.
40. Prefer genuinely affordable alternatives when the requested option is too expensive.
41. Do not recommend luxury venues or expensive food as if they were affordable when the budget cannot support them.
42. The plan may have an estimatedCost higher than the user's budget if that is the realistic result.
43. Do not create fake venue names or fake pricing.
44. Use fetched venue information whenever a suitable venue is available.
45. Do not claim that fetched venue data represents live availability.

ARRAY REQUIREMENTS:

46. themeSuggestions MUST contain at least 4 different useful options.
47. recommendedVenues MUST contain at least 4 different venues.
48. cakeIdeas MUST contain at least 4 different cake ideas.
49. decorationIdeas MUST contain at least 4 different decoration ideas.
50. gamesAndActivities MUST contain at least 4 different activities.
51. eventTimeline MUST contain at least 4 different timeline steps.
52. foodMenuSuggestions MUST contain at least 4 different food options.
53. checklist MUST contain at least 4 different checklist items.
54. Never return fewer than 4 items in any required array.
55. Prefer exactly 4 items for normal recommendation arrays.
56. Every recommendation must be meaningfully different.
57. Never duplicate the same recommendation using different wording.

PRANK REQUIREMENTS:

58. Prank Preference is: ${prankPreference}

59. ${prankPreference ===
        "Yes"
        ? "prankIdeas MUST contain EXACTLY 5 different prank ideas."
        : "prankIdeas MUST be an empty array because the user selected No."
      }

60. Every prank must be completely harmless and safe.
61. Every prank must be appropriate for the birthday person's age.
62. Pranks must be designed to create fun, laughter and memorable birthday moments.
63. The birthday person should be able to enjoy the joke rather than becoming the target of serious embarrassment or distress.
64. Never suggest physical injury, violence, dangerous activities or unsafe challenges.
65. Never suggest fire, explosives, weapons, choking hazards or dangerous chemicals.
66. Never suggest poisoning, food tampering or intentionally exposing someone to allergens.
67. Never suggest fake emergencies, fake accidents, fake arrests, threats or panic-inducing situations.
68. Never suggest damaging, hiding, stealing or modifying someone's personal property.
69. Never suggest illegal activity.
70. Never involve unwilling strangers.
71. Never suggest secretly recording or publicly posting someone without consent.
72. Never suggest sexual, degrading or humiliating pranks.
73. Never use alcohol, drugs or intoxication as part of a prank.
74. Never create a prank that could cause a person to run, fall, crash, panic or physically react dangerously.
75. Avoid excessive noise or sudden scares.
76. Prefer playful, social, creative and celebration-focused ideas.
77. Each prank must include a clear safe way to perform it.
78. Each prank must explain why it is fun.
79. Each prank must include a safety note.
80. Do not repeat the same prank concept.
81. Follow the age-specific prank rules provided below.

AGE-SPECIFIC PRANK RULES:

${prankAgeRules}

USER INFORMATION:

Person Name: ${String(
        name,
      ).trim()}

Turning Age: ${numericAge}

User Area/Location: ${String(
        area,
      ).trim()}

Budget: ₹${numericBudget.toLocaleString(
        "en-IN",
      )}

Budget Per Person: ₹${budgetPerPerson.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 0,
        },
      )}

Guests Count: ${numericPeople}

Cake Flavour: ${String(
        cakeFlavour,
      ).trim()}

Cake Weight: ${numericCakeWeight} kg

Prank Preference: ${prankPreference}

Event Type: ${String(
        eventType ||
        "General",
      ).trim()}

Venue Preference: ${String(
        venueType ||
        "Any",
      ).trim()}

Food Preference: ${String(
        foodPreference ||
        "Any",
      ).trim()}

Special Request: ${String(
        specialRequest ||
        "None",
      ).trim()}

FETCHED GOOGLE MAPS VENUES IN THE AREA:

${JSON.stringify(
        realVenues,
        null,
        2,
      )}

BUDGET REALISM:

82. The budget is a spending limit, not a reason to fabricate prices.
83. Never make an expensive venue appear cheap.
84. Never make an expensive cake appear cheap.
85. Never make restaurant or catering costs artificially low.
86. If the selected venue type is too expensive for the budget, explain that and recommend genuinely cheaper alternatives where appropriate.
87. If the user's selected preferences cannot realistically fit the budget, set budgetReality.status to "Budget may be insufficient".
88. If the plan realistically fits the budget, set budgetReality.status to "Within budget".
89. budgetReality.message must clearly explain the budget situation.
90. estimatedCost must remain realistic even when it exceeds the user's budget.
91. remaining can be negative when estimatedCost exceeds the budget.
92. Do not force estimatedCost below the user's budget.

RETURN EXACTLY THIS JSON STRUCTURE:

{
  "summary": "",
  "estimatedCost": 0,
  "budgetReality": {
    "status": "",
    "message": ""
  },
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
  "prankIdeas": ${prankPreference === "Yes"
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
      response =
        await generateBirthdayPlan(
          prompt,
          numericPeople,
          numericAge,
        );
    } catch (aiError) {
      console.error(
        "ALL GEMINI BIRTHDAY MODELS FAILED:",
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
        ) ||
        message.includes(
          "rate limit",
        )
      ) {
        throw new ApiError(
          503,
          "The birthday planning service has reached its current request limit. Please try again later.",
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
          "unavailable",
        ) ||
        message.includes(
          "temporarily",
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
          "The birthday planning service is temporarily unavailable. Please try again shortly.",
        );
      }

      throw new ApiError(
        503,
        "Unable to generate your birthday plan at this time. Please try again.",
      );
    }

    const content =
      response?.text?.trim();

    if (!content) {
      throw new ApiError(
        503,
        "No birthday plan was returned. Please try again.",
      );
    }

    let aiPlan;

    try {
      aiPlan = JSON.parse(
        content,
      );
    } catch (error) {
      console.error(
        "GEMINI BIRTHDAY JSON ERROR:",
        error,
      );

      console.error(
        "GEMINI BIRTHDAY RESPONSE:",
        content,
      );

      throw new ApiError(
        500,
        "Birthday plan could not be generated correctly. Please try again.",
      );
    }

    if (
      !validateBirthdayPlan(
        aiPlan,
        prankPreference,
      )
    ) {
      throw new ApiError(
        500,
        prankPreference === "Yes"
          ? "Birthday plan did not contain enough recommendations or 5 valid prank ideas. Please try again."
          : "Birthday plan did not contain enough recommendations. Please try again.",
      );
    }

    const numericEstimatedCost =
      Number(
        aiPlan.estimatedCost,
      );

    if (
      !aiPlan.budgetReality ||
      typeof aiPlan.budgetReality !==
      "object"
    ) {
      aiPlan.budgetReality = {
        status:
          Number.isFinite(
            numericEstimatedCost,
          ) &&
            numericEstimatedCost >
            numericBudget
            ? "Budget may be insufficient"
            : "Within budget",
        message:
          Number.isFinite(
            numericEstimatedCost,
          ) &&
            numericEstimatedCost >
            numericBudget
            ? `The realistic estimated celebration cost may exceed the ₹${numericBudget.toLocaleString(
              "en-IN",
            )} budget.`
            : "The realistic estimated celebration cost is within the requested budget.",
      };
    }

    if (
      Number.isFinite(
        numericEstimatedCost,
      )
    ) {
      aiPlan.budgetReality.status =
        numericEstimatedCost >
          numericBudget
          ? "Budget may be insufficient"
          : "Within budget";

      if (
        numericEstimatedCost >
        numericBudget
      ) {
        aiPlan.budgetReality.message =
          `The realistic estimated celebration cost may exceed the ₹${numericBudget.toLocaleString(
            "en-IN",
          )} budget. Prices are estimates and should be verified before booking.`;
      }
    }

    if (
      !Array.isArray(
        aiPlan.checklist,
      )
    ) {
      aiPlan.checklist = [];
    }

    if (
      Number.isFinite(
        numericEstimatedCost,
      ) &&
      numericEstimatedCost >
      numericBudget
    ) {
      const budgetWarning =
        `The selected birthday preferences may require more than the ₹${numericBudget.toLocaleString(
          "en-IN",
        )} budget. Consider lower-cost venue, food or decoration options if you need to stay within budget.`;

      if (
        !aiPlan.checklist.includes(
          budgetWarning,
        )
      ) {
        aiPlan.checklist.unshift(
          budgetWarning,
        );
      }
    }

    const birthday =
      await Birthday.create({
        user: req.user._id,
        Name: String(
          name,
        ).trim(),
        Age: numericAge,
        Area: String(
          area,
        ).trim(),
        budget:
          numericBudget,
        people:
          numericPeople,
        cakeFlavour:
          String(
            cakeFlavour,
          ).trim(),
        cakeWeight:
          numericCakeWeight,
        prank:
          prankPreference,
        eventType:
          String(
            eventType || "",
          ).trim(),
        venueType:
          String(
            venueType || "Any",
          ).trim(),
        foodPreference:
          String(
            foodPreference ||
            "Any",
          ).trim(),
        specialRequest:
          String(
            specialRequest || "",
          ).trim(),
        estimatedCost:
          Number(
            aiPlan.estimatedCost,
          ) || numericBudget,
        aiPlan,
      });

    try {
      await Notification.create({
        user: req.user._id,
        birthdayId:
          birthday._id,
        title:
          "Birthday Plan Ready",
        message: `Your birthday plan for ${String(
          name,
        ).trim()} has been generated successfully.`,
        type: "Birthday",
      });
    } catch (notificationError) {
      console.error(
        "BIRTHDAY NOTIFICATION CREATION ERROR:",
        notificationError,
      );
    }

    return res.status(201).json({
      status: true,
      message:
        "Birthday plan created successfully.",
      data: {
        birthdayId:
          birthday._id,
        Name:
          birthday.Name,
        Age:
          birthday.Age,
        Area:
          birthday.Area,
        budget:
          birthday.budget,
        people:
          birthday.people,
        cakeFlavour:
          birthday.cakeFlavour,
        cakeWeight:
          birthday.cakeWeight,
        prank:
          birthday.prank,
        eventType:
          birthday.eventType,
        venueType:
          birthday.venueType,
        foodPreference:
          birthday.foodPreference,
        specialRequest:
          birthday.specialRequest,
        birthdayPlan:
          birthday.aiPlan,
      },
    });
  } catch (err) {
    console.error(
      "CREATE BIRTHDAY ERROR:",
      err,
    );

    next(err);
  }
};

module.exports = {
  createBirthday,
};