'use client';

import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { usePathname } from 'next/navigation';
import { Menu, Utensils, User, LogOut, MessageCircle } from 'lucide-react';

export default function SidebarLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <Menu size={20} /> },
    { href: '/recommendation', label: 'Recommendations', icon: <Utensils size={20} /> },
    { href: '/chat', label: 'Chat with AI', icon: <MessageCircle size={20} /> },
    { href: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between p-6 shadow-xl">
        <div>
          {/* Logo Section */}
          <div className="flex items-center space-x-3 mb-8">
            <Image 
              src="/logo.png"  // Path to your logo image inside the public folder
              alt="MyHealth AI Logo" 
              width={40} 
              height={40} 
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold text-green-400">MyHealth AI</h1>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-4">
            {navItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-green-600 hover:text-white ${
                  pathname === href ? 'bg-green-700 text-white' : 'text-gray-300'
                }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
