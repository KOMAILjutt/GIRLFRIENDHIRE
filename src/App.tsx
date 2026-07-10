import React, { useState, useEffect } from 'react';
import { Companion, Booking, UserProfile, SupportMessage, Transaction } from './types';
import { SERVICES } from './data';
import BrowsePage from './components/BrowsePage';
import ProfilePage from './components/ProfilePage';
import AdminPanel from './components/AdminPanel';
import WalletScreen from './components/WalletScreen';
import SupportScreen from './components/SupportScreen';
import BottomNav from './components/BottomNav';
import AuthScreens from './components/AuthScreens';

// Demo companions data (replace with your Supabase fetch)
const DEMO_COMPANIONS: Companion[] = [
  {
    id: 'comp_1',
    name: 'Mehwish Ali',
    age: 24,
    gender: 'Female',
    city: 'Lahore',
    bio: 'Friendly and outgoing companion. I enjoy fine dining, movies, and long conversations. Available for social events and private meetups.',
    interests: ['Dining', 'Movies', 'Travel', 'Conversation'],
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
    ],
    services: [
      { serviceId: 'srv_1', customBasePrice: 5000, customPerHourRate: 2000 },
      { serviceId: 'srv_2', customBasePrice: 8000, customPerHourRate: 3000 }
    ],
    rating: 4.8,
    reviews: [],
    status: 'Approved',
    isVerified: true
  },
  {
    id: 'comp_2',
    name: 'Aisha Khan',
    age: 26,
    gender: 'Female',
    city: 'Karachi',
    bio: 'Elegant and sophisticated. Perfect for business dinners and social gatherings. I speak fluent English and Urdu.',
    interests: ['Business', 'Dining', 'Shopping', 'Events'],
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'
    ],
    services: [
      { serviceId: 'srv_1', customBasePrice: 6000, customPerHourRate: 2500 },
      { serviceId: 'srv_3', customBasePrice: 10000, customPerHourRate: 4000 }
    ],
    rating: 4.9,
    reviews: [],
    status: 'Approved',
    isVerified: true
  },
  {
    id: 'comp_3',
    name: 'Sana Malik',
    age: 22,
    gender: 'Female',
    city: 'Islamabad',
    bio: 'Young and energetic. I love outdoor activities, hiking, and adventure sports. Great travel companion!',
    interests: ['Travel', 'Hiking', 'Adventure', 'Photography'],
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    ],
    services: [
      { serviceId: 'srv_2', customBasePrice: 7000, customPerHourRate: 2500 },
      { serviceId: 'srv_4', customBasePrice: 12000, customPerHourRate: 5000 }
    ],
    rating: 4.7,
    reviews: [],
    status: 'Approved',
    isVerified: true
  }
];

export default function App() {
  // ─── STATE ───
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [companions, setCompanions] = useState<Companion[]>(DEMO_COMPANIONS);

  // ─── HANDLERS ───

  // Auth success
  const handleAuthSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    // Set wallet balance from profile or default to 0
    setWalletBalance(profile.walletBalance || 0);
  };

  // Register companion
  const handleRegisterCompanion = (companionProfile: any) => {
    setCompanions([...companions, companionProfile]);
  };

  // Book companion (from BrowsePage "Book Now" button)
  const handleBookCompanion = (bookingData: any) => {
    const newBooking: Booking = {
      id: `book_${Date.now()}`,
      clientName: userProfile?.name || 'Guest',
      clientId: userProfile?.id || 'guest',
      companionId: bookingData.companionId,
      companionName: bookingData.companionName,
      companionPhoto: companions.find(c => c.id === bookingData.companionId)?.photos[0] || '',
      serviceName: bookingData.serviceName,
      durationHours: bookingData.durationHours,
      totalPrice: bookingData.totalPrice,
      bookingDate: bookingData.bookingDate,
      timeSlot: bookingData.timeSlot,
      meetingLocation: bookingData.meetingLocation,
      status: 'Pending',
      createdAt: new Date().toLocaleDateString(),
      paymentDetails: {
        trxLast4: bookingData.trxLast4,
        senderName: bookingData.senderName,
        paymentTo: bookingData.paymentTo,
        paymentAccountName: bookingData.paymentAccountName
      }
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  // Book from ProfilePage
  const handleBookFromProfile = (service: any) => {
    if (!selectedCompanion) return;
    // Open booking modal via BrowsePage logic or navigate
    console.log('Book from profile:', service);
  };

  // Wallet top-up
  const handleTopUp = (amount: number, trxId: string) => {
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      amount,
      description: `EasyPaisa Top-up (TRX: ${trxId})`,
      date: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    setTransactions(prev => [newTx, ...prev]);
    // Add to wallet balance immediately (admin will verify later)
    setWalletBalance(prev => prev + amount);
  };

  // Support message
  const handleSendMessage = (text: string, sender: 'user' | 'admin') => {
    const newMsg: SupportMessage = {
      id: `msg_${Date.now()}`,
      text,
      sender,
      timestamp: new Date().toLocaleTimeString()
    };
    setSupportMessages(prev => [...prev, newMsg]);
  };

  // Admin: Approve/Reject companion
  const handleApproveReject = (id: string, newStatus: 'Approved' | 'Pending' | 'Rejected') => {
    setCompanions(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  // Admin: Delete companion
  const handleDeleteCompanion = (id: string) => {
    setCompanions(prev => prev.filter(c => c.id !== id));
  };

  // Admin: Remove all
  const handleRemoveAll = () => {
    setCompanions([]);
  };

  // Admin: Add companion
  const handleAddCompanion = (newComp: Companion) => {
    setCompanions(prev => [...prev, newComp]);
  };

  // Admin: Edit companion
  const handleEditCompanion = (comp: Companion) => {
    setCompanions(prev => prev.map(c => c.id === comp.id ? comp : c));
  };

  // Admin: Send reply
  const handleSendAdminReply = (text: string) => {
    handleSendMessage(text, 'admin');
  };

  // Admin: Approve booking
  const handleApproveBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Confirmed' as const } : b));
    // Add to transactions
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      setTransactions(prev => [{
        id: `tx_${Date.now()}`,
        type: 'payment',
        amount: booking.totalPrice,
        description: `Booking: ${booking.companionName}`,
        date: new Date().toLocaleDateString(),
        status: 'Completed'
      }, ...prev]);
    }
  };

  // Admin: Reject booking
  const handleRejectBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Rejected' as const } : b));
  };

  // Admin: Complete booking
  const handleCompleteBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Completed' as const } : b));
  };

  // ─── RENDER CONTENT ───
  const renderContent = () => {
    // Not logged in → Auth screens
    if (!userProfile) {
      return (
        <AuthScreens
          onAuthSuccess={handleAuthSuccess}
          onRegisterCompanionSubmit={handleRegisterCompanion}
        />
      );
    }

    // Profile page (when companion selected)
    if (selectedCompanion && activeTab === 'profile') {
      return (
        <ProfilePage
          companion={selectedCompanion}
          onBack={() => setSelectedCompanion(null)}
          onBook={handleBookFromProfile}
        />
      );
    }

    // Tab-based rendering
    switch (activeTab) {
      case 'home':
      case 'browse':
        return (
          <BrowsePage
            companions={companions}
            onSelectCompanion={(comp) => {
              setSelectedCompanion(comp);
              setActiveTab('profile');
            }}
            onBookCompanion={handleBookCompanion}
          />
        );

      case 'profile':
        return (
          <div className="p-8 text-center text-slate-400">
            <p className="text-sm">Select a companion from Browse to view profile</p>
            <button
              onClick={() => setActiveTab('browse')}
              className="mt-4 bg-[#6A0DAD] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Go to Browse
            </button>
          </div>
        );

      case 'wallet':
        return (
          <WalletScreen
            balance={walletBalance}
            transactions={transactions}
            onTopUp={handleTopUp}
          />
        );

      case 'support':
        // Admin sees AdminPanel, User sees SupportScreen
        if (userProfile.role === 'Admin') {
          return (
            <AdminPanel
              companions={companions}
              onApproveReject={handleApproveReject}
              onDeleteCompanion={handleDeleteCompanion}
              onRemoveAllCompanions={handleRemoveAll}
              onAddCompanion={handleAddCompanion}
              onEditCompanion={handleEditCompanion}
              supportMessages={supportMessages}
              onSendAdminReply={handleSendAdminReply}
              bookings={bookings}
              onApproveBooking={handleApproveBooking}
              onRejectBooking={handleRejectBooking}
              onCompleteBooking={handleCompleteBooking}
            />
          );
        }
        return (
          <SupportScreen
            messages={supportMessages}
            onSendMessage={handleSendMessage}
          />
        );

      default:
        return (
          <BrowsePage
            companions={companions}
            onSelectCompanion={(comp) => {
              setSelectedCompanion(comp);
              setActiveTab('profile');
            }}
            onBookCompanion={handleBookCompanion}
          />
        );
    }
  };

  // ─── JSX ───
  return (
    <div className="min-h-screen bg-[#0f071a] text-slate-100 font-sans">
      {/* Main Content */}
      <main className="pb-20">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      {userProfile && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab !== 'profile') setSelectedCompanion(null);
          }}
          walletBalance={walletBalance}
          unreadSupportCount={supportMessages.filter(m => m.sender === 'admin').length}
        />
      )}
    </div>
  );
}
