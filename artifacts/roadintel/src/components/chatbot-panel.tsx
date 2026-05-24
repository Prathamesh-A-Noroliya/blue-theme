import { useState } from "react";
import { X, Send, Bot, User } from "lucide-react";
import { useChatWithAi } from "@workspace/api-client-react";

const SUGGESTIONS = [
  "What is the health score of MG Road?",
  "Which roads are most at risk?",
  "How much money was spent on NH-48?",
  "Why is Andheri-Kurla Road marked critical?",
  "What are the sensor alerts today?",
];

type Message = { role: "user" | "assistant"; text: string };

export function ChatbotPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I am RoadIntel AI Assistant. I can help you understand road conditions, health scores, sensor alerts, and public spending. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const chat = useChatWithAi();

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    try {
      const res = await chat.mutateAsync({ data: { message: text } });
      setMessages((m) => [...m, { role: "assistant", text: res.response }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "I encountered an error. Please try again." }]);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-96 rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", height: "480px" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: "hsl(var(--sidebar))", borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--sidebar-primary))" }}>
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: "hsl(var(--sidebar-foreground))" }}>RoadIntel AI</div>
          <div className="text-xs" style={{ color: "hsl(var(--sidebar-primary))" }}>Online</div>
        </div>
        <button onClick={onClose} className="ml-auto" style={{ color: "hsl(var(--sidebar-foreground))" }}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === "assistant" ? "" : ""}`} style={m.role === "assistant" ? { background: "hsl(var(--sidebar-primary) / 0.2)" } : { background: "hsl(var(--muted))" }}>
              {m.role === "assistant" ? <Bot className="w-3.5 h-3.5" style={{ color: "hsl(var(--sidebar-primary))" }} /> : <User className="w-3.5 h-3.5" />}
            </div>
            <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${m.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
              style={m.role === "user" ? { background: "hsl(var(--sidebar-primary))", color: "white" } : { background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}>
              {m.text}
            </div>
          </div>
        ))}
        {chat.isPending && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--sidebar-primary) / 0.2)" }}>
              <Bot className="w-3.5 h-3.5" style={{ color: "hsl(var(--sidebar-primary))" }} />
            </div>
            <div className="px-3 py-2 rounded-xl text-sm" style={{ background: "hsl(var(--muted))" }}>
              <span className="animate-pulse">Analyzing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.slice(0, 3).map((s) => (
            <button key={s} onClick={() => send(s)} className="text-xs px-2.5 py-1 rounded-full border hover:opacity-80 transition-opacity" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 p-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about roads, spending..."
          className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
          style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
        />
        <button onClick={() => send(input)} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--sidebar-primary))" }}>
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
