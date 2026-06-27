"use client";

import { useState, useRef, useEffect } from "react";
import { X, Bot, Sparkles, SendHorizontal } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ChatMessage {
  role: string;
  parts: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialCTAs = [
    { label: "About Me", value: "Tell me about Chandrabhan Yadav" },
    { label: "Projects", value: "What projects has Chandrabhan built?" },
    { label: "Experience", value: "What is Chandrabhan's work experience?" },
    { label: "Resume", value: "How can I download Chandrabhan's resume?" },
    { label: "Contact", value: "How can I contact Chandrabhan?" }
  ];

  const followUpCTAs = [
    { label: "AI & RAG Skills", value: "Tell me about Chandrabhan's AI and RAG skills" },
    { label: "FastAPI & Python", value: "What backend experience does Chandrabhan have?" },
    { label: "Next.js & Frontend", value: "Tell me about Chandrabhan's frontend capabilities" },
    { label: "Open for Opportunities?", value: "Is Chandrabhan open for new roles?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: "user", parts: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/chat/", {
        method: "POST",
        body: JSON.stringify({
          history: messages,
          message: text
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, { role: "model", parts: data.response }]);
      } else {
        setMessages([...newMessages, { role: "model", parts: "Sorry, I encountered an error. Please try again." }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "model", parts: "Network error. Please check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20 hover:scale-105"
          aria-label="Open Chat"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Ask AI Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex flex-col h-[520px] w-[360px] sm:w-[400px] rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-muted/80 px-5 py-4 text-foreground border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background border border-border">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none">Chandrabhan AI</h3>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Sparkles className="h-3 w-3 text-primary" /> Enterprise RAG System
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-background">
            {/* Welcome message */}
            <div className="flex justify-start">
              <div className="max-w-[88%] rounded-2xl bg-card border border-border p-4 shadow-sm text-sm text-foreground">
                <p className="font-bold mb-1">👋 Hi, I&apos;m Chandrabhan&apos;s AI Assistant!</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Ask me any question about his work, qualifications, technical projects, or coordinate details. Select an option to start:</p>
                
                {/* Initial CTAs */}
                {messages.length === 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {initialCTAs.map((cta, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(cta.value)}
                        className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all shadow-sm"
                      >
                        {cta.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Conversation */}
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-2">
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                        : "bg-card text-foreground border border-border shadow-sm"
                    }`}
                  >
                    {msg.parts}
                  </div>
                </div>

                {/* Suggested CTAs after model's response */}
                {msg.role === "model" && idx === messages.length - 1 && (
                  <div className="flex flex-wrap gap-2 justify-start pl-2 animate-in fade-in duration-300">
                    {followUpCTAs.map((cta, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleSendMessage(cta.value)}
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
                      >
                        {cta.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl bg-card border border-border px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="border-t border-border p-4 flex gap-2 items-center bg-card"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query portfolio data..."
              className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background text-foreground transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
