'use client';
import { useState, useEffect } from 'react';
import { createProfile, getProfile } from '../../api/apis';

export default function Profile({ token }) {
  const [profile, setProfile] = useState({
    age: '',
    weight: '',
    height: '',
    conditions: '',
    allergies: ''
  });
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getProfile(token);
        console.log('res', res);
        setProfile(res.data.profile); // Assuming API returns { age, weight, height, conditions, allergies }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      age: parseInt(profile.age),
      weight: parseFloat(profile.weight),
      height: parseFloat(profile.height),
      conditions: profile.conditions.split(',').map(s => s.trim()),
      allergies: profile.allergies.split(',').map(s => s.trim())
    };

    console.log("Payload sent to API:", payload);

    try {
      const res = await createProfile(payload, token);
      console.log("Server response:", res);
      alert('Profile saved!');
      setError(null);
    } catch (err) {
      console.error("API error:", err);
      alert('Failed to save profile');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Create Profile</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Age"
          className="border p-2 w-full"
          value={profile.age}
          onChange={(e) => setProfile({ ...profile, age: e.target.value })}
        />
        <input
          type="number"
          step="any"
          placeholder="Weight (kg)"
          className="border p-2 w-full"
          value={profile.weight}
          onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
        />
        <input
          type="number"
          step="any"
          placeholder="Height (cm)"
          className="border p-2 w-full"
          value={profile.height}
          onChange={(e) => setProfile({ ...profile, height: e.target.value })}
        />
        <input
          type="text"
          placeholder="Conditions (comma separated)"
          className="border p-2 w-full"
          value={profile.conditions}
          onChange={(e) => setProfile({ ...profile, conditions: e.target.value })}
        />
        <input
          type="text"
          placeholder="Allergies (comma separated)"
          className="border p-2 w-full"
          value={profile.allergies}
          onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
        />
        <button type="submit" className="bg-purple-500 hover:bg-purple-600 transition text-white px-4 py-2 rounded-md">
          Save Profile
        </button>
      </form>
    </div>
  );
}
