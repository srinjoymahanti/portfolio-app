import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Trash2, Bot, User, Loader2, Sparkles } from "lucide-react";
import { sendChatMessage } from "../services/api.js";

const SUGGESTED_QUESTIONS = [
  "Tell me about Srinjoy",
  "What technologies does he use?",
  "What projects has he built?",
  "What is his education?",
  "How can I contact him?",
];

const MAX_LENGTH = 500;

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text) {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setError(null);
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const { answer } = await sendChatMessage(question);
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch (err) {
      setError("I'm unable to access my portfolio information right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <section id="ai-chat" className="py-20 px-5 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={13} /> AI-Powered
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Ask About Me</h2>
          <p className="mt-3 text-slate-500">
            Ask anything about my skills, projects, education, and experience.
          </p>
        </motion.div>

        <div className="rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden">
          {/* Messages */}
          <div ref={scrollRef} className="h-[420px] overflow-y-auto thin-scrollbar px-5 py-6 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <Bot size={22} />
                </div>
                <p className="text-sm text-slate-400 mb-5">
                  Ask me anything about Srinjoy's background — try a suggestion below.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-accent hover:text-accent transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center mt-0.5">
                    <Bot size={15} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-accent text-white rounded-br-sm"
                      : "bg-slate-100 text-slate-700 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mt-0.5">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center mt-0.5">
                  <Bot size={15} />
                </div>
                <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-slate-100 text-slate-400 flex items-center gap-1.5">
                  <Loader2 size={14} className="animate-spin" /> Thinking...
                </div>
              </div>
            )}

            {error && (
              <div className="text-center text-sm text-red-500 py-2">{error}</div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about my skills, projects, education..."
                className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 max-h-32"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="shrink-0 w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-dark transition-colors disabled:opacity-40"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
              {messages.length > 0 && (
                <button
                  onClick={() => { setMessages([]); setError(null); }}
                  className="shrink-0 w-10 h-10 rounded-xl border border-slate-200 text-slate-400 flex items-center justify-center hover:text-red-500 hover:border-red-200 transition-colors"
                  aria-label="Clear chat"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="flex justify-between mt-2 px-1">
              <p className="text-[11px] text-slate-400">Answers are based on information in my portfolio.</p>
              <p className="text-[11px] text-slate-300">{input.length}/{MAX_LENGTH}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
