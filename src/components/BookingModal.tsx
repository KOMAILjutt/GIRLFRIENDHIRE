import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Companion, ServiceItem } from '../types';

interface BookingModalProps {
  companion: Companion;
  service: ServiceItem;
  walletBalance: number;
  onClose: () => void;
  onConfirmBooking: (bookingData: {
    serviceId: string;
    serviceName: string;
    durationHours: number;
    totalPrice: number;
    meetingLocation: string;
    bookingDate: string;
    timeSlot: any;
  }) => void;
  onNavigateToWallet: () => void;
}

export default function BookingModal({
  companion,
  service,
  walletBalance,
  onClose,
  onConfirmBooking,
  onNavigateToWallet
}: BookingModalProps) {
  const [duration, setDuration] = useState<number>(2); // Default to 2 hours
  const [location, setLocation] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState<'Morning 9-12' | 'Afternoon 12-3' | 'Evening 3-6' | 'Night 6-9'>('Evening 3-6');
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate dynamic price
  // Formula: base + (extra hours × per hour rate)
  // Extra hours = chosen duration - 1
  const extraHours = duration - 1;
  const totalPrice = service.basePrice + (extraHours * service.perHourRate);
  const isBalanceSufficient = walletBalance >= totalPrice;

  // Minimum date calculation (at least 2 days from today)
  const [minDateStr, setMinDateStr] = useState('');
  const [tomorrowDateStr, setTomorrowDateStr] = useState('');

  useEffect(() => {
    const today = new Date();
    
    // Min gap is 2 days
    const minDate = new Date();
    minDate.setDate(today.getDate() + 2);
    
    const year = minDate.getFullYear();
    const month = String(minDate.getMonth() + 1).padStart(2, '0');
    const day = String(minDate.getDate()).padStart(2, '0');
    setMinDateStr(`${year}-${month}-${day}`);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomY = tomorrow.getFullYear();
    const tomM = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const tomD = String(tomorrow.getDate()).padStart(2, '0');
    setTomorrowDateStr(`${tomY}-${tomM}-${tomD}`);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    setBookingDate(selected);
    setErrorMsg('');

    if (selected) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selDate = new Date(selected);
      selDate.setHours(0, 0, 0, 0);

      // Diff in ms to days
      const diffTime = selDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 2) {
        setErrorMsg('Strict Rules: Bookings must be scheduled at least 2 days in advance. Today and tomorrow are disabled.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (errorMsg) return;

    if (!location.trim()) {
      setErrorMsg('Please enter a valid meeting location.');
      return;
    }

    if (!bookingDate) {
      setErrorMsg('Please select a booking date.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selDate = new Date(bookingDate);
    selDate.setHours(0, 0, 0, 0);
    const diffTime = selDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 2) {
      setErrorMsg('Strict Rules: Please pick a date at least 2 days from now.');
      return;
    }

    if (!isBalanceSufficient) {
      setErrorMsg('Insufficient EasyPaisa Balance. Please top up your wallet.');
      return;
    }

    onConfirmBooking({
      serviceId: service.id,
      serviceName: service.name,
      durationHours: duration,
      totalPrice,
      meetingLocation: location.trim(),
      bookingDate,
      timeSlot
    });
  };

  return (
    <div id="booking-modal-overlay" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div id="booking-modal-card" className="bg-[#1a0b2e] border border-white/10 rounded-t-2xl sm:rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div>
            <span className="text-[9px] text-[#E9D5FF] uppercase tracking-widest font-mono font-bold">Companion Booking Engine</span>
            <h3 className="text-sm font-bold text-slate-100 font-display">Book {companion.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 bg-[#0f071a] border border-white/5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Service Card */}
        <div className="bg-[#6A0DAD]/15 border border-[#6A0DAD]/35 rounded-xl p-3 flex justify-between items-center">
          <div>
            <div className="text-[10px] bg-[#6A0DAD]/40 border border-[#6A0DAD]/50 text-[#E9D5FF] font-semibold px-2 py-0.5 rounded-full inline-block mb-1 font-mono">
              {service.category} Service
            </div>
            <h4 className="font-semibold text-xs text-slate-100 font-display">{service.name}</h4>
          </div>
          <div className="text-right">
            <div className="font-bold text-xs text-slate-100">₨ {service.basePrice.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 font-mono">+{service.perHourRate}/hr extra</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Duration Selector */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1 flex justify-between font-mono">
              <span>Select Duration (Hours)</span>
              <span className="text-[#E9D5FF] font-normal capitalize">Base covers 1st hour</span>
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
            >
              <option value={2}>2 Hours (Base + 1 hr)</option>
              <option value={3}>3 Hours (Base + 2 hrs)</option>
              <option value={4}>4 Hours (Base + 3 hrs)</option>
              <option value={6}>6 Hours (Base + 5 hrs)</option>
              <option value={8}>8 Hours (Base + 7 hrs)</option>
              <option value={12}>12 Hours (Base + 11 hrs)</option>
              <option value={24}>24 Hours (Full Day Special)</option>
            </select>
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Meeting Location / Place Name <span className="text-[#6A0DAD]">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gloria Jean's Cafe, DHA Phase 6"
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
              />
            </div>
            <p className="text-[9px] text-slate-500 mt-1">Can be any cafe, restaurant, hotel, or private venue agreed between both parties.</p>
          </div>

          {/* Date Picker (At least 2 days gap) */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Select Date (Min. 2 Days Advance) <span className="text-[#6A0DAD]">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="date"
                required
                min={minDateStr}
                value={bookingDate}
                onChange={handleDateChange}
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
              />
            </div>
          </div>

          {/* Time Slot Selector */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Preferred Time Slot <span className="text-[#6A0DAD]">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <select
                value={timeSlot}
                onChange={(e: any) => setTimeSlot(e.target.value)}
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
              >
                <option value="Morning 9-12">Morning 9am - 12pm</option>
                <option value="Afternoon 12-3">Afternoon 12pm - 3pm</option>
                <option value="Evening 3-6">Evening 3pm - 6pm</option>
                <option value="Night 6-9">Night 6pm - 9pm</option>
              </select>
            </div>
          </div>

          {/* Dynamic Pricing details */}
          <div className="bg-[#0f071a]/85 rounded-xl p-3 border border-white/5 space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Base Service Fee ({service.name})</span>
              <span>₨ {service.basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Extra Hours ({extraHours} hrs @ ₨ {service.perHourRate}/hr)</span>
              <span>₨ {(extraHours * service.perHourRate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-200 font-bold border-t border-white/5 pt-1.5 text-xs">
              <span>Total calculated</span>
              <span className="text-[#E9D5FF]">₨ {totalPrice.toLocaleString()} PKR</span>
            </div>
          </div>

          {/* Wallet check & error warnings */}
          <div className="flex items-center justify-between text-[11px] px-1 font-mono">
            <span className="text-slate-400 font-medium">Your EasyPaisa balance:</span>
            <span className={`font-bold ${isBalanceSufficient ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₨ {walletBalance.toLocaleString()} PKR
            </span>
          </div>

          {!isBalanceSufficient && (
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 flex gap-2 text-rose-300">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
              <div>
                <p className="font-semibold text-[11px] font-display">Insufficient Wallet Funds</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  You need <strong>₨ {(totalPrice - walletBalance).toLocaleString()} PKR</strong> more.
                </p>
                <button
                  type="button"
                  onClick={onNavigateToWallet}
                  className="mt-1.5 text-[#E9D5FF] hover:text-white font-bold underline text-[10px] cursor-pointer"
                >
                  Click here to Top Up via EasyPaisa
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-2.5 text-rose-400 text-[10px] font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Footer Warning note */}
          <div className="bg-[#0f071a] border border-white/5 rounded-xl p-2.5 text-[10px] text-slate-400 flex gap-2 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>Funds are held in secure escrow. Admin will verify and confirm meetup with the companion within 30 minutes.</span>
          </div>

          {/* Booking Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isBalanceSufficient}
              className={`w-full font-bold rounded-xl py-3 text-xs transition-all shadow-lg flex items-center justify-center gap-2 ${
                isBalanceSufficient
                  ? 'bg-[#6A0DAD] hover:brightness-110 text-white shadow-[#6A0DAD]/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              Proceed to Escrow Payment – ₨ {totalPrice.toLocaleString()} PKR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
