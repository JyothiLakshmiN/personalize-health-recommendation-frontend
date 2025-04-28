'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    router.push(token ? '/dashboard' : '/login');
  }, [router]);

  return <p>Redirecting...</p>;
}
