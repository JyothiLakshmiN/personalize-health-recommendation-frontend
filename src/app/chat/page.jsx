'use client';
import ChatPage from '../components/ChatWithAI';
import SidebarLayout from "../components/Sidebar";
export default function DashboardPage() {
  return (
    <SidebarLayout>
      <ChatPage />
    </SidebarLayout>
  );
}
