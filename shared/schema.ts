import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profile table with all holistic health data
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Personal Information
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(), // male, female, other
  height: integer("height").notNull(), // in cm
  weight: integer("weight").notNull(), // in kg
  region: text("region").notNull(),
  occupation: text("occupation").notNull(),
  
  // Health Information
  medicalConditions: text("medical_conditions").array(),
  allergies: text("allergies").array(),
  physicalActivityLevel: text("physical_activity_level").notNull(), // sedentary, light, moderate, active, very_active
  
  // Spiritual/Ayurvedic Information
  birthPlace: text("birth_place"),
  birthDate: text("birth_date"),
  birthTime: text("birth_time"),
  doshaType: text("dosha_type"), // vata, pitta, kapha, vata-pitta, pitta-kapha, vata-kapha, tridoshic
  
  // Preferences
  foodPreference: text("food_preference").notNull(), // vegan, vegetarian, non-vegetarian, pescatarian
  weeklyBudget: integer("weekly_budget").notNull(), // in local currency
  workingHoursPreference: text("working_hours_preference").notNull(), // morning, afternoon, evening, night, flexible
  
  // Goals
  physicalGoals: text("physical_goals").array(), // speed, flexibility, strength
  mentalGoals: boolean("mental_goals").notNull().default(false),
  spiritualGoals: boolean("spiritual_goals").notNull().default(false),
  goalSpeed: text("goal_speed").notNull(), // slow, moderate, fast
  
  // Custom preferences
  customPreferences: text("custom_preferences"),
});

// Meal plan table
export const mealPlans = pgTable("meal_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userProfiles.id),
  breakfast: text("breakfast").notNull(), // JSON string of ingredients with quantities
  lunch: text("lunch").notNull(),
  dinner: text("dinner").notNull(),
  snacks: text("snacks"),
  foodsToAvoid: text("foods_to_avoid").array(),
  waterIntake: text("water_intake").notNull(), // JSON string with schedule and quantities
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Daily timetable table
export const timetables = pgTable("timetables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userProfiles.id),
  sleepSchedule: text("sleep_schedule").notNull(), // JSON with sleep and wake times
  workSchedule: text("work_schedule").notNull(), // JSON with work blocks
  mealTimings: text("meal_timings").notNull(), // JSON with meal times
  waterSchedule: text("water_schedule").notNull(), // JSON with water intake times
  exerciseSchedule: text("exercise_schedule"), // JSON with exercise blocks
  meditationSchedule: text("meditation_schedule"), // JSON with meditation blocks
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Insert schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true,
  createdAt: true,
});

export const insertTimetableSchema = createInsertSchema(timetables).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertTimetable = z.infer<typeof insertTimetableSchema>;
export type Timetable = typeof timetables.$inferSelect;

// Frontend-specific types for structured data
export interface MealIngredients {
  items: { name: string; quantity: string }[];
}

export interface WaterIntakeSchedule {
  totalLiters: number;
  schedule: { time: string; amount: string }[];
}

export interface SleepSchedule {
  sleepTime: string;
  wakeTime: string;
  totalHours: number;
}

export interface WorkSchedule {
  blocks: { startTime: string; endTime: string; type: string }[];
  totalHours: number;
}

export interface MealTimings {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks?: string[];
}

export interface TimeBlock {
  time: string;
  duration: string;
  activity: string;
}
