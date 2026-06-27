"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

interface ChatMessage {
  role: string;
  parts: string;
}

export default function ChatTester() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", parts: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/chat/", {
        method: "POST",
        body: JSON.stringify({
          history: messages,
          message: input
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, { role: "model", parts: data.response }]);
      } else {
        setMessages([...newMessages, { role: "model", parts: "Error connecting to server." }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "model", parts: "Network error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 flex flex-col h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold">Chatbot Tester</h1>
      
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Test the Gemini Integration</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4 mb-4 border rounded p-4 mx-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
                <p className="whitespace-pre-wrap">{msg.parts}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-gray-500">
                Thinking...
              </div>
            </div>
          )}
        </CardContent>
        <div className="p-6 pt-0">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask a question about the portfolio..." 
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>Send</Button>
            <Button type="button" variant="outline" onClick={() => setMessages([])}>Clear</Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
