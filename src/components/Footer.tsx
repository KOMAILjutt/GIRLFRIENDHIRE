import React from 'react';
import { Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer-section" className="bg-[#1a0b2e] text-slate-300 py-8 px-4 border-t border-white/5 mt-auto text-xs md:text-sm">
      <div className="max-w-md mx-auto space-y-6">
        {/* Contact and Payment details */}
        <div className="bg-[#0f071a] p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center space-y-2">
          <h4 className="font-semibold text-slate-100 text-xs font-display">EasyPaisa Secure Escrow</h4>
          <div className="space-y-1 text-[11px] text-slate-400">
            <div className="flex items-center justify-center gap-1 text-slate-300 font-medium">
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              Till ID: 489312
            </div>
            <div>Girlfriend Hire PK Ltd.</div>
            <div className="text-[10px] text-[#E9D5FF]/80 font-mono">Approved SECP Platform Merchant</div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 text-center text-[10px] text-slate-500 font-mono">
          &copy; 2026 Girlfriend Hire Pakistan. All rights reserved. Registered under SECP.
        </div>
      </div>
    </footer>
  );
}

