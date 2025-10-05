import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMealPlan, generateTimetable } from "./openai";
import { insertUserProfileSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create user profile
  app.post("/api/profile", async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(validatedData);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid profile data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create profile" });
      }
    }
  });

  // Get user profile
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.userId);
      if (!profile) {
        res.status(404).json({ error: "Profile not found" });
        return;
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Get meal plan for user
  app.get("/api/meal-plan/:userId", async (req, res) => {
    try {
      const mealPlan = await storage.getMealPlan(req.params.userId);
      if (!mealPlan) {
        res.status(404).json({ error: "Meal plan not found" });
        return;
      }
      res.json(mealPlan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch meal plan" });
    }
  });

  // Get timetable for user
  app.get("/api/timetable/:userId", async (req, res) => {
    try {
      const timetable = await storage.getTimetable(req.params.userId);
      if (!timetable) {
        res.status(404).json({ error: "Timetable not found" });
        return;
      }
      res.json(timetable);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch timetable" });
    }
  });

  // Generate personalized plan (meal plan + timetable)
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        res.status(404).json({ error: "Profile not found" });
        return;
      }

      // Generate meal plan and timetable in parallel using AI
      const [mealPlanData, timetableData] = await Promise.all([
        generateMealPlan(profile),
        generateTimetable(profile),
      ]);

      // Store meal plan
      const mealPlan = await storage.updateMealPlan(userId, {
        userId,
        breakfast: JSON.stringify(mealPlanData.breakfast),
        lunch: JSON.stringify(mealPlanData.lunch),
        dinner: JSON.stringify(mealPlanData.dinner),
        snacks: mealPlanData.snacks ? JSON.stringify(mealPlanData.snacks) : null,
        foodsToAvoid: mealPlanData.foodsToAvoid,
        waterIntake: JSON.stringify(mealPlanData.waterIntake),
      });

      // Store timetable
      const timetable = await storage.updateTimetable(userId, {
        userId,
        sleepSchedule: JSON.stringify(timetableData.sleepSchedule),
        workSchedule: JSON.stringify(timetableData.workSchedule),
        mealTimings: JSON.stringify(timetableData.mealTimings),
        waterSchedule: JSON.stringify(timetableData.waterSchedule),
        exerciseSchedule: timetableData.exerciseSchedule ? JSON.stringify(timetableData.exerciseSchedule) : null,
        meditationSchedule: timetableData.meditationSchedule ? JSON.stringify(timetableData.meditationSchedule) : null,
      });

      res.json({ mealPlan, timetable });
    } catch (error) {
      console.error("Error generating plan:", error);
      res.status(500).json({ error: "Failed to generate plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
