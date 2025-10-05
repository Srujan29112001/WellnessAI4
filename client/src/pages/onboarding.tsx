import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Activity, Brain, Sparkles, Target, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  // Personal Information
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(10).max(120),
  gender: z.string().min(1, "Please select a gender"),
  height: z.coerce.number().min(50).max(300, "Height must be in cm"),
  weight: z.coerce.number().min(20).max(500, "Weight must be in kg"),
  region: z.string().min(2, "Please enter your region"),
  occupation: z.string().min(2, "Please enter your occupation"),
  
  // Health Information
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  physicalActivityLevel: z.string().min(1, "Please select activity level"),
  
  // Spiritual Information
  birthPlace: z.string().optional(),
  birthDate: z.string().optional(),
  birthTime: z.string().optional(),
  doshaType: z.string().optional(),
  
  // Preferences
  foodPreference: z.string().min(1, "Please select food preference"),
  weeklyBudget: z.coerce.number().min(0),
  workingHoursPreference: z.string().min(1, "Please select working hours preference"),
  
  // Goals
  physicalGoalsSpeed: z.boolean().default(false),
  physicalGoalsFlexibility: z.boolean().default(false),
  physicalGoalsStrength: z.boolean().default(false),
  mentalGoals: z.boolean().default(false),
  spiritualGoals: z.boolean().default(false),
  goalSpeed: z.string().min(1, "Please select goal speed"),
  
  // Custom
  customPreferences: z.string().optional(),
});

const steps = [
  { id: 1, title: "Personal Info", icon: Activity },
  { id: 2, title: "Health Details", icon: Activity },
  { id: 3, title: "Spiritual Profile", icon: Sparkles },
  { id: 4, title: "Preferences", icon: Brain },
  { id: 5, title: "Goals", icon: Target },
  { id: 6, title: "Review", icon: CheckCircle2 },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 25,
      gender: "",
      height: 170,
      weight: 70,
      region: "",
      occupation: "",
      medicalConditions: "",
      allergies: "",
      physicalActivityLevel: "",
      birthPlace: "",
      birthDate: "",
      birthTime: "",
      doshaType: "",
      foodPreference: "",
      weeklyBudget: 50,
      workingHoursPreference: "",
      physicalGoalsSpeed: false,
      physicalGoalsFlexibility: false,
      physicalGoalsStrength: false,
      mentalGoals: false,
      spiritualGoals: false,
      goalSpeed: "",
      customPreferences: "",
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const physicalGoals = [];
      if (data.physicalGoalsSpeed) physicalGoals.push("speed");
      if (data.physicalGoalsFlexibility) physicalGoals.push("flexibility");
      if (data.physicalGoalsStrength) physicalGoals.push("strength");

      const profileData = {
        name: data.name,
        age: data.age,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        region: data.region,
        occupation: data.occupation,
        medicalConditions: data.medicalConditions ? data.medicalConditions.split(",").map(s => s.trim()) : [],
        allergies: data.allergies ? data.allergies.split(",").map(s => s.trim()) : [],
        physicalActivityLevel: data.physicalActivityLevel,
        birthPlace: data.birthPlace || null,
        birthDate: data.birthDate || null,
        birthTime: data.birthTime || null,
        doshaType: data.doshaType || null,
        foodPreference: data.foodPreference,
        weeklyBudget: data.weeklyBudget,
        workingHoursPreference: data.workingHoursPreference,
        physicalGoals,
        mentalGoals: data.mentalGoals,
        spiritualGoals: data.spiritualGoals,
        goalSpeed: data.goalSpeed,
        customPreferences: data.customPreferences || null,
      };

      return await apiRequest("POST", "/api/profile", profileData);
    },
    onSuccess: (data) => {
      toast({
        title: "Profile Created!",
        description: "Generating your personalized plan...",
      });
      setLocation(`/dashboard?userId=${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createProfileMutation.mutate(data);
  };

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
            Your Holistic Health Journey
          </h1>
          <p className="text-center text-muted-foreground text-lg">
            Help us understand you better to create your personalized wellness plan
          </p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" data-testid="progress-onboarding" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif">
                  {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Tell us about yourself"}
                  {currentStep === 2 && "Share your health information"}
                  {currentStep === 3 && "Spiritual and Ayurvedic details (optional)"}
                  {currentStep === 4 && "Your lifestyle preferences"}
                  {currentStep === 5 && "What are your wellness goals?"}
                  {currentStep === 6 && "Review and submit"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStep === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} data-testid="input-age" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-gender">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} data-testid="input-height" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} data-testid="input-weight" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region/Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Mumbai, India" {...field} data-testid="input-region" />
                          </FormControl>
                          <FormDescription>
                            This helps us suggest region-appropriate ingredients
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Software Engineer" {...field} data-testid="input-occupation" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="medicalConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Conditions (if any)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Diabetes, High BP (comma separated)"
                              {...field}
                              data-testid="input-medical-conditions"
                            />
                          </FormControl>
                          <FormDescription>
                            Separate multiple conditions with commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allergies (if any)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Peanuts, Dairy, Gluten (comma separated)"
                              {...field}
                              data-testid="input-allergies"
                            />
                          </FormControl>
                          <FormDescription>
                            Separate multiple allergies with commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="physicalActivityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Physical Activity Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-activity-level">
                                <SelectValue placeholder="Select your activity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                              <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                              <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                              <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                              <SelectItem value="very_active">Very Active (physical job + exercise)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground">
                        These details help us incorporate Ayurvedic and astrological wisdom into your plan. All fields are optional.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="birthPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Place of Birth (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., New Delhi, India" {...field} data-testid="input-birth-place" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-birth-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="birthTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time of Birth (Optional)</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} data-testid="input-birth-time" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="doshaType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ayurvedic Dosha (if known)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-dosha">
                                <SelectValue placeholder="Select your dosha type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="vata">Vata</SelectItem>
                              <SelectItem value="pitta">Pitta</SelectItem>
                              <SelectItem value="kapha">Kapha</SelectItem>
                              <SelectItem value="vata-pitta">Vata-Pitta</SelectItem>
                              <SelectItem value="pitta-kapha">Pitta-Kapha</SelectItem>
                              <SelectItem value="vata-kapha">Vata-Kapha</SelectItem>
                              <SelectItem value="tridoshic">Tridoshic (balanced)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Don't know your dosha? Our AI will suggest one based on your profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <FormField
                      control={form.control}
                      name="foodPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food Preference</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-food-preference">
                                <SelectValue placeholder="Select your food preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="vegan">Vegan</SelectItem>
                              <SelectItem value="vegetarian">Vegetarian</SelectItem>
                              <SelectItem value="pescatarian">Pescatarian</SelectItem>
                              <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weeklyBudget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekly Food Budget (in your local currency)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} data-testid="input-weekly-budget" />
                          </FormControl>
                          <FormDescription>
                            This helps us suggest affordable ingredient options
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="workingHoursPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Working Hours</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-working-hours">
                                <SelectValue placeholder="When do you prefer to work?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                              <SelectItem value="evening">Evening (6 PM - 12 AM)</SelectItem>
                              <SelectItem value="night">Night (12 AM - 6 AM)</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <div>
                      <FormLabel>Physical Goals (select all that apply)</FormLabel>
                      <div className="space-y-3 mt-3">
                        <FormField
                          control={form.control}
                          name="physicalGoalsSpeed"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-goal-speed"
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Speed & Agility</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="physicalGoalsFlexibility"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-goal-flexibility"
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Flexibility & Mobility</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="physicalGoalsStrength"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-goal-strength"
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Strength & Endurance</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="mentalGoals"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-goal-mental"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Mental Wellness (focus, clarity, stress reduction)
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="spiritualGoals"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-goal-spiritual"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Spiritual Growth (mindfulness, inner peace)
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="goalSpeed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How fast do you want to achieve your goals?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-goal-speed">
                                <SelectValue placeholder="Select goal timeline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="slow">Slow & Steady (6+ months)</SelectItem>
                              <SelectItem value="moderate">Moderate (3-6 months)</SelectItem>
                              <SelectItem value="fast">Fast (1-3 months)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customPreferences"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Preferences (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any other preferences or requirements we should know about?"
                              {...field}
                              data-testid="input-custom-preferences"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                      <h3 className="font-semibold text-lg">Review Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="font-medium">{form.watch("name")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Age</p>
                          <p className="font-medium">{form.watch("age")} years</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Food Preference</p>
                          <p className="font-medium capitalize">{form.watch("foodPreference")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Activity Level</p>
                          <p className="font-medium capitalize">{form.watch("physicalActivityLevel")?.replace("_", " ")}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground">Goals</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {form.watch("physicalGoalsSpeed") && <Badge>Speed</Badge>}
                            {form.watch("physicalGoalsFlexibility") && <Badge>Flexibility</Badge>}
                            {form.watch("physicalGoalsStrength") && <Badge>Strength</Badge>}
                            {form.watch("mentalGoals") && <Badge variant="outline">Mental Wellness</Badge>}
                            {form.watch("spiritualGoals") && <Badge variant="outline">Spiritual Growth</Badge>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Click "Generate My Plan" to create your personalized wellness journey
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                data-testid="button-previous-step"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  data-testid="button-next-step"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createProfileMutation.isPending}
                  data-testid="button-submit-profile"
                >
                  {createProfileMutation.isPending ? "Generating..." : "Generate My Plan"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
