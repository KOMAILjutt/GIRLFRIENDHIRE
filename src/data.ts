// ============================================
// TYPES (inline to avoid missing imports)
// ============================================

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  perHourRate: number;
  description: string;
  icon: string;
  tags: string[];
  discountPercent: number;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CompanionService {
  serviceId: string;
}

export interface Companion {
  id: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  bio: string;
  interests: string[];
  photos: string[];
  services: CompanionService[];
  rating: number;
  reviews: Review[];
  status: string;
  isVerified: boolean;
}

// ============================================
// CITIES - FLAT ARRAY (for BrowsePage.tsx compatibility)
// ============================================

export const CITIES = [
  // Punjab - Major
  'Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Multan', 'Sialkot',
  'Bahawalpur', 'Sargodha', 'Gujrat', 'Sheikhupura', 'Jhelum', 'Murree',
  'Sahiwal', 'Okara', 'Kasur', 'Rahim Yar Khan', 'Dera Ghazi Khan',
  'Chiniot', 'Wah Cantt', 'Taxila', 'Muridke', 'Kamoke', 'Burewala',
  'Shakargarh', 'Sadiqabad', 'Jaranwala', 'Chishtian', 'Ahmedpur East',
  'Kot Addu', 'Daska', 'Wazirabad', 'Kamalia', 'Arifwala', 'Mailsi',
  'Gojra', 'Shujabad', 'Fort Abbas', 'Chichawatni', 'Pattoki',
  'Renala Khurd', 'Sangla Hill', 'Kabirwala', 'Dunyapur',
  'Kahror Pakka', 'Mian Channu', 'Hasilpur', 'Chunian', 'Bhalwal',
  'Phalia', 'Zafarwal', 'Shorkot', 'Jalalpur Jattan',
  'Kot Radha Kishan', 'Raiwind', 'Lahore Cantt', 'Kasur', 'Nankana Sahib',
  'Jhang', 'Toba Tek Singh', 'Attock', 'Chakwal', 'Hafizabad',
  'Mandi Bahauddin', 'Narowal', 'Khanewal', 'Lodhran', 'Vehari',
  'Bhakkar', 'Khushab', 'Mianwali', 'Pakpattan', 'Rajanpur',
  'Layyah', 'Muzaffargarh', 'Taunsa', 'Bahawalnagar',
  
  // Sindh
  'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah',
  'Mirpur Khas', 'Jacobabad', 'Shikarpur', 'Khairpur', 'Dadu',
  'Badin', 'Thatta', 'Umerkot', 'Tharparkar', 'Tando Allahyar',
  'Tando Adam', 'Kotri', 'Rohri', 'Ghotki', 'Kashmore',
  'Qambar', 'Sanghar', 'Matiari', 'Jamshoro',
  
  // KPK
  'Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat',
  'Dera Ismail Khan', 'Bannu', 'Mansehra', 'Nowshera',
  'Charsadda', 'Swabi', 'Haripur', 'Battagram', 'Buner',
  'Malakand', 'Lower Dir', 'Upper Dir', 'Shangla', 'Karak',
  'Lakki Marwat', 'Tank', 'Hangu',
  
  // Balochistan
  'Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi',
  'Chaman', 'Zhob', 'Loralai', 'Hub', 'Dera Murad Jamali',
  'Nasirabad', 'Kalat', 'Mastung', 'Nushki', 'Panjgur', 'Kharan',
  
  // Gilgit-Baltistan
  'Gilgit', 'Skardu', 'Hunza', 'Chilas',
  
  // Azad Kashmir
  'Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot',
  'Bagh', 'Bhimber',
  
  // Islamabad
  'Islamabad',
  
  // Tourist Areas
  'Murree', 'Nathia Gali', 'Bhurban', 'Naran', 'Kaghan',
  'Swat Valley', 'Hunza Valley', 'Skardu Valley',
  'Neelum Valley', 'Thandiani', 'Kalam'
];

// ============================================
// SERVICES - 18 SERVICES WITH NEW PRICES (20% FIRST-TIME DISCOUNT)
// ============================================

export const SERVICES: ServiceItem[] = [
  // --- BASIC TIER ---
  {
    id: 'coffee-date',
    name: 'Coffee/Meal Date',
    category: 'Basic',
    basePrice: 1999,
    perHourRate: 500,
    description: 'A relaxed meeting over coffee or a light meal at your favorite local cafe.',
    icon: 'Coffee',
    tags: ['Social', 'Casual', 'Introductory'],
    discountPercent: 20
  },
  {
    id: 'shopping-comp',
    name: 'Shopping Companion',
    category: 'Basic',
    basePrice: 3999,
    perHourRate: 800,
    description: 'Get an honest opinion and a helping hand while you shop at the mall or local bazaars.',
    icon: 'ShoppingBag',
    tags: ['Shopping', 'Advice', 'Social'],
    discountPercent: 20
  },
  {
    id: 'movie-hangout',
    name: 'Movie/Cafe Hangout',
    category: 'Basic',
    basePrice: 1999,
    perHourRate: 600,
    description: 'Catch the latest cinema release or lounge at a trendy cafe with great company.',
    icon: 'Film',
    tags: ['Entertainment', 'Casual'],
    discountPercent: 20
  },
  {
    id: 'virtual-comp',
    name: 'Virtual Companion',
    category: 'Basic',
    basePrice: 2999,
    perHourRate: 1000,
    description: 'Online interaction, video calls, or chat sessions for meaningful conversation from anywhere.',
    icon: 'Video',
    tags: ['Online', 'Global', 'Chat'],
    discountPercent: 20
  },
  {
    id: 'lang-practice',
    name: 'Language Practice',
    category: 'Basic',
    basePrice: 1499,
    perHourRate: 400,
    description: 'Improve your Urdu, Punjabi, or English through casual conversation with a native speaker.',
    icon: 'Languages',
    tags: ['Learning', 'Communication'],
    discountPercent: 20
  },

  // --- STANDARD TIER ---
  {
    id: 'dinner-date',
    name: 'Dinner Date',
    category: 'Standard',
    basePrice: 7999,
    perHourRate: 1500,
    description: 'An elegant evening dinner experience at a fine-dining restaurant.',
    icon: 'Utensils',
    tags: ['Formal', 'Dining', 'Evening'],
    discountPercent: 20
  },
  {
    id: 'event-comp',
    name: 'Event Companion',
    category: 'Standard',
    basePrice: 9999,
    perHourRate: 2000,
    description: 'Perfect for weddings, corporate gatherings, or parties where you need a plus-one.',
    icon: 'Ticket',
    tags: ['Events', 'Weddings', 'Social'],
    discountPercent: 20
  },
  {
    id: 'pro-plus-one',
    name: 'Professional +1',
    category: 'Standard',
    basePrice: 11999,
    perHourRate: 2500,
    description: 'Sophisticated company for business dinners, networking events, or professional galas.',
    icon: 'Briefcase',
    tags: ['Professional', 'Corporate', 'Formal'],
    discountPercent: 20
  },
  {
    id: 'cultural-fest',
    name: 'Cultural/Festival',
    category: 'Standard',
    basePrice: 7999,
    perHourRate: 1200,
    description: 'Explore local festivals, Basant, or cultural exhibits with a knowledgeable local.',
    icon: 'Map',
    tags: ['Culture', 'Outdoor', 'Traditional'],
    discountPercent: 20
  },
  {
    id: 'hobby-partner',
    name: 'Hobby Partner',
    category: 'Standard',
    basePrice: 5999,
    perHourRate: 1000,
    description: 'Enjoy activities like gym sessions, tennis, or gaming with a dedicated partner.',
    icon: 'Gamepad',
    tags: ['Activities', 'Fitness', 'Fun'],
    discountPercent: 20
  },

  // --- PREMIUM TIER ---
  {
    id: 'full-day-comp',
    name: 'Full Day Companion',
    category: 'Premium',
    basePrice: 14999,
    perHourRate: 1800,
    description: 'Complete day-long company for errands, sightseeing, and social engagements (up to 8 hours).',
    icon: 'Sun',
    tags: ['Daily', 'Comprehensive', 'Full Access'],
    discountPercent: 20
  },
  {
    id: 'travel-comp',
    name: 'Travel Companion',
    category: 'Premium',
    basePrice: 17999,
    perHourRate: 3000,
    description: 'Company for inter-city travel or weekend trips across Pakistan.',
    icon: 'Plane',
    tags: ['Travel', 'Adventure', 'Long Distance'],
    discountPercent: 20
  },
  {
    id: 'travel-guide',
    name: 'Travel Guide',
    category: 'Premium',
    basePrice: 8999,
    perHourRate: 1500,
    description: 'An expert companion to show you the hidden gems and historic sites of your city.',
    icon: 'Compass',
    tags: ['Tourism', 'Local Expert', 'History'],
    discountPercent: 20
  },
  {
    id: 'emotional-support',
    name: 'Emotional Support',
    category: 'Premium',
    basePrice: 5999,
    perHourRate: 2000,
    description: 'A compassionate listener for when you need to talk, vent, or find comfort in company.',
    icon: 'Heart',
    tags: ['Empathy', 'Wellness', 'Private'],
    discountPercent: 20
  },

  // --- EXCLUSIVE TIER ---
  {
    id: 'romantic-night',
    name: 'Romantic Night',
    category: 'Exclusive',
    basePrice: 24999,
    perHourRate: 5000,
    description: 'A premium, curated romantic experience for special occasions and deep connection.',
    icon: 'Moon',
    tags: ['Luxury', 'Exclusive', 'Romantic'],
    discountPercent: 20
  },
  {
    id: 'weekend-comp',
    name: 'Weekend Companion',
    category: 'Exclusive',
    basePrice: 34999,
    perHourRate: 4000,
    description: 'Dedicated company for an entire weekend of activities, relaxation, and bonding.',
    icon: 'CalendarDays',
    tags: ['Weekend', 'Premium', 'Immersion'],
    discountPercent: 20
  },
  {
    id: 'vacation-comp',
    name: 'Vacation Companion',
    category: 'Exclusive',
    basePrice: 29999,
    perHourRate: 4500,
    description: 'The ultimate travel partner for vacations to northern areas or abroad.',
    icon: 'Palmtree',
    tags: ['Holiday', 'VIP', 'Global'],
    discountPercent: 20
  }
];

// ============================================
// PROFILE OPTIONS
// ============================================

export const INTEREST_OPTIONS = [
  'Reading', 'Travel', 'Music', 'Fitness', 'Cooking',
  'Gaming', 'Movies', 'Photography', 'Art', 'Tech',
  'Dancing', 'Sports', 'Fashion', 'Nature', 'Business'
];

export const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Other'];

export const AGE_RANGES = ['18-22', '23-27', '28-35', '35-45', '45+'];

export const LANGUAGES = ['Urdu', 'English', 'Punjabi', 'Pashto', 'Sindhi', 'Saraiki', 'Balochi'];

// ============================================
// STATUS CONSTANTS (as strings for compatibility)
// ============================================

export const VERIFICATION_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

// ============================================
// BOOKING OPTIONS
// ============================================

export const DURATIONS = [
  { label: '1 Hour', value: 1 },
  { label: '2 Hours', value: 2 },
  { label: '3 Hours', value: 3 },
  { label: '4 Hours', value: 4 },
  { label: '6 Hours', value: 6 },
  { label: '8 Hours (Full Day)', value: 8 },
  { label: 'Weekend (48h)', value: 48 }
];

export const PAYMENT_METHODS = [
  { id: 'easypaisa', name: 'EasyPaisa', icon: 'Wallet' },
  { id: 'jazzcash', name: 'JazzCash', icon: 'Smartphone' },
  { id: 'bank', name: 'Bank Transfer', icon: 'Building' }
];

// ============================================
// SEED COMPANIONS
// ============================================

export const SEED_COMPANIONS: Companion[] = [
  {
    id: 'comp-1',
    name: 'Aisha Malik',
    age: 24,
    gender: 'Female',
    city: 'Lahore',
    bio: 'Experienced social companion for dinner dates, cultural events, and professional networking. I enjoy meaningful conversations about art, tech, and literature.',
    interests: ['Art', 'Tech', 'Music'],
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=800&auto=format&fit=crop&q=60'
    ],
    services: [
      { serviceId: 'dinner-date' },
      { serviceId: 'pro-plus-one' },
      { serviceId: 'event-comp' }
    ],
    rating: 4.9,
    reviews: [
      { id: 'rev-1', reviewerName: 'Usman K.', rating: 5, comment: 'Very professional and great conversation.', date: '2026-06-15' }
    ],
    status: 'Approved',
    isVerified: true
  },
  {
    id: 'comp-2',
    name: 'Zainab Ahmed',
    age: 22,
    gender: 'Female',
    city: 'Karachi',
    bio: 'Vibrant and outgoing companion for shopping trips, cafe hangouts, and cinema outings. I love exploring Karachi\'s food scene!',
    interests: ['Fashion', 'Movies', 'Nature'],
    photos: [
      'https://images.unsplash.com/photo-1503104834685-7205e8607eb9?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=60'
    ],
    services: [
      { serviceId: 'shopping-comp' },
      { serviceId: 'movie-hangout' },
      { serviceId: 'coffee-date' }
    ],
    rating: 4.7,
    reviews: [
      { id: 'rev-2', reviewerName: 'Farhan M.', rating: 4, comment: 'Had a fun time shopping!', date: '2026-06-20' }
    ],
    status: 'Approved',
    isVerified: true
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const calculatePrice = (serviceId: string, hours: number = 1, isFirstTime: boolean = false): number => {
  const service = getServiceById(serviceId);
  if (!service) return 0;
  
  const totalBase = service.basePrice + (service.perHourRate * (hours - 1 > 0 ? hours - 1 : 0));
  
  if (isFirstTime) {
    return Math.round(totalBase * 0.8); // 20% first-time discount
  }
  
  return totalBase;
};

export const getServiceById = (serviceId: string): ServiceItem | undefined => {
  return SERVICES.find(s => s.id === serviceId);
};

export const getServicesByCategory = (category: string): ServiceItem[] => {
  return SERVICES.filter(s => s.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(SERVICES.map(s => s.category)));
};

export const getDiscountedPrice = (basePrice: number, isFirstTime: boolean): number => {
  return isFirstTime ? Math.round(basePrice * 0.8) : basePrice;
};

export const getFirstTimeDiscountAmount = (basePrice: number): number => {
  return Math.round(basePrice * 0.2);
};
