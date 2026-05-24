import { useState, useRef, useEffect } from "react";
import { useChatWithAi } from "@workspace/api-client-react";
import { Bot, Mic, MicOff, Send, Globe, ChevronRight, Volume2 } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string; time: string };

const CHIPS = [
  "Who is responsible for NH-48 near Khopoli?",
  "How much money was spent on Katraj Ghat?",
  "When was Swargate flyover last repaired?",
  "Show roads with repeated failures",
  "Which contractor has the most flags?",
  "Where should I file my complaint?",
  "Show unsafe roads near me",
  "Explain the budget overrun on Swargate flyover",
  "What is the risk level of Katraj Ghat?",
  "Why does NH-48 near Khopoli keep failing?",
];

const LANGS = [
  { code: "en-IN", label: "English" },
  { code: "hi-IN", label: "Hindi" },
  { code: "ta-IN", label: "Tamil" },
  { code: "te-IN", label: "Telugu" },
  { code: "bn-IN", label: "Bengali" },
  { code: "mr-IN", label: "Marathi" },
];

const QUICK_LINKS: Record<string, string> = {
  "complaint": "/complaints",
  "risk map": "/risk-map",
  "sensor": "/sensors",
  "spending": "/spending",
  "contractor": "/contractors",
  "road dna": "/roads",
};

function getQuickLink(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [key, path] of Object.entries(QUICK_LINKS)) {
    if (lower.includes(key)) return path;
  }
  return null;
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I'm RoadIntel AI — your road intelligence assistant. Ask me about roads, spending, contractors, complaints, or sensor data.", time: new Date().toLocaleTimeString() },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("en-IN");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chat = useChatWithAi();
  const recognizerRef = useRef<any>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text, time: new Date().toLocaleTimeString() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    try {
      const result = await chat.mutateAsync({ data: { message: text } });
      const assistantMsg: Message = { role: "assistant", text: result.response ?? "I'm processing your request.", time: new Date().toLocaleTimeString() };
      setMessages(m => [...m, assistantMsg]);
    } catch {
      setMessages(m => [...m, { role: "assistant", text: "I encountered an error. Please try again.", time: new Date().toLocaleTimeString() }]);
    }
  };

  const toggleVoice = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice input not supported in this browser."); return; }

    if (listening) {
      recognizerRef.current?.stop();
      setListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    recognizerRef.current = rec;
    setListening(true);
  };

  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-full" style={{ maxHeight: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center gap-3 shrink-0" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(14,165,164,0.15)" }}>
          <Bot className="w-5 h-5" style={{ color: "#0EA5A4" }} />
        </div>
        <div className="flex-1">
          <h1 className="font-bold" style={{ fontFamily: "Sora, sans-serif" }}>RoadIntel AI Assistant</h1>
          <p className="text-xs text-muted-foreground">Ask about roads, budgets, complaints, and more</p>
        </div>
        {/* Language selector */}
        <div className="relative">
          <button onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border hover:opacity-80 transition-opacity"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
            <Globe className="w-3.5 h-3.5" style={{ color: "#0EA5A4" }} />
            {LANGS.find(l => l.code === lang)?.label ?? "English"}
          </button>
          {showLangMenu && (
            <div className="absolute right-0 top-9 z-50 rounded-xl shadow-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", minWidth: 140 }}>
              {LANGS.map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:opacity-70 transition-opacity"
                  style={{ color: lang === l.code ? "#0EA5A4" : "hsl(var(--foreground))" }}>
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide shrink-0" style={{ background: "hsl(var(--card))", borderBottom: "1px solid hsl(var(--border))" }}>
        {CHIPS.map(chip => (
          <button key={chip} onClick={() => sendMessage(chip)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
            style={{ background: "rgba(14,165,164,0.1)", border: "1px solid rgba(14,165,164,0.2)", color: "#0EA5A4" }}>
            {chip}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: "hsl(var(--background))" }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(14,165,164,0.15)" }}>
                <Bot className="w-4 h-4" style={{ color: "#0EA5A4" }} />
              </div>
            )}
            <div className={`max-w-[80%] space-y-1 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
              <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={msg.role === "user"
                  ? { background: "#0EA5A4", color: "#fff", borderBottomRightRadius: 4 }
                  : { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderBottomLeftRadius: 4 }}>
                {msg.text}
                {msg.role === "assistant" && getQuickLink(msg.text) && (
                  <a href={getQuickLink(msg.text)!}
                    className="flex items-center gap-1 mt-2 text-xs font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: "#0EA5A4" }}>
                    Go to page <ChevronRight className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{msg.time}</span>
                {msg.role === "assistant" && (
                  <button onClick={() => speak(msg.text)} className="opacity-50 hover:opacity-100 transition-opacity">
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {chat.isPending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(14,165,164,0.15)" }}>
              <Bot className="w-4 h-4" style={{ color: "#0EA5A4" }} />
            </div>
            <div className="px-4 py-3 rounded-2xl flex gap-1 items-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#0EA5A4", animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 py-4 border-t shrink-0" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
        <div className="flex gap-3 items-end">
          <div className="flex-1 rounded-2xl border flex items-center gap-2 px-4 py-3" style={{ borderColor: listening ? "#0EA5A4" : "hsl(var(--border))", background: "hsl(var(--muted))" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder={listening ? "Listening..." : "Ask about any road, budget, contractor..."}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button onClick={toggleVoice} className={`shrink-0 transition-colors ${listening ? "animate-pulse" : ""}`}
              style={{ color: listening ? "#E53935" : "hsl(var(--muted-foreground))" }}>
              {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || chat.isPending}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 disabled:opacity-40 transition-opacity"
            style={{ background: "#0EA5A4" }}>
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Voice: {LANGS.find(l => l.code === lang)?.label} · Tap mic to speak
        </p>
      </div>
    </div>
  );
}
