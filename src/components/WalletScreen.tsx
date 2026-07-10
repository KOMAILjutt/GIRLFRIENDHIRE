import React, { useState } from 'react';
import { Wallet, Landmark, ArrowUpRight, ArrowDownLeft, Copy, Check } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'payment' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'Completed' | 'Pending';
}

interface WalletScreenProps {
  balance: number;
  transactions: Transaction[];
  onTopUp: (amount: number, trxId: string) => void;
}

export default function WalletScreen({ balance, transactions, onTopUp }: WalletScreenProps) {
  const [topUpAmount, setTopUpAmount] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCopyTill = () => {
    navigator.clipboard.writeText('489312');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Please enter a valid positive amount.');
      return;
    }
    if (!trxId.trim()) {
      setErrorMsg('Please enter the EasyPaisa TRX ID.');
      return;
    }

    onTopUp(amount, trxId.trim());
    setSuccessMsg(`Payment request submitted! Admin will verify your payment within 30 minutes.`);
    setTopUpAmount('');
    setTrxId('');

    setTimeout(() => setSuccessMsg(''), 6000);
  };

  return (
    <div id="wallet-screen-container" className="p-4 space-y-6 pb-24 animate-fade-in">
      {/* Payment Info Card - FAKE BALANCE REMOVED */}
      <div className="bg-gradient-to-br from-[#1a0b2e] via-[#6A0DAD]/40 to-[#0f071a] text-white rounded-2xl p-6 shadow-xl border border-[#6A0DAD]/35 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#6A0DAD]/10 rounded-full blur-2xl" />
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#E9D5FF]" />
          <span className="text-sm font-medium text-[#E9D5FF]/80 font-display">EasyPaisa Payment</span>
        </div>
        <div className="mt-4">
          <p className="text-sm text-[#E9D5FF]">
            Pay after booking via EasyPaisa. Admin will verify your payment.
          </p>
        </div>
        <p className="text-xs text-[#E9D5FF]/75 mt-2">
          Send payment to our EasyPaisa account after you book a companion.
        </p>
      </div>

      {/* Top Up Instructions */}
      <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <Landmark className="w-4.5 h-4.5 text-[#E9D5FF]" />
          <h3 className="font-semibold text-sm text-slate-100 font-display">How to Pay via EasyPaisa</h3>
        </div>
        
        <ol className="text-xs text-slate-400 space-y-2.5 list-decimal list-inside">
          <li>Open your <strong>EasyPaisa App</strong>.</li>
          <li>Choose <strong>Send Money</strong> &gt; <strong>To Merchant (Till Payment)</strong>.</li>
          <li>
            Enter Till ID:{' '}
            <button 
              onClick={handleCopyTill}
              type="button"
              className="inline-flex items-center gap-1 bg-[#0f071a] text-[#D4AF37] px-2.5 py-1 rounded-lg font-mono font-semibold text-xs border border-[#6A0DAD]/40 hover:bg-[#6A0DAD]/20 transition-colors cursor-pointer"
            >
              489312
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#D4AF37]/70" />}
            </button>
          </li>
          <li>Transfer the booking amount and note down the <strong>TRX ID</strong>.</li>
          <li>Submit the form below for admin verification.</li>
        </ol>

        {/* Submit Form */}
        <form onSubmit={handleSubmitTopUp} className="space-y-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Amount Paid (PKR)</label>
            <input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="e.g. 5000"
              required
              className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">EasyPaisa TRX ID</label>
            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="e.g. 35849102431"
              required
              className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD] font-mono"
            />
          </div>

          {errorMsg && <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>}
          {successMsg && <p className="text-xs text-emerald-400 font-medium">{successMsg}</p>}

          <button
            type="submit"
            className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-semibold rounded-xl py-2.5 text-xs transition-colors shadow-lg cursor-pointer"
          >
            Submit Payment for Verification
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-slate-100 px-1 font-display">Payment History</h3>
        {transactions.length === 0 ? (
          <div className="bg-[#1a0b2e]/40 border border-white/5 rounded-xl p-6 text-center text-xs text-slate-500">
            No payments found yet.
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-[#1a0b2e] border border-white/5 rounded-xl p-3 flex justify-between items-center shadow-md hover:border-[#6A0DAD]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    tx.type === 'deposit' 
                      ? 'bg-emerald-950/40 text-emerald-400' 
                      : tx.type === 'refund' 
                      ? 'bg-blue-950/40 text-blue-400'
                      : 'bg-rose-950/40 text-rose-400'
                  }`}>
                    {tx.type === 'deposit' || tx.type === 'refund' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-xs">{tx.description}</h4>
                    <span className="text-[10px] text-slate-500">{tx.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-xs ${
                    tx.type === 'deposit' || tx.type === 'refund' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}₨ {tx.amount.toLocaleString()}
                  </span>
                  <div className="text-[9px] text-slate-500">{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
