import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, Edit3, CheckCircle, XCircle, Users, BarChart3, Landmark, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { Companion, ServiceItem, SupportMessage, Booking } from '../types';
import { CITIES, SERVICES } from '../data';

interface AdminPanelProps {
  companions: Companion[];
  onApproveReject: (id: string, newStatus: 'Approved' | 'Pending' | 'Rejected') => void;
  onDeleteCompanion: (id: string) => void;
  onAddCompanion: (newComp: Companion) => void;
  onEditCompanion: (comp: Companion) => void;
  supportMessages: SupportMessage[];
  onSendAdminReply: (text: string) => void;
  bookings: Booking[];
  onApproveBooking: (id: string) => void;
  onRejectBooking: (id: string) => void;
  onCompleteBooking: (id: string) => void;
}

export default function AdminPanel({
  companions,
  onApproveReject,
  onDeleteCompanion,
  onAddCompanion,
  onEditCompanion,
  supportMessages,
  onSendAdminReply,
  bookings,
  onApproveBooking,
  onRejectBooking,
  onCompleteBooking
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'companions' | 'bookings' | 'add' | 'support'>('companions');

  // Form states for adding new companion
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number>(23);
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [newCity, setNewCity] = useState('Lahore');
  const [newBio, setNewBio] = useState('');
  const [newPhotos, setNewPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  ]);
  const [selectedServices, setSelectedServices] = useState<string[]>(['srv_1', 'srv_3']);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Stats calculation
  const totalCompanions = companions.length;
  const approvedCompanions = companions.filter(c => c.status === 'Approved').length;
  const pendingCompanions = companions.filter(c => c.status === 'Pending').length;

  // Real Photo Upload & Permission states for Admin onboarding
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionTargetIndex, setPermissionTargetIndex] = useState<number>(0);
  const [galleryPermission, setGalleryPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const triggerFileUpload = (idx: number) => {
    setPermissionTargetIndex(idx);
    if (galleryPermission === 'granted') {
      fileInputRef.current?.click();
    } else {
      setShowPermissionModal(true);
    }
  };

  const handleGrantPermission = () => {
    setGalleryPermission('granted');
    setShowPermissionModal(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleDenyPermission = () => {
    setGalleryPermission('denied');
    setShowPermissionModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const updated = [...newPhotos];
        updated[permissionTargetIndex] = base64;
        setNewPhotos(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newBio.trim()) return;

    const companionServicesObj = selectedServices.map(sid => ({
      serviceId: sid
    }));

    const newCompanion: Companion = {
      id: `comp_${Date.now()}`,
      name: newName,
      age: newAge,
      gender: newGender,
      city: newCity,
      bio: newBio,
      interests: ['Conversation', 'Dining', 'Events'],
      photos: newPhotos,
      services: companionServicesObj,
      rating: 5.0,
      reviews: [],
      status: 'Approved', // Admin creations are instantly approved
      isVerified: true
    };

    onAddCompanion(newCompanion);
    
    // Reset Form
    setNewName('');
    setNewAge(23);
    setNewBio('');
    setSelectedServices(['srv_1', 'srv_3']);
    setActiveTab('companions');
  };

  const handleSendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;
    onSendAdminReply(adminReplyText.trim());
    setAdminReplyText('');
  };

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(sid => sid !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  return (
    <div id="admin-panel-container" className="p-4 space-y-5 pb-24 text-xs animate-fade-in">
      {/* Header and stats */}
      <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-4 space-y-3.5 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-[#E9D5FF]" />
            <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider font-display">Admin Control Desk</h2>
          </div>
          <span className="bg-[#6A0DAD]/30 text-[#E9D5FF] text-[10px] px-2 py-0.5 rounded-full border border-[#6A0DAD]/50">
            Regional Supervisor
          </span>
        </div>

        {/* Dashboard Mini-Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#0f071a]/65 border border-white/5 p-2.5 rounded-xl">
            <Users className="w-4 h-4 mx-auto text-[#E9D5FF] mb-1" />
            <span className="block font-black text-xs text-slate-100">{totalCompanions}</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-semibold font-mono">Total Accounts</span>
          </div>
          <div className="bg-[#0f071a]/65 border border-white/5 p-2.5 rounded-xl">
            <CheckCircle className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <span className="block font-black text-xs text-emerald-400">{approvedCompanions}</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-semibold font-mono">Approved</span>
          </div>
          <div className="bg-[#0f071a]/65 border border-white/5 p-2.5 rounded-xl">
            <XCircle className="w-4 h-4 mx-auto text-rose-400 mb-1" />
            <span className="block font-black text-xs text-rose-400">{pendingCompanions}</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-semibold font-mono">Pending</span>
          </div>
        </div>
      </div>

      {/* Admin Tab Switching */}
      <div className="flex flex-wrap bg-[#1a0b2e] p-1 rounded-xl border border-white/10 shadow-inner gap-1">
        <button
          onClick={() => setActiveTab('companions')}
          className={`flex-1 py-2 text-center rounded-lg font-bold transition-all cursor-pointer text-[10px] min-w-[80px] ${
            activeTab === 'companions' ? 'bg-[#6A0DAD] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Manage Companions
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 py-2 text-center rounded-lg font-bold transition-all cursor-pointer text-[10px] min-w-[80px] relative ${
            activeTab === 'bookings' ? 'bg-[#6A0DAD] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Payment Approvals
          {bookings.filter(b => b.status === 'Pending').length > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full border border-[#1a0b2e]">
              {bookings.filter(b => b.status === 'Pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 text-center rounded-lg font-bold transition-all cursor-pointer text-[10px] min-w-[80px] ${
            activeTab === 'add' ? 'bg-[#6A0DAD] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Add Companion
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`flex-1 py-2 text-center rounded-lg font-bold transition-all cursor-pointer text-[10px] min-w-[80px] relative ${
            activeTab === 'support' ? 'bg-[#6A0DAD] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Support Desk
          {supportMessages.filter(m => m.sender === 'user').length > 0 && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping" />
          )}
        </button>
      </div>

      {/* 1. MANAGE REGISTRATIONS TAB */}
      {activeTab === 'companions' && (
        <div className="space-y-3">
          <h3 className="font-semibold text-xs text-slate-200 px-1 font-display uppercase tracking-wider">Verification Registrations Directory</h3>
          
          <div className="space-y-3">
            {companions.map((comp) => (
              <div
                key={comp.id}
                className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-3.5 space-y-3.5 shadow-md hover:border-[#6A0DAD]/30 transition-colors"
              >
                {/* Identification Header */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    {/* Thumbnail slider */}
                    <div className="flex gap-1">
                      {comp.photos.map((p, i) => (
                        <img
                          key={i}
                          src={p}
                          alt="thumb"
                          className="w-10 h-10 rounded-lg object-cover border border-[#6A0DAD]/35"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-100 font-display">{comp.name}, {comp.age}</h4>
                      <span className="text-[10px] text-slate-400">{comp.city} • {comp.gender}</span>
                    </div>
                  </div>

                  {/* Current Status tag */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    comp.status === 'Approved'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900'
                      : comp.status === 'Pending'
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-900'
                      : 'bg-rose-950/60 text-rose-400 border border-rose-900'
                  }`}>
                    {comp.status}
                  </span>
                </div>

                {/* Brief bio and services */}
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 italic line-clamp-2">"{comp.bio}"</p>
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {comp.services.map((cs, i) => {
                      const details = SERVICES.find(s => s.id === cs.serviceId);
                      return details ? (
                        <span key={i} className="bg-[#0f071a] text-[#E9D5FF] border border-white/5 text-[8px] px-1.5 py-0.5 rounded font-mono">
                          {details.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex justify-between items-center border-t border-white/5 pt-2.5">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onApproveReject(comp.id, 'Approved')}
                      className={`font-semibold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                        comp.status === 'Approved'
                          ? 'bg-emerald-900/40 text-slate-400 cursor-not-allowed border border-transparent'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/60'
                      }`}
                      disabled={comp.status === 'Approved'}
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Verification
                    </button>
                    <button
                      onClick={() => onApproveReject(comp.id, 'Rejected')}
                      className={`font-semibold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                        comp.status === 'Rejected'
                          ? 'bg-rose-900/40 text-slate-400 cursor-not-allowed border border-transparent'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/60 hover:bg-rose-900/60'
                      }`}
                      disabled={comp.status === 'Rejected'}
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => onEditCompanion(comp)}
                      className="bg-indigo-950 text-indigo-400 border border-indigo-800/60 hover:bg-indigo-900/60 font-semibold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteCompanion(comp.id)}
                    className="bg-[#0f071a] hover:bg-rose-950/50 border border-white/5 hover:border-rose-900/45 text-slate-500 hover:text-rose-400 p-2 rounded-xl transition-all cursor-pointer"
                    title="Delete registration form"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PAYMENT APPROVALS / ESCROW BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-semibold text-xs text-slate-200 font-display uppercase tracking-wider">
              Escrow Booking Payments Approval Desk
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              SLA Goal: Under 30 Mins
            </span>
          </div>

          {/* Escrow specific mini cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1a0b2e] border border-white/5 p-3 rounded-2xl">
              <span className="text-slate-500 text-[9px] uppercase tracking-wider font-semibold block">Total Funds in Escrow</span>
              <span className="text-[#D4AF37] text-xs font-black font-mono">
                ₨ {bookings.reduce((sum, b) => b.status !== 'Completed' ? sum + b.totalPrice : sum, 0).toLocaleString()} PKR
              </span>
            </div>
            <div className="bg-[#1a0b2e] border border-white/5 p-3 rounded-2xl">
              <span className="text-slate-500 text-[9px] uppercase tracking-wider font-semibold block">Pending Approvals</span>
              <span className="text-rose-400 text-xs font-black font-mono">
                {bookings.filter(b => b.status === 'Pending').length} payments
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="bg-[#1a0b2e] border border-white/5 rounded-2xl p-6 text-center text-slate-500 text-xs">
                No bookings or payments processed on the platform yet.
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-4 space-y-3 shadow-md hover:border-[#6A0DAD]/30 transition-colors"
                >
                  {/* Top identification line */}
                  <div className="flex justify-between items-start border-b border-white/5 pb-2.5">
                    <div>
                      <span className="text-[8px] bg-[#6A0DAD]/20 text-[#E9D5FF] font-mono font-black px-1.5 py-0.5 rounded">
                        ID: {b.id.toUpperCase()}
                      </span>
                      <h4 className="text-xs font-bold text-slate-100 mt-1">
                        Client: <span className="text-[#E9D5FF]">{b.clientName}</span>
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-900'
                          : b.status === 'Pending'
                          ? 'bg-amber-950/70 text-amber-400 border border-amber-900'
                          : 'bg-indigo-950/70 text-indigo-400 border border-indigo-900'
                      }`}>
                        {b.status}
                      </span>
                      <span className="block text-[8px] text-slate-500 mt-1 font-mono">Created: {b.createdAt}</span>
                    </div>
                  </div>

                  {/* Companion & Service Detail */}
                  <div className="flex items-center gap-3 bg-[#0f071a] p-2.5 rounded-xl border border-white/5">
                    <img
                      src={b.companionPhoto}
                      alt={b.companionName}
                      className="w-10 h-10 rounded-lg object-cover border border-[#6A0DAD]/35"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono">Scheduled Companion</div>
                      <div className="font-bold text-xs text-slate-100">{b.companionName}</div>
                      <div className="text-[9px] text-[#E9D5FF]">{b.serviceName} ({b.durationHours} Hours)</div>
                    </div>
                  </div>

                  {/* Location & Time specs */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 font-mono">
                    <div className="bg-[#0f071a]/50 p-1.5 rounded border border-white/5">
                      <span className="text-slate-500 text-[8px] block uppercase">Meetup Date & Slot</span>
                      {b.bookingDate} • {b.timeSlot}
                    </div>
                    <div className="bg-[#0f071a]/50 p-1.5 rounded border border-white/5">
                      <span className="text-slate-500 text-[8px] block uppercase">Chosen Location</span>
                      <span className="line-clamp-1">{b.meetingLocation}</span>
                    </div>
                  </div>

                  {/* Payment Amount & Admin Controls */}
                  <div className="flex justify-between items-center border-t border-white/5 pt-3">
                    <div>
                      <span className="text-slate-500 text-[8px] block uppercase font-mono">Escrow Value</span>
                      <span className="text-[#D4AF37] font-black text-xs font-mono">₨ {b.totalPrice.toLocaleString()} PKR</span>
                    </div>

                    <div className="flex gap-1.5">
                      {b.status === 'Pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => onRejectBooking(b.id)}
                            className="bg-rose-950/45 hover:bg-rose-900/60 border border-rose-900/50 text-rose-400 text-[9px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-bold uppercase tracking-wider animate-pulse"
                          >
                            Reject &amp; Refund
                          </button>
                          <button
                            type="button"
                            onClick={() => onApproveBooking(b.id)}
                            className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 text-[9px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-bold uppercase tracking-wider"
                          >
                            Approve Payment
                          </button>
                        </>
                      )}

                      {b.status === 'Confirmed' && (
                        <>
                          <button
                            type="button"
                            onClick={() => onRejectBooking(b.id)}
                            className="bg-rose-950/45 hover:bg-rose-900/60 border border-rose-900/50 text-rose-400 text-[9px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-bold uppercase tracking-wider"
                          >
                            Force Refund
                          </button>
                          <button
                            type="button"
                            onClick={() => onCompleteBooking(b.id)}
                            className="bg-[#6A0DAD]/40 hover:bg-[#6A0DAD]/70 border border-[#6A0DAD] text-[#E9D5FF] text-[9px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-bold uppercase tracking-wider"
                          >
                            Release Escrow Funds
                          </button>
                        </>
                      )}

                      {b.status === 'Completed' && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Funds Released to Companion
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. ADD COMPANION TAB */}
      {activeTab === 'add' && (
        <form onSubmit={handleAddSubmit} className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="font-bold text-xs text-slate-100 border-b border-white/5 pb-2 flex items-center gap-1 font-display uppercase tracking-wider">
            <Plus className="w-4 h-4 text-[#E9D5FF]" /> Pre-Verify New Companion
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Companion Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Mahira Sheikh"
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age</label>
                <input
                  type="number"
                  required
                  min={18}
                  max={60}
                  value={newAge}
                  onChange={(e) => setNewAge(parseInt(e.target.value) || 23)}
                  className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">City Base</label>
                <select
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                >
                  {CITIES.tier1.map(c => <option key={c} value={c}>{c}</option>)}
                  {CITIES.tier2.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gallery (3 thumbnails)</label>
              <div className="grid grid-cols-3 gap-2">
                {newPhotos.map((ph, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-[#0f071a] border border-white/5">
                    <img src={ph} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => triggerFileUpload(idx)}
                      className="absolute inset-0 bg-black/55 flex items-center justify-center opacity-0 hover:opacity-100 text-[8px] text-white transition-opacity cursor-pointer font-bold"
                    >
                      Upload Photo
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Companion Bio</label>
              <textarea
                required
                rows={3}
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                placeholder="Polite introduction about hobbies, hobbies partner credentials..."
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Custom Services</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto bg-[#0f071a] p-2.5 rounded-xl border border-white/5">
                {SERVICES.map((s) => {
                  const isChecked = selectedServices.includes(s.id);
                  return (
                    <label key={s.id} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-[#1a0b2e]">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleService(s.id)}
                        className="accent-[#6A0DAD] rounded"
                      />
                      <span className="text-[10px] text-slate-300 font-display">{s.name} - ₨ {s.basePrice.toLocaleString()}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-bold rounded-xl py-3 text-xs transition-colors shadow-lg cursor-pointer"
            >
              Add and Pre-Verify Instantly
            </button>
          </div>
        </form>
      )}

      {/* 3. SUPPORT DESK TAB (CHAT WITH USER) */}
      {activeTab === 'support' && (
        <div className="space-y-4 bg-[#1a0b2e] border border-white/10 rounded-2xl p-4 shadow-xl">
          <h3 className="font-bold text-xs text-slate-100 flex items-center gap-1.5 border-b border-white/5 pb-2 font-display uppercase tracking-wider">
            <MessageSquare className="w-4.5 h-4.5 text-[#E9D5FF]" /> Platform User Support Desk
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto p-2 bg-[#0f071a] rounded-xl border border-[#6A0DAD]/30">
            {supportMessages.length === 0 ? (
              <p className="text-center text-[10px] text-slate-500 py-6">No support queries received yet.</p>
            ) : (
              supportMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg text-[11px] leading-relaxed max-w-[90%] shadow-sm ${
                    msg.sender === 'admin'
                      ? 'bg-[#6A0DAD]/10 text-[#E9D5FF] border border-[#6A0DAD]/30 ml-auto'
                      : 'bg-[#1a0b2e] text-slate-300 border border-white/5'
                  }`}
                >
                  <div className="font-bold text-[9px] text-slate-500 mb-0.5 font-mono">
                    {msg.sender === 'admin' ? 'You (Regional Admin)' : 'Client / User'}
                  </div>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className="block text-[8px] text-slate-500 text-right font-mono">{msg.timestamp}</span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendAdminMessage} className="flex gap-2">
            <input
              type="text"
              value={adminReplyText}
              onChange={(e) => setAdminReplyText(e.target.value)}
              placeholder="Type your official reply here..."
              className="flex-1 bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
            />
            <button
              type="submit"
              className="bg-[#6A0DAD] hover:brightness-110 text-white font-bold px-3.5 rounded-xl transition-colors shrink-0 cursor-pointer shadow-md"
            >
              Send Reply
            </button>
          </form>
          <p className="text-[9px] text-slate-500 italic">Replies appear instantly on the user's Support screen.</p>
        </div>
      )}

      {/* Hidden native input for file selector */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* OS-styled Permission Prompt Dialogue */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl max-w-xs w-full overflow-hidden shadow-2xl animate-scale-in text-center text-xs">
            {/* Permission Icon Header */}
            <div className="p-5 pb-3">
              <div className="w-12 h-12 bg-[#6A0DAD]/20 border border-[#6A0DAD]/40 rounded-full flex items-center justify-center mx-auto text-[#E9D5FF] mb-3">
                <ImageIcon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-xs font-black text-slate-100 font-display">
                Allow Gallery &amp; File Access?
              </h3>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Girlfriend Hire Pakistan requires your permission to access local device photos, camera roll, and files. This allows the registration service provider or regional supervisor to select and upload your official verification pictures.
              </p>
            </div>

            {/* Permission Actions Choice */}
            <div className="grid grid-cols-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleDenyPermission}
                className="py-3 text-[10px] font-bold text-rose-400 hover:bg-white/5 border-r border-white/10 transition-colors cursor-pointer"
              >
                Don't Allow
              </button>
              <button
                type="button"
                onClick={handleGrantPermission}
                className="py-3 text-[10px] font-black text-[#E9D5FF] hover:bg-white/5 transition-colors cursor-pointer"
              >
                Allow Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
