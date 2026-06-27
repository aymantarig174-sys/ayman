import { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "يا هلا والله بك في متجر خطفة! 😍 أنا المساعد الذكي للمتجر، أقدر أساعدك تختار أفضل الإنارات لغرفتك أو تختار اشتراكاتك الرقمية بالأسعار الرهيبة حقتنا. وش خاطرك فيه اليوم يا غالي؟ ✨"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "وش ترشح لي لإنارة الغرفة؟ 🤔",
    "وش مميزات يوتيوب بريميوم؟ 🎬",
    "عندكم اشتراك نيتفليكس؟ 🍿",
    "كيف أفعل اشتراك كانفا برو؟ 🎨"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error("فشل في التواصل مع الخادم");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("حدثت مشكلة في الاتصال. جرب مرة ثانية أبشرك.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans" style={{ direction: "rtl" }}>
      {/* Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-white text-black hover:bg-gray-200 rounded-full flex items-center justify-center shadow-2xl cursor-pointer relative group border border-white"
        id="ai-bot-launcher"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Box Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-18 left-0 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] bg-[#0b0b0b] rounded-3xl shadow-2xl border border-[#2a2a2a] flex flex-col overflow-hidden"
            id="ai-chat-dialog"
          >
            {/* Header */}
            <div className="bg-[#111111] text-white p-4 flex items-center justify-between border-b border-[#2a2a2a]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-[#3a3a3a]">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    مساعد خطفة الذكي
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-[#a8a8a8] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    نشط الآن لخدمتك
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#a8a8a8] hover:text-white transition-colors duration-150 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-[#0b0b0b]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2.5 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  {msg.role === "model" && (
                    <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 border border-[#2a2a2a]">
                      <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-white text-black rounded-tr-none"
                        : "bg-[#111111] text-white border border-[#2a2a2a] rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 flex-row">
                  <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 border border-[#2a2a2a]">
                    <Bot className="w-4 h-4 text-blue-400 animate-spin" />
                  </div>
                  <div className="bg-[#111111] border border-[#2a2a2a] p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                    <span className="w-2 h-2 bg-[#6a6a6a] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-[#6a6a6a] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-[#6a6a6a] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-900/20 text-red-400 rounded-xl text-xs flex items-center gap-2 border border-red-900/50">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Prompts suggestions (only if keyboard is clear and no error) */}
            <div className="px-3 py-2 bg-[#0b0b0b] border-t border-[#2a2a2a] flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-[#111111] text-[#a8a8a8] hover:text-white hover:bg-[#1a1a1a] text-xs px-3 py-1.5 rounded-full shrink-0 border border-[#2a2a2a] transition-colors duration-200 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 bg-[#111111] border-t border-[#2a2a2a] flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="اكتب استفسارك هنا يا غالي..."
                className="flex-grow bg-[#0b0b0b] text-white placeholder:text-[#6a6a6a] text-sm px-4 py-2.5 rounded-xl border border-[#2a2a2a] focus:border-blue-500 focus:outline-none transition-all duration-200"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-white text-black p-2.5 rounded-xl hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-white transition-colors duration-150 cursor-pointer flex items-center justify-center shrink-0"
                id="btn-send-message"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
