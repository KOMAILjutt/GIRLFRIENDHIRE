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
import { resolveSignedUrls } from './lib/storage';
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
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  
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

  // Load state from Supabase on init and auth change
  useEffect(() => {
    // 1. Fetch companions from Supabase (Seeded automatically if empty)
    const fetchCompanions = async () => {
      try {
        const { data, error } = await supabase
          .from('companions')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          // 1. Collect all raw paths
          const allPaths = data.flatMap(item => item.photos || []);
          // 2. Resolve URLs
          const signedUrlsMap = await resolveSignedUrls(allPaths);
          
          const mapped: Companion[] = data.map(item => ({
            id: item.id,
            name: item.name,
            age: item.age,
            gender: item.gender,
            city: item.city,
            bio: item.bio,
            interests: item.interests || [],
            rawPhotos: item.photos || [],
            photos: (item.photos || []).map(path => signedUrlsMap[path] || path),
            services: item.services || [],
            rating: Number(item.rating || 5.0),
            reviews: item.reviews || [],
            status: item.status || 'Approved',
            isVerified: item.is_verified || false
          }));
          setCompanions(mapped);
        } else {
          // Empty companions table in Supabase: Seed it immediately with defaults so the app works beautifully
          setCompanions(SEED_COMPANIONS);
          const seedRows = SEED_COMPANIONS.map(c => ({
            id: c.id,
            name: c.name,
            age: c.age,
            gender: c.gender,
            city: c.city,
            bio: c.bio,
            interests: c.interests,
            photos: c.photos,
            services: c.services,
            rating: c.rating,
            reviews: c.reviews,
            status: c.status,
            is_verified: c.isVerified
          }));
          await supabase.from('companions').insert(seedRows);
        }
      } catch (err) {
        console.error('Error fetching companions:', err);
      }
    };
    fetchCompanions();

    // 2. Current User (protected via Supabase Session) and dependencies
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCurrentUser(null);
        setWalletBalance(0);
      } else {
        const user = session.user;
        
        // Check for Regional Admin Special Account
        if (user.email?.toLowerCase() === 'komailjutt008@gmail.com') {
          const adminProfile: UserProfile = {
            id: user.id,
            name: 'Regional Admin',
            email: 'komailjutt008@gmail.com',
            role: 'Admin',
            profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
          };
          setCurrentUser(adminProfile);
          return;
        }

        // Fetch from user_profiles table in Supabase
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          const mappedProfile: UserProfile = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            role: profile.role,
            gender: profile.gender,
            age: profile.age,
            city: profile.city,
            profilePhoto: profile.profile_photo,
            bio: profile.bio,
            interests: profile.interests,
            photos: profile.photos,
            services: profile.services,
            isApprovedCompanion: profile.is_approved_companion
          };
          setCurrentUser(mappedProfile);
          setWalletBalance(Number(profile.wallet_balance ?? 0));
        } else {
          // Create user profile if none exists in database
          const newProfile = {
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Client',
            email: user.email || '',
            phone: user.user_metadata?.phone || '+92 321 4567890',
            role: 'Client',
            city: 'Lahore',
            gender: 'Male',
            age: 26,
            profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
            wallet_balance: 0
          };

          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert(newProfile);

          if (!insertError) {
            const mappedProfile: UserProfile = {
              id: newProfile.id,
              name: newProfile.name,
              email: newProfile.email,
              phone: newProfile.phone,
              role: newProfile.role as any,
              city: newProfile.city,
              gender: newProfile.gender as any,
              age: newProfile.age,
              profilePhoto: newProfile.profile_photo,
              isApprovedCompanion: false
            };
            setCurrentUser(mappedProfile);
            setWalletBalance(0);
          }
        }
      }
    };
    checkSession();

    // Sync auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setCurrentUser(null);
      } else {
        checkSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch authenticated user dependencies whenever currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setBookings([]);
      setSupportMessages([]);
      setTransactions([]);
      return;
    }

    const fetchUserDependencies = async () => {
      // 1. Bookings
      let bkQuery = supabase.from('bookings').select('*');
      if (currentUser.role !== 'Admin') {
        bkQuery = bkQuery.eq('client_id', currentUser.id);
      }
      const { data: bkData } = await bkQuery.order('created_at', { ascending: false });
      if (bkData) {
        const mappedBk: Booking[] = bkData.map(item => ({
          id: item.id,
          clientId: item.client_id,
          clientName: item.client_name,
          companionId: item.companion_id,
          companionName: item.companion_name,
          companionPhoto: item.companion_photo,
          serviceId: item.service_id,
          serviceName: item.service_name,
          durationHours: Number(item.duration_hours),
          totalPrice: Number(item.total_price),
          meetingLocation: item.meeting_location,
          bookingDate: item.booking_date,
          timeSlot: item.time_slot,
          status: item.status,
          createdAt: new Date(item.created_at).toLocaleDateString()
        }));
        setBookings(mappedBk);
      }

      // 2. Support Messages
      let msgQuery = supabase.from('support_messages').select('*');
      if (currentUser.role !== 'Admin') {
        msgQuery = msgQuery.eq('user_id', currentUser.id);
      }
      const { data: msgData } = await msgQuery.order('created_at', { ascending: true });
      if (msgData && msgData.length > 0) {
        const mappedMsg: SupportMessage[] = msgData.map(item => ({
          id: item.id,
          sender: item.sender,
          text: item.text,
          timestamp: item.timestamp
        }));
        setSupportMessages(mappedMsg);
      } else {
        setSupportMessages([
          {
            id: 'welcome_msg',
            sender: 'admin',
            text: "As-salamu alaykum! Welcome to YAARANA.PK Pakistan support desk. We are active online to answer questions regarding companion approvals, EasyPaisa secure wallet transactions, or regional cancel policies. How can we help you today?",
            timestamp: 'Just now'
          }
        ]);
      }

      // 3. Transactions
      let txQuery = supabase.from('transactions').select('*');
      if (currentUser.role !== 'Admin') {
        txQuery = txQuery.eq('user_id', currentUser.id);
      }
      const { data: txData } = await txQuery.order('created_at', { ascending: false });
      if (txData) {
        setTransactions(txData);
      }
    };

    fetchUserDependencies();
  }, [currentUser]);

  // Auth Screen Callbacks
  const handleAuthSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    setActiveTab('home');
  };

  const handleRegisterCompanionSubmit = async (companionObj: any) => {
    if (!currentUser) return;

    // Update profile role and details in Supabase user_profiles
    await supabase
      .from('user_profiles')
      .update({
        role: 'Companion',
        bio: companionObj.bio,
        interests: companionObj.interests,
        photos: companionObj.photos,
        services: companionObj.services,
        is_approved_companion: companionObj.isVerified // Use the verified status
      })
      .eq('id', currentUser.id);

    // Also register companion applicant inside companions table
    const companionRow = {
      id: companionObj.id,
      name: companionObj.name,
      age: companionObj.age,
      gender: companionObj.gender,
      city: companionObj.city,
      bio: companionObj.bio,
      interests: companionObj.interests,
      photos: companionObj.photos,
      services: companionObj.services,
      rating: companionObj.rating,
      reviews: companionObj.reviews,
      status: companionObj.status,
      is_verified: companionObj.isVerified,
      user_id: currentUser.id
    };

    const { error } = await supabase.from('companions').insert(companionRow);

    if (!error) {
      setCompanions(prev => [companionObj, ...prev]);
      setCurrentUser(prev => prev ? {
        ...prev,
        role: 'Companion',
        bio: companionObj.bio,
        interests: companionObj.interests,
        photos: companionObj.photos,
        services: companionObj.services,
        isApprovedCompanion: false
      } : null);
    }
  };

  // Support Chat Callbacks
  const handleSendMessage = async (text: string, sender: 'user' | 'admin') => {
    if (!currentUser) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = {
      id: `msg_${Date.now()}`,
      user_id: currentUser.id,
      sender,
      text,
      timestamp: time
    };

    const { error } = await supabase.from('support_messages').insert(newMessage);

    if (!error) {
      setSupportMessages(prev => [...prev, { id: newMessage.id, sender, text, timestamp: time }]);
    }
  };

  // Wallet Top Up handler
  const handleWalletTopUp = async (amount: number, trxId: string) => {
    if (!currentUser) return;
    const newBal = walletBalance + amount;

    const { error } = await supabase
      .from('user_profiles')
      .update({ wallet_balance: newBal })
      .eq('id', currentUser.id);

    if (!error) {
      setWalletBalance(newBal);

      // Save transaction
      const newTx = {
        id: `tx_${Date.now()}`,
        user_id: currentUser.id,
        type: 'deposit' as const,
        amount,
        description: `EasyPaisa Top-Up (TRX: ${trxId})`,
        date: new Date().toLocaleDateString(),
        status: 'Completed' as const
      };

      await supabase.from('transactions').insert(newTx);
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  // Admin Callbacks
  const handleApproveRejectCompanion = async (id: string, newStatus: 'Approved' | 'Pending' | 'Rejected') => {
    const updatedStatus = {
      status: newStatus,
      is_verified: newStatus === 'Approved' ? true : false
    };

    const { error } = await supabase
      .from('companions')
      .update(updatedStatus)
      .eq('id', id);

    if (!error) {
      setCompanions(prev => prev.map(c => {
        if (c.id === id) {
          return { 
            ...c, 
            status: newStatus,
            isVerified: newStatus === 'Approved' ? true : c.isVerified 
          };
        }
        return c;
      }));
    }
  };

  const handleDeleteCompanion = async (id: string) => {
    // 1. Find companion to see if it has a user_id
    const comp = companions.find(c => c.id === id);
    
    // 2. Delete from companions table
    const { error } = await supabase
      .from('companions')
      .delete()
      .eq('id', id);

    if (!error) {
      // 3. If it had a user_id, update their profile
      // Note: We don't have user_id in Companion interface, assuming it might be in raw data or not easily available here. 
      // For now, focus on companions table as requested.
      setCompanions(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleRemoveAllCompanions = async () => {
    if (!confirm('Are you sure you want to remove ALL companions? This cannot be undone.')) return;

    const { error } = await supabase
      .from('companions')
      .delete()
      .neq('id', 'non-existent-id'); // Trick to delete all

    if (!error) {
        setCompanions([]);
        alert('All companions removed.');
    } else {
        alert('Error removing companions: ' + error.message);
    }
  };

  const handleAddCompanionByAdmin = async (newComp: Companion) => {
    const row = {
      id: newComp.id,
      name: newComp.name,
      age: newComp.age,
      gender: newComp.gender,
      city: newComp.city,
      bio: newComp.bio,
      interests: newComp.interests,
      photos: newComp.photos,
      services: newComp.services,
      rating: newComp.rating,
      reviews: newComp.reviews,
      status: newComp.status,
      is_verified: newComp.isVerified
    };

    const { error } = await supabase
      .from('companions')
      .insert(row);

    if (!error) {
      setCompanions(prev => [newComp, ...prev]);
    }
  };

  const handleEditCompanion = async (companion: Companion) => {
    const newBio = prompt('Enter new bio:', companion.bio);
    if (newBio === null) return;
    
    const { error } = await supabase
      .from('companions')
      .update({ bio: newBio })
      .eq('id', companion.id);
      
    if (!error) {
      setCompanions(prev => prev.map(c => c.id === companion.id ? { ...c, bio: newBio } : c));
    }
  };

  const handleApproveBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'Confirmed' })
      .eq('id', bookingId);

    if (!error) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Confirmed' as const } : b));
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    // Refund client wallet balance in Supabase
    const updatedBalance = walletBalance + target.totalPrice;
    
    await supabase
      .from('user_profiles')
      .update({ wallet_balance: updatedBalance })
      .eq('id', target.clientId);

    // Delete booking from database
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (!error) {
      setWalletBalance(updatedBalance);
      setBookings(prev => prev.filter(b => b.id !== bookingId));

      // Save refund transaction log
      const newTx = {
        id: `tx_${Date.now()}`,
        user_id: target.clientId,
        type: 'refund' as const,
        amount: target.totalPrice,
        description: `Admin Refund: Escrow booking rejected for ${target.companionName}`,
        date: new Date().toLocaleDateString(),
        status: 'Completed' as const
      };

      await supabase.from('transactions').insert(newTx);
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'Completed' })
      .eq('id', bookingId);

    if (!error) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Completed' as const } : b));
    }
  };

  // Booking process confirmation
  const handleConfirmBooking = async (bookingData: {
    serviceId: string;
    serviceName: string;
    durationHours: number;
    totalPrice: number;
    meetingLocation: string;
    bookingDate: string;
    timeSlot: any;
  }) => {
    if (!selectedCompanion || !currentUser) return;

    // Deduct wallet balance in Supabase
    const updatedBalance = walletBalance - bookingData.totalPrice;
    await supabase
      .from('user_profiles')
      .update({ wallet_balance: updatedBalance })
      .eq('id', currentUser.id);

    // Create active booking
    const newBookingId = `bk_${Date.now()}`;
    const newBooking: Booking = {
      id: newBookingId,
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
      createdAt: new Date().toLocaleDateString(),
      paymentDetails: bookingData.paymentDetails
    };

    const row = {
      id: newBooking.id,
      client_id: newBooking.clientId,
      client_name: newBooking.clientName,
      companion_id: newBooking.companionId,
      companion_name: newBooking.companionName,
      companion_photo: newBooking.companionPhoto,
      service_id: newBooking.serviceId,
      service_name: newBooking.serviceName,
      duration_hours: newBooking.durationHours,
      total_price: newBooking.totalPrice,
      meeting_location: newBooking.meetingLocation,
      booking_date: newBooking.bookingDate,
      time_slot: newBooking.timeSlot,
      status: newBooking.status
    };

    const { error } = await supabase.from('bookings').insert(row);

    if (!error) {
      setWalletBalance(updatedBalance);
      setBookings(prev => [newBooking, ...prev]);

      // Save transaction
      const newTx = {
        id: `tx_${Date.now()}`,
        user_id: currentUser.id,
        type: 'payment' as const,
        amount: bookingData.totalPrice,
        description: `Escrow payment: ${selectedCompanion.name} (${bookingData.serviceName})`,
        date: new Date().toLocaleDateString(),
        status: 'Completed' as const
      };
      
      await supabase.from('transactions').insert(newTx);
      setTransactions(prev => [newTx, ...prev]);

      // Clear Modal
      setActiveBookingService(null);
      setSelectedCompanion(null);
      
      // Jump to Profile screen to view their active bookings
      navigateTo('profile', null);

      // Simulated auto-confirm after 8 seconds (to mimic our 30-minute admin SLA prompt)
      setTimeout(async () => {
        const { data: bData } = await supabase
          .from('bookings')
          .select('status')
          .eq('id', newBookingId)
          .single();

        if (bData && bData.status === 'Pending') {
          await supabase
            .from('bookings')
            .update({ status: 'Confirmed' })
            .eq('id', newBookingId);

          setBookings(prev => prev.map(b => b.id === newBookingId ? { ...b, status: 'Confirmed' as const } : b));
        }
      }, 8000);
    }
  };

  const handleCancelBooking = async (bookingId: string, refundAmount: number) => {
    if (!currentUser) return;

    // Refund money in Supabase
    const newBal = walletBalance + refundAmount;
    await supabase
      .from('user_profiles')
      .update({ wallet_balance: newBal })
      .eq('id', currentUser.id);

    // Remove or cancel booking in database
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (!error) {
      setWalletBalance(newBal);
      setBookings(prev => prev.filter(b => b.id !== bookingId));

      // Transaction log
      const newTx = {
        id: `tx_${Date.now()}`,
        user_id: currentUser.id,
        type: 'refund' as const,
        amount: refundAmount,
        description: `Refund: Escrow release for cancelled booking`,
        date: new Date().toLocaleDateString(),
        status: 'Completed' as const
      };

      await supabase.from('transactions').insert(newTx);
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setActiveBookingService(null);
    navigateTo('home', null);
    setNavHistory([{ tab: 'home', companion: null }]);
  };

  // Retrieve transactions helper
  const getTransactionsList = () => {
    return transactions;
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
              YAARANA.PK <span className="text-[8px] bg-[#140822] text-[#E9D5FF] font-bold px-1.5 py-0.5 rounded border border-[#6A0DAD]/30">PK</span>
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
          ) : null}
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
              {currentUser.role === 'Admin' && (
                <button
                  onClick={() => setCurrentUser({ ...currentUser, role: 'Client' })}
                  className="text-[#E9D5FF]/70 hover:text-white font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  [Switch to Client View]
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
              onRemoveAllCompanions={handleRemoveAllCompanions}
              onAddCompanion={handleAddCompanionByAdmin}
              onEditCompanion={handleEditCompanion}
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
                          BOOKING STARTS FROM 499 PKR ONLY FOR FIRST TIME USER
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
                          How YAARANA.PK Works
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
                            setCurrentUser(profile);
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

                      {/* Approaching Booking Reminder */}
                      {bookings.filter(b => {
                        const today = new Date().toISOString().split('T')[0];
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const tomorrowStr = tomorrow.toISOString().split('T')[0];
                        return b.status === 'Confirmed' && (b.bookingDate === today || b.bookingDate === tomorrowStr);
                      }).length > 0 && (
                        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-4 flex items-start gap-3 shadow-md animate-pulse">
                          <AlertCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-xs text-[#D4AF37]">Upcoming Session Reminder</h4>
                            <p className="text-[10px] text-slate-300">
                              You have a confirmed booking within the next 24 hours. Please check your schedule and be ready at the meeting location on time.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Become a companion callout on profile */}
                      <div className="space-y-3">
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
                        
                        {/* Floating Contact Admin Button */}
                        <button
                          onClick={() => setActiveTab('support')}
                          className="w-full bg-[#1a0b2e] hover:bg-[#251042] border border-[#6A0DAD]/50 text-[#E9D5FF] font-bold text-xs py-3 rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Contact Admin Support
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
          hasPreviousBookings={bookings.length > 0}
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
