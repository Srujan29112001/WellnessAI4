# Holistic Health AI - Gen AI Wellness App

## Overview
A comprehensive AI-powered wellness application that generates personalized meal plans and daily timetables based on physical, mental, and spiritual health dimensions. The app combines modern AI technology with traditional Ayurvedic wisdom to create truly holistic health recommendations.

## Project Status
- **Current Phase**: Schema & Frontend Development (Task 1)
- **Stack**: Fullstack JavaScript (React + Express + TypeScript)
- **AI Integration**: OpenAI GPT-5 for personalized plan generation

## Architecture

### Frontend (React + TypeScript)
- **Pages**:
  - `/` - Home/Landing page with features showcase
  - `/onboarding` - Multi-step form (6 steps) to collect user data
  - `/dashboard` - Main dashboard showing meal plans and daily timetables
  
- **Components**:
  - ThemeProvider & ThemeToggle for dark/light mode
  - Multi-step onboarding form with progress indicator
  - Dashboard with health dimension cards (Physical, Mental, Spiritual)
  - Meal plan display with ingredient lists
  - Daily timetable with sleep, meal, and water intake schedules

### Backend (Express + TypeScript)
- **API Endpoints** (to be implemented):
  - `POST /api/profile` - Create user profile
  - `GET /api/profile/:userId` - Get user profile
  - `POST /api/generate-plan` - Generate AI meal plan and timetable
  - `GET /api/meal-plan/:userId` - Get meal plan
  - `GET /api/timetable/:userId` - Get timetable

### Data Schema
- **UserProfile**: Personal info, health data, spiritual profile, preferences, goals
- **MealPlan**: Breakfast, lunch, dinner, snacks (ingredients with quantities), foods to avoid, water intake
- **Timetable**: Sleep schedule, work schedule, meal timings, water schedule, exercise, meditation

### Key Features Implemented (Frontend)
1. ✅ Multi-step onboarding form with 6 sections:
   - Personal Information (name, age, gender, height, weight, region, occupation)
   - Health Details (medical conditions, allergies, activity level)
   - Spiritual Profile (birth details, dosha type)
   - Preferences (food preference, budget, working hours)
   - Goals (physical, mental, spiritual)
   - Review & Submit
   
2. ✅ Dashboard with:
   - Health dimension cards (Physical, Mental, Spiritual) with progress indicators
   - Daily timetable showing sleep, meal times, water schedule
   - Ingredient-based meal plan (breakfast, lunch, dinner, snacks)
   - Foods to avoid list based on health profile
   - Regenerate plan functionality

3. ✅ Home/Landing page with:
   - Hero section
   - How it works (3 steps)
   - Features showcase (8 feature cards)
   - Health dimensions breakdown
   - CTA sections

4. ✅ Design System:
   - Theme support (light/dark mode)
   - Health dimension colors (Physical: teal, Mental: blue, Spiritual: purple)
   - Playfair Display for headings, Inter for body text
   - Consistent spacing and component usage per design guidelines

## User Input Collection
The onboarding form collects:

**Personal Info**: Name, age, gender, height (cm), weight (kg), region, occupation

**Health Details**: Medical conditions, allergies, physical activity level (sedentary to very active)

**Spiritual Profile** (optional): Birth place, birth date, birth time, Ayurvedic dosha type

**Preferences**: Food preference (vegan/vegetarian/pescatarian/non-vegetarian), weekly budget, working hours preference

**Goals**: 
- Physical: Speed, flexibility, strength (checkboxes)
- Mental wellness (checkbox)
- Spiritual growth (checkbox)
- Goal speed: Slow (6+ months), Moderate (3-6 months), Fast (1-3 months)
- Custom preferences (text area)

## AI Integration Plan
OpenAI GPT-5 will:
1. Analyze complete user profile (physical, mental, spiritual dimensions)
2. Generate personalized meal plans with:
   - Region-appropriate ingredients
   - Budget-conscious options
   - Allergy and medical condition awareness
   - Dosha-balanced recommendations
   - Ingredient names and quantities (no recipes)
3. Create optimal daily timetables with:
   - Sleep schedule (optimal hours and timing)
   - Work schedule (based on preferences and occupation)
   - Meal timings
   - Water intake schedule with quantities
   - Optional exercise and meditation blocks

## Recent Changes (October 5, 2025)
- Defined complete data schema in `shared/schema.ts`
- Configured design tokens and theme in `tailwind.config.ts` and `index.css`
- Built all frontend components for MVP:
  - Theme system with dark mode support
  - 6-step onboarding form with validation
  - Dashboard with health dimensions and meal/timetable display
  - Home/landing page with feature showcase
- Set up routing with wouter (/, /onboarding, /dashboard)
- Integrated health dimension colors (physical, mental, spiritual)

## Next Steps
1. Implement backend API endpoints
2. Create OpenAI integration for AI plan generation
3. Implement storage interface for user profiles, meal plans, and timetables
4. Connect frontend to backend
5. Add loading states and error handling
6. Test complete user journey

## Design Guidelines
Following design_guidelines.md:
- Calm, wellness-focused color palette (purple primary, teal secondary, amber accent)
- Inter font for body, Playfair Display for headings
- Card-based layouts with proper spacing
- Health dimension color coding throughout
- Responsive design for all screen sizes
- Dark mode support with proper contrast

## User Preferences
- User requested comprehensive holistic health app
- Focus on AI-powered personalization
- Ingredient lists only (no recipes)
- Integration of physical, mental, and spiritual health
- Ayurvedic and astrological considerations
- Budget-conscious recommendations
- Regional ingredient adaptation
