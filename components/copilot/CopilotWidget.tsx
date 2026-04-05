// @ts-nocheck
"use client";

import React, { useState, useRef, useEffect } from "react";

export const CopilotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { id: Date.now().toString(), role: "user", content: text }];
    setMessages(newMessages);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      
      setMessages([...newMessages, { id: Date.now().toString() + "a", role: "assistant", content: data.text }]);
    } catch (e: any) {
      setMessages([...newMessages, { id: Date.now().toString() + "e", role: "assistant", content: "Sorry, I had trouble connecting. Make sure your API key is in the .env file!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(query);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 z-50 text-2xl"
      >
        {isOpen ? "✕" : "✨"}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[22rem] sm:w-96 h-[550px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-black text-white flex items-center gap-2 text-lg">✨ AI Co-pilot</h3>
              <p className="text-xs font-medium text-gray-400 mt-0.5">Ask me anything about your business</p>
            </div>
            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button 
                  onClick={() => setMessages([])} 
                  className="text-xs font-bold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg transition-colors border border-gray-700 shadow-sm"
                  title="Start a new chat"
                >
                  + New
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1" title="Close chat">✕</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-8 space-y-3">
                <div className="text-4xl mb-4 opacity-50">🤖</div>
                <p className="font-bold text-gray-500">I'm connected to your inventory database!</p>
                <div className="space-y-2 mt-4 text-left px-2">
                  <button onClick={() => handleSend("Which products will I run out of this weekend?")} className="block w-full text-left italic bg-white border border-gray-100 p-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm text-xs font-medium cursor-pointer">
                    "Which products will I run out of this weekend?"
                  </button>
                  <button onClick={() => handleSend("Identify products taking up shelf space but not selling.")} className="block w-full text-left italic bg-white border border-gray-100 p-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm text-xs font-medium cursor-pointer">
                    "Identify products taking up shelf space but not selling."
                  </button>
                  <button onClick={() => handleSend("Why is revenue lower today than yesterday?")} className="block w-full text-left italic bg-white border border-gray-100 p-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm text-xs font-medium cursor-pointer">
                    "Why is revenue lower today than yesterday?"
                  </button>
                </div>
              </div>
            )}
            
            {messages.map((m: any) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3.5 text-sm leading-relaxed ${m.role === "user" ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm font-medium" : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm"}`}>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              </div>
            ))}
            
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-tl-sm p-3.5">
                   <div className="text-gray-400 text-xs italic animate-pulse">Thinking...</div>
                 </div>
               </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          <form onSubmit={submitForm} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-gray-800 transition-colors"
              disabled={isLoading}
            />
            <button type="submit" disabled={!query.trim() || isLoading} className="bg-blue-600 font-bold text-white px-4 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400 shadow-sm">
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
};
