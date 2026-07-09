import React, { useState } from 'react';
import { Search, MapPin, Star, Filter, ShieldCheck, X } from 'lucide-react';
import { Companion } from '../types';
import { CITIES, SERVICES } from '../data';

interface BrowsePageProps {
  companions: Companion[];
  onSelectCompanion: (companion: Companion) => void;
}

export default function BrowsePage({ companions, onSelectCompanion }: BrowsePageProps) {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('All');

  const handleClear = () => {
    setSelectedCity('All');
    setSearchQuery('');
    setSelectedGender('All');
  };

  // Extract starting from price for a companion
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

  // Get service names as tags for card display
  const getServiceTags = (comp: Companion) => {
    return comp.services.map((cs) => {
      const original = SERVICES.find((s) => s.id === cs.serviceId);
      return original ? original.name : null;
    }).filter(Boolean) as string[];
  };

  // Filter companions
  const filteredCompanions = companions.filter((comp) => {
    // Only display approved ones in browse
    if (comp.status !== 'Approved') return false;

    // Filter by city dropdown
    if (selectedCity !== 'All' && comp.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    // Filter by manual search input (city, name, interests, bio)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchName = comp.name.toLowerCase().includes(query);
      const matchCity = comp.city.toLowerCase().includes(query);
      const matchBio = comp.bio.toLowerCase().includes(query);
      const matchInterests = comp.interests.some(i => i.toLowerCase().includes(query));
      
      if (!matchName && !matchCity && !matchBio && !matchInterests) {
        return false;
      }
    }

    // Filter by gender
    if (selectedGender !== 'All' && comp.gender !== selectedGender) {
      return false;
    }

    return true;
  });

  return (
    <div id="companion-browse-page" className="p-4 space-y-6 pb-24 animate-fade-in">
      {/* Search & Filter Header Section */}
      <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-4 space-y-3.5 shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Filter className="w-4 h-4 text-[#E9D5FF]" />
          <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider font-display">Search Verified Companions</h3>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Text input search */}
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
            {/* Grouped City dropdown */}
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

            {/* Gender filter */}
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

        {/* Action Buttons */}
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

                  {/* Rating Badge Overlay */}
                  <div className="absolute top-2 left-2 bg-[#0f071a]/85 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-white/5 text-[10px] text-slate-200 font-bold">
                    <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                    <span>{comp.rating.toFixed(1)}</span>
                  </div>

                  {/* Verification Overlay Badge */}
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

                    {/* Service tag clips (max 2 for spacing) */}
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

                  {/* Price Tag & button */}
                  <div className="border-t border-white/5 pt-2 flex flex-col gap-1.5 mt-auto">
                    <div className="text-[10px] text-slate-400">
                      Starts from{' '}
                      <span className="font-extrabold text-xs text-[#E9D5FF]">
                        ₨ {startPrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectCompanion(comp)}
                      className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-semibold rounded-xl py-1.5 text-[10px] transition-colors shadow-md cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
