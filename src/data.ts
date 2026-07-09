// ============================================
// TYPES & INTERFACES
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
  discountedPrice: number;
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

export interface PaymentAccount {
  number: string;
  name: string;
  method: 'easypaisa' | 'jazzcash' | 'bank';
}

export interface DurationOption {
  label: string;
  value: number;
}

export interface PaymentMethodOption {
  id: string;
  name: string;
  icon: string;
}

export interface CityTier {
  tier1: string[];
  tier2: string[];
  tier3: string[];
}

// ============================================
// CITIES - ALL PAKISTAN (Complete Punjab Coverage + All Provinces)
// ============================================

export const CITIES: CityTier = {
  tier1: ['Lahore', 'Karachi', 'Islamabad'],
  tier2: [
    'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 
    'Peshawar', 'Quetta', 'Hyderabad', 'Sukkur'
  ],
  tier3: [
    // Punjab Complete
    'Sialkot', 'Bahawalpur', 'Sargodha', 'Gujrat', 
    'Sheikhupura', 'Jhelum', 'Murree', 'Sahiwal', 
    'Okara', 'Kasur', 'Rahim Yar Khan', 'Dera Ghazi Khan',
    'Chiniot', 'Wah Cantt', 'Taxila', 'Muridke', 
    'Kamoke', 'Burewala', 'Shakargarh', 'Sadiqabad',
    'Jaranwala', 'Chishtian', 'Ahmedpur East', 
    'Kot Addu', 'Daska', 'Wazirabad', 'Kamalia',
    'Arifwala', 'Mailsi', 'Gojra', 'Shujabad',
    'Fort Abbas', 'Chichawatni', 'Pattoki',
    'Renala Khurd', 'Sangla Hill', 'Kabirwala',
    'Dunyapur', 'Kahror Pakka', 'Mian Channu',
    'Hasilpur', 'Chunian', 'Bhalwal', 'Phalia',
    'Zafarwal', 'Shorkot', 'Jalalpur Jattan',
    'Kot Radha Kishan', 'Raiwind', 'Lahore Cantt',
    'Nankana Sahib', 'Jhang', 'Toba Tek Singh',
    'Attock', 'Chakwal', 'Hafizabad',
    'Mandi Bahauddin', 'Narowal', 'Khanewal',
    'Lodhran', 'Vehari', 'Bhakkar', 'Khushab',
    'Mianwali', 'Pakpattan', 'Rajanpur',
    'Layyah', 'Muzaffargarh', 'Taunsa', 'Bahawalnagar',
    // Sindh
    'Larkana', 'Nawabshah', 'Mirpur Khas',
    'Jacobabad', 'Shikarpur', 'Khairpur', 'Dadu',
    'Badin', 'Thatta', 'Umerkot', 'Tharparkar',
    'Tando Allahyar', 'Tando Adam', 'Kotri',
    'Rohri', 'Ghotki', 'Kashmore', 'Qambar',
    'Sanghar', 'Matiari', 'Jamshoro',
    // KPK
    'Mardan', 'Abbottabad', 'Swat', 'Kohat',
    'Dera Ismail Khan', 'Bannu', 'Mansehra',
    'Nowshera', 'Charsadda', 'Swabi', 'Haripur',
    'Battagram', 'Buner', 'Malakand', 'Lower Dir',
    'Upper Dir', 'Shangla', 'Karak', 'Lakki Marwat',
    'Tank', 'Hangu',
    // Balochistan
    'Gwadar', 'Turbat', 'Khuzdar', 'Sibi',
    'Chaman', 'Zhob', 'Loralai', 'Hub',
    'Dera Murad Jamali', 'Nasirabad', 'Kalat',
    'Mastung', 'Nushki', 'Panjgur', 'Kharan',
    // Gilgit-Baltistan
    'Gilgit', 'Skardu', 'Hunza', 'Chilas',
    // Azad Kashmir
    'Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot',
    'Bagh', 'Bhimber',
    // Tourist Areas
    'Nathia Gali', 'Bhurban', 'Naran', 'Kaghan',
    'Swat Valley', 'Hunza Valley', 'Skardu Valley',
    'Neelum Valley', 'Thandiani', 'Kalam'
  ]
};

// Flat list for dropdowns
export const FLAT_CITIES: string[] = [
  ...CITIES.tier1,
  ...CITIES.tier2,
  ...CITIES.tier3
];

// ============================================
// SERVICES - 18 SERVICES WITH 50% DISCOUNT
// ============================================

export const SERVICES: ServiceItem[] = [
  // ========== BASIC TIER ==========
  {
    id: 'coffee-date',
    name: 'Coffee/Meal Date',
    category: 'Basic',
    basePrice: 1999,
    perHourRate: 500,
    description: 'A relaxed meeting over coffee or a light meal at your favorite local cafe. Perfect for first-time introductions in a comfortable setting.',
    icon: 'Coffee',
    tags: ['Social', 'Casual', 'Introductory', 'Food'],
    discountPercent: 50,
    discountedPrice: 999
  },
  {
    id: 'shopping-comp',
    name: 'Shopping Companion',
    category: 'Basic',
    basePrice: 3999,
    perHourRate: 800,
    description: 'Get an honest opinion and a helping hand while you shop at malls or local bazaars. Great for fashion advice and gift shopping.',
    icon: 'ShoppingBag',
    tags: ['Shopping', 'Advice', 'Social', 'Fashion'],
    discountPercent: 50,
    discountedPrice: 1999
  },
  {
    id: 'movie-hangout',
    name: 'Movie/Cafe Hangout',
    category: 'Basic',
    basePrice: 1999,
    perHourRate: 600,
    description: 'Catch the latest cinema release or lounge at a trendy cafe with great company. Relax and enjoy entertainment together.',
    icon: 'Film',
    tags: ['Entertainment', 'Casual', 'Relaxing'],
    discountPercent: 50,
    discountedPrice: 999
  },
  {
    id: 'virtual-comp',
    name: 'Virtual Companion',
    category: 'Basic',
    basePrice: 2999,
    perHourRate: 1000,
    description: 'Online interaction, video calls, or chat sessions for meaningful conversation from anywhere in the world. Perfect for long-distance connection.',
    icon: 'Video',
    tags: ['Online', 'Global', 'Chat', 'Remote'],
    discountPercent: 50,
    discountedPrice: 1499
  },
  {
    id: 'lang-practice',
    name: 'Language Practice',
    category: 'Basic',
    basePrice: 1499,
    perHourRate: 400,
    description: 'Improve your Urdu, Punjabi, or English through casual conversation with a native speaker. Learn while having fun!',
    icon: 'Languages',
    tags: ['Learning', 'Communication', 'Education'],
    discountPercent: 50,
    discountedPrice: 749
  },

  // ========== STANDARD TIER ==========
  {
    id: 'dinner-date',
    name: 'Dinner Date',
    category: 'Standard',
    basePrice: 7999,
    perHourRate: 1500,
    description: 'An elegant evening dinner experience at a fine-dining restaurant. Dress up and enjoy a sophisticated night out with charming company.',
    icon: 'Utensils',
    tags: ['Formal', 'Dining', 'Evening', 'Romantic'],
    discountPercent: 50,
    discountedPrice: 3999
  },
  {
    id: 'event-comp',
    name: 'Event Companion',
    category: 'Standard',
    basePrice: 9999,
    perHourRate: 2000,
    description: 'Perfect for weddings, corporate gatherings, or parties where you need a plus-one. Make a great impression with sophisticated company.',
    icon: 'Ticket',
    tags: ['Events', 'Weddings', 'Social', 'Parties'],
    discountPercent: 50,
    discountedPrice: 4999
  },
  {
    id: 'pro-plus-one',
    name: 'Professional +1',
    category: 'Standard',
    basePrice: 11999,
    perHourRate: 2500,
    description: 'Sophisticated company for business dinners, networking events, or professional galas. Elevate your professional image.',
    icon: 'Briefcase',
    tags: ['Professional', 'Corporate', 'Formal', 'Business'],
    discountPercent: 50,
    discountedPrice: 5999
  },
  {
    id: 'cultural-fest',
    name: 'Cultural/Festival',
    category: 'Standard',
    basePrice: 7999,
    perHourRate: 1200,
    description: 'Explore local festivals, Basant, or cultural exhibits with a knowledgeable local. Experience Pakistani culture authentically.',
    icon: 'Map',
    tags: ['Culture', 'Outdoor', 'Traditional', 'Festival'],
    discountPercent: 50,
    discountedPrice: 3999
  },
  {
    id: 'hobby-partner',
    name: 'Hobby Partner',
    category: 'Standard',
    basePrice: 5999,
    perHourRate: 1000,
    description: 'Enjoy activities like gym sessions, tennis, gaming, or art with a dedicated partner. Share your passions with someone who cares.',
    icon: 'Gamepad',
    tags: ['Activities', 'Fitness', 'Fun', 'Sports'],
    discountPercent: 50,
    discountedPrice: 2999
  },

  // ========== PREMIUM TIER ==========
  {
    id: 'full-day-comp',
    name: 'Full Day Companion',
    category: 'Premium',
    basePrice: 14999,
    perHourRate: 1800,
    description: 'Complete day-long company for errands, sightseeing, and social engagements. Up to 8 hours of dedicated attention and companionship.',
    icon: 'Sun',
    tags: ['Daily', 'Comprehensive', 'Full Access', 'All Day'],
    discountPercent: 50,
    discountedPrice: 7499
  },
  {
    id: 'travel-comp',
    name: 'Travel Companion',
    category: 'Premium',
    basePrice: 17999,
    perHourRate: 3000,
    description: 'Company for inter-city travel or weekend trips across Pakistan. Explore new places with a friendly and knowledgeable companion.',
    icon: 'Plane',
    tags: ['Travel', 'Adventure', 'Long Distance', 'Exploring'],
    discountPercent: 50,
    discountedPrice: 8999
  },
  {
    id: 'travel-guide',
    name: 'Travel Guide',
    category: 'Premium',
    basePrice: 8999,
    perHourRate: 1500,
    description: 'An expert companion to show you the hidden gems and historic sites of your city. Discover secrets only locals know.',
    icon: 'Compass',
    tags: ['Tourism', 'Local Expert', 'History', 'Sightseeing'],
    discountPercent: 50,
    discountedPrice: 4499
  },
  {
    id: 'emotional-support',
    name: 'Emotional Support',
    category: 'Premium',
    basePrice: 5999,
    perHourRate: 2000,
    description: 'A compassionate listener for when you need to talk, vent, or find comfort in company. Judgment-free emotional support.',
    icon: 'Heart',
    tags: ['Empathy', 'Wellness', 'Private', 'Care'],
    discountPercent: 50,
    discountedPrice: 2999
  },

  // ========== EXCLUSIVE TIER ==========
  {
    id: 'romantic-night',
    name: 'Romantic Night',
    category: 'Exclusive',
    basePrice: 24999,
    perHourRate: 5000,
    description: 'A premium, curated romantic experience for special occasions and deep connection. Create unforgettable memories together.',
    icon: 'Moon',
    tags: ['Luxury', 'Exclusive', 'Romantic', 'Special'],
    discountPercent: 50,
    discountedPrice: 12499
  },
  {
    id: 'weekend-comp',
    name: 'Weekend Companion',
    category: 'Exclusive',
    basePrice: 34999,
    perHourRate: 4000,
    description: 'Dedicated company for an entire weekend of activities, relaxation, and bonding. The ultimate getaway experience.',
    icon: 'CalendarDays',
    tags: ['Weekend', 'Premium', 'Immersion', 'Getaway'],
    discountPercent: 50,
    discountedPrice: 17499
  },
  {
    id: 'vacation-comp',
    name: 'Vacation Companion',
    category: 'Exclusive',
    basePrice: 29999,
    perHourRate: 4500,
    description: 'The ultimate travel partner for vacations to northern areas or abroad. Experience your dream holiday with perfect company.',
    icon: 'Palmtree',
    tags: ['Holiday', 'VIP', 'Global', 'Luxury'],
    discountPercent: 50,
    discountedPrice: 14999
  }
];

// ============================================
// PAYMENT ACCOUNTS (EasyPaisa - Manual Escrow)
// ============================================

export const PAYMENT_ACCOUNTS: PaymentAccount[] = [
  {
    number: '03173223559',
    name: 'Noman Khan',
    method: 'easypaisa'
  },
  {
    number: '03465119715',
    name: 'Majid Amin',
    method: 'easypaisa'
  }
];

// Support Till IDs
export const SUPPORT_TILL_IDS = [
  { tillId: '489312', name: 'Noman Khan', number: '03173223559' },
  { tillId: '489313', name: 'Majid Amin', number: '03465119715' }
];

// ============================================
// PROFILE OPTIONS
// ============================================

export const INTEREST_OPTIONS: string[] = [
  'Reading', 'Travel', 'Music', 'Fitness', 'Cooking',
  'Gaming', 'Movies', 'Photography', 'Art', 'Tech',
  'Dancing', 'Sports', 'Fashion', 'Nature', 'Business',
  'Poetry', 'History', 'Cars', 'Pets', 'Yoga'
];

export const GENDER_OPTIONS: string[] = ['Male', 'Female', 'Non-binary', 'Other'];

export const AGE_RANGES: string[] = ['18-22', '23-27', '28-35', '35-45', '45+'];

export const LANGUAGES: string[] = [
  'Urdu', 'English', 'Punjabi', 'Pashto', 
  'Sindhi', 'Saraiki', 'Balochi', 'Hindko'
];

// ============================================
// STATUS CONSTANTS
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
  CANCELLED: 'Cancelled',
  IN_PROGRESS: 'In Progress'
};

export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  PENDING_VERIFICATION: 'Pending Verification',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
  REFUNDED: 'Refunded'
};

// ============================================
// BOOKING OPTIONS
// ============================================

export const DURATIONS: DurationOption[] = [
  { label: '1 Hour', value: 1 },
  { label: '2 Hours', value: 2 },
  { label: '3 Hours', value: 3 },
  { label: '4 Hours', value: 4 },
  { label: '5 Hours', value: 5 },
  { label: '6 Hours', value: 6 },
  { label: '8 Hours (Full Day)', value: 8 },
  { label: '12 Hours', value: 12 },
  { label: '24 Hours', value: 24 },
  { label: 'Weekend (48h)', value: 48 }
];

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'easypaisa', name: 'EasyPaisa', icon: 'Wallet' },
  { id: 'jazzcash', name: 'JazzCash', icon: 'Smartphone' },
  { id: 'bank', name: 'Bank Transfer', icon: 'Building' }
];

// ============================================
// SEED COMPANIONS (Sample Data)
// ============================================

export const SEED_COMPANIONS: Companion[] = [
  {
    id: 'comp-1',
    name: 'Aisha Malik',
    age: 24,
    gender: 'Female',
    city: 'Lahore',
    bio: 'Experienced social companion for dinner dates, cultural events, and professional networking. I enjoy meaningful conversations about art, tech, and literature. Fluent in Urdu and English.',
    interests: ['Art', 'Tech', 'Music', 'Reading'],
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
      { 
        id: 'rev-1', 
        reviewerName: 'Usman K.', 
        rating: 5, 
        comment: 'Very professional and great conversation. Highly recommended!', 
        date: '2026-06-15' 
      }
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
    bio: 'Vibrant and outgoing companion for shopping trips, cafe hangouts, and cinema outings. I love exploring Karachi\'s food scene and know all the best spots!',
    interests: ['Fashion', 'Movies', 'Nature', 'Cooking'],
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
      { 
        id: 'rev-2', 
        reviewerName: 'Farhan M.', 
        rating: 4, 
        comment: 'Had a fun time shopping! Great fashion sense.', 
        date: '2026-06-20' 
      }
    ],
    status: 'Approved',
    isVerified: true
  },
  {
    id: 'comp-3',
    name: 'Sana Rafiq',
    age: 26,
    gender: 'Female',
    city: 'Islamabad',
    bio: 'Well-educated companion for professional events and intellectual discussions. Background in business and fluent in three languages.',
    interests: ['Business', 'Travel', 'Tech', 'Fitness'],
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=60'
    ],
    services: [
      { serviceId: 'pro-plus-one' },
      { serviceId: 'dinner-date' },
      { serviceId: 'lang-practice' }
    ],
    rating: 4.8,
    reviews: [
      { 
        id: 'rev-3', 
        reviewerName: 'Ali R.', 
        rating: 5, 
        comment: 'Perfect for business dinners. Very professional.', 
        date: '2026-06-25' 
      }
    ],
    status: 'Approved',
    isVerified: true
  }
];

// ============================================
// DISCOUNT CONFIGURATION
// ============================================

export const DISCOUNT_CONFIG = {
  enabled: true,
  discountPercent: 50,
  description: '50% OFF on all services!',
  badgeText: '50% OFF',
  firstTimeOnly: false, // Set to true if you want 50% only for first booking
  minimumOrderValue: 0,
  maximumDiscountAmount: 0 // 0 means no limit
};

// ============================================
// APP CONFIGURATION
// ============================================

export const APP_CONFIG = {
  name: 'Companion Connect Pakistan',
  currency: 'PKR',
  currencySymbol: '₨',
  country: 'Pakistan',
  supportPhone: '03173223559',
  supportEmail: 'support@companionconnect.pk',
  maxBookingHours: 48,
  minBookingHours: 1,
  cancellationHoursBefore: 24
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate total price for a service with hours and discount
 */
export function calculatePrice(serviceId: string, hours: number = 1, isFirstTime: boolean = false): number {
  const service = getServiceById(serviceId);
  if (!service) return 0;
  
  const totalBase = service.basePrice + (service.perHourRate * Math.max(0, hours - 1));
  
  // Apply 50% discount
  if (DISCOUNT_CONFIG.enabled) {
    // If firstTimeOnly is true, only apply for first booking
    if (!DISCOUNT_CONFIG.firstTimeOnly || isFirstTime) {
      return Math.round(totalBase * 0.5); // 50% off
    }
  }
  
  return totalBase;
}

/**
 * Calculate original price without discount
 */
export function calculateOriginalPrice(serviceId: string, hours: number = 1): number {
  const service = getServiceById(serviceId);
  if (!service) return 0;
  
  return service.basePrice + (service.perHourRate * Math.max(0, hours - 1));
}

/**
 * Get discount amount
 */
export function getDiscountAmount(serviceId: string, hours: number = 1): number {
  const original = calculateOriginalPrice(serviceId, hours);
  const discounted = calculatePrice(serviceId, hours, true);
  return original - discounted;
}

/**
 * Get service by ID
 */
export function getServiceById(serviceId: string): ServiceItem | undefined {
  return SERVICES.find(s => s.id === serviceId);
}

/**
 * Get services by category
 */
export function getServicesByCategory(category: string): ServiceItem[] {
  return SERVICES.filter(s => s.category === category);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(SERVICES.map(s => s.category)));
}

/**
 * Get discounted price (static amount)
 */
export function getDiscountedPrice(basePrice: number, discountPercent: number = 50): number {
  return Math.round(basePrice * ((100 - discountPercent) / 100));
}

/**
 * Get discount amount from base price
 */
export function getDiscountAmountFromBase(basePrice: number, discountPercent: number = 50): number {
  return Math.round(basePrice * (discountPercent / 100));
}

/**
 * Format price with currency
 */
export function formatPrice(price: number): string {
  return `${APP_CONFIG.currencySymbol} ${price.toLocaleString('en-PK')}`;
}

/**
 * Get random payment account for manual escrow
 */
export function getRandomPaymentAccount(): PaymentAccount {
  const randomIndex = Math.floor(Math.random() * PAYMENT_ACCOUNTS.length);
  return PAYMENT_ACCOUNTS[randomIndex];
}

/**
 * Check if service is available in city
 */
export function isServiceAvailableInCity(serviceId: string, city: string): boolean {
  // Add logic here if certain services are city-restricted
  return true;
}

/**
 * Get service tags as formatted string
 */
export function getServiceTagsString(serviceId: string): string {
  const service = getServiceById(serviceId);
  if (!service) return '';
  return service.tags.join(', ');
}

/**
 * Validate booking hours
 */
export function validateBookingHours(hours: number): { valid: boolean; message?: string } {
  if (hours < APP_CONFIG.minBookingHours) {
    return { valid: false, message: `Minimum booking is ${APP_CONFIG.minBookingHours} hour` };
  }
  if (hours > APP_CONFIG.maxBookingHours) {
    return { valid: false, message: `Maximum booking is ${APP_CONFIG.maxBookingHours} hours` };
  }
  return { valid: true };
}

/**
 * Get category color/theme
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Basic': '#4CAF50',
    'Standard': '#2196F3',
    'Premium': '#9C27B0',
    'Exclusive': '#FF9800'
  };
  return colors[category] || '#757575';
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Basic': 'Star',
    'Standard': 'Award',
    'Premium': 'Crown',
    'Exclusive': 'Diamond'
  };
  return icons[category] || 'Circle';
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  CITIES,
  FLAT_CITIES,
  SERVICES,
  PAYMENT_ACCOUNTS,
  SUPPORT_TILL_IDS,
  INTEREST_OPTIONS,
  GENDER_OPTIONS,
  AGE_RANGES,
  LANGUAGES,
  VERIFICATION_STATUS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  DURATIONS,
  PAYMENT_METHODS,
  SEED_COMPANIONS,
  DISCOUNT_CONFIG,
  APP_CONFIG,
  calculatePrice,
  calculateOriginalPrice,
  getDiscountAmount,
  getServiceById,
  getServicesByCategory,
  getAllCategories,
  getDiscountedPrice,
  getDiscountAmountFromBase,
  formatPrice,
  getRandomPaymentAccount,
  isServiceAvailableInCity,
  getServiceTagsString,
  validateBookingHours,
  getCategoryColor,
  getCategoryIcon
};
