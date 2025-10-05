import { type UserProfile, type InsertUserProfile, type MealPlan, type InsertMealPlan, type Timetable, type InsertTimetable } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User Profile operations
  getUserProfile(id: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  
  // Meal Plan operations
  getMealPlan(userId: string): Promise<MealPlan | undefined>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  updateMealPlan(userId: string, mealPlan: InsertMealPlan): Promise<MealPlan>;
  
  // Timetable operations
  getTimetable(userId: string): Promise<Timetable | undefined>;
  createTimetable(timetable: InsertTimetable): Promise<Timetable>;
  updateTimetable(userId: string, timetable: InsertTimetable): Promise<Timetable>;
}

export class MemStorage implements IStorage {
  private userProfiles: Map<string, UserProfile>;
  private mealPlans: Map<string, MealPlan>; // keyed by userId
  private timetables: Map<string, Timetable>; // keyed by userId

  constructor() {
    this.userProfiles = new Map();
    this.mealPlans = new Map();
    this.timetables = new Map();
  }

  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(id);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = { ...insertProfile, id };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async getMealPlan(userId: string): Promise<MealPlan | undefined> {
    return this.mealPlans.get(userId);
  }

  async createMealPlan(insertMealPlan: InsertMealPlan): Promise<MealPlan> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const mealPlan: MealPlan = { ...insertMealPlan, id, createdAt };
    this.mealPlans.set(insertMealPlan.userId, mealPlan);
    return mealPlan;
  }

  async updateMealPlan(userId: string, insertMealPlan: InsertMealPlan): Promise<MealPlan> {
    const existing = this.mealPlans.get(userId);
    const id = existing?.id || randomUUID();
    const createdAt = existing?.createdAt || new Date().toISOString();
    const mealPlan: MealPlan = { ...insertMealPlan, id, createdAt };
    this.mealPlans.set(userId, mealPlan);
    return mealPlan;
  }

  async getTimetable(userId: string): Promise<Timetable | undefined> {
    return this.timetables.get(userId);
  }

  async createTimetable(insertTimetable: InsertTimetable): Promise<Timetable> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const timetable: Timetable = { ...insertTimetable, id, createdAt };
    this.timetables.set(insertTimetable.userId, timetable);
    return timetable;
  }

  async updateTimetable(userId: string, insertTimetable: InsertTimetable): Promise<Timetable> {
    const existing = this.timetables.get(userId);
    const id = existing?.id || randomUUID();
    const createdAt = existing?.createdAt || new Date().toISOString();
    const timetable: Timetable = { ...insertTimetable, id, createdAt };
    this.timetables.set(userId, timetable);
    return timetable;
  }
}

export const storage = new MemStorage();
