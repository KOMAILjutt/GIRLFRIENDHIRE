import React from 'react';
import { Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer-section" className="bg-[#1a0b2e] text-slate-300 py-8 px-4 border-t border-white/5 mt-auto text-xs md:text-sm">
      <div className="max-w-md mx-auto space-y-6">
        {/* Contact and Payment details */}
        <div className="pt-4 border-t border-white/5 text-center text-[10px] text-slate-500 font-mono">
          &copy; 2026 YAARANA.PK Pakistan. All rights reserved. Registered under SECP.
        </div>
      </div>
    </footer>
  );
}

