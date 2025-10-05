import OpenAI from "openai";
import type { UserProfile, MealIngredients, WaterIntakeSchedule, SleepSchedule, WorkSchedule, MealTimings, TimeBlock } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface MealPlanResponse {
  breakfast: MealIngredients;
  lunch: MealIngredients;
  dinner: MealIngredients;
  snacks: MealIngredients | null;
  foodsToAvoid: string[];
  waterIntake: WaterIntakeSchedule;
}

interface TimetableResponse {
  sleepSchedule: SleepSchedule;
  workSchedule: WorkSchedule;
  mealTimings: MealTimings;
  waterSchedule: TimeBlock[];
  exerciseSchedule: TimeBlock[] | null;
  meditationSchedule: TimeBlock[] | null;
}

export async function generateMealPlan(profile: UserProfile): Promise<MealPlanResponse> {
  const prompt = `You are a holistic health and nutrition expert with deep knowledge of Ayurveda, modern nutrition science, and regional cuisines.

Generate a personalized daily meal plan based on this user profile:

Personal Details:
- Name: ${profile.name}
- Age: ${profile.age}, Gender: ${profile.gender}
- Height: ${profile.height}cm, Weight: ${profile.weight}kg
- Region: ${profile.region}
- Occupation: ${profile.occupation}

Health Information:
- Medical Conditions: ${profile.medicalConditions?.join(", ") || "None"}
- Allergies: ${profile.allergies?.join(", ") || "None"}
- Physical Activity Level: ${profile.physicalActivityLevel}

Spiritual/Ayurvedic Profile:
- Dosha Type: ${profile.doshaType || "Not specified"}
- Birth Place: ${profile.birthPlace || "Not specified"}
- Birth Date/Time: ${profile.birthDate || "Not specified"} ${profile.birthTime || ""}

Preferences:
- Food Preference: ${profile.foodPreference}
- Weekly Budget: ${profile.weeklyBudget} (local currency)

Goals:
- Physical Goals: ${profile.physicalGoals?.join(", ") || "None"}
- Mental Wellness: ${profile.mentalGoals ? "Yes" : "No"}
- Spiritual Growth: ${profile.spiritualGoals ? "Yes" : "No"}
- Goal Speed: ${profile.goalSpeed}

Requirements:
1. Provide ONLY ingredient names with quantities (no recipes or cooking instructions)
2. Consider the user's region for locally available ingredients
3. Respect all allergies and medical conditions strictly
4. Balance the meal plan according to Ayurvedic dosha principles if dosha is specified
5. Stay within budget constraints
6. Support the user's physical, mental, and spiritual goals
7. Provide appropriate calories for their activity level and goals
8. List foods to avoid based on allergies, medical conditions, and Ayurvedic principles
9. Calculate optimal daily water intake and create a schedule

Respond with JSON in this exact format:
{
  "breakfast": {
    "items": [{ "name": "ingredient name", "quantity": "amount with unit" }]
  },
  "lunch": {
    "items": [{ "name": "ingredient name", "quantity": "amount with unit" }]
  },
  "dinner": {
    "items": [{ "name": "ingredient name", "quantity": "amount with unit" }]
  },
  "snacks": {
    "items": [{ "name": "ingredient name", "quantity": "amount with unit" }]
  },
  "foodsToAvoid": ["food1", "food2"],
  "waterIntake": {
    "totalLiters": 2.5,
    "schedule": [
      { "time": "7:00 AM", "amount": "500ml" },
      { "time": "10:00 AM", "amount": "500ml" }
    ]
  }
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert holistic health nutritionist combining Ayurvedic wisdom with modern nutrition science. Always respond with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 8192,
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return result as MealPlanResponse;
}

export async function generateTimetable(profile: UserProfile): Promise<TimetableResponse> {
  const prompt = `You are an expert in holistic wellness, circadian rhythms, Ayurveda, and work-life optimization.

Generate a personalized daily timetable based on this user profile:

Personal Details:
- Name: ${profile.name}
- Age: ${profile.age}, Gender: ${profile.gender}
- Occupation: ${profile.occupation}
- Region: ${profile.region}

Health & Activity:
- Physical Activity Level: ${profile.physicalActivityLevel}
- Medical Conditions: ${profile.medicalConditions?.join(", ") || "None"}

Spiritual/Ayurvedic Profile:
- Dosha Type: ${profile.doshaType || "Balanced"}
- Birth Time: ${profile.birthTime || "Not specified"}

Preferences:
- Working Hours Preference: ${profile.workingHoursPreference}

Goals:
- Physical Goals: ${profile.physicalGoals?.join(", ") || "None"}
- Mental Wellness: ${profile.mentalGoals ? "Yes" : "No"}
- Spiritual Growth: ${profile.spiritualGoals ? "Yes" : "No"}
- Goal Speed: ${profile.goalSpeed}

Requirements:
1. Optimal sleep schedule (7-9 hours based on age and activity level)
2. Work schedule aligned with their preference and natural energy rhythms
3. Meal timings for optimal digestion (consider Ayurvedic principles)
4. Water intake schedule throughout the day
5. Include exercise timing if they have physical goals
6. Include meditation/spiritual practice timing if they have spiritual goals
7. Consider dosha type for optimal activity timings
8. Ensure work-life balance and stress management

Respond with JSON in this exact format:
{
  "sleepSchedule": {
    "sleepTime": "10:00 PM",
    "wakeTime": "6:00 AM",
    "totalHours": 8
  },
  "workSchedule": {
    "blocks": [
      { "startTime": "9:00 AM", "endTime": "1:00 PM", "type": "focused work" },
      { "startTime": "2:00 PM", "endTime": "6:00 PM", "type": "collaborative work" }
    ],
    "totalHours": 8
  },
  "mealTimings": {
    "breakfast": "7:30 AM",
    "lunch": "12:30 PM",
    "dinner": "7:00 PM",
    "snacks": ["10:30 AM", "4:00 PM"]
  },
  "waterSchedule": [
    { "time": "6:30 AM", "duration": "500ml", "activity": "Morning hydration" },
    { "time": "10:00 AM", "duration": "300ml", "activity": "Mid-morning" }
  ],
  "exerciseSchedule": [
    { "time": "6:30 AM", "duration": "30 min", "activity": "Morning yoga/exercise" }
  ],
  "meditationSchedule": [
    { "time": "6:00 AM", "duration": "15 min", "activity": "Morning meditation" }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert in holistic wellness scheduling, combining Ayurvedic principles with modern chronobiology. Always respond with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 8192,
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return result as TimetableResponse;
}
