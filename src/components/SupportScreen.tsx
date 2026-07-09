import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, UserCheck, ShieldCheck, HelpCircle } from 'lucide-react';
import { SupportMessage } from '../types';

interface SupportScreenProps {
  messages: SupportMessage[];
  onSendMessage: (text: string, sender: 'user' | 'admin') => void;
}

export default function SupportScreen({ messages, onSendMessage }: SupportScreenProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    onSendMessage(userText, 'user');
    setInputText('');

    // Trigger standard automated response after 1 second
    setTimeout(() => {
      let responseText = "Thanks for contacting YAARANA.PK Support. A member of our verification team is online and reviewing your query. We typically respond within 5-10 minutes. How else can we assist you?";
      
      // Smart matching
      const lower = userText.toLowerCase();
      if (lower.includes('easypaisa') || lower.includes('payment') || lower.includes('paisa') || lower.includes('money')) {
        responseText = "For EasyPaisa payments, please transfer to Till ID 489312 and enter the TRX ID in the Wallet tab. Once submitted, your wallet will be updated instantly. Bookings are automatically confirmed after wallet checks!";
      } else if (lower.includes('unsafe') || lower.includes('safety') || lower.includes('intimate') || lower.includes('rule')) {
        responseText = "Safety, respect, and mutual consent are our #1 priorities. We support personal intimacy and private companion meetups between consenting adults. All companions are verified via National CNIC and face screening. If you have any concerns, please let us know immediately here.";
      } else if (lower.includes('approve') || lower.includes('admin') || lower.includes('register') || lower.includes('pending')) {
        responseText = "New companion profiles are reviewed by our Pakistani regional admins within 24 hours. You will receive an SMS/Email notification. To speed up verification, ensure you have uploaded 3 clear, high-resolution photos.";
      }
      
      onSendMessage(responseText, 'admin');
    }, 1200);
  };

  const handleQuickQuestion = (question: string, answer: string) => {
    onSendMessage(question, 'user');
    setTimeout(() => {
      onSendMessage(answer, 'admin');
    }, 1000);
  };

  const faqs = [
    {
      q: "Is intimacy allowed?",
      a: "Yes! YAARANA.PK supports both platonic social activities and private personal intimacy based on mutual consent and agreement between adults. Please discuss preferences directly with your selected companion."
    },
    {
      q: "How to pay verified companions?",
      a: "All payments are routed through our secure EasyPaisa Wallet system. You top up your wallet via EasyPaisa Till ID 489312. When you book a companion, the funds are held in escrow and released only after the meetup is successful."
    },
    {
      q: "How long does admin approval take?",
      a: "Our local admin team verifies companion registrations within 24 hours. They check photos against CNIC/identity details for authenticity."
    }
  ];

  return (
    <div id="support-screen" className="flex flex-col h-[calc(100vh-130px)] pb-16 animate-fade-in">
      {/* Support Status Header */}
      <div className="bg-[#1a0b2e] border-b border-white/10 p-3 shrink-0 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#6A0DAD]/30 border border-[#6A0DAD]/50 flex items-center justify-center text-[#E9D5FF] font-black text-xs font-display shadow-inner">
              GH
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#0f071a] animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-xs text-slate-100 flex items-center gap-1 font-display">
              YAARANA.PK Support <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            </h3>
            <span className="text-[10px] text-emerald-400 font-medium">Regional Admins Online (Lahore & Karachi)</span>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f071a]">
        {/* Help Banner */}
        <div className="bg-[#6A0DAD]/10 border border-[#6A0DAD]/30 rounded-xl p-3 text-[11px] text-slate-400 flex gap-2.5">
          <HelpCircle className="w-4 h-4 text-[#E9D5FF] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200 block mb-0.5">Welcome to YAARANA.PK Support!</span>
            Ask us anything about EasyPaisa transactions, companion registration, safety measures, or cancellation rules.
          </div>
        </div>

        {/* Dynamic Messages */}
        {messages.map((msg) => {
          const isAdmin = msg.sender === 'admin';
          return (
            <div
              key={msg.id}
              className={`flex ${isAdmin ? 'justify-start' : 'justify-end'} animate-fade-in`}
            >
              <div
                className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isAdmin
                    ? 'bg-[#1a0b2e] text-slate-200 rounded-tl-none border border-white/5 shadow-md'
                    : 'bg-[#6A0DAD] text-white rounded-tr-none shadow-lg shadow-[#6A0DAD]/15'
                }`}
              >
                <div className={`font-bold text-[10px] mb-0.5 ${isAdmin ? 'text-[#E9D5FF]' : 'text-[#E9D5FF]/80'}`}>
                  {isAdmin ? 'System Admin' : 'You'}
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div className="text-[8px] text-slate-500 text-right mt-1 font-mono">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* FAQ Chips Quick Select */}
      <div className="p-2 bg-[#0f071a] border-t border-white/5 shrink-0">
        <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 px-1">Quick Questions</span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {faqs.map((faq, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(faq.q, faq.a)}
              className="bg-[#1a0b2e] hover:bg-[#6A0DAD]/20 hover:border-[#6A0DAD]/40 border border-white/5 text-slate-300 text-[10px] px-2.5 py-1.5 rounded-full shrink-0 transition-colors cursor-pointer"
            >
              {faq.q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field Form */}
      <form onSubmit={handleSend} className="p-3 bg-[#1a0b2e] border-t border-white/10 shrink-0 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
        />
        <button
          type="submit"
          className="bg-[#6A0DAD] hover:brightness-110 text-white p-2.5 rounded-xl transition-colors shrink-0 shadow-md flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
