// app/page.tsx
'use client';

import { useState } from 'react';
import { Brain, Target, Dumbbell, Utensils } from 'lucide-react';


export default function HomePage() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!age || !weight || !goal) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    // Simulate AI plan generation
    setTimeout(() => {
      const samplePlan = {
        workout: {
          title: "5-day weekly routine",
          description: `Here's a detailed 5-day workout plan designed for a ${age}-year-old individual weighing ${weight}kg, focused on building muscle and gaining strength. This plan prioritizes compound movements, progressive overload, and adequate recovery to maximize results.`,
          days: [
            {
              day: "Day 1: Lower Body Strength",
              exercises: [
                "Barbell Back Squats: 3 sets of 6-8 reps",
                "Romanian Deadlifts: 3 sets of 8-10 reps", 
                "Leg Press: 3 sets of 10-12 reps",
                "Walking Lunges: 3 sets of 10-12 reps per leg",
                "Calf Raises: 3 sets of 12-15 reps"
              ]
            },
            {
              day: "Day 2: Upper Body Strength (Push)",
              exercises: [
                "Dumbbell Bench Press: 3 sets of 8-10 reps",
                "Seated Dumbbell Shoulder Press: 3 sets of 8-10 reps",
                "Incline Dumbbell Press: 3 sets of 10-12 reps",
                "Dumbbell Lateral Raises: 3 sets of 12-15 reps",
                "Triceps Pushdowns: 3 sets of 10-12 reps"
              ]
            },
            {
              day: "Day 3: Active Recovery / Core",
              exercises: [
                "Light Cardio: 20-30 minutes",
                "Plank: 30-60 seconds",
                "Side Plank: 20-40 seconds per side",
                "Dead Bug: 10-12 reps per side",
                "Glute Bridges: 12-15 reps"
              ]
            },
            {
              day: "Day 4: Upper Body Strength (Pull)",
              exercises: [
                "Lat Pulldowns: 3 sets of 8-10 reps",
                "Seated Cable Rows: 3 sets of 8-10 reps",
                "Dumbbell Rows: 3 sets of 10-12 reps per arm",
                "Face Pulls: 3 sets of 12-15 reps",
                "Dumbbell Bicep Curls: 3 sets of 10-12 reps"
              ]
            },
            {
              day: "Day 5: Full Body Power",
              exercises: [
                "Kettlebell Swings: 3 sets of 10-12 reps",
                "Push-ups: 3 sets of 8-12 reps",
                "Box Jumps: 3 sets of 8-10 reps",
                "Renegade Rows: 3 sets of 8-10 reps per side",
                "Battle Ropes: 3 sets of 30-45 seconds"
              ]
            }
          ]
        },
        mealPlan: {
          title: "Daily nutrition guide",
          description: `Here's a detailed, high-protein daily meal plan designed for a ${age}-year-old individual weighing ${weight}kg looking to build muscle, focusing on practicality, health, and achievement.`,
          meals: [
            {
              time: "Breakfast",
              foods: [
                "1/2 cup dry rolled oats with 1 scoop protein powder",
                "2 large hard-boiled eggs",
                "1 tbsp ground flax seeds",
                "1/4 cup mixed berries",
                "1 tbsp unsweetened almond butter"
              ],
              calories: "550-600 kcal",
              protein: "45-50g"
            },
            {
              time: "Lunch", 
              foods: [
                "150g grilled chicken breast or salmon",
                "1 cup cooked quinoa or brown rice",
                "2 cups mixed greens with vegetables",
                "1/4 avocado with olive oil dressing"
              ],
              calories: "650-700 kcal", 
              protein: "50-55g"
            },
            {
              time: "Dinner",
              foods: [
                "150g baked cod or lean ground turkey",
                "1 medium baked sweet potato", 
                "1.5 cups steamed broccoli",
                "Small drizzle of olive oil"
              ],
              calories: "600-650 kcal",
              protein: "40-45g"
            },
            {
              time: "Snacks",
              foods: [
                "Greek yogurt with berries (pre-workout)",
                "Protein shake (post-workout)", 
                "Almonds and apple (mid-afternoon)"
              ],
              calories: "150-180 kcal",
              protein: "15-20g"
            }
          ]
        }
      };
      
      setPlan(samplePlan);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Personalized Fitness Plan
          </h1>
          <p className="text-xl text-slate-300">
            Enter your details to get AI-generated workout and meal plans
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/30 rounded-2xl border border-slate-700 p-8 max-w-2xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Target className="text-blue-400" />
              Tell Us About Yourself
            </h2>
            <p className="text-slate-400">
              We'll create a plan tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter your weight"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Fitness Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            >
              <option value="" className="bg-slate-800">Select your goal</option>
              <option value="build-muscle" className="bg-slate-800">Build Muscle</option>
              <option value="lose-weight" className="bg-slate-800">Lose Weight</option>
              <option value="improve-endurance" className="bg-slate-800">Improve Endurance</option>
              <option value="body-toning" className="bg-slate-800">Body Toning</option>
            </select>
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Plans...
              </div>
            ) : (
              'Generate Plans'
            )}
          </button>
        </div>

        {/* Results Section */}
        {plan && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Workout Plan */}
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Dumbbell className="text-blue-400" />
                <h2 className="text-2xl font-bold">Your Workout Plan</h2>
              </div>
              <h3 className="text-xl font-semibold text-blue-400 mb-4">{plan.workout.title}</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">{plan.workout.description}</p>
              
              <div className="space-y-6">
                {plan.workout.days.map((day: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-lg mb-3">{day.day}</h4>
                    <ul className="space-y-2">
                      {day.exercises.map((exercise: string, exIndex: number) => (
                        <li key={exIndex} className="text-slate-300 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal Plan */}
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Utensils className="text-green-400" />
                <h2 className="text-2xl font-bold">Your Meal Plan</h2>
              </div>
              <h3 className="text-xl font-semibold text-green-400 mb-4">{plan.mealPlan.title}</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">{plan.mealPlan.description}</p>
              
              <div className="space-y-6">
                {plan.mealPlan.meals.map((meal: any, index: number) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">{meal.time}</h4>
                      <div className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                        {meal.calories} • {meal.protein} protein
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {meal.foods.map((food: string, foodIndex: number) => (
                        <li key={foodIndex} className="text-slate-300 flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          {food}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="text-blue-400" size={20} />
              <span className="font-semibold">FitMind AI Fitness</span>
            </div>
            <p>Your AI-powered personal trainer and nutrition coach</p>
          </div>
        </div>
      </footer>
    </div>
  );
}