'use client';

import { useState } from 'react';
import { Brain, Target, Dumbbell, Utensils } from 'lucide-react';

interface Exercise {
  day: string;
  exercises: string[];
}

interface Meal {
  time: string;
  foods: string[];
  calories: string;
  protein: string;
}

interface WorkoutPlan {
  title: string;
  description: string;
  days: Exercise[];
}

interface MealPlan {
  title: string;
  description: string;
  meals: Meal[];
}

interface Plan {
  workout: WorkoutPlan;
  mealPlan: MealPlan;
}

type ValidationErrors = {
  age?: string;
  weight?: string;
  goal?: string;
};

export default function HomePage() {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateInputs = () => {
    const errors: ValidationErrors = {};
    if (!age) errors.age = 'Age is required';
    else if (Number(age) <= 0) errors.age = 'Age must be greater than zero';
    if (!weight) errors.weight = 'Weight is required';
    else if (Number(weight) <= 0) errors.weight = 'Weight must be greater than zero';
    if (!goal) errors.goal = 'Fitness goal is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generatePlan = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setError('');
    setPlan(null);

    let response: Response | undefined = undefined;

    try {
      response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: parseInt(age),
          weight: parseFloat(weight),
          goal: goal
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          setError('You have hit the rate limit. Please wait a moment before trying again.');
          // Disable generate button for 5 seconds after rate limit error
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 5000);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate plan');
      }

      const data: Plan = await response.json();
      setPlan(data);
    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate plan. Please try again.');
    } finally {
      if (response?.status !== 429) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Personalized Fitness Plan
          </h1>
          <p className="text-xl text-slate-300">
            Enter your details to get AI-generated workout and meal plans
          </p>
        </div>

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
              {validationErrors.age && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.age}</p>
              )}
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
              {validationErrors.weight && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.weight}</p>
              )}
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
            {validationErrors.goal && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.goal}</p>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}

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

        {plan && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Dumbbell className="text-blue-400" />
                <h2 className="text-2xl font-bold">Your Workout Plan</h2>
              </div>
              <h3 className="text-xl font-semibold text-blue-400 mb-4">{plan.workout.title}</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">{plan.workout.description}</p>
              
              <div className="space-y-6">
                {plan.workout.days.map((day, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-lg mb-3">{day.day}</h4>
                    <ul className="space-y-2">
                      {day.exercises.map((exercise, exIndex) => (
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

            <div className="bg-slate-800/30 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Utensils className="text-green-400" />
                <h2 className="text-2xl font-bold">Your Meal Plan</h2>
              </div>
              <h3 className="text-xl font-semibold text-green-400 mb-4">{plan.mealPlan.title}</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">{plan.mealPlan.description}</p>
              
              <div className="space-y-6">
                {plan.mealPlan.meals.map((meal, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">{meal.time}</h4>
                      <div className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                        {meal.calories} • {meal.protein} protein
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {meal.foods.map((food, foodIndex) => (
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
