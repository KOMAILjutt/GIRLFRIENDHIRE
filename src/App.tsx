import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  MessageSquare, 
  HelpCircle, 
  LogOut, 
  UserCheck, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Wallet,
  ArrowLeft,
  Search
} from 'lucide-react';
import { Companion, ServiceItem, Booking, UserProfile, SupportMessage } from './types';
import { supabase } from './supabaseClient';
import { SEED_COMPANIONS, SERVICES } from './data';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import WalletScreen from './components/WalletScreen';
import SupportScreen from './components/SupportScreen';
import BookingModal from './components/BookingModal';
import ProfilePage from './components/ProfilePage';
import BrowsePage from './components/BrowsePage';
import AuthScreens from './components/AuthScreens';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Global States
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(15000); // 15,000 PKR seeded starting balance
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  
  // Navigation & Modal states
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [activeBookingService, setActiveBookingService] = useState<ServiceItem | null>(null);

  // Navigation History Stack (Back up page)
  const [navHistory, setNavHistory] = useState<{ tab: string; companion: Companion | null }[]>([
    { tab: 'home', companion: null }
  ]);

  const navigateTo = (tab: string, companion: Companion | null = null) => {
    setActiveTab(tab);
    setSelectedCompanion(companion);
    setNavHistory(prev => {
      const last = prev[prev.length - 1];
      if (last && last.tab === tab && last.companion?.id === companion?.id) {
        return prev;
      }
      return [...prev, { tab, companion }];
    });
  };

  const handleGoBack = () => {
    if (navHistory.length <= 1) {
      if (activeTab !== 'home') {
        setActiveTab('home');
        setSelectedCompanion(null);
        setNavHistory([{ tab: 'home', companion: null }]);
      }
      return;
    }
    const nextHistory = [...navHistory];
    nextHistory.pop(); // Pop current state
    const prevState = nextHistory[nextHistory.length - 1];
    setNavHistory(nextHistory);
    setActiveTab(prevState.tab);
    setSelectedCompanion(prevState.companion);
  };
  
  // Local time UTC indicator
  const [utcTime, setUtcTime] = useState<string>('02:24:38');

  // Load state from localStorage on init
  useEffect(() => {
    // 1. Companions
    const storedComps = localStorage.getItem('ch_companions_v1');
    if (storedComps) {
      setCompanions(JSON.parse(storedComps));
    } else {
      setCompanions(SEED_COMPANIONS);
      localStorage.setItem('ch_companions_v1', JSON.stringify(SEED_COMPANIONS));
    }

    // 2. Current User (protected via Supabase Session)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCurrentUser(null);
        localStorage.removeItem('ch_user_v1');
      } else {
        const storedUser = localStorage.getItem('ch_user_v1');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        } else {
          const user = session.user;
          const profile: UserProfile = {
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Client',
            email: user.email || '',
            phone: user.user_metadata?.phone || '+92 321 4567890',
            role: 'Client',
            city: 'Lahore',
            gender: 'Male',
            age: 26,
            profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
          };
          setCurrentUser(profile);
          localStorage.setItem('ch_user_v1', JSON.stringify(profile));
        }
      }
    };
    checkSession();

    // 3. Wallet Balance
    const storedBalance = localStorage.getItem('ch_balance_v1');
    if (storedBalance) {
      setWalletBalance(parseFloat(storedBalance));
    } else {
      localStorage.setItem('ch_balance_v1', '15000');
    }

    // 4. Bookings
    const storedBookings = localStorage.getItem('ch_bookings_v1');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }

    // 5. Support Messages
    const storedMsgs = localStorage.getItem('ch_messages_v1');
    if (storedMsgs) {
      setSupportMessages(JSON.parse(storedMsgs));
    } else {
      const initialMsgs: SupportMessage[] = [
        {
          id: 'welcome_msg',
          sender: 'admin',
          text: "As-salamu alaykum! Welcome to Girlfriend Hire Pakistan support desk. We are active online to answer questions regarding companion approvals, EasyPaisa secure wallet transactions, or regional cancel policies. How can we help you today?",
          timestamp: 'Just now'
        }
      ];
      setSupportMessages(initialMsgs);
      localStorage.setItem('ch_messages_v1', JSON.stringify(initialMsgs));
    }

    // Sync auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setCurrentUser(null);
        localStorage.removeItem('ch_user_v1');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync helpers with localStorage
  const updateCompanions = (updated: Companion[]) => {
    setCompanions(updated);
    localStorage.setItem('ch_companions_v1', JSON.stringify(updated));
  };

  const updateCurrentUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('ch_user_v1', JSON.stringify(user));
    } else {
      localStorage.removeItem('ch_user_v1');
    }
  };

  const updateWalletBalance = (newBalance: number) => {
    setWalletBalance(newBalance);
    localStorage.setItem('ch_balance_v1', newBalance.toString());
  };

  const updateBookings = (updated: Booking[]) => {
    setBookings(updated);
    localStorage.setItem('ch_bookings_v1', JSON.stringify(updated));
  };

  const updateSupportMessages = (updated: SupportMessage[]) => {
    setSupportMessages(updated);
    localStorage.setItem('ch_messages_v1', JSON.stringify(updated));
  };

  // Auth Screen Callbacks
  const handleAuthSuccess = (profile: UserProfile) => {
    updateCurrentUser(profile);
    setActiveTab('home');
  };

  const handleRegisterCompanionSubmit = (companionObj: any) => {
    // Add pending companion to our pool
    const updated = [companionObj, ...companions];
    updateCompanions(updated);
  };

  // Support Chat Callbacks
  const handleSendMessage = (text: string, sender: 'user' | 'admin') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: SupportMessage = {
      id: `msg_${Date.now()}`,
      sender,
      text,
      timestamp: time
    };
    const updated = [...supportMessages, newMessage];
    updateSupportMessages(updated);
  };

  // Wallet Top Up handler
  const handleWalletTopUp = (amount: number, trxId: string) => {
    // Credit Balance
    const newBal = walletBalance + amount;
    updateWalletBalance(newBal);

    // Save transaction
    const newTx = {
      id: `tx_${Date.now()}`,
      type: 'deposit' as const,
      amount,
      description: `EasyPaisa Top-Up (TRX: ${trxId})`,
      date: new Date().toLocaleDateString(),
      status: 'Completed' as const
    };
    
    // Push transaction to list
    const storedTxs = localStorage.getItem('ch_txs_v1');
    const txsList = storedTxs ? JSON.parse(storedTxs) : [];
    const updatedTxs = [newTx, ...txsList];
    localStorage.setItem('ch_txs_v1', JSON.stringify(updatedTxs));
  };

  // Admin Callbacks
  const handleApproveRejectCompanion = (id: string, newStatus: 'Approved' | 'Pending' | 'Rejected') => {
    const updated = companions.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          status: newStatus,
          isVerified: newStatus === 'Approved' ? true : c.isVerified 
        };
      }
      return c;
    });
    updateCompanions(updated);
  };

  const handleDeleteCompanion = (id: string) => {
    const updated = companions.filter(c => c.id !== id);
    updateCompanions(updated);
  };

  const handleAddCompanionByAdmin = (newComp: Companion) => {
    const updated = [newComp, ...companions];
    updateCompanions(updated);
  };

  const handleApproveBooking = (bookingId: string) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'Confirmed' as const } : b);
    updateBookings(updated);
  };

  const handleRejectBooking = (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    // Refund client wallet balance
    const updatedBalance = walletBalance + target.totalPrice;
    updateWalletBalance(updatedBalance);

    // Filter out booking from active scheduled meetups
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    updateBookings(updatedBookings);

    // Save refund transaction log
    const newTx = {
      id: `tx_${Date.now()}`,
      type: 'refund' as const,
      amount: target.totalPrice,
      description: `Admin Refund: Escrow booking rejected for ${target.companionName}`,
      date: new Date().toLocaleDateString(),
      status: 'Completed' as const
    };
    const storedTxs = localStorage.getItem('ch_txs_v1');
    const txsList = storedTxs ? JSON.parse(storedTxs) : [];
    localStorage.setItem('ch_txs_v1', JSON.stringify([newTx, ...txsList]));
  };

  const handleCompleteBooking = (bookingId: string) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'Completed' as const } : b);
    updateBookings(updated);
  };

  // Booking process confirmation
  const handleConfirmBooking = (bookingData: {
    serviceId: string;
    serviceName: string;
    durationHours: number;
    totalPrice: number;
    meetingLocation: string;
    bookingDate: string;
    timeSlot: any;
  }) => {
    if (!selectedCompanion || !currentUser) return;

    // Deduct wallet balance
    const updatedBalance = walletBalance - bookingData.totalPrice;
    updateWalletBalance(updatedBalance);

    // Create active booking
    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      clientId: currentUser.id,
      clientName: currentUser.name,
      companionId: selectedCompanion.id,
      companionName: selectedCompanion.name,
      companionPhoto: selectedCompanion.photos[0],
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      durationHours: bookingData.durationHours,
      totalPrice: bookingData.totalPrice,
      meetingLocation: bookingData.meetingLocation,
      bookingDate: bookingData.bookingDate,
      timeSlot: bookingData.timeSlot,
      status: 'Pending', // Pending admin verify
      createdAt: new Date().toLocaleDateString()
    };

    const updatedBookings = [newBooking, ...bookings];
    updateBookings(updatedBookings);

    // Save transaction
    const newTx = {
      id: `tx_${Date.now()}`,
      type: 'payment' as const,
      amount: bookingData.totalPrice,
      description: `Escrow payment: ${selectedCompanion.name} (${bookingData.serviceName})`,
      date: new Date().toLocaleDateString(),
      status: 'Completed' as const
    };
    
    const storedTxs = localStorage.getItem('ch_txs_v1');
    const txsList = storedTxs ? JSON.parse(storedTxs) : [];
    const updatedTxs = [newTx, ...txsList];
    localStorage.setItem('ch_txs_v1', JSON.stringify(updatedTxs));

    // Clear Modal
    setActiveBookingService(null);
    setSelectedCompanion(null);
    
    // Jump to Profile screen to view their active bookings
    navigateTo('profile', null);

    // Simulated auto-confirm after 8 seconds (to mimic our 30-minute admin SLA prompt)
    setTimeout(() => {
      setBookings(prev => {
        const isStillThere = prev.find(b => b.id === newBooking.id);
        if (isStillThere && isStillThere.status === 'Pending') {
          const updated = prev.map(b => b.id === newBooking.id ? { ...b, status: 'Confirmed' as const } : b);
          localStorage.setItem('ch_bookings_v1', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }, 8000);
  };

  const handleCancelBooking = (bookingId: string, refundAmount: number) => {
    // Refund money
    const newBal = walletBalance + refundAmount;
    updateWalletBalance(newBal);

    // Remove or cancel booking
    const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'Completed' as any } : b); // complete or delete
    const filteredBookings = bookings.filter(b => b.id !== bookingId);
    updateBookings(filteredBookings);

    // Transaction log
    const newTx = {
      id: `tx_${Date.now()}`,
      type: 'refund' as const,
      amount: refundAmount,
      description: `Refund: Escrow release for cancelled booking`,
      date: new Date().toLocaleDateString(),
      status: 'Completed' as const
    };
    const storedTxs = localStorage.getItem('ch_txs_v1');
    const txsList = storedTxs ? JSON.parse(storedTxs) : [];
    localStorage.setItem('ch_txs_v1', JSON.stringify([newTx, ...txsList]));
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    updateCurrentUser(null);
    setActiveBookingService(null);
    navigateTo('home', null);
    setNavHistory([{ tab: 'home', companion: null }]);
  };

  // Retrieve transactions helper
  const getTransactionsList = () => {
    const storedTxs = localStorage.getItem('ch_txs_v1');
    return storedTxs ? JSON.parse(storedTxs) : [];
  };

  return (
    <div className="min-h-screen bg-[#0f071a] text-slate-100 font-sans flex flex-col selection:bg-[#6A0DAD] selection:text-white">
      
      {/* 1. STICKY BRAND HEADER */}
      <header className="sticky top-0 z-30 bg-[#1a0b2e]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-[0_0_15px_rgba(106,13,173,0.15)]">
        <button 
          onClick={() => {
            navigateTo('home', null);
          }}
          className="flex items-center gap-2 text-left focus:outline-none cursor-pointer"
        >
          <div className="p-2 bg-gradient-to-br from-[#6A0DAD] to-[#140822] border border-[#6A0DAD]/30 rounded-xl shadow-[0_0_10px_rgba(106,13,173,0.35)]">
            <Sparkles className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-tight text-white flex items-center gap-1 uppercase font-display">
              Girlfriend Hire <span className="text-[8px] bg-[#140822] text-[#E9D5FF] font-bold px-1.5 py-0.5 rounded border border-[#6A0DAD]/30">PK</span>
            </h1>
            <span className="text-[9px] text-slate-400 block tracking-wide">Premium Marketplace</span>
          </div>
        </button>

        <div className="flex items-center gap-2.5">
          {/* UTC Clock for security monitor */}
          <span className="hidden sm:inline-flex items-center gap-1 bg-[#140822] px-2.5 py-1 rounded-lg border border-white/5 text-[10px] text-[#E9D5FF]/60 font-mono">
            <Clock className="w-3 h-3 text-[#D4AF37]" /> UTC {utcTime}
          </span>

          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Wallet Quick Balance badge */}
              <button 
                onClick={() => navigateTo('wallet', null)}
                className="bg-[#1a0b2e] hover:bg-[#6A0DAD]/20 border border-[#6A0DAD]/45 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-[#E9D5FF] flex items-center gap-1 transition-all shadow-[0_0_10px_rgba(106,13,173,0.15)] cursor-pointer"
              >
                <Wallet className="w-3 h-3 text-[#D4AF37]" /> ₨ {walletBalance.toLocaleString()}
              </button>

              {/* User Avatar clip */}
              <div 
                onClick={() => navigateTo('profile', null)}
                className="w-8.5 h-8.5 rounded-full overflow-hidden border border-[#6A0DAD] cursor-pointer hover:scale-105 transition-transform"
                title="View My Profile"
              >
                <img 
                  src={currentUser.profilePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigateTo('home', null)}
              className="bg-[#6A0DAD] hover:bg-[#6A0DAD]/90 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all shadow-[0_0_10px_rgba(106,13,173,0.4)] cursor-pointer"
            >
              Get Started
            </button>
          )}
        </div>
      </header>

      {/* 2. AUTH FLOW CONTAINER (IF NOT LOGGED IN) */}
      {!currentUser ? (
        <AuthScreens 
          onAuthSuccess={handleAuthSuccess}
          onRegisterCompanionSubmit={handleRegisterCompanionSubmit}
        />
      ) : (
        /* 3. APP VIEWPORT WITH NAVIGATION (WHEN LOGGED IN) */
        <main className="flex-1 w-full max-w-md mx-auto bg-[#0f071a] relative min-h-[85vh]">
          
          {/* Active Admin / Demo Simulator Alert Bar */}
          <div className="bg-[#1a0b2e] border-b border-white/10 px-4 py-2 flex items-center justify-between text-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
            <span className="text-[#E9D5FF] font-medium flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> 
              {currentUser.role === 'Admin' ? 'Supervisor Mode' : `Client: ${currentUser.name}`}
            </span>
            <div className="flex gap-1.5">
              {currentUser.role === 'Admin' ? (
                <button
                  onClick={() => updateCurrentUser({ ...currentUser, role: 'Client' })}
                  className="text-[#E9D5FF]/70 hover:text-white font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  [Switch to Client View]
                </button>
              ) : (
                <button
                  onClick={() => updateCurrentUser({ ...currentUser, role: 'Admin' })}
                  className="text-[#E9D5FF] hover:text-white font-bold uppercase tracking-wider bg-[#6A0DAD]/35 px-2 py-0.5 rounded border border-[#6A0DAD]/60 shadow-[0_0_10px_rgba(106,13,173,0.25)] cursor-pointer transition-all"
                >
                  [Demo Admin Panel]
                </button>
              )}
            </div>
          </div>

          {/* Back up page History Bar */}
          {currentUser.role !== 'Admin' && (activeTab !== 'home' || navHistory.length > 1) && (
            <div className="px-4 py-2.5 bg-[#1a0b2e]/55 border-b border-white/5 flex items-center justify-between animate-fade-in">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 text-[10px] font-bold text-[#E9D5FF] hover:text-white bg-[#6A0DAD]/15 hover:bg-[#6A0DAD]/30 border border-[#6A0DAD]/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Go Back to Previous Page
              </button>
              <span className="text-[9px] text-slate-500 font-mono">
                History: {navHistory.length - 1} page{navHistory.length - 1 > 1 ? 's' : ''} back
              </span>
            </div>
          )}

          {/* VIEW ROUTING SKELETON */}
          
          {/* A. ADMIN PANEL VIEW */}
          {currentUser.role === 'Admin' ? (
            <AdminPanel
              companions={companions}
              onApproveReject={handleApproveRejectCompanion}
              onDeleteCompanion={handleDeleteCompanion}
              onAddCompanion={handleAddCompanionByAdmin}
              supportMessages={supportMessages}
              onSendAdminReply={(text) => handleSendMessage(text, 'admin')}
              bookings={bookings}
              onApproveBooking={handleApproveBooking}
              onRejectBooking={handleRejectBooking}
              onCompleteBooking={handleCompleteBooking}
            />
          ) : (
            /* B. STANDARD CLIENT / COMPANION VIEWS */
            <>
              {/* Profile Details Page Override */}
              {selectedCompanion ? (
                <ProfilePage
                  companion={selectedCompanion}
                  onBack={handleGoBack}
                  onBook={(service) => setActiveBookingService(service)}
                />
              ) : (
                <>
                  {/* TAB 1: HOME */}
                  {activeTab === 'home' && (
                    <div className="space-y-6 p-4 pb-24 animate-fade-in">
                      {/* Premium Hero block */}
                      <div className="bg-gradient-to-br from-[#1a0b2e] via-[#6A0DAD]/50 to-[#0f071a] text-white rounded-3xl p-6 shadow-[0_0_20px_rgba(106,13,173,0.15)] border border-[#6A0DAD]/35 space-y-4 relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 w-36 h-36 bg-[#6A0DAD]/10 rounded-full blur-2xl" />
                        <span className="bg-[#140822]/85 border border-[#6A0DAD]/40 text-[#E9D5FF] font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-inner">
                          Verified Pakistani Marketplace
                        </span>
                        <h2 className="text-xl font-black leading-tight tracking-tight font-display">
                          Your Perfect Companion – <span className="text-[#E9D5FF]">Book by the Hour</span> or Full Day
                        </h2>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Hire local verified companions for dinners, event guides, shopping helper, or private companion dates. Fully secure, highly private, and personalized.
                        </p>
                      </div>

                      {/* QUICK NAVIGATION CARDS */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setActiveTab('browse')}
                          className="bg-gradient-to-br from-[#1a0b2e] to-[#6A0DAD]/30 border-2 border-[#6A0DAD]/45 rounded-2xl p-4 text-left transition-all duration-300 hover:border-[#6A0DAD] hover:bg-[#6A0DAD]/20 active:scale-95 cursor-pointer flex flex-col justify-between h-36 group shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
                        >
                          <div className="p-2.5 bg-[#0f071a] border border-[#6A0DAD]/35 text-[#E9D5FF] rounded-xl w-fit group-hover:bg-[#6A0DAD]/45 transition-colors">
                            <Search className="w-5 h-5 text-purple-300" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xs text-slate-100 group-hover:text-white font-display">Hire a Companion</h3>
                            <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">Browse, filter, and book regional verified profiles</p>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveTab('become_companion')}
                          className="bg-gradient-to-br from-[#1a0b2e] to-[#6A0DAD]/30 border-2 border-[#6A0DAD]/45 rounded-2xl p-4 text-left transition-all duration-300 hover:border-[#6A0DAD] hover:bg-[#6A0DAD]/20 active:scale-95 cursor-pointer flex flex-col justify-between h-36 group shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
                        >
                          <div className="p-2.5 bg-[#0f071a] border border-[#6A0DAD]/35 text-[#E9D5FF] rounded-xl w-fit group-hover:bg-[#6A0DAD]/45 transition-colors">
                            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xs text-slate-100 group-hover:text-white font-display">Become a Companion</h3>
                            <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">Create your profile and earn up to ₨ 15,000/day</p>
                          </div>
                        </button>
                      </div>

                      {/* Trust badges */}
                      <div className="grid grid-cols-3 gap-2.5 text-center">
                        <div className="bg-[#1a0b2e] border border-white/5 p-3.5 rounded-2xl space-y-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:border-[#6A0DAD]/35 transition-colors">
                          <ShieldCheck className="w-5.5 h-5.5 text-[#E9D5FF] mx-auto" />
                          <h4 className="font-bold text-[10px] text-slate-100 font-display">Admin Verified</h4>
                          <p className="text-[9px] text-slate-500">Every companion CNIC verified</p>
                        </div>
                        <div className="bg-[#1a0b2e] border border-white/5 p-3.5 rounded-2xl space-y-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:border-[#6A0DAD]/35 transition-colors">
                          <Lock className="w-5.5 h-5.5 text-[#E9D5FF] mx-auto" />
                          <h4 className="font-bold text-[10px] text-slate-100 font-display">EasyPaisa Secure</h4>
                          <p className="text-[9px] text-slate-500">Safe, held-in escrow balance</p>
                        </div>
                        <div className="bg-[#1a0b2e] border border-white/5 p-3.5 rounded-2xl space-y-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:border-[#6A0DAD]/35 transition-colors">
                          <MessageSquare className="w-5.5 h-5.5 text-[#E9D5FF] mx-auto" />
                          <h4 className="font-bold text-[10px] text-slate-100 font-display">24/7 Support</h4>
                          <p className="text-[9px] text-slate-500">Active chat with support agents</p>
                        </div>
                      </div>

                      {/* How It Works */}
                      <div className="bg-[#1a0b2e] border border-white/5 rounded-2xl p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                        <h3 className="font-black text-xs text-slate-100 uppercase tracking-wider border-b border-white/10 pb-2 font-display">
                          How Girlfriend Hire Works
                        </h3>
                        <div className="space-y-3">
                          {/* Step 1 */}
                          <div className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#6A0DAD] text-white font-bold border border-[#E9D5FF]/20 text-[11px] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(106,13,173,0.3)]">
                              1
                            </span>
                            <div>
                              <h4 className="font-bold text-xs text-slate-200">Choose Companion</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                Browse regional approved locals by cities and category-wise services. View full portfolios and rating stars.
                              </p>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#6A0DAD] text-white font-bold border border-[#E9D5FF]/20 text-[11px] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(106,13,173,0.3)]">
                              2
                            </span>
                            <div>
                              <h4 className="font-bold text-xs text-slate-200">Pay via EasyPaisa</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                Submit bookings with dynamic pricing calculations. Escrow payment holds funds securely until your meetup completes.
                              </p>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#6A0DAD] text-white font-bold border border-[#E9D5FF]/20 text-[11px] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(106,13,173,0.3)]">
                              3
                            </span>
                            <div>
                              <h4 className="font-bold text-xs text-slate-200">Meet at Chosen Location</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                Meet your companion safely at your chosen locations (cafes, malls, dinner locations, or other agreed private spots) for premium customized support.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: BECOME COMPANION */}
                  {activeTab === 'become_companion' && (
                    <div className="p-4 space-y-4 pb-24 animate-fade-in">
                      <button
                        onClick={() => setActiveTab('home')}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-[#E9D5FF] hover:text-white bg-[#6A0DAD]/15 hover:bg-[#6A0DAD]/30 border border-[#6A0DAD]/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 mb-4"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                      </button>
                      
                      <div className="bg-[#1a0b2e] border border-white/5 rounded-2xl p-1 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                        <AuthScreens 
                          onAuthSuccess={(profile) => {
                            updateCurrentUser(profile);
                            setActiveTab('home');
                          }}
                          onRegisterCompanionSubmit={(companionObj) => {
                            handleRegisterCompanionSubmit(companionObj);
                          }}
                          initialScreen="companion_reg"
                          currentUser={currentUser}
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: BROWSE COMPANIONS */}
                  {activeTab === 'browse' && (
                    <BrowsePage
                      companions={companions}
                      onSelectCompanion={(comp) => navigateTo('browse', comp)}
                    />
                  )}

                  {/* TAB 3: WALLET */}
                  {activeTab === 'wallet' && (
                    <WalletScreen
                      balance={walletBalance}
                      transactions={getTransactionsList()}
                      onTopUp={handleWalletTopUp}
                    />
                  )}

                  {/* TAB 4: SUPPORT */}
                  {activeTab === 'support' && (
                    <SupportScreen
                      messages={supportMessages}
                      onSendMessage={(text) => handleSendMessage(text, 'user')}
                    />
                  )}

                  {/* TAB 5: USER PROFILE */}
                  {activeTab === 'profile' && (
                    <div className="p-4 space-y-6 pb-24 animate-fade-in">
                       {/* User details header card */}
                      <div className="bg-gradient-to-r from-[#1a0b2e] to-[#140822] border border-white/10 rounded-2xl p-5 flex items-center gap-4 relative shadow-lg">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#6A0DAD] shrink-0">
                          <img 
                            src={currentUser.profilePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'} 
                            alt={currentUser.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="text-[8px] bg-[#6A0DAD]/30 text-[#E9D5FF] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#6A0DAD]/50">
                            Verified Client
                          </span>
                          <h3 className="font-bold text-sm text-slate-100 mt-1 font-display">{currentUser.name}</h3>
                          <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                          <span className="text-[10px] text-[#D4AF37] block mt-0.5">{currentUser.city || 'Pakistan'}</span>
                        </div>
                      </div>

                      {/* Become a companion callout on profile */}
                      <div className="bg-gradient-to-br from-[#1a0b2e] to-[#6A0DAD]/20 border border-[#6A0DAD]/35 rounded-2xl p-4 flex items-center justify-between shadow-md">
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-slate-100">Want to earn as a Companion?</h4>
                          <p className="text-[10px] text-slate-400">Join Pakistan's elite local provider network and receive premium bookings.</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('become_companion')}
                          className="bg-[#6A0DAD] hover:bg-[#6A0DAD]/90 text-white font-bold text-[10px] px-3.5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
                        >
                          Become a Companion
                        </button>
                      </div>

                      {/* Active Scheduled Bookings */}
                      <div className="space-y-3.5">
                        <h3 className="font-bold text-xs text-slate-100 px-1 uppercase tracking-wider font-display">Scheduled Escrow Bookings</h3>
                        {bookings.length === 0 ? (
                          <div className="bg-[#1a0b2e]/65 border border-white/5 rounded-2xl p-6 text-center text-xs text-slate-500">
                            No scheduled bookings found. Navigate to the companion browse page to secure your first meeting!
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {bookings.map((b) => (
                              <div
                                key={b.id}
                                className="bg-[#1a0b2e] border border-[#6A0DAD]/20 rounded-2xl p-4 space-y-3 shadow-md"
                              >
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2.5">
                                    <img 
                                      src={b.companionPhoto} 
                                      alt={b.companionName} 
                                      className="w-9 h-9 rounded-xl object-cover border border-[#6A0DAD]/35"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div>
                                      <h4 className="font-bold text-xs text-slate-100">{b.companionName}</h4>
                                      <span className="text-[10px] text-slate-400">{b.serviceName}</span>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                      b.status === 'Confirmed'
                                        ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-900'
                                        : 'bg-amber-950/70 text-amber-400 border border-amber-900 animate-pulse'
                                    }`}>
                                      {b.status}
                                    </span>
                                    <span className="block text-[8px] text-[#D4AF37] mt-1 font-mono">Escrow active</span>
                                  </div>
                                </div>

                                {/* Booking Detail table */}
                                <div className="grid grid-cols-2 gap-2 bg-[#140822] p-2.5 rounded-xl text-[10px] border border-white/5">
                                  <div className="flex items-center gap-1.5 text-slate-400">
                                    <Calendar className="w-3.5 h-3.5 text-[#E9D5FF]" />
                                    <span>{b.bookingDate}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock className="w-3.5 h-3.5 text-[#E9D5FF]" />
                                    <span>{b.timeSlot}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-slate-400 col-span-2">
                                    <MapPin className="w-3.5 h-3.5 text-[#E9D5FF]" />
                                    <span className="line-clamp-1">{b.meetingLocation}</span>
                                  </div>
                                </div>

                                {/* Pricing and Actions */}
                                <div className="flex justify-between items-center border-t border-white/5 pt-2.5">
                                  <div className="text-[10px] text-slate-400">
                                    Price paid:{' '}
                                    <span className="font-bold text-slate-100">₨ {b.totalPrice.toLocaleString()} PKR</span>
                                  </div>

                                  <button
                                    onClick={() => handleCancelBooking(b.id, b.totalPrice)}
                                    className="bg-[#140822] hover:bg-rose-950/40 text-rose-400 text-[10px] px-3 py-1.5 rounded-lg border border-rose-900/40 transition-colors cursor-pointer"
                                  >
                                    Cancel Booking
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Logging out details */}
                      <div className="pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full bg-[#1a0b2e] hover:bg-[#6A0DAD]/20 text-slate-300 font-bold rounded-xl py-3 text-xs border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <LogOut className="w-4 h-4 text-purple-400" /> Logout Securely
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Persistent Bot Nav */}
          {currentUser.role !== 'Admin' && (
            <BottomNav
              activeTab={activeTab}
              onTabChange={(tab) => {
                navigateTo(tab, null);
              }}
              walletBalance={walletBalance}
              unreadSupportCount={1}
            />
          )}

        </main>
      )}

      {/* 4. PLATONIC SAFETY FOOTER */}
      <Footer />

      {/* 5. BOOKING ENGINE LIGHTBOX MODAL */}
      {selectedCompanion && activeBookingService && currentUser && (
        <BookingModal
          companion={selectedCompanion}
          service={activeBookingService}
          walletBalance={walletBalance}
          onClose={() => setActiveBookingService(null)}
          onConfirmBooking={handleConfirmBooking}
          onNavigateToWallet={() => {
            setActiveBookingService(null);
            setSelectedCompanion(null);
            setActiveTab('wallet');
          }}
        />
      )}

    </div>
  );
}
