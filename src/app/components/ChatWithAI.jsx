'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { chatWithAI } from '../../api/apis';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const res = await chatWithAI(input, token);

      if (res.response) {
        // Handle the simple 'response' field
        const aiMessage = { sender: 'ai', text: res.response };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Handle unexpected structure
        const errorMessage = { sender: 'ai', text: "Sorry, couldn't understand the server response." };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { sender: 'ai', text: "Sorry, I couldn't process your request." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">🤖 Chat with AI</h1>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white rounded-xl shadow-md border">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-sm ${
              msg.sender === 'user' ? 'bg-green-100 ml-auto' : 'bg-gray-100 mr-auto'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 text-sm">AI is typing...</div>
        )}
      </div>

      <form
        onSubmit={sendMessage}
        className="mt-4 flex items-center gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Ask anything..."
          className="flex-1 p-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 p-3 rounded-full text-white transition"
          disabled={loading}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
