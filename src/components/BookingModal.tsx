import React, { useState } from 'react';
import { X, Copy, Check, Upload, Calendar, MapPin, Clock } from 'lucide-react';
import { Companion } from '../types';
import { SERVICES } from '../data';

// Payment accounts - randomly shown
const PAYMENT_ACCOUNTS = [
  { number: '03173223559', name: 'Noman Khan', method: 'Easypaisa' },
  { number: '03465119715', name: 'Majid Amin', method: 'Easypaisa' }
];

interface BookingModalProps {
  companion: Companion;
  onClose: () => void;
  onConfirmBooking: (bookingData: any) => void;
}

export default function BookingModal({ companion, onClose, onConfirmBooking }: BookingModalProps) {
  const [step, setStep] = useState<'select' | 'pay' | 'verify'>('select');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [bookingHours, setBookingHours] = useState<number>(3);
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Evening 3-6');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [paymentAccount, setPaymentAccount] = useState(PAYMENT_ACCOUNTS[0]);
  const [trxLast4, setTrxLast4] = useState('');
  const [senderName, setSenderName] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Get companion services properly mapped
  const companionServices = companion.services.map((cs) => {
    const original = SERVICES.find((s) => s.id === cs.serviceId);
    if (!original) return null;
    return {
      serviceId: cs.serviceId,
      name: original.name,
      category: original.category,
      basePrice: cs.customBasePrice || original.basePrice,
      perHourRate: original.perHourRate
    };
  }).filter(Boolean) as { serviceId: string; name: string; category: string; basePrice: number; perHourRate: number }[];

  // Set default service on mount
  React.useEffect(() => {
    if (companionServices.length > 0 && !selectedServiceId) {
      setSelectedServiceId(companionServices[0].serviceId);
    }
    // Random payment account
    const randomIndex = Math.floor(Math.random() * PAYMENT_ACCOUNTS.length);
    setPaymentAccount(PAYMENT_ACCOUNTS[randomIndex]);
  }, [companion]);

  const getServicePrice = (serviceId: string, hours: number) => {
    const svc = companionServices.find(s => s.serviceId === serviceId);
    if (!svc) return 0;
    return svc.basePrice + (svc.perHourRate * (hours - 1));
  };

  const selectedService = companionServices.find(s => s.serviceId === selectedServiceId);
  const totalPrice = selectedService ? getServicePrice(selectedServiceId, bookingHours) : 0;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentAccount.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedToPayment = () => {
    setErrorMsg('');
    if (!selectedServiceId) {
      setErrorMsg('Please select a service.');
      return;
    }
    if (!bookingDate) {
      setErrorMsg('Please select a booking date.');
      return;
    }
    if (!meetingLocation.trim()) {
      setErrorMsg('Please enter a meeting location.');
      return;
    }
    setStep('pay');
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (trxLast4.length !== 4) {
      setErrorMsg('Please enter last 4 digits of TRX ID.');
      return;
    }
    if (!senderName.trim()) {
      setErrorMsg('Please enter sender name.');
      return;
    }

    onConfirmBooking({
      companionId: companion.id,
      companionName: companion.name,
      serviceId: selectedServiceId,
      serviceName: selectedService?.name,
      durationHours: bookingHours,
      totalPrice: totalPrice,
      bookingDate,
      timeSlot,
      meetingLocation: meetingLocation.trim(),
      paymentTo: paymentAccount.number,
      paymentAccountName: paymentAccount.name,
      trxLast4,
      senderName: senderName.trim(),
      screenshot: screenshot?.name || null
    });

    setStep('verify');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  // Minimum date (2 days from now)
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a0b2e] border border-[#6A0DAD]/50 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-sm font-bold text-white font-display">
            {step === 'select' && 'Book ' + companion.name}
            {step === 'pay' && 'Complete Payment'}
            {step === 'verify' && 'Verify Payment'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Select Service, Hours, Date, Location */}
        {step === 'select' && (
          <div className="p-4 space-y-4">
            {/* Service Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Service</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100"
              >
                {companionServices.map((svc) => (
                  <option key={svc.serviceId} value={svc.serviceId}>
                    {svc.name} — ₨ {svc.basePrice.toLocaleString()} + {svc.perHourRate}/hr
                  </option>
                ))}
              </select>
            </div>

            {/* Hours Select - Minimum 3 */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Hours (Minimum 3)</label>
              <select
                value={bookingHours}
                onChange={(e) => setBookingHours(Number(e.target.value))}
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100"
              >
                {[3,4,5,6,8,10,12].map(h => (
                  <option key={h} value={h}>{h} Hours</option>
                ))}
              </select>
            </div>

            {/* Date Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Booking Date (Min 2 days advance)
              </label>
              <input
                type="date"
                min={getMinDate()}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100"
              >
                <option value="Morning 9-12">Morning 9am - 12pm</option>
                <option value="Afternoon 12-3">Afternoon 12pm - 3pm</option>
                <option value="Evening 3-6">Evening 3pm - 6pm</option>
                <option value="Night 6-9">Night 6pm - 9pm</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Meeting Location
              </label>
              <input
                type="text"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                placeholder="e.g. Gloria Jeans, DHA Phase 6"
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100"
              />
            </div>

            {/* Total Amount */}
            <div className="bg-[#6A0DAD]/10 border border-[#6A0DAD]/30 rounded-xl p-3">
              <p className="text-xs text-slate-400">Total Amount</p>
              <p className="text-xl font-bold text-white">₨ {totalPrice.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-400">50% OFF applied!</p>
            </div>

            {errorMsg && <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>}

            <button
              onClick={handleProceedToPayment}
              className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-bold rounded-xl py-3 text-xs transition-colors"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* STEP 2: Payment Instructions */}
        {step === 'pay' && (
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

            <div className="bg-[#0f071a] border border-white/5 rounded-xl p-3 space-y-1 text-xs text-slate-400">
              <p className="font-semibold text-slate-300 mb-1">Payment Instructions:</p>
              <p>1. Open EasyPaisa app</p>
              <p>2. Send <strong className="text-white">₨ {totalPrice.toLocaleString()}</strong></p>
              <p>3. Enter number: <strong className="text-white">{paymentAccount.number}</strong></p>
              <p>4. Note down the TRX ID</p>
            </div>

            <button
              onClick={() => setStep('verify')}
              className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-bold rounded-xl py-3 text-xs transition-colors"
            >
              I Have Paid — Enter Details
            </button>
          </div>
        )}

        {/* STEP 3: Verify Payment */}
        {step === 'verify' && (
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

            {errorMsg && <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>}

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
  );
}
