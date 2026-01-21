import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { supabaseService } from '../services/supabaseService';
import { ChatMessage, DonationDetails } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      text: 'Namaste! I am the **Roti Bank Assistant**. How can I help you support our mission today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [donationDetails, setDonationDetails] = useState<DonationDetails | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const cleanInput = input.trim();
    if (!cleanInput) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: cleanInput }]);
    setIsLoading(true);

    const response = await geminiService.generateChatResponse(cleanInput);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  const renderMessage = (text: string) => {
    const showQR = text.includes('[SHOW_QR]');
    const cleanText = text.replace('[SHOW_QR]', '').trim();
    const parts = cleanText.split(/(\*\*.*?\*\*)/g);

    return (
      <div className="space-y-4">
        <div className="leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong
                  key={i}
                  className="font-extrabold text-emerald-900 bg-emerald-50 px-1 rounded-md"
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

        {showQR && (
          <div className="mt-6 p-4 bg-white rounded-3xl border-2 border-emerald-100 shadow-xl flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                Secure Donation
              </span>
              <i className="fas fa-shield-alt text-emerald-500"></i>
            </div>

            <img
              src={donationDetails?.qrUrl || 'QR.png.jpg'}
              alt="Donation QR Code"
              className="w-48 h-48 object-contain rounded-xl shadow-inner border border-slate-50 mb-3"
            />

            <p className="text-[10px] text-slate-400 font-bold uppercase text-center">
              Scan with any UPI App
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white w-[350px] sm:w-[420px] h-[650px] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src="download-WeResize.com (1).png"
                className="w-10 h-10 rounded-full"
                alt="bot"
              />
              <div>
                <h3 className="font-black text-xl">Roti Bank Assistant</h3>
                <p className="text-[10px] uppercase tracking-widest">
                  Online • Secure Session
                </p>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)}>
              <i className="fas fa-chevron-down"></i>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[90%] p-5 rounded-[2rem] ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border'
                  }`}
                >
                  {renderMessage(msg.text)}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-6 border-t">
            <div className="relative">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="How can I help you donate?"
                className="w-full px-6 py-4 rounded-full border"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 bg-emerald-600 text-white w-10 h-10 rounded-full"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 text-white w-20 h-20 rounded-full shadow-xl"
        >
          <i className="fa-solid fa-comment-dots text-3xl"></i>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
