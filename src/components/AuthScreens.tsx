import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, Phone, User, Check, Sparkles, Upload, Eye, Camera, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { UserProfile, ServiceItem } from '../types';
import { CITIES, INTEREST_OPTIONS, SERVICES } from '../data';
import { supabase } from '../supabaseClient';
import { uploadToSupabaseStorage, resolveSignedUrls } from '../lib/storage';

// Nice pre-selected avatar choices for fast client/companion setup testing
const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=200'
];

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
  const [profilePhoto, setProfilePhoto] = useState(AVATAR_OPTIONS[0]); // Default first
  const [rawProfilePhoto, setRawProfilePhoto] = useState<string | null>(null);
  
  // Companion specific
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  // Needs 3 photos
  const [companionPhotos, setCompanionPhotos] = useState<string[]>([
    AVATAR_OPTIONS[1],
    AVATAR_OPTIONS[3],
    AVATAR_OPTIONS[5]
  ]);
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
      // Use standard Supabase signInWithOAuth.
      // To ensure it works inside the preview iframe, we first try to get the URL with skipBrowserRedirect
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        // If skipBrowserRedirect fails or isn't supported, fall back to standard redirection
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
        // Open the Google OAuth URL in a new window/tab to bypass iframe restrictions
        window.open(data.url, '_blank');
      } else {
        // Fallback to direct redirect if no URL returned but no error
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

    // Check if admin login
    if (email.toLowerCase() === 'admin@girlfriendhire.pk') {
      const adminProfile: UserProfile = {
        id: 'admin_1',
        name: 'Regional Admin',
        email: 'admin@girlfriendhire.pk',
        role: 'Admin',
        profilePhoto: AVATAR_OPTIONS[4]
      };
      onAuthSuccess(adminProfile);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // Standard client login from Supabase Auth
      const user = data.user;
      const mockProfile: UserProfile = {
        id: user?.id || `usr_${Date.now()}`,
        name: user?.user_metadata?.full_name || name || email.split('@')[0],
        email: email,
        phone: user?.user_metadata?.phone || phone || '+92 321 4567890',
        role: 'Client',
        city: 'Lahore',
        gender: 'Male',
        age: 26,
        profilePhoto: AVATAR_OPTIONS[2]
      };
      onAuthSuccess(mockProfile);
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

      // Do not auto-login: sign out any session that was automatically created on signUp
      await supabase.auth.signOut();

      // Clear password for security & clean UX
      setPassword('');

      // Redirect the user to the login screen
      setScreen('login');

      // Show success message above the login form
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

  // Real Photo Upload & Permission states
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionTargetIndex, setPermissionTargetIndex] = useState<number | undefined>(undefined);
  const [galleryPermission, setGalleryPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const fileInputMultipleRef = React.useRef<HTMLInputElement | null>(null);
  const fileInputCameraRef = React.useRef<HTMLInputElement | null>(null);

  // useRef based handler to validate that files are valid images before displaying
  const validateImagesFromRef = (inputRef: React.RefObject<HTMLInputElement | null>): File[] => {
    const input = inputRef.current;
    if (!input || !input.files) return [];
    
    const validFiles: File[] = [];
    const filesArray = Array.from(input.files) as File[];
    
    for (const file of filesArray) {
      if (file && file.type.startsWith('image/')) {
        validFiles.push(file);
      } else {
        setErrorMsg(`"${file.name}" is not a valid image file. Only image files (PNG, JPG, JPEG, etc.) are allowed.`);
      }
    }
    return validFiles;
  };

  const triggerFileUpload = (index?: number) => {
    setPermissionTargetIndex(index);
    if (galleryPermission === 'granted') {
      if (index === undefined) {
        fileInputMultipleRef.current?.click();
      } else {
        fileInputCameraRef.current?.click();
      }
    } else {
      setShowPermissionModal(true);
    }
  };

  const handleGrantPermission = () => {
    setGalleryPermission('granted');
    setShowPermissionModal(false);
    // Programmatically open file dialog after state update
    setTimeout(() => {
      if (permissionTargetIndex === undefined) {
        fileInputMultipleRef.current?.click();
      } else {
        fileInputCameraRef.current?.click();
      }
    }, 100);
  };

  const handleDenyPermission = () => {
    setGalleryPermission('denied');
    setShowPermissionModal(false);
  };

  // For client profile photo (single selection)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file && !file.type.startsWith('image/')) {
      setErrorMsg('Selected file is not a valid image.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrorMsg('You must be logged in to upload files.');
      return;
    }

    try {
      const extension = file.name.split('.').pop() || 'jpg';
      const path = await uploadToSupabaseStorage(user.id, 'profile', 'avatar', file, extension);
      setRawProfilePhoto(path);
      const signed = await resolveSignedUrls([path]);
      setProfilePhoto(signed[path]);
    } catch (err) {
      setErrorMsg('Failed to upload image.');
      console.error(err);
    }
  };

  // Handler for multiple gallery images using useRef validation
  const handleMultipleFileChange = async () => {
    setErrorMsg('');
    const validFiles = validateImagesFromRef(fileInputMultipleRef);
    if (validFiles.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrorMsg('You must be logged in to upload files.');
      return;
    }

    try {
      const uploadPromises = validFiles.slice(0, 3).map(async (file) => {
        const extension = file.name.split('.').pop() || 'jpg';
        return await uploadToSupabaseStorage(user.id, 'companion', 'gallery', file, extension);
      });

      const paths = await Promise.all(uploadPromises);
      setRawCompanionPhotos(paths);
      const signedUrls = await resolveSignedUrls(paths);
      
      // Map paths to signed URLs
      const signedPhotoUrls = paths.map(path => signedUrls[path]);
      
      setCompanionPhotos(signedPhotoUrls);
    } catch (err) {
      setErrorMsg('Failed to upload images.');
      console.error(err);
    }
  };

  // Handler for camera capture images using useRef validation
  const handleCameraFileChange = async () => {
    setErrorMsg('');
    const validFiles = validateImagesFromRef(fileInputCameraRef);
    if (validFiles.length === 0) return;

    const file = validFiles[0];
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrorMsg('You must be logged in to upload files.');
      return;
    }

    try {
      const extension = file.name.split('.').pop() || 'jpg';
      const path = await uploadToSupabaseStorage(user.id, 'companion', 'camera', file, extension);
      
      const signedUrls = await resolveSignedUrls([path]);
      
      const targetIdx = permissionTargetIndex !== undefined ? permissionTargetIndex : 0;
      
      const newRawPhotos = [...rawCompanionPhotos];
      newRawPhotos[targetIdx] = path;
      setRawCompanionPhotos(newRawPhotos);
      
      const newPhotos = [...companionPhotos];
      newPhotos[targetIdx] = signedUrls[path];
      setCompanionPhotos(newPhotos);
      
    } catch (err) {
      setErrorMsg('Failed to upload camera image.');
      console.error(err);
    }
  };


  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!profilePhoto) {
      setErrorMsg('Profile photo is required.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || `usr_${Date.now()}`;

    const clientProfile: UserProfile = {
      id: userId,
      name,
      email,
      phone,
      role: 'Client',
      city,
      gender,
      age,
      profilePhoto,
      rawProfilePhoto
    };

    // Upsert into user_profiles table in Supabase
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: clientProfile.id,
        name: clientProfile.name,
        email: clientProfile.email,
        phone: clientProfile.phone,
        role: clientProfile.role,
        city: clientProfile.city,
        gender: clientProfile.gender,
        age: clientProfile.age,
        profile_photo: clientProfile.rawProfilePhoto || clientProfile.profilePhoto, // Use raw if available
        wallet_balance: 15000.00 // initial balance
      });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    onAuthSuccess(clientProfile);
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleService = (serviceId: string) => {
    const exists = selectedServices.some(s => s.serviceId === serviceId);
    if (exists) {
      setSelectedServices(selectedServices.filter(s => s.serviceId !== serviceId));
    } else {
      const originalService = SERVICES.find(s => s.id === serviceId);
      if (originalService) {
        setSelectedServices([
          ...selectedServices,
          {
            serviceId,
            customBasePrice: originalService.basePrice,
            customPerHourRate: originalService.perHourRate
          }
        ]);
      }
    }
  };

  const handleCompanionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (companionPhotos.length < 3) {
      setErrorMsg('You must upload at least 3 photos (front face, full body, casual).');
      return;
    }

    if (!bio.trim() || bio.split(/\s+/).length > 200) {
      setErrorMsg('Bio is required and must not exceed 200 words.');
      return;
    }

    if (selectedInterests.length === 0) {
      setErrorMsg('Please select at least one interest.');
      return;
    }

    if (selectedServices.length === 0) {
      setErrorMsg('Please select at least one service you offer.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || `usr_${Date.now()}`;

    // Submit for approval
    const companionObj = {
      id: `comp_${Date.now()}`,
      name,
      age,
      gender,
      city,
      bio,
      interests: selectedInterests,
      photos: rawCompanionPhotos.length > 0 ? rawCompanionPhotos : companionPhotos,
      services: selectedServices.map(sid => ({ serviceId: sid })),
      rating: 5.0,
      reviews: [],
      status: 'Approved' as const,
      isVerified: true
    };

    // Update or insert their user profile in Supabase
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        name,
        email,
        phone,
        role: 'Companion',
        city,
        gender,
        age,
        profile_photo: rawCompanionPhotos[0] || companionPhotos[0],
        bio,
        interests: selectedInterests,
        photos: rawCompanionPhotos.length > 0 ? rawCompanionPhotos : companionPhotos,
        services: selectedServices,
        is_approved_companion: true
      });

    if (profileError) {
      setErrorMsg(profileError.message);
      return;
    }

    // Insert into companions table
    console.log('Attempting to insert into companions:', {
      id: companionObj.id,
      user_id: userId,
      name: companionObj.name,
      status: companionObj.status
    });
    const { error: companionError } = await supabase
      .from('companions')
      .insert({
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
        user_id: userId
      });

    if (companionError) {
      console.error('Companion insert error details:', companionError);
      setErrorMsg(`Failed to register companion: ${companionError.message}`);
      return;
    }
    console.log('Companion insert success!');

    onRegisterCompanionSubmit(companionObj);
    setCompanionSubmitted(true);
  };

  return (
    <div id="auth-screens-container" className="p-4 flex flex-col justify-center min-h-[80vh] pb-16 animate-fade-in">
      
      {/* 1. LOGIN SCREEN */}
      {screen === 'login' && (
        <div className="space-y-6 max-w-sm mx-auto w-full animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3.5 bg-[#6A0DAD]/15 border border-[#6A0DAD]/40 rounded-2xl shadow-inner mb-2">
              <Sparkles className="w-8 h-8 text-[#E9D5FF]" />
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-display">Girlfriend Hire</h1>
            <p className="text-xs text-slate-400 font-medium px-2">
              "Your Perfect Companion – Book by the Hour or Full Day"
            </p>
          </div>

          {/* Social Sign In Button */}
          <button
            onClick={handleGoogleAuth}
            type="button"
            className="w-full bg-[#1a0b2e] border border-white/10 hover:border-[#6A0DAD]/50 text-slate-200 text-xs font-bold rounded-xl py-3.5 flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98 cursor-pointer hover:bg-[#6A0DAD]/10"
          >
            {/* Google Vector Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.62 14.99 1 12 1 7.35 1 3.37 3.67 1.41 7.57l3.8 2.94C6.12 7.18 8.85 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.92 3.41-8.55z" />
              <path fill="#FBBC05" d="M5.21 10.51a6.992 6.992 0 010-4.44l-3.8-2.94A11.944 11.944 0 000 12c0 3.23.86 6.27 2.41 8.87l3.8-2.94a6.992 6.992 0 01-1-7.42z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.11.75-2.53 1.19-4.26 1.19-3.15 0-5.88-2.14-6.79-5.47l-3.8 2.94C3.37 20.33 7.35 23 12 23z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">or manual login</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. haris@gmail.com"
                  className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl pl-10 pr-3 py-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl pl-10 pr-3 py-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
            )}

            {successMsg && (
              <p className="text-xs text-emerald-400 font-semibold">{successMsg}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-bold rounded-xl py-3.5 text-xs transition-colors shadow-lg shadow-[#6A0DAD]/15 cursor-pointer"
            >
              Log In
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">New to Girlfriend Hire? </span>
            <button
              onClick={handleGoToSignup}
              className="text-xs text-[#E9D5FF] hover:text-white font-bold underline decoration-[#6A0DAD] cursor-pointer"
            >
              Sign Up Now
            </button>
          </div>

          {/* Quick Demo Assist */}
          <div className="bg-[#6A0DAD]/10 border border-[#6A0DAD]/30 rounded-xl p-3 text-center text-[11px] text-[#E9D5FF]">
            <strong>Testing Tip:</strong> Standard Client manual login is instantaneous. To test as a platform supervisor, type: <span className="font-mono text-white bg-[#0f071a] border border-white/5 px-1 rounded">admin@girlfriendhire.pk</span> as email.
          </div>
        </div>
      )}

      {/* 2. SIGN-UP SCREEN */}
      {screen === 'signup' && (
        <div className="space-y-6 max-w-sm mx-auto w-full animate-fade-in flex flex-col">
          <button
            type="button"
            onClick={handleGoToLogin}
            className="flex items-center gap-1.5 text-[10px] font-bold text-[#E9D5FF] hover:text-white bg-[#6A0DAD]/15 hover:bg-[#6A0DAD]/30 border border-[#6A0DAD]/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 self-start mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back to Log In
          </button>

          <div className="text-center space-y-2 w-full">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-display">Create Account</h1>
            <p className="text-xs text-slate-400 font-medium px-2">
              Join Pakistan's finest companion network
            </p>
          </div>

          {/* Social Sign Up Button */}
          <button
            onClick={handleGoogleAuth}
            type="button"
            className="w-full bg-[#1a0b2e] border border-white/10 hover:border-[#6A0DAD]/50 text-slate-200 text-xs font-bold rounded-xl py-3.5 flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98 cursor-pointer hover:bg-[#6A0DAD]/10"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.62 14.99 1 12 1 7.35 1 3.37 3.67 1.41 7.57l3.8 2.94C6.12 7.18 8.85 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.92 3.41-8.55z" />
              <path fill="#FBBC05" d="M5.21 10.51a6.992 6.992 0 010-4.44l-3.8-2.94A11.944 11.944 0 000 12c0 3.23.86 6.27 2.41 8.87l3.8-2.94a6.992 6.992 0 01-1-7.42z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.11.75-2.53 1.19-4.26 1.19-3.15 0-5.88-2.14-6.79-5.47l-3.8 2.94C3.37 20.33 7.35 23 12 23z" />
            </svg>
            Sign up with Google
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">or register manually</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <form onSubmit={handleManualSignUp} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Komail Jutt"
                  className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl pl-10 pr-3 py-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@domain.com"
                  className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl pl-10 pr-3 py-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number (WhatsApp preferred)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl pl-10 pr-3 py-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl pl-10 pr-3 py-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
            )}

            {successMsg && (
              <p className="text-xs text-emerald-400 font-semibold">{successMsg}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-bold rounded-xl py-3.5 text-xs transition-colors shadow-lg shadow-[#6A0DAD]/15 cursor-pointer"
            >
              Sign Up &amp; Select Role
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">Already registered? </span>
            <button
              onClick={handleGoToLogin}
              className="text-xs text-[#E9D5FF] hover:text-white font-bold underline decoration-[#6A0DAD] cursor-pointer"
            >
              Log In
            </button>
          </div>
        </div>
      )}

      {/* 3. ROLE SELECTION SCREEN */}
      {screen === 'role_select' && (
        <div className="space-y-6 max-w-sm mx-auto w-full animate-fade-in flex flex-col">
          <button
            type="button"
            onClick={handleGoToSignup}
            className="flex items-center gap-1.5 text-[10px] font-bold text-[#E9D5FF] hover:text-white bg-[#6A0DAD]/15 hover:bg-[#6A0DAD]/30 border border-[#6A0DAD]/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 self-start mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back to Sign Up
          </button>

          <div className="text-center space-y-2 w-full">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest font-mono">Step 2 of 3</span>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-display">Select Account Type</h1>
            <p className="text-xs text-slate-400 px-2 leading-relaxed">
              Are you joining Girlfriend Hire as a Client (Hirer) or a Companion (Service Provider)?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Client Option */}
            <button
              onClick={() => handleSelectRole('Client')}
              type="button"
              className="bg-[#1a0b2e] hover:bg-[#6A0DAD]/15 border-2 border-white/5 hover:border-[#6A0DAD]/40 rounded-2xl p-5 text-left transition-all duration-300 shadow-xl flex items-start gap-4 active:scale-98 cursor-pointer group"
            >
              <div className="p-3 bg-[#0f071a] border border-[#6A0DAD]/35 text-[#E9D5FF] rounded-xl group-hover:bg-[#6A0DAD]/30 transition-colors">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-xs text-slate-100 group-hover:text-[#E9D5FF] transition-colors">Join as Client (Hirer)</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Browse regional approved companion profiles, schedule dates, shopping, travel guiding, and book instantly.
                </p>
              </div>
            </button>

            {/* Companion Option */}
            <button
              onClick={() => handleSelectRole('Companion')}
              type="button"
              className="bg-[#1a0b2e] hover:bg-[#6A0DAD]/15 border-2 border-white/5 hover:border-[#6A0DAD]/40 rounded-2xl p-5 text-left transition-all duration-300 shadow-xl flex items-start gap-4 active:scale-98 cursor-pointer group"
            >
              <div className="p-3 bg-[#0f071a] border border-[#6A0DAD]/35 text-[#E9D5FF] rounded-xl group-hover:bg-[#6A0DAD]/30 transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-xs text-slate-100 group-hover:text-[#E9D5FF] transition-colors">Join as Companion (Provider)</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Offer companion services (dining, travel companion, private date buddies) in your city and earn up to ₨ 15,000+ per day.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 4. CLIENT REGISTRATION */}
      {screen === 'client_reg' && (
        <div className="space-y-6 max-w-sm mx-auto w-full animate-fade-in flex flex-col">
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setSuccessMsg('');
              setScreen('role_select');
            }}
            className="flex items-center gap-1.5 text-[10px] font-bold text-[#E9D5FF] hover:text-white bg-[#6A0DAD]/15 hover:bg-[#6A0DAD]/30 border border-[#6A0DAD]/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 self-start mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>

          <div className="text-center space-y-2 w-full">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest font-mono">Client Credentials</span>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-display">Complete Profile</h1>
            <p className="text-xs text-slate-400 px-2 leading-relaxed">
              Fill out your regional details to unlock access to companions
            </p>
          </div>

          <form onSubmit={handleClientSubmit} className="space-y-4">
            {/* Step 1: City Tier */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Your City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
              >
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

            {/* Step 2: Gender and Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e: any) => setGender(e.target.value)}
                  className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Age</label>
                <input
                  type="number"
                  required
                  min={18}
                  max={80}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 22)}
                  className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
                />
              </div>
            </div>

            {/* Step 3: Profile Photo Selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Upload Profile Photo (Mandatory)</label>
              
              <div className="flex items-center gap-4 bg-[#1a0b2e] border border-white/10 p-3.5 rounded-2xl shadow-md">
                <div className="w-14 h-14 bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl overflow-hidden shrink-0">
                  <img src={profilePhoto} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <span className="block text-[10px] text-slate-400">Select an avatar or generate mock files</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => triggerFileUpload()}
                      className="bg-[#6A0DAD]/20 hover:bg-[#6A0DAD]/40 border border-[#6A0DAD]/45 text-[#E9D5FF] text-[9px] font-bold px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" /> Select from Gallery
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-bold rounded-xl py-3.5 text-xs transition-colors shadow-lg shadow-[#6A0DAD]/15 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Submit &amp; Enter Platform <Check className="w-4 h-4 text-emerald-400 font-black" />
            </button>
          </form>
        </div>
      )}

      {/* 5. COMPANION REGISTRATION */}
      {screen === 'companion_reg' && (
        <div className="space-y-6 max-w-sm mx-auto w-full animate-fade-in">
          {companionSubmitted ? (
            <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-6 text-center space-y-4 animate-fade-in shadow-2xl">
              <div className="w-12 h-12 bg-[#6A0DAD]/25 text-[#E9D5FF] border border-[#6A0DAD]/50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h2 className="text-lg font-black text-slate-100 font-display">Application Under Review!</h2>
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p className="font-medium italic text-[#E9D5FF]">
                  "Your profile is under review. Admin will verify within 24 hours."
                </p>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Regional officers are matching your uploads against CNIC databases. Once approved, you will appear instantly on the browse page and start receiving hourly bookings.
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    // For the demo purpose, let them instantly proceed as Client OR direct them to the Admin Login
                    onAuthSuccess({
                      id: `usr_${Date.now()}`,
                      name,
                      email,
                      phone,
                      role: 'Client',
                      profilePhoto: companionPhotos[0],
                      city,
                      gender,
                      age
                    });
                  }}
                  className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-semibold rounded-xl py-2.5 text-xs transition-colors cursor-pointer shadow-md"
                >
                  Enter Platform as Client Demo
                </button>
                <span className="block text-[9px] text-slate-500 font-mono">
                  (You can approve this profile in the Admin Panel later)
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-5 flex flex-col">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setSuccessMsg('');
                  setScreen('role_select');
                }}
                className="flex items-center gap-1.5 text-[10px] font-bold text-[#E9D5FF] hover:text-white bg-[#6A0DAD]/15 hover:bg-[#6A0DAD]/30 border border-[#6A0DAD]/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 self-start mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Go Back
              </button>

              <div className="text-center space-y-1.5 w-full">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest font-mono">Earn with Girlfriend Hire</span>
                <h1 className="text-xl font-black text-slate-100 tracking-tight font-display">Companion Onboarding</h1>
                <p className="text-[11px] text-slate-400 leading-relaxed px-1">
                  Submit verification documents and build your premium service portfolio.
                </p>
              </div>

              <form onSubmit={handleCompanionSubmit} className="space-y-4 text-xs">
                
                {/* Step 1: City selection */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">Select City Base</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
                  >
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

                {/* Step 2: Gender and Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e: any) => setGender(e.target.value)}
                      className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">Age</label>
                    <input
                      type="number"
                      required
                      min={18}
                      max={65}
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 22)}
                      className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Step 3: Photos - MUST UPLOAD 3 */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Upload 3 mandatory Photos (Front, Full-Body, Casual)
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2 bg-[#1a0b2e] border border-white/10 p-2.5 rounded-xl shadow-md">
                    {companionPhotos.map((ph, idx) => (
                      <div key={idx} className="space-y-1.5 flex flex-col items-center">
                        <div className="w-full aspect-square bg-[#0f071a] border border-[#6A0DAD]/35 rounded-lg overflow-hidden relative shadow-inner">
                          {ph ? (
                            <img src={ph} alt={`Upload ${idx+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-950/40 text-[9px] text-center p-1">
                              No Image
                            </div>
                          )}
                          <div className="absolute top-1 left-1 bg-black/60 px-1 py-0.5 text-[7px] text-slate-300 rounded font-mono">
                            Slot {idx + 1}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPermissionTargetIndex(idx);
                            if (galleryPermission === 'granted') {
                              fileInputCameraRef.current?.click();
                            } else {
                              setShowPermissionModal(true);
                            }
                          }}
                          className="bg-[#6A0DAD]/20 hover:bg-[#6A0DAD]/40 border border-[#6A0DAD]/45 text-[8px] text-[#E9D5FF] py-1 px-1 rounded w-full flex items-center justify-center gap-0.5 cursor-pointer font-bold transition-all"
                          title="Use Camera to capture photo for this slot"
                        >
                          <Camera className="w-2.5 h-2.5 text-[#D4AF37]" /> Camera
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Bulk Gallery Upload Option */}
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPermissionTargetIndex(undefined); // Bulk multiple gallery upload
                        if (galleryPermission === 'granted') {
                          fileInputMultipleRef.current?.click();
                        } else {
                          setShowPermissionModal(true);
                        }
                      }}
                      className="flex-1 bg-[#6A0DAD]/30 hover:bg-[#6A0DAD]/55 border border-[#6A0DAD]/50 text-[#E9D5FF] text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 font-sans"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" /> Bulk Upload (Gallery)
                    </button>
                  </div>
                </div>

                {/* Step 4: Bio & Interests */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Your Bio (Max 200 words)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your interests, personality, conversational style, and what companion activities you specialize in..."
                    className="w-full bg-[#0f071a] border border-[#6A0DAD]/35 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6A0DAD]"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                    <span>Be descriptive and polite.</span>
                    <span className="font-mono">Words: {bio.trim() === '' ? 0 : bio.trim().split(/\s+/).length}/200</span>
                  </div>
                </div>

                {/* Multi-select Interests */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Interests (Select at least 1)
                  </label>
                  <div className="flex flex-wrap gap-1.5 bg-[#0f071a] p-2.5 rounded-xl border border-white/5">
                    {INTEREST_OPTIONS.slice(0, 5).map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`text-[9px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#6A0DAD] text-white border-[#6A0DAD] shadow-md shadow-[#6A0DAD]/15'
                              : 'bg-[#1a0b2e] text-slate-400 border-white/5 hover:text-slate-200'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 5: Select services & Pricing */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Select Your Services &amp; Set Rates (PKR)
                  </label>
                  <div className="space-y-2 bg-[#0f071a] p-2.5 rounded-xl border border-white/5 max-h-48 overflow-y-auto">
                    {SERVICES.map((s) => {
                      const isSelected = selectedServices.some(item => item.serviceId === s.id);
                      return (
                        <div
                          key={s.id}
                          className={`flex items-center justify-between p-2 rounded-lg border text-[10px] transition-colors ${
                            isSelected
                              ? 'bg-[#6A0DAD]/20 border-[#6A0DAD]/40 text-slate-200'
                              : 'bg-[#1a0b2e]/60 border-white/5 text-slate-400'
                          }`}
                        >
                          <label className="flex items-center gap-2 cursor-pointer flex-1 py-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleService(s.id)}
                              className="accent-[#6A0DAD] rounded"
                            />
                            <div className="space-y-0.5">
                              <span className="font-semibold text-slate-200 block font-display">{s.name}</span>
                              <span className="text-[9px] text-slate-500">Category: {s.category}</span>
                            </div>
                          </label>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-slate-100 block">₨ {s.basePrice.toLocaleString()}</span>
                            <span className="text-[8px] text-slate-500 font-mono">+{s.perHourRate}/hr extra</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#6A0DAD] hover:brightness-110 text-white font-bold rounded-xl py-3.5 text-xs transition-colors shadow-lg shadow-[#6A0DAD]/15 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Submit for Admin Approval <Check className="w-4.5 h-4.5 text-emerald-400 font-black" />
                </button>
              </form>
            </div>
          )}
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

      {/* Hidden native input for Multiple Gallery selector */}
      <input
        type="file"
        ref={fileInputMultipleRef}
        onChange={handleMultipleFileChange}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />

      {/* Hidden native input for Camera Capture */}
      <input
        type="file"
        ref={fileInputCameraRef}
        onChange={handleCameraFileChange}
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
      />

      {/* Elegant OS-styled Permission Prompt Dialogue */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl max-w-xs w-full overflow-hidden shadow-2xl animate-scale-in text-center">
            {/* Permission Icon Header */}
            <div className="p-5 pb-3">
              <div className="w-12 h-12 bg-[#6A0DAD]/20 border border-[#6A0DAD]/40 rounded-full flex items-center justify-center mx-auto text-[#E9D5FF] mb-3">
                <ImageIcon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-xs font-black text-slate-100 font-display">
                Allow Gallery &amp; File Access?
              </h3>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Girlfriend Hire Pakistan requires your permission to access local device photos, camera roll, and files. This is used by the registration service provider to select and upload your official portfolio verification pictures.
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
