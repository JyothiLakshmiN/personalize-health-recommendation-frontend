"use client";
import { useState, useEffect } from "react";
import { getMealPlan } from "../../api/apis";
import { Flame, Calendar, ChevronDown, ChevronUp } from "lucide-react";

export default function Recommendation({ token }) {
  const [mealPlan, setMealPlan] = useState(null);
  const [expandedDays, setExpandedDays] = useState({}); // Track expanded days

  useEffect(() => {
    async function fetchMeals() {
      const res = await getMealPlan(token);
      setMealPlan(res.data);
    }
    fetchMeals();
  }, [token]);

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-10 text-green-700">
        🍽️ Personalized Meal Recommendations
      </h2>

      {mealPlan ? (
        <div className="space-y-12">

          {/* Daily Meal Recommendations */}
          <section>
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">Daily Meals</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealPlan.daily_meals?.map((meal, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                >
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{meal.meal}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Flame className="w-5 h-5 text-red-500" />
                    <span>{meal.calories} Calories</span>
                  </div>
                  {meal.description && (
                    <p className="text-gray-500 text-sm">{meal.description}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Daily Total Calories */}
            <div className="text-right text-lg font-semibold mt-6">
              Daily Total Calories:{" "}
              <span className="text-rose-600">{mealPlan.daily_meals.reduce((sum, meal) => sum + meal.calories, 0)}</span>
            </div>
          </section>

          {/* Weekly Meal Recommendations */}
          {mealPlan.weekly_meals && (
            <section>
              <h3 className="text-3xl font-semibold text-gray-800 mb-8">Weekly Meals</h3>
              <div className="space-y-8">
                {mealPlan.weekly_meals.map((dayMeal, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-3xl shadow-md border border-gray-200"
                  >
                    {/* Day Header */}
                    <div
                      onClick={() => toggleDay(dayMeal.day)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-7 h-7 text-green-600" />
                        <h4 className="text-2xl font-bold text-gray-800">{dayMeal.day}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold bg-green-100 text-green-700 py-1 px-3 rounded-full shadow-sm">
                          {dayMeal.total_day_calories} Cal
                        </span>
                        {expandedDays[dayMeal.day] ? (
                          <ChevronUp className="w-6 h-6 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                    </div>

                    {/* Meals List */}
                    {expandedDays[dayMeal.day] && (
                      <div className="mt-6 grid md:grid-cols-2 gap-4">
                        {dayMeal.meal_plan.map((meal, mealIdx) => (
                          <div
                            key={mealIdx}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                          >
                            <h5 className="text-lg font-semibold text-gray-700 mb-1">{meal.meal}</h5>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <Flame className="w-4 h-4 text-rose-400" />
                              <span>{meal.calories} Cal</span>
                            </div>
                            <p className="text-sm text-gray-500">{meal.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Overall Total Calories */}
          <div className="text-right text-xl font-semibold mt-8">
            Overall Total Calories:{" "}
            <span className="text-rose-600">{mealPlan.total_calories}</span>
          </div>

          {/* Health Tips */}
          {mealPlan.suggestions && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl text-md text-blue-800 leading-relaxed">
              <strong className="block text-lg mb-2">💡 Health Tips:</strong>
              {mealPlan.suggestions}
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">Loading your personalized meals...</p>
      )}
    </div>
  );
}
