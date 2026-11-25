
'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Sparkles,
  BrainCircuit,
  Zap,
  MessageSquare,
  Plus,
  Activity,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function AIOrb() {
  return (
    <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
      <div className="absolute inset-0 rounded-full bg-violet-600/10 blur-3xl orb-glow" />

      <div className="orb-ring absolute w-full h-full rounded-full" />
      <div className="orb-ring-reverse absolute w-[85%] h-[85%] rounded-full" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[115%] h-[115%]"
      >
        <div className="absolute top-5 left-1/2 w-2 h-2 rounded-full bg-blue-300 shadow-[0_0_15px_#60a5fa]" />
      </motion.div>

      <div className="ai-orb relative w-24 h-24 sm:w-28 sm:h-28 rounded-full">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent" />
        <div className="absolute top-5 left-7 w-8 h-5 bg-white/30 blur-xl rounded-full" />
      </div>
    </div>
  );
}

export default function Twin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const messageText = input.trim();

    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          session_id: sessionId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      if (!sessionId) {
        setSessionId(data.session_id);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Connection error. Please check that the AI backend is running and try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);

    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex min-h-screen text-white">

      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-white/[0.07] bg-[#090a19]/70 p-6">

        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <BrainCircuit size={22} />
          </div>

          <div>
            <h1 className="font-semibold tracking-wide">DIGITAL TWIN</h1>
            <p className="text-[10px] text-violet-300 tracking-[3px]">
              INTELLIGENCE OS
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([])}
          disabled={isLoading}
          className="flex items-center gap-3 w-full p-3 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 transition-colors text-sm"
        >
          <Plus size={18} className="text-violet-300" />
          New Conversation
        </button>

        <div className="mt-10">
          <p className="text-[10px] text-gray-500 tracking-[2px] mb-5">
            YOUR DIGITAL IDENTITY
          </p>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
              <User size={19} />
            </div>

            <div>
              <p className="text-sm font-medium">Ahmed Elsayed Taha</p>
              <p className="text-xs text-gray-500">AI Engineer</p>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <p className="text-[10px] text-gray-500 tracking-[2px]">
            SYSTEM STATUS
          </p>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-400">
              <Activity size={15} />
              Intelligence
            </span>
            <span className="text-emerald-400 text-xs">Active</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-400">
              <Zap size={15} />
              AI Engine
            </span>
            <span className="text-emerald-400 text-xs">Ready</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/[0.07]">
          <p className="text-xs text-gray-500">Powered by Groq</p>
          <p className="text-[10px] text-gray-600 mt-1">
            GPT-OSS 120B
          </p>
        </div>
      </aside>

      {/* Main Area */}
      <section className="flex-1 min-w-0 flex flex-col relative">

        {/* Topbar */}
        <header className="h-[72px] flex items-center justify-between px-5 sm:px-8 border-b border-white/[0.07] bg-[#090a19]/40 backdrop-blur-xl">

          <div>
            <p className="text-sm font-medium">Digital Twin Experience</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Your intelligence, digitally represented
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-300 tracking-wide">
              SYSTEM ONLINE
            </span>
          </div>
        </header>

        {/* Conversation */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-8">

          <AnimatePresence mode="wait">
            {messages.length === 0 ? (

              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="min-h-full flex flex-col items-center justify-center text-center"
              >
                <AIOrb />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8"
                >
                  <div className="flex items-center justify-center gap-2 text-violet-300 text-xs tracking-[4px] mb-5">
                    <Sparkles size={14} />
                    DIGITAL CONSCIOUSNESS
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                    Your mind,
                    <span className="block mt-2 bg-gradient-to-r from-violet-300 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Beyond Reality.
                    </span>
                  </h2>

                  <p className="text-gray-500 text-sm mt-5 max-w-md leading-7 px-4">
                    I&apos;m your Digital Twin. An AI representation
                    designed to reflect your knowledge, personality,
                    experiences, and way of thinking.
                  </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-3 mt-10">
                  {[
                    'Tell me about yourself',
                    'What are your AI interests?',
                    'Explain your latest projects',
                  ].map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      onClick={() => setInput(suggestion)}
                      className="px-4 py-3 rounded-xl text-xs text-gray-300 border border-white/10 bg-white/[0.03] hover:bg-violet-500/10 hover:border-violet-400/30 transition-all"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

            ) : (

              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-3xl mx-auto space-y-7"
              >
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index === messages.length - 1 ? 0.05 : 0 }}
                    className={`flex gap-3 ${
                      message.role === 'user'
                        ? 'flex-row-reverse'
                        : 'flex-row'
                    }`}
                  >
                    <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${
                      message.role === 'assistant'
                        ? 'bg-gradient-to-br from-violet-500 to-blue-600'
                        : 'bg-white/10 border border-white/10'
                    }`}>
                      {message.role === 'assistant'
                        ? <Bot size={19} />
                        : <User size={19} />
                      }
                    </div>

                    <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-violet-600/80 to-indigo-600/80 rounded-tr-sm'
                        : 'glass-panel rounded-tl-sm'
                    }`}>
                      <p className="text-sm leading-7 whitespace-pre-wrap break-words">
                        {message.content}
                      </p>

                      <p className="text-[10px] text-white/40 mt-3">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                        <Bot size={19} />
                      </div>

                      <div className="glass-panel rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                        <span className="text-xs text-violet-300 mr-2">
                          Thinking
                        </span>
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="px-4 sm:px-8 pb-6 pt-3">
          <div className="max-w-3xl mx-auto">

            <div className="chat-input rounded-2xl p-2 flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Talk to your Digital Twin..."
                disabled={isLoading}
                className="flex-1 min-w-0 bg-transparent outline-none px-4 py-3 text-sm text-white placeholder:text-gray-600 disabled:opacity-50"
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-30 disabled:hover:scale-100"
              >
                <Send size={18} />
              </button>
            </div>

            <p className="text-center text-[10px] text-gray-600 mt-4">
              Your Digital Twin can make mistakes. Verify important information.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
