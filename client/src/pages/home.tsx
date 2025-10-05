import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, Sparkles, Utensils, Clock, TrendingUp, Heart, Leaf, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-primary/10 via-background to-spiritual/10">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/40 z-0"></div>
        <div className="container max-w-6xl mx-auto text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-spiritual to-primary bg-clip-text text-transparent">
            Your Holistic Health Journey
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AI-powered personalized meal plans and daily timetables based on your physical, mental, and spiritual wellness
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding">
              <Button size="lg" className="text-lg px-8" data-testid="button-get-started">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-learn-more">
              Learn More
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Personalized in minutes
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to transform your wellness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Share Your Details</CardTitle>
                <CardDescription>
                  Tell us about your health, lifestyle, spiritual practices, and wellness goals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-spiritual/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-spiritual" />
                </div>
                <CardTitle>2. AI Generates Your Plan</CardTitle>
                <CardDescription>
                  Our AI analyzes your holistic profile and creates personalized recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle>3. Live Your Best Life</CardTitle>
                <CardDescription>
                  Follow your customized meal plan and daily schedule for optimal wellness
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Wellness Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for holistic health in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Utensils className="h-8 w-8 text-chart-3 mb-3" />
                <CardTitle className="text-lg">Meal Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ingredient-based plans with quantities tailored to your budget and preferences
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-lg">Daily Timetable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Optimal timings for sleep, work, meals, and water intake
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="h-8 w-8 text-spiritual mb-3" />
                <CardTitle className="text-lg">Spiritual Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ayurvedic dosha analysis and astrological insights
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-8 w-8 text-destructive mb-3" />
                <CardTitle className="text-lg">Health Awareness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Foods to avoid based on allergies and medical conditions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-physical mb-3" />
                <CardTitle className="text-lg">Goal Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track physical, mental, and spiritual wellness goals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Leaf className="h-8 w-8 text-chart-2 mb-3" />
                <CardTitle className="text-lg">Regional Adaptation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Locally available ingredients based on your location
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-8 w-8 text-mental mb-3" />
                <CardTitle className="text-lg">Activity Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Plans adapted to your physical activity levels
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-8 w-8 text-chart-4 mb-3" />
                <CardTitle className="text-lg">AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced AI considers all dimensions of your wellness
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Holistic Health Dimensions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-physical hover-elevate">
              <CardHeader>
                <Activity className="h-10 w-10 text-physical mb-4" />
                <CardTitle className="text-2xl font-serif">Physical Health</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Nutrition based on activity levels</li>
                  <li>• Body composition goals (speed, strength, flexibility)</li>
                  <li>• Region-specific ingredient recommendations</li>
                  <li>• Allergy and medical condition awareness</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-mental hover-elevate">
              <CardHeader>
                <Brain className="h-10 w-10 text-mental mb-4" />
                <CardTitle className="text-2xl font-serif">Mental Wellness</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Optimized work-life balance schedules</li>
                  <li>• Stress reduction through proper timing</li>
                  <li>• Focus and clarity enhancement</li>
                  <li>• Sleep optimization for mental health</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-spiritual hover-elevate">
              <CardHeader>
                <Sparkles className="h-10 w-10 text-spiritual mb-4" />
                <CardTitle className="text-2xl font-serif">Spiritual Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Ayurvedic dosha-based nutrition</li>
                  <li>• Birth chart and astrological insights</li>
                  <li>• Mindfulness and meditation timing</li>
                  <li>• Inner peace and harmony practices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-spiritual/10 to-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Start Your Wellness Journey Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands who have transformed their lives with personalized holistic health plans
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="text-lg px-8" data-testid="button-cta-start">
              Create My Plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
