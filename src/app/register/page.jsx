'use client';

import Register from '../components/Register'; // Adjust the path based on your structure
import { useState } from 'react';

export default function LoginPage() {
  const [token, setToken] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Register setToken={setToken} />
    </div>
  );
}
