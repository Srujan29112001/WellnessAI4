import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, Brain, Sparkles, Clock, Utensils, Droplets, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile, MealPlan, Timetable, MealIngredients, WaterIntakeSchedule, SleepSchedule, MealTimings, TimeBlock } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const userId = params.get("userId");
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: [`/api/profile/${userId}`],
    enabled: !!userId,
  });

  const { data: mealPlan, isLoading: mealPlanLoading } = useQuery<MealPlan>({
    queryKey: [`/api/meal-plan/${userId}`],
    enabled: !!userId,
  });

  const { data: timetable, isLoading: timetableLoading } = useQuery<Timetable>({
    queryKey: [`/api/timetable/${userId}`],
    enabled: !!userId,
  });

  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/generate-plan", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/meal-plan/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/timetable/${userId}`] });
      toast({
        title: "Plan Generated!",
        description: "Your new personalized plan is ready.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            User ID not found. Please complete the onboarding first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (profileLoading || mealPlanLoading || timetableLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your wellness dashboard...</p>
        </div>
      </div>
    );
  }

  if (!mealPlan || !timetable) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Generate Your Plan</CardTitle>
            <CardDescription>
              Click below to generate your personalized meal plan and daily timetable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => generatePlanMutation.mutate()}
              disabled={generatePlanMutation.isPending}
              data-testid="button-generate-plan"
            >
              {generatePlanMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate My Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const breakfast = JSON.parse(mealPlan.breakfast) as MealIngredients;
  const lunch = JSON.parse(mealPlan.lunch) as MealIngredients;
  const dinner = JSON.parse(mealPlan.dinner) as MealIngredients;
  const snacks = mealPlan.snacks ? JSON.parse(mealPlan.snacks) as MealIngredients : null;
  const waterIntake = JSON.parse(mealPlan.waterIntake) as WaterIntakeSchedule;
  
  const sleepSchedule = JSON.parse(timetable.sleepSchedule) as SleepSchedule;
  const mealTimings = JSON.parse(timetable.mealTimings) as MealTimings;
  const waterSchedule = JSON.parse(timetable.waterSchedule) as TimeBlock[];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Welcome, {profile?.name}
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Your personalized holistic wellness plan
            </p>
          </div>
          <Button
            onClick={() => generatePlanMutation.mutate()}
            disabled={generatePlanMutation.isPending}
            data-testid="button-regenerate-plan"
          >
            {generatePlanMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Plan
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-physical">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Physical Health</CardTitle>
                <Activity className="h-5 w-5 text-physical" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Activity Level</span>
                  <span className="font-medium capitalize">{profile?.physicalActivityLevel?.replace("_", " ")}</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Goals: {profile?.physicalGoals?.join(", ") || "Not specified"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-mental">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Mental Wellness</CardTitle>
                <Brain className="h-5 w-5 text-mental" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Focus</span>
                  <span className="font-medium">{profile?.mentalGoals ? "Active" : "Balanced"}</span>
                </div>
                <Progress value={80} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {profile?.mentalGoals ? "Working on mental clarity" : "Maintaining balance"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-spiritual">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Spiritual Growth</CardTitle>
                <Sparkles className="h-5 w-5 text-spiritual" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dosha</span>
                  <span className="font-medium capitalize">{profile?.doshaType || "Balanced"}</span>
                </div>
                <Progress value={70} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {profile?.spiritualGoals ? "On a spiritual journey" : "In harmony"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-serif">Daily Timetable</CardTitle>
                    <CardDescription>Your optimal schedule for today</CardDescription>
                  </div>
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="bg-spiritual/20 p-2 rounded-md">
                      <Clock className="h-4 w-4 text-spiritual" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">Sleep Schedule</h4>
                      <p className="text-sm text-muted-foreground">
                        Sleep: {sleepSchedule.sleepTime} | Wake: {sleepSchedule.wakeTime}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total: {sleepSchedule.totalHours} hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="bg-chart-3/20 p-2 rounded-md">
                      <Utensils className="h-4 w-4 text-chart-3" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">Meal Times</h4>
                      <div className="space-y-1 mt-1">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Breakfast:</span> {mealTimings.breakfast}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Lunch:</span> {mealTimings.lunch}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Dinner:</span> {mealTimings.dinner}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="bg-chart-4/20 p-2 rounded-md">
                      <Droplets className="h-4 w-4 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">Water Intake</h4>
                      <p className="text-sm text-muted-foreground">
                        Total: {waterIntake.totalLiters}L daily
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {waterSchedule.slice(0, 3).map((slot, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {slot.time}: {slot.duration}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-serif">Meal Plan</CardTitle>
                    <CardDescription>Today's ingredient-based nutrition</CardDescription>
                  </div>
                  <Utensils className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-chart-3">●</span> Breakfast
                  </h3>
                  <ul className="space-y-1 ml-4">
                    {breakfast.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {item.name} - {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-chart-3">●</span> Lunch
                  </h3>
                  <ul className="space-y-1 ml-4">
                    {lunch.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {item.name} - {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-chart-3">●</span> Dinner
                  </h3>
                  <ul className="space-y-1 ml-4">
                    {dinner.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {item.name} - {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                {snacks && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="text-chart-3">●</span> Snacks
                      </h3>
                      <ul className="space-y-1 ml-4">
                        {snacks.items.map((item, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            {item.name} - {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {mealPlan.foodsToAvoid && mealPlan.foodsToAvoid.length > 0 && (
              <Card className="border-l-4 border-l-destructive">
                <CardHeader>
                  <CardTitle className="text-lg">Foods to Avoid</CardTitle>
                  <CardDescription>Based on your health profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mealPlan.foodsToAvoid.map((food, idx) => (
                      <Badge key={idx} variant="destructive" className="text-xs">
                        {food}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
