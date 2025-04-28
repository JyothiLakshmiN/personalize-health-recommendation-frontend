'use client';

import Profile from '../components/Profile'; // Adjust the path based on your structure
import { useState } from 'react';
import SidebarLayout from "../components/Sidebar";

export default function LoginPage() {
  const [token, setToken] = useState("");

  return (
    <SidebarLayout>
      <Profile />
    </SidebarLayout>
  );
}
