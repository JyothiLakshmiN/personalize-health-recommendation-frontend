'use client';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProfile, getMealPlan } from '../../api/apis';
import { useRouter } from 'next/navigation';

const COLORS = ['#34d399', '#fbbf24', '#8b5cf6'];

export default function Dashboard() {
  const router = useRouter();
  
  const [profile, setProfile] = useState(null);
  const [mealPlan, setMealPlan] = useState([]);
  const [bmiTrend, setBmiTrend] = useState([]);
  const [weeklyIntake, setWeeklyIntake] = useState([]);
  const [macroDistribution, setMacroDistribution] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingMeals, setLoadingMeals] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    const fetchData = async () => {
      try {
        const profileRes = await getProfile(token);
        const mealRes = await getMealPlan(token);

        if (profileRes.status === 401 || mealRes.status === 401) return router.push('/login');

        const { profile, history } = profileRes.data;

        setProfile(profile);
        setMealPlan(mealRes.data.daily_meals || []);
        setBmiTrend(history?.bmi || []);
        setWeeklyIntake(history?.weeklyIntake || []);
        setMacroDistribution(history?.macronutrients || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.data?.redirect_to) {
          return router.push(error.response.data.redirect_to);
        }
        router.push('/login');
      } finally {
        setLoadingProfile(false);
        setLoadingMeals(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-semibold text-green-700 mb-6">
          Personalized Diet Recommendation Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BMI Trend */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-bold text-green-700 mb-4">BMI Trend</h3>
            {loadingProfile ? (
              <div className="flex justify-center items-center h-52">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={bmiTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="bmi" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Weekly Nutrition Intake */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-bold text-green-700 mb-4">Weekly Nutrition Intake</h3>
            {loadingProfile ? (
              <div className="flex justify-center items-center h-52">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyIntake}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="carbs" stackId="a" fill="#fbbf24" />
                  <Bar dataKey="protein" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="calories" stackId="a" fill="#34d399" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Macronutrient Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-bold text-green-700 mb-4">Macronutrient Distribution</h3>
            {loadingProfile ? (
              <div className="flex justify-center items-center h-52">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={macroDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {macroDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Meals and Recommendations */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Your Meals */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-bold text-green-700 mb-4">Your Meals</h3>
            {loadingMeals ? (
              <div className="flex justify-center items-center h-32">Loading meals...</div>
            ) : (
              <ul className="list-disc list-inside text-gray-700">
                {mealPlan?.map((meal, index) => (
                  <li key={index}>{meal.meal}</li>
                ))}
              </ul>
            )}
          </div>

          {/* AI Recommendations with form */}
          <form
            method="POST"
            action="/recommendation"
            className="bg-white p-6 rounded-2xl shadow"
          >
            <h3 className="text-lg font-bold text-green-700 mb-4">AI Recommendations</h3>
            {loadingProfile ? (
              <div className="flex justify-center items-center h-32">Loading recommendations...</div>
            ) : (
              <>
                <p className="text-gray-700 mb-4">
                  Based on your profile, here are some suggested meals and nutrient goals for the upcoming week.
                </p>

                <button
                  type="submit"
                  className="mt-4 bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
                >
                  Get Recommendations
                </button>
              </>
            )}
          </form>
        </div>

      </main>
    </div>
  );
}
