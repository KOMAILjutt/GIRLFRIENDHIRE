import React, { useState } from 'react';
import { Search, MapPin, Star, Filter, ShieldCheck, X, Copy, Check, Upload } from 'lucide-react';
import { Companion } from '../types';
import { CITIES, SERVICES } from '../data';

interface BrowsePageProps {
  companions: Companion[];
  onSelectCompanion: (companion: Companion) => void;
}

// Payment accounts
const PAYMENT_ACCOUNTS = [
  { number: '03173223559', name: 'Noman Khan' },
  { number: '03465119715', name: 'Majid Amin' }
];

export default function BrowsePage({ companions, onSelectCompanion }: BrowsePageProps) {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  
  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [bookingHours, setBookingHours] = useState<number>(1);
  const [paymentAccount, setPaymentAccount] = useState<{number: string, name: string} | null>(null);
  
  // Payment verification state
  const [trxLast4, setTrxLast4] = useState('');
  const [senderName, setSenderName] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'pay' | 'verify'>('select');
  const [copied, setCopied] = useState(false);

  const handleClear = () => {
    setSelectedCity('All');
    setSearchQuery('');
    setSelectedGender('All');
  };

  const getStartingPrice = (comp: Companion) => {
    let minPrice = Infinity;
    comp.services.forEach((cs) => {
      const original = SERVICES.find((s) => s.id === cs.serviceId);
      if (original) {
        const price = cs.customBasePrice || original.basePrice;
        if (price < minPrice) {
          minPrice = price;
        }
      }
    });
    return minPrice === Infinity ? 2000 : minPrice;
  };

  const getServiceTags = (comp: Companion) => {
    return comp.services.map((cs) => {
      const original = SERVICES.find((s) => s.id === cs.serviceId);
      return original ? original.name : null;
    }).filter(Boolean) as string[];
  };

  const getServicePrice = (serviceId: string, hours: number = 1) => {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return 0;
    return service.basePrice + (service.perHourRate * (hours - 1));
  };

  const handleBookNow = (comp: Companion) => {
    setSelectedCompanion(comp);
    setSelectedService(comp.services[0]?.serviceId || '');
    setBookingHours(1);
    setPaymentStep('select');
    setTrxLast4('');
    setSenderName('');
    setScreenshot(null);
    setShowBookingModal(true);
  };

  const handleProceedToPayment = () => {
    // Randomly select one payment account
    const randomIndex = Math.floor(Math.random() * PAYMENT_ACCOUNTS.length);
    setPaymentAccount(PAYMENT_ACCOUNTS[randomIndex]);
    setPaymentStep('pay');
  };

  const handleCopyNumber = () => {
    if (paymentAccount) {
      navigator.clipboard.writeText(paymentAccount.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (trxLast4.length !== 4) {
      alert('Please enter last 4 digits of TRX ID');
      return;
    }
    if (!senderName.trim()) {
      alert('Please enter sender name');
      return;
    }

    // Here you would send to Supabase
    console.log('Booking submitted:', {
      companion: selectedCompanion?.id,
      service: selectedService,
      hours: bookingHours,
      amount: getServicePrice(selectedService, bookingHours),
      paymentTo: paymentAccount,
      trxLast4,
      senderName,
      screenshot: screenshot?.name
    });

    setPaymentStep('verify');
    setTimeout(() => {
      setShowBookingModal(false);
      alert('Booking request submitted! Admin will verify your payment.');
    }, 2000);
  };

  const filteredCompanions = companions.filter((comp) => {
    if (comp.status !== 'Approved') return false;
    if (selectedCity !== 'All' && comp.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchName = comp.name.toLowerCase().includes(query);
      const matchCity = comp.city.toLowerCase().includes(query);
      const matchBio = comp.bio.toLowerCase().includes(query);
      const matchInterests = comp.interests.some(i => i.toLowerCase().includes(query));
      if (!matchName && !matchCity && !matchBio && !matchInterests) return false;
    }
    if (selectedGender !== 'All' && comp.gender !== selectedGender) return false;
    return true;
  });

  return (
    <div id="companion-browse-page" className="p-4 space-y-6 pb-24 animate-fade-in">
      {/* Special Offer Banner */}
      <div className="bg-gradient-to-r from-[#6A0DAD] to-[#4c0780] rounded-2xl p-4 text-center text-white shadow-lg">
        <h2 className="text-sm font-bold font-display uppercase tracking-wider">Start Booking from 999 Only!</h2>
        <p className="text-[11px] mt-1 text-purple-100">
          50% OFF on all services!
        </p>
      </div>

      {/* Search & Filter Header Section */}
      <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-4 space-y-3.5 shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Filter className="w-4 h-4 text-[#E9D5FF]" />
          <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider font-display">Search Verified Companions</h3>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Lahore, Multan, conversationalist, Aisha..."
              className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">City Filter</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
              >
                <option value="All">All Cities</option>
                <optgroup label="Tier 1 (Major)">
                  {CITIES.tier1.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Tier 2 (Mid)">
                  {CITIES.tier2.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Tier 3 (Smaller)">
                  {CITIES.tier3.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
              >
                <option value="All">All Genders</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1 text-[11px]">
          <span className="text-slate-400 font-medium">
            Found <strong className="text-[#E9D5FF]">{filteredCompanions.length}</strong> available results
          </span>
          {(selectedCity !== 'All' || searchQuery !== '' || selectedGender !== 'All') && (
            <button
              onClick={handleClear}
              className="text-[#E9D5FF] hover:text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Grid of cards */}
      {filteredCompanions.length === 0 ? (
        <div className="bg-[#1a0b2e]/65 border border-white/5 rounded-2xl p-8 text-center text-xs text-slate-500 space-y-2 shadow-lg">
          <p className="font-semibold text-slate-400">No companions match your search parameters.</p>
          <p className="text-[11px]">Try searching different keywords, clearing the filter, or selecting "All Cities".</p>
          <button
            onClick={handleClear}
            className="mt-2 bg-[#6A0DAD]/25 text-[#E9D5FF] hover:bg-[#6A0DAD]/40 border border-[#6A0DAD]/45 px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {filteredCompanions.map((comp) => {
            const startPrice = getStartingPrice(comp);
            const serviceTags = getServiceTags(comp);

            return (
              <div
                key={comp.id}
                className="bg-[#1a0b2e] border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-[#6A0DAD]/50 hover:shadow-[0_0_15px_rgba(106,13,173,0.25)] transition-all duration-300 group shadow-md"
              >
                {/* Photo Header */}
                <div className="relative aspect-4/5 bg-[#0f071a] overflow-hidden">
                  <img
                    src={comp.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={comp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute top-2 left-2 bg-[#0f071a]/85 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-white/5 text-[10px] text-slate-200 font-bold">
                    <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                    <span>{comp.rating.toFixed(1)}</span>
                  </div>

                  {comp.isVerified && (
                    <div className="absolute top-2 right-2 bg-[#6A0DAD]/90 border border-[#6A0DAD]/50 text-white p-1 rounded-full flex items-center justify-center shadow-md shadow-[#0f071a]/30" title="Admin Verified">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                    </div>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-bold text-xs text-slate-100 group-hover:text-[#E9D5FF] transition-colors line-clamp-1 font-display">
                        {comp.name}, {comp.age}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin className="w-3 h-3 text-[#E9D5FF]/85 shrink-0" />
                      <span className="line-clamp-1">{comp.city}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1 overflow-hidden h-[18px]">
                      {serviceTags.slice(0, 2).map((st, i) => (
                        <span
                          key={i}
                          className="bg-[#6A0DAD]/20 text-[#E9D5FF] border border-[#6A0DAD]/30 text-[8px] px-1.5 py-0.5 rounded-full tracking-wide line-clamp-1"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price Tag & Book Now button */}
                  <div className="border-t border-white/5 pt-2 flex flex-col gap-1.5 mt-auto">
                    <div className="text-[10px] text-slate-400">
                      Starts from{' '}
                      <span className="font-extrabold text-xs text-[#E9D5FF]">
                        ₨ {startPrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleBookNow(comp)}
                      className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-semibold rounded-xl py-1.5 text-[10px] transition-colors shadow-md cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BOOKING MODAL */}
      {showBookingModal && selectedCompanion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0b2e] border border-[#6A0DAD]/50 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-sm font-bold text-white font-display">Book {selectedCompanion.name}</h2>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: Select Service & Hours */}
            {paymentStep === 'select' && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Select Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100"
                  >
                    {selectedCompanion.services.map((cs) => {
                      const svc = SERVICES.find(s => s.id === cs.serviceId);
                      return svc ? (
                        <option key={cs.serviceId} value={cs.serviceId}>
                          {svc.name} - ₨ {getServicePrice(cs.serviceId, 1).toLocaleString()}
                        </option>
                      ) : null;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Hours</label>
                  <select
                    value={bookingHours}
                    onChange={(e) => setBookingHours(Number(e.target.value))}
                    className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100"
                  >
                    {[1,2,3,4,5,6,8].map(h => (
                      <option key={h} value={h}>{h} Hour{h>1?'s':''}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-[#6A0DAD]/10 border border-[#6A0DAD]/30 rounded-xl p-3">
                  <p className="text-xs text-slate-400">Total Amount</p>
                  <p className="text-xl font-bold text-white">₨ {getServicePrice(selectedService, bookingHours).toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-400">50% OFF applied!</p>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-bold rounded-xl py-3 text-xs transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {/* STEP 2: Payment Instructions */}
            {paymentStep === 'pay' && paymentAccount && (
              <div className="p-4 space-y-4">
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-emerald-400 mb-1">Send payment to this EasyPaisa number:</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <p className="text-lg font-bold text-white font-mono">{paymentAccount.number}</p>
                    <button 
                      onClick={handleCopyNumber}
                      className="text-[#D4AF37] hover:text-white"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Account: {paymentAccount.name}</p>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>1. Open EasyPaisa app</p>
                  <p>2. Send <strong>₨ {getServicePrice(selectedService, bookingHours).toLocaleString()}</strong></p>
                  <p>3. Enter number: <strong>{paymentAccount.number}</strong></p>
                  <p>4. Note down the TRX ID</p>
                </div>

                <button
                  onClick={() => setPaymentStep('verify')}
                  className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-bold rounded-xl py-3 text-xs transition-colors"
                >
                  I Have Paid - Enter Details
                </button>
              </div>
            )}

            {/* STEP 3: Verify Payment */}
            {paymentStep === 'verify' && paymentAccount && (
              <form onSubmit={handleSubmitPayment} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last 4 Digits of TRX ID</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={trxLast4}
                    onChange={(e) => setTrxLast4(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 7845"
                    required
                    className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100 text-center font-mono tracking-widest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sender Name (Your Name)</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Screenshot (Optional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label 
                      htmlFor="screenshot-upload"
                      className="flex items-center justify-center gap-2 w-full bg-[#0f071a] border border-dashed border-[#6A0DAD]/50 rounded-xl px-3 py-3 text-xs text-slate-400 cursor-pointer hover:border-[#6A0DAD]"
                    >
                      <Upload className="w-4 h-4" />
                      {screenshot ? screenshot.name : 'Click to upload screenshot'}
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-3 text-xs transition-colors"
                >
                  Submit Booking Request
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
