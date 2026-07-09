import React, { useState } from 'react';
import { ShieldCheck, Star, MapPin, Calendar, BookOpen, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Companion, ServiceItem } from '../types';
import { SERVICES } from '../data';

interface ProfilePageProps {
  companion: Companion;
  onBack: () => void;
  onBook: (service: ServiceItem) => void;
}

export default function ProfilePage({ companion, onBack, onBook }: ProfilePageProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const nextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % companion.photos.length);
  };

  const prevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + companion.photos.length) % companion.photos.length);
  };

  // Resolve services offered
  const companionServices = companion.services.map((cs) => {
    const serviceDetails = SERVICES.find((s) => s.id === cs.serviceId);
    return serviceDetails ? {
      ...serviceDetails,
      basePrice: cs.customBasePrice || serviceDetails.basePrice,
      perHourRate: cs.customPerHourRate || serviceDetails.perHourRate
    } : null;
  }).filter(Boolean) as ServiceItem[];

  return (
    <div id="companion-profile-page" className="p-4 space-y-5 pb-24 animate-fade-in">
      {/* Back button header */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="bg-[#1a0b2e] border border-white/10 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 hover:text-white transition-colors cursor-pointer shadow-md"
        >
          <ChevronLeft className="w-4 h-4 text-[#E9D5FF]" /> Back to Browse
        </button>
      </div>

      {/* Swipeable / Clickable Image Gallery */}
      <div className="relative bg-[#0f071a] rounded-2xl overflow-hidden aspect-4/5 shadow-2xl border border-white/10 animate-fade-in">
        <img
          src={companion.photos[activePhotoIdx]}
          alt={`${companion.name} full photo`}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Next/Prev Buttons */}
        {companion.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#0f071a]/60 p-2 rounded-full text-white border border-white/10 backdrop-blur-sm cursor-pointer hover:bg-[#6A0DAD]/50 transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0f071a]/60 p-2 rounded-full text-white border border-white/10 backdrop-blur-sm cursor-pointer hover:bg-[#6A0DAD]/50 transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-[#0f071a]/75 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
          {companion.photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhotoIdx(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activePhotoIdx === idx ? 'bg-[#6A0DAD] scale-125 shadow-[0_0_8px_rgba(106,13,173,0.6)]' : 'bg-slate-400/50'
              }`}
            />
          ))}
        </div>

        {/* Verification badge on image overlay */}
        {companion.isVerified && (
          <div className="absolute top-3 right-3 bg-[#6A0DAD]/90 backdrop-blur-sm border border-[#6A0DAD]/50 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" /> Admin Verified
          </div>
        )}
      </div>

      {/* Thumbnail Bar */}
      <div className="flex gap-2 justify-center">
        {companion.photos.map((ph, idx) => (
          <button
            key={idx}
            onClick={() => setActivePhotoIdx(idx)}
            className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
              activePhotoIdx === idx ? 'border-[#6A0DAD] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={ph} alt="thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </button>
        ))}
      </div>

      {/* Profile Details Header */}
      <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-slate-100 font-display">{companion.name}, {companion.age}</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#E9D5FF]/80" />
              <span>{companion.city}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#0f071a] border border-[#6A0DAD]/35 px-2.5 py-1 rounded-full shadow-inner">
            <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
            <span className="text-xs font-bold text-slate-200">{companion.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {companion.interests.map((interest, idx) => (
            <span
              key={idx}
              className="bg-[#6A0DAD]/20 text-[#E9D5FF] border border-[#6A0DAD]/35 text-[10px] px-2.5 py-1 rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Bio */}
        <div className="border-t border-white/5 pt-3">
          <h4 className="text-[10px] font-semibold text-[#E9D5FF] uppercase tracking-wider mb-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> About {companion.name}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{companion.bio}</p>
        </div>
      </div>

      {/* Services and Pricing Grid */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-slate-100 px-1 font-display">Services Offered &amp; Rates</h3>
        <div className="space-y-2">
          {companionServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-4 flex justify-between items-center hover:border-[#6A0DAD]/50 transition-colors shadow-md"
            >
              <div className="space-y-1">
                <span className="text-[9px] bg-[#6A0DAD]/20 border border-[#6A0DAD]/40 text-[#E9D5FF] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                  {service.category}
                </span>
                <h4 className="font-bold text-xs text-slate-100 mt-1 font-display">{service.name}</h4>
                <p className="text-[10px] text-slate-500">Includes meet guidance, safe public settings.</p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold text-xs text-slate-100">₨ {service.basePrice.toLocaleString()}</div>
                <div className="text-[9px] text-slate-500">+{service.perHourRate}/hr extra</div>
                <button
                  onClick={() => onBook(service)}
                  className="mt-2 bg-[#6A0DAD] hover:brightness-110 text-white font-semibold rounded-lg px-3 py-1.5 text-[10px] transition-all cursor-pointer shadow-md"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-slate-100 px-1 flex items-center gap-1.5 font-display">
          <MessageSquare className="w-4 h-4 text-[#E9D5FF]" /> Client Feedbacks ({companion.reviews.length})
        </h3>
        {companion.reviews.length === 0 ? (
          <div className="bg-[#1a0b2e]/40 border border-white/5 rounded-2xl p-5 text-center text-xs text-slate-500">
            No feedbacks recorded yet. Be the first to book and share your thoughts!
          </div>
        ) : (
          <div className="space-y-2">
            {companion.reviews.map((rev) => (
              <div key={rev.id} className="bg-[#1a0b2e]/65 border border-white/5 rounded-2xl p-3.5 space-y-1.5 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-200">{rev.reviewerName}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(rev.rating) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">"{rev.comment}"</p>
                <span className="block text-[9px] text-slate-500 text-right font-mono">{rev.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
