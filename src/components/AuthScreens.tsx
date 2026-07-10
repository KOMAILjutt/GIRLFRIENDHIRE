import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, Phone, User, Check, Sparkles, Upload, Eye, Camera, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { UserProfile, ServiceItem } from '../types';
import { CITIES, INTEREST_OPTIONS, SERVICES, ALL_CITIES } from '../data';
import { supabase } from '../supabaseClient';
import { uploadToSupabaseStorage, resolveSignedUrls } from '../lib/storage';

interface AuthScreensProps {
  onAuthSuccess: (profile: UserProfile) => void;
  onRegisterCompanionSubmit: (companionProfile: any) => void;
  initialScreen?: 'login' | 'signup' | 'role_select' | 'client_reg' | 'companion_reg';
  currentUser?: UserProfile | null;
}

export default function AuthScreens({ 
  onAuthSuccess, 
  onRegisterCompanionSubmit, 
  initialScreen = 'login',
  currentUser = null
}: AuthScreensProps) {
  const [screen, setScreen] = useState<'login' | 'signup' | 'role_select' | 'client_reg' | 'companion_reg'>(initialScreen);
  
  // User profile builder
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [password, setPassword] = useState('');
  
  // Registration fields
  const [city, setCity] = useState('Karachi');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [age, setAge] = useState<number>(22);
  const [profilePhoto, setProfilePhoto] = useState<string>(''); // NO DEFAULT - must upload
  const [rawProfilePhoto, setRawProfilePhoto] = useState<string | null>(null);
  
  // Companion specific
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  // EXACTLY 3 user-uploaded photos - NO AI AVATARS
  const [companionPhotos, setCompanionPhotos] = useState<string[]>([]);
  const [rawCompanionPhotos, setRawCompanionPhotos] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<{ serviceId: string; customBasePrice?: number; customPerHourRate?: number }[]>([]);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [companionSubmitted, setCompanionSubmitted] = useState(false);

  const handleGoToSignup = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setScreen('signup');
    setPassword('');
  };

  const handleGoToLogin = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setScreen('login');
    setPassword('');
  };

  // Real Supabase Google Authentication
  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        const { error: redirectError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (redirectError) {
          setErrorMsg(redirectError.message);
        }
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during Google sign in.');
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    // ONLY komailjutt008@gmail.com can be admin - NO FAKE ADMIN LOGIN
    if (email.toLowerCase() === 'komailjutt008@gmail.com') {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        // Admin auth success handled by App.tsx via onAuthSuccess
        return;
      } catch (err: any) {
        setErrorMsg(err.message || 'Admin login failed.');
        return;
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setErrorMsg(error.message);
        return;
      }

      const user = data.user;
      // Fetch real profile from Supabase
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      const realProfile: UserProfile = {
        id: user?.id || `usr_${Date.now()}`,
        name: profile?.name || user?.user_metadata?.full_name || name || email.split('@')[0],
        email: email,
        phone: profile?.phone || user?.user_metadata?.phone || phone || '',
        role: profile?.role || 'Client',
        city: profile?.city || 'Karachi',
        gender: profile?.gender || 'Male',
        age: profile?.age || 26,
        profilePhoto: profile?.profile_photo || '',
        walletBalance: profile?.wallet_balance || 0
      };
      onAuthSuccess(realProfile);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during sign in.');
    }
  };

  const handleManualSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!name || !email || !phone || !password) {
      setErrorMsg('Please fill in all manual registration fields.');
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone
          }
        }
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      await supabase.auth.signOut();
      setPassword('');
      setScreen('login');
      setSuccessMsg("Your account has been created. Please check your email and verify your address before logging in.");
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during sign up.');
    }
  };

  const handleSelectRole = (role: 'Client' | 'Companion') => {
    if (role === 'Client') {
      setScreen('client_reg');
    } else {
      setScreen('companion_reg');
    }
  };

  // Photo upload handlers - FORCE GALLERY ONLY, NO AI AVATARS
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const fileInputMultipleRef = React.useRef<HTMLInputElement | null>(null);
  const [uploadingPhotoIndex, setUploadingPhotoIndex] = useState<number | null>(null);

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate image
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image must be less than 5MB.');
      return;
    }

    try {
      setUploadingPhotoIndex(-1); // -1 means profile photo
      const path = await uploadToSupabaseStorage(file, 'avatars');
      const urls = await resolveSignedUrls([path]);
      setProfilePhoto(urls[path] || path);
      setRawProfilePhoto(path);
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg('Failed to upload photo: ' + err.message);
    } finally {
      setUploadingPhotoIndex(null);
    }
  };

  const handleCompanionPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image must be less than 5MB.');
      return;
    }

    try {
      setUploadingPhotoIndex(index);
      const path = await uploadToSupabaseStorage(file, 'companions');
      const urls = await resolveSignedUrls([path]);
      const url = urls[path] || path;
      
      setCompanionPhotos(prev => {
        const updated = [...prev];
        updated[index] = url;
        return updated;
      });
      setRawCompanionPhotos(prev => {
        const updated = [...prev];
        updated[index] = path;
        return updated;
      });
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg('Failed to upload photo: ' + err.message);
    } finally {
      setUploadingPhotoIndex(null);
    }
  };

  const removeCompanionPhoto = (index: number) => {
    setCompanionPhotos(prev => prev.filter((_, i) => i !== index));
    setRawCompanionPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleRegisterClient = async () => {
    if (!name || !city || !profilePhoto) {
      setErrorMsg('Please fill in all fields and upload a profile photo from your gallery.');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMsg('You must be logged in to complete registration.');
        return;
      }

      const profileData = {
        id: user.id,
        name,
        email: user.email,
        phone: phone || user.user_metadata?.phone || '',
        role: 'Client',
        gender,
        age,
        city,
        profile_photo: profilePhoto,
        raw_profile_photo: rawProfilePhoto,
        wallet_balance: 0, // NO FAKE BALANCE - starts at 0
        is_approved_companion: false
      };

      const { error } = await supabase.from('user_profiles').upsert(profileData);
      if (error) {
        setErrorMsg(error.message);
        return;
      }

      const profile: UserProfile = {
        id: user.id,
        name,
        email: user.email || '',
        phone: profileData.phone,
        role: 'Client',
        gender,
        age,
        city,
        profilePhoto,
        walletBalance: 0
      };
      onAuthSuccess(profile);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  const handleRegisterCompanion = async () => {
    if (!name || !city || !bio || selectedInterests.length === 0) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (companionPhotos.length < 3) {
      setErrorMsg('You must upload exactly 3 photos from your gallery. No AI-generated images allowed.');
      return;
    }
    if (selectedServices.length === 0) {
      setErrorMsg('Please select at least one service.');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMsg('You must be logged in to register as a companion.');
        return;
      }

      // Create companion profile with PENDING status - requires admin approval
      const companionData = {
        id: `comp_${Date.now()}`,
        user_id: user.id,
        name,
        age,
        gender,
        city,
        bio,
        interests: selectedInterests,
        photos: rawCompanionPhotos.length > 0 ? rawCompanionPhotos : companionPhotos,
        services: selectedServices,
        rating: 0,
        reviews: [],
        status: 'Pending', // MUST BE APPROVED BY ADMIN
        is_verified: false
      };

      // Insert into companions table
      const { error: companionError } = await supabase.from('companions').insert(companionData);
      if (companionError) {
        setErrorMsg(companionError.message);
        return;
      }

      // Update user profile to mark as pending companion
      const { error: profileError } = await supabase.from('user_profiles').upsert({
        id: user.id,
        name,
        email: user.email,
        phone: phone || user.user_metadata?.phone || '',
        role: 'Companion',
        gender,
        age,
        city,
        profile_photo: companionPhotos[0],
        raw_profile_photo: rawCompanionPhotos[0],
        bio,
        interests: selectedInterests,
        photos: companionPhotos,
        raw_photos: rawCompanionPhotos,
        services: selectedServices,
        is_approved_companion: false, // Pending approval
        wallet_balance: 0
      });

      if (profileError) {
        setErrorMsg(profileError.message);
        return;
      }

      setCompanionSubmitted(true);
      setErrorMsg('');
      
      // Notify admin via support message
      await supabase.from('support_messages').insert({
        sender: 'user',
        text: `NEW COMPANION REGISTRATION PENDING: ${name} from ${city} has registered as a companion and requires your approval.`,
        timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      setErrorMsg(err.message || 'Companion registration failed.');
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleService = (service: ServiceItem) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.serviceId === service.id);
      if (exists) {
        return prev.filter(s => s.serviceId !== service.id);
      }
      return [...prev, { serviceId: service.id }];
    });
  };

  // --- RENDERERS ---

  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-[#0f071a] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6A0DAD] to-[#140822] border border-[#6A0DAD]/30 shadow-[0_0_20px_rgba(106,13,173,0.3)]">
              <Sparkles className="w-7 h-7 text-purple-300" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">YAARANA.PK</h1>
            <p className="text-sm text-slate-400">Sign in to your account</p>
          </div>

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm text-center">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center flex items-center gap-2 justify-center">
              <ShieldCheck className="w-4 h-4" />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a0b2e] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6A0DAD]/50 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a0b2e] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6A0DAD]/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#4a0080] hover:from-[#7a1dbd] hover:to-[#5a0090] text-white font-semibold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(106,13,173,0.3)] active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0f071a] px-3 text-slate-500">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleAuth}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
            Google
          </button>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <button onClick={handleGoToSignup} className="text-[#E9D5FF] hover:text-white font-medium transition-colors">
              Sign up
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (screen === 'signup') {
    return (
      <div className="min-h-screen bg-[#0f071a] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <button onClick={handleGoToLogin} className="absolute left-4 top-4 text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black text-white tracking-tight">Create Account</h1>
            <p className="text-sm text-slate-400">Join YAARANA.PK today</p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleManualSignUp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1a0b2e] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6A0DAD]/50"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a0b2e] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6A0DAD]/50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#1a0b2e] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6A0DAD]/50"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a0b2e] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6A0DAD]/50"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#4a0080] hover:from-[#7a1dbd] hover:to-[#5a0090] text-white font-semibold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(106,13,173,0.3)] active:scale-[0.98]"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <button onClick={handleGoToLogin} className="text-[#E9D5FF] hover:text-white font-medium transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (screen === 'role_select') {
    return (
      <div className="min-h-screen bg-[#0f071a] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Choose Your Role</h1>
            <p className="text-sm text-slate-400">How would you like to use YAARANA.PK?</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => handleSelectRole('Client')}
              className="p-6 bg-[#1a0b2e] border border-white/10 rounded-2xl hover:border-[#6A0DAD]/50 transition-all text-left space-y-2 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6A0DAD]/20 flex items-center justify-center group-hover:bg-[#6A0DAD]/30 transition-colors">
                <User className="w-6 h-6 text-[#E9D5FF]" />
              </div>
              <h3 className="text-lg font-bold text-white">I'm a Client</h3>
              <p className="text-sm text-slate-400">Browse and book companions for events, dining, travel, and more.</p>
            </button>

            <button
              onClick={() => handleSelectRole('Companion')}
              className="p-6 bg-[#1a0b2e] border border-white/10 rounded-2xl hover:border-[#6A0DAD]/50 transition-all text-left space-y-2 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6A0DAD]/20 flex items-center justify-center group-hover:bg-[#6A0DAD]/30 transition-colors">
                <Sparkles className="w-6 h-6 text-[#E9D5FF]" />
              </div>
              <h3 className="text-lg font-bold text-white">I'm a Companion</h3>
              <p className="text-sm text-slate-400">Register your services and get booked by clients. Requires admin approval.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'client_reg') {
    return (
      <div className="min-h-screen bg-[#0f071a] px-4 py-8">
        <div className="max-w-sm mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setScreen('role_select')} className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white">Complete Your Profile</h1>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            {/* Profile Photo Upload - FROM GALLERY ONLY */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Profile Photo <span className="text-red-400">*</span></label>
              <div className="flex flex-col items-center gap-3">
                {profilePhoto ? (
                  <div className="relative">
                    <img src={profilePhoto} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-2 border-[#6A0DAD]/50" />
                    <button
                      onClick={() => { setProfilePhoto(''); setRawProfilePhoto(null); }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-[#1a0b2e] border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1">
                    <Camera className="w-6 h-6 text-slate-500" />
                    <span className="text-[10px] text-slate-500">No photo</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhotoIndex === -1}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a0b2e] border border-white/10 rounded-xl text-sm text-[#E9D5FF] hover:bg-[#6A0DAD]/20 transition-colors disabled:opacity-50"
                >
                  {uploadingPhotoIndex === -1 ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload from Gallery
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Full Name <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1a0b2e] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#6A0DAD]/50"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">City <span className="text-red-400">*</span></label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#1a0b2e] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus
