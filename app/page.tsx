'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Dumbbell, UtensilsCrossed, Bot, History, LogOut, User, Calendar, Trash2 } from "lucide-react";

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
  id?: string;
  workout: WorkoutPlan;
  mealPlan: MealPlan;
  age: number;
  weight: number;
  goal: string;
  createdAt?: string;
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [savedPlans, setSavedPlans] = useState<Plan[]>([]);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadSavedPlans();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedPlans = async () => {
    try {
      const response = await fetch('/api/plans/saved');
      if (response.ok) {
        const plans = await response.json();
        setSavedPlans(plans);
      }
    } catch (err) {
      console.error('Failed to load saved plans:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setSavedPlans([]);
      setShowSavedPlans(false);
      setSelectedPlan(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedPlans(savedPlans.filter(p => p.id !== planId));
        if (selectedPlan?.id === planId) {
          setSelectedPlan(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete plan:', err);
    }
  };

  const formatGoal = (goal: string) => {
    return goal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* User Dashboard Bar - Only show when logged in */}
      {user && (
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <User size={20} className="text-blue-400" />
              <span className="text-gray-300">Welcome back, <span className="font-semibold text-white">{user.name || user.email}</span></span>
            </div>
            
            <button
              onClick={() => setShowSavedPlans(!showSavedPlans)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm"
            >
              <History size={18} />
              {showSavedPlans ? 'Hide' : 'Show'} My Plans ({savedPlans.length})
            </button>
          </div>
        </div>
      )}

      {/* Saved Plans Section - Shows ABOVE homepage content when toggled */}
      {user && showSavedPlans && (
        <section id="saved-plans" className="bg-gray-800/50 py-12 px-6 border-b border-gray-700">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <History className="text-blue-400" />
                Your Saved Plans
              </h2>
              <button
                onClick={() => setShowSavedPlans(false)}
                className="text-gray-400 hover:text-white"
              >
                Close ×
              </button>
            </div>
            
            {savedPlans.length === 0 ? (
              <div className="text-center py-12 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-lg mb-4">
                  You haven't generated any plans yet.
                </p>
                <a
                  href="/generate"
                  className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Generate Your First Plan
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-blue-400 mb-2">
                          {formatGoal(plan.goal)}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <User size={16} />
                          <span>Age: {plan.age} • Weight: {plan.weight}kg</span>
                        </div>
                        {plan.createdAt && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar size={16} />
                            <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setSelectedPlan(plan)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          plan.id && deletePlan(plan.id);
                        }}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Selected Plan Details Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{formatGoal(selectedPlan.goal)} Plan</h2>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Workout Plan */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Dumbbell className="text-blue-400" />
                  <h3 className="text-xl font-bold">Workout Plan</h3>
                </div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">
                  {selectedPlan.workout.title}
                </h4>
                <p className="text-gray-300 mb-4">{selectedPlan.workout.description}</p>
                
                <div className="space-y-4">
                  {selectedPlan.workout.days.map((day, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 bg-gray-700/50 p-3 rounded">
                      <h5 className="font-semibold mb-2">{day.day}</h5>
                      <ul className="space-y-1">
                        {day.exercises.map((exercise, exIndex) => (
                          <li key={exIndex} className="text-gray-300 text-sm flex items-start gap-2">
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
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <UtensilsCrossed className="text-green-400" />
                  <h2 className="text-xl font-bold">Meal Plan</h2>
                </div>
                <h3 className="text-lg font-semibold text-green-400 mb-4">{selectedPlan.mealPlan.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{selectedPlan.mealPlan.description}</p>
                
                <div className="space-y-6">
                  {selectedPlan.mealPlan.meals.map((meal, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 bg-gray-700/50 p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
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
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-blue-400">AI-Powered Fitness Platform</h2>
        <h3 className="text-2xl md:text-3xl font-semibold mb-6">Transform Your Body With AI Guidance</h3>
        <p className="max-w-2xl text-gray-300 mb-8">
          FitMind combines cutting-edge AI technology with proven fitness science to create personalized
          workout and meal plans that evolve with you.
        </p>
        <div className="flex gap-4">
          <a
            href={user ? "/plan" : "/login"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition"
          >
            Start Now
          </a>
          {user ? (
            <button
              onClick={() => {
                setShowSavedPlans(true);
                // Scroll to saved plans section
                setTimeout(() => {
                  document.getElementById('saved-plans')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="border border-blue-500 hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition"
            >
              View My Plans
            </button>
          ) : (
            <a
              href="#features"
              className="border border-blue-500 hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition"
            >
              Learn More
            </a>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-800 py-16 px-6 grid md:grid-cols-3 gap-10 text-center">
        <div className="p-6 rounded-lg bg-gray-700 hover:bg-gray-600 transition flex flex-col items-center">
          <Dumbbell className="w-10 h-10 text-blue-400 mb-3" />
          <h4 className="text-2xl font-bold text-blue-400 mb-2">AI Workout Plans</h4>
          <p className="text-gray-300">
            Get personalized 5-day workout routines tailored to your fitness goals.
          </p>
        </div>

        <div className="p-6 rounded-lg bg-gray-700 hover:bg-gray-600 transition flex flex-col items-center">
          <UtensilsCrossed className="w-10 h-10 text-blue-400 mb-3" />
          <h4 className="text-2xl font-bold text-blue-400 mb-2">Smart Meal Plans</h4>
          <p className="text-gray-300">
            Receive customized daily meal plans that align with your objectives.
          </p>
        </div>

        <div className="p-6 rounded-lg bg-gray-700 hover:bg-gray-600 transition flex flex-col items-center">
          <Bot className="w-10 h-10 text-blue-400 mb-3" />
          <h4 className="text-2xl font-bold text-blue-400 mb-2">AI Fitness Coach</h4>
          <p className="text-gray-300">
            Chat with your personal AI coach for motivation and guidance.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 px-6 bg-blue-600">
        <h2 className="text-4xl font-extrabold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-lg mb-6 text-gray-100">
          Join thousands of users who have transformed their fitness with AI-powered personalization.
        </p>
        <a
          href={user ? "/generate" : "/login"}
          className="bg-white text-blue-600 hover:bg-gray-200 px-8 py-3 rounded-lg font-semibold shadow-md transition"
        >
          Get Your Plan
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-800 text-gray-400 text-sm">
        © 2025 FitMind. All rights reserved.
      </footer>
    </main>
  );
}
