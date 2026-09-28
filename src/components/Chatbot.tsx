import React, { useState, useRef, useEffect } from 'react';
import logoImg from '../assets/logo.png';
import { geminiService } from '../services/geminiService';
import { aiKnowledgeEngine } from '../services/aiKnowledgeEngine';
import { supabaseService } from '../services/supabaseService';
import { ChatMessage, DonationDetails } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      text: 'Namaste! I am the **Roti Bank AI Assistant**. Ask me anything about our daily meal drives, donations, Section 80G tax receipts, volunteering, or branch locations in Bettiah.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [donationDetails, setDonationDetails] = useState<DonationDetails | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    supabaseService
      .getDonationDetails()
      .then(setDonationDetails)
      .catch(err =>
        console.error('Failed to fetch donation details for chat:', err)
      );
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const askAi = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    const cleanInput = queryText.trim();

    setMessages(prev => [...prev, { role: 'user', text: cleanInput }]);
    setIsLoading(true);

    const response = await geminiService.generateChatResponse(cleanInput);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const currentInput = input;
    setInput('');
    await askAi(currentInput);
  };

  const renderMessage = (text: string) => {
    const showQR = text.includes('[SHOW_QR]');
    const showVolunteerBtn = text.includes('[OPEN_VOLUNTEER_FORM]');
    const cleanText = text.replace('[SHOW_QR]', '').replace('[OPEN_VOLUNTEER_FORM]', '').trim();
    const parts = cleanText.split(/(\*\*.*?\*\*)/g);

    return (
      <div className="space-y-4">
        <div className="leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong
                  key={i}
                  className="font-extrabold text-emerald-950 bg-emerald-50 px-1 py-0.5 rounded"
                >
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return (
              <span key={i} className="font-normal text-slate-700">
                {part}
              </span>
            );
          })}
        </div>

        {showVolunteerBtn && (
          <div className="mt-3 p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <i className="fas fa-file-signature text-emerald-600"></i>
              Official Volunteer Form Available
            </div>
            <p className="text-[11px] text-slate-600">
              Fill out the volunteer form directly on our site to join our daily evening meal drives.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => {
                  document.getElementById('volunteer')?.scrollIntoView({ behavior: 'smooth' });
                }, 200);
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <i className="fas fa-arrow-down text-[10px]"></i>
              Open Volunteer Form
            </button>
          </div>
        )}

        {showQR && (
          <div className="mt-4 p-4 bg-white rounded-2xl border border-emerald-200 shadow-sm flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Official UPI QR Code
              </span>
              <i className="fas fa-shield-halved text-emerald-600 text-xs"></i>
            </div>

            {donationDetails?.qrUrl ? (
              <>
                <img
                  src={donationDetails.qrUrl}
                  alt="Donation QR Code"
                  className="w-44 h-44 object-contain rounded-xl border border-slate-100 mb-2"
                />
                <p className="text-[10px] text-slate-500 font-semibold uppercase text-center">
                  Scan with GPay, PhonePe, Paytm, or BHIM
                </p>
              </>
            ) : (
              <div className="text-center p-3 bg-slate-50 rounded-xl w-full">
                <i className="fas fa-building-columns text-slate-400 text-xl mb-1"></i>
                <p className="text-[11px] text-slate-600 font-medium">
                  PNB Account: <strong>1919202100001486</strong><br/>
                  IFSC: <strong>PUNB0191920</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const quickActions = [
    { text: 'How to donate?', icon: 'fa-hand-holding-heart' },
    { text: 'How to volunteer?', icon: 'fa-hands-helping' },
    { text: '80G Tax Exemption', icon: 'fa-file-shield' },
    { text: 'Bank Account Details', icon: 'fa-building-columns' },
    { text: 'Where is food served?', icon: 'fa-location-dot' },
    { text: 'Wedding surplus food', icon: 'fa-utensils' },
  ];


  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chatbot-panel"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="bg-white w-[350px] sm:w-[420px] h-[640px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={logoImg}
                    className="w-10 h-10 rounded-xl border border-emerald-500/30 object-cover"
                    alt="Roti Bank AI"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 shadow"></div>
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight text-white flex items-center gap-1.5">
                    Roti Bank AI
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                      NATIVE
                    </span>
                  </h3>
                  <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Instant Answers • 100% Free
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMessages([
                    {
                      role: 'ai',
                      text: 'Namaste! I am the **Roti Bank AI Assistant**. Ask me anything about our daily meal drives, donations, Section 80G tax receipts, volunteering, or branch locations in Bettiah.'
                    }
                  ])}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs"
                  title="Reset Chat"
                >
                  <i className="fas fa-rotate-right"></i>
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs"
                  aria-label="Close Chatbot"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-emerald-700 text-white rounded-xl rounded-tr-none shadow-sm'
                        : 'bg-white border border-slate-200/80 rounded-xl rounded-tl-none shadow-sm text-slate-800'
                    }`}
                  >
                    {renderMessage(msg.text)}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-slate-200 p-3 rounded-xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </motion.div>
              )}

              {/* Quick Suggestion Chips */}
              {!isLoading && (
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Suggested Questions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => askAi(action.text)}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-xs font-medium transition-all active:scale-95 flex items-center gap-1.5 border border-slate-200 hover:border-emerald-300 shadow-2xs"
                      >
                        <i className={`fas ${action.icon} text-[9px] text-emerald-600`}></i>
                        {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form id="chatbot-form" onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-white">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isLoading ? "Generating answer..." : "Ask in English or Hindi..."}
                  disabled={isLoading}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:bg-slate-100 transition-all text-xs md:text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 bg-emerald-600 hover:bg-emerald-700 text-white w-9 h-9 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center shadow-sm"
                  aria-label="Send message"
                >
                  <i className="fas fa-paper-plane text-xs"></i>
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Floating FAB Button */
          <motion.button
            key="chatbot-fab"
            onClick={() => setIsOpen(true)}
            className="relative bg-emerald-600 hover:bg-emerald-700 text-white w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center group border border-emerald-500/30"
            aria-label="Open Roti Bank Assistant"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 rounded-2xl bg-emerald-400 animate-ping opacity-20"></div>
            
            <i className="fas fa-comment-dots text-xl relative z-10"></i>
            
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.95 }}
                  className="absolute right-full mr-3 bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl border border-slate-800 pointer-events-none"
                >
                  Ask Roti Bank AI
                  <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-t border-slate-800"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Online badge */}
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white shadow flex items-center justify-center"></div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
