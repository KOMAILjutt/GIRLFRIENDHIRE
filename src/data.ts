// ============================================
// CITIES - ALL PAKISTAN (Complete Punjab Coverage)
// ============================================

export const CITIES = [
  // ========== PUNJAB (Complete Coverage) ==========
  'Lahore',
  'Faisalabad',
  'Rawalpindi',
  'Gujranwala',
  'Multan',
  'Sialkot',
  'Lahore Cantt',
  'Kasur',
  'Sheikhupura',
  'Nankana Sahib',
  'Jhang',
  'Toba Tek Singh',
  'Chiniot',
  'Attock',
  'Jhelum',
  'Chakwal',
  'Gujrat',
  'Hafizabad',
  'Mandi Bahauddin',
  'Narowal',
  'Khanewal',
  'Lodhran',
  'Vehari',
  'Sargodha',
  'Bhakkar',
  'Khushab',
  'Mianwali',
  'Sahiwal',
  'Okara',
  'Pakpattan',
  'Dera Ghazi Khan',
  'Rajanpur',
  'Layyah',
  'Muzaffargarh',
  'Taunsa',
  'Bahawalpur',
  'Bahawalnagar',
  'Rahim Yar Khan',
  'Wah Cantt',
  'Taxila',
  'Muridke',
  'Kamoke',
  'Burewala',
  'Shakargarh',
  'Sadiqabad',
  'Jaranwala',
  'Chishtian',
  'Ahmedpur East',
  'Kot Addu',
  'Daska',
  'Wazirabad',
  'Kamalia',
  'Arifwala',
  'Mailsi',
  'Gojra',
  'Shujabad',
  'Fort Abbas',
  'Chichawatni',
  'Pattoki',
  'Renala Khurd',
  'Sangla Hill',
  'Kabirwala',
  'Dunyapur',
  'Kahror Pakka',
  'Mian Channu',
  'Hasilpur',
  'Chunian',
  'Bhalwal',
  'Phalia',
  'Zafarwal',
  'Shorkot',
  'Jalalpur Jattan',
  'Kot Radha Kishan',
  'Raiwind',

  // ========== SINDH ==========
  'Karachi',
  'Hyderabad',
  'Sukkur',
  'Larkana',
  'Nawabshah',
  'Mirpur Khas',
  'Jacobabad',
  'Shikarpur',
  'Khairpur',
  'Dadu',
  'Badin',
  'Thatta',
  'Umerkot',
  'Tharparkar',
  'Tando Allahyar',
  'Tando Adam',
  'Kotri',
  'Rohri',
  'Ghotki',
  'Kashmore',
  'Qambar',
  'Sanghar',
  'Matiari',
  'Jamshoro',

  // ========== KPK ==========
  'Peshawar',
  'Mardan',
  'Abbottabad',
  'Swat',
  'Kohat',
  'Dera Ismail Khan',
  'Bannu',
  'Mansehra',
  'Nowshera',
  'Charsadda',
  'Swabi',
  'Haripur',
  'Battagram',
  'Buner',
  'Malakand',
  'Lower Dir',
  'Upper Dir',
  'Shangla',
  'Karak',
  'Lakki Marwat',
  'Tank',
  'Hangu',

  // ========== BALOCHISTAN ==========
  'Quetta',
  'Gwadar',
  'Turbat',
  'Khuzdar',
  'Sibi',
  'Chaman',
  'Zhob',
  'Loralai',
  'Hub',
  'Dera Murad Jamali',
  'Nasirabad',
  'Kalat',
  'Mastung',
  'Nushki',
  'Panjgur',
  'Kharan',

  // ========== GILGIT-BALTISTAN ==========
  'Gilgit',
  'Skardu',
  'Hunza',
  'Chilas',

  // ========== AZAD KASHMIR ==========
  'Muzaffarabad',
  'Mirpur',
  'Kotli',
  'Rawalakot',
  'Bagh',
  'Bhimber',

  // ========== ISLAMABAD ==========
  'Islamabad',

  // ========== TOURIST AREAS ==========
  'Murree',
  'Nathia Gali',
  'Bhurban',
  'Naran',
  'Kaghan',
  'Swat Valley',
  'Hunza Valley',
  'Skardu Valley',
  'Neelum Valley',
  'Thandiani',
  'Kalam'
];

// ============================================
// SERVICES - ALL TIERS WITH NEW PRICES (20% DISCOUNT FOR FIRST TIME ONLY)
// ============================================

export const SERVICES = [
  // ========== BASIC TIER ==========
  {
    id: 'coffee-meal-date',
    name: 'Coffee/Meal Date',
    category: 'Basic',
    basePrice: 1999,
    perHourRate: 299,
    description: 'Casual meetup over coffee or a meal',
    icon: 'Coffee',
    discountPercent: 20,
    discountedPrice: 1599,
    tags: ['casual', 'food', 'relaxed']
  },
  {
    id: 'shopping-companion',
    name: 'Shopping Companion',
    category: 'Basic',
    basePrice: 3999,
    perHourRate: 499,
    description: 'Shop together at malls or markets',
    icon: 'ShoppingBag',
    discountPercent: 20,
    discountedPrice: 3199,
    tags: ['shopping', 'fashion', 'lifestyle']
  },
  {
    id: 'movie-cafe-hangout',
    name: 'Movie/Cafe Hangout',
    category: 'Basic',
    basePrice: 1999,
    perHourRate: 299,
    description: 'Watch a movie or chill at a cafe',
    icon: 'Film',
    discountPercent: 20,
    discountedPrice: 1599,
    tags: ['entertainment', 'casual', 'fun']
  },
  {
    id: 'virtual-companion',
    name: 'Virtual Companion',
    category: 'Basic',
    basePrice: 2999,
    perHourRate: 399,
    description: 'Video calls, chats, online company',
    icon: 'Video',
    discountPercent: 20,
    discountedPrice: 2399,
    tags: ['online', 'virtual', 'remote']
  },
  {
    id: 'language-practice',
    name: 'Language Practice',
    category: 'Basic',
    basePrice: 1499,
    perHourRate: 249,
    description: 'Practice English, Urdu, or other languages',
    icon: 'Languages',
    discountPercent: 20,
    discountedPrice: 1199,
    tags: ['learning', 'education', 'practice']
  },

  // ========== STANDARD TIER ==========
  {
    id: 'dinner-date',
    name: 'Dinner Date',
    category: 'Standard',
    basePrice: 7999,
    perHourRate: 799,
    description: 'Fine dining experience together',
    icon: 'Utensils',
    discountPercent: 20,
    discountedPrice: 6399,
    tags: ['dining', 'romantic', 'elegant']
  },
  {
    id: 'event-companion',
    name: 'Event Companion',
    category: 'Standard',
    basePrice: 9999,
    perHourRate: 899,
    description: 'Attend weddings, parties, corporate events',
    icon: 'Calendar',
    discountPercent: 20,
    discountedPrice: 7999,
    tags: ['events', 'social', 'professional']
  },
  {
    id: 'professional-plus1',
    name: 'Professional +1',
    category: 'Standard',
    basePrice: 11999,
    perHourRate: 999,
    description: 'Impress at business meetings or dinners',
    icon: 'Briefcase',
    discountPercent: 20,
    discountedPrice: 9599,
    tags: ['business', 'corporate', 'impress']
  },
  {
    id: 'cultural-festival',
    name: 'Cultural/Festival',
    category: 'Standard',
    basePrice: 7999,
    perHourRate: 799,
    description: 'Experience festivals, concerts, cultural events',
    icon: 'Music',
    discountPercent: 20,
    discountedPrice: 6399,
    tags: ['culture', 'music', 'festivals']
  },
  {
    id: 'hobby-partner',
    name: 'Hobby Partner',
    category: 'Standard',
    basePrice: 5999,
    perHourRate: 599,
    description: 'Share hobbies: gaming, sports, art, etc.',
    icon: 'Gamepad2',
    discountPercent: 20,
    discountedPrice: 4799,
    tags: ['hobbies', 'fun', 'activities']
  },

  // ========== PREMIUM TIER ==========
  {
    id: 'full-day-companion',
    name: 'Full Day Companion',
    category: 'Premium',
    basePrice: 14999,
    perHourRate: 1199,
    description: 'A complete day together, 8+ hours',
    icon: 'Sun',
    discountPercent: 20,
    discountedPrice: 11999,
    tags: ['full-day', 'exclusive', 'premium']
  },
  {
    id: 'travel-companion',
    name: 'Travel Companion',
    category: 'Premium',
    basePrice: 17999,
    perHourRate: 1499,
    description: 'Travel together within Pakistan',
    icon: 'Plane',
    discountPercent: 20,
    discountedPrice: 14399,
    tags: ['travel', 'adventure', 'explore']
  },
  {
    id: 'travel-guide',
    name: 'Travel Guide',
    category: 'Premium',
    basePrice: 8999,
    perHourRate: 799,
    description: 'Guided tours of cities and attractions',
    icon: 'Map',
    discountPercent: 20,
    discountedPrice: 7199,
    tags: ['tour', 'guide', 'sightseeing']
  },
  {
    id: 'emotional-support',
    name: 'Emotional Support',
    category: 'Premium',
    basePrice: 5999,
    perHourRate: 599,
    description: 'Someone to talk to, listen, and support',
    icon: 'Heart',
    discountPercent: 20,
    discountedPrice: 4799,
    tags: ['support', 'care', 'listening']
  },

  // ========== EXCLUSIVE TIER ==========
  {
    id: 'romantic-night',
    name: 'Romantic Night',
    category: 'Exclusive',
    basePrice: 24999,
    perHourRate: 1999,
    description: 'An intimate, romantic evening',
    icon: 'Moon',
    discountPercent: 20,
    discountedPrice: 19999,
    tags: ['romantic', 'intimate', 'exclusive']
  },
  {
    id: 'weekend-companion',
    name: 'Weekend Companion',
    category: 'Exclusive',
    basePrice: 34999,
    perHourRate: 2499,
    description: 'A full weekend getaway together',
    icon: 'Palmtree',
    discountPercent: 20,
    discountedPrice: 27999,
    tags: ['weekend', 'getaway', 'luxury']
  },
  {
    id: 'vacation-companion',
    name: 'Vacation Companion',
    category: 'Exclusive',
    basePrice: 29999,
    perHourRate: 1999,
    description: 'Multi-day vacation within Pakistan',
    icon: 'Umbrella',
    discountPercent: 20,
    discountedPrice: 23999,
    tags: ['vacation', 'holiday', 'luxury']
  }
];

// ============================================
// FIRST-TIME DISCOUNT CONFIGURATION
// ============================================

export const FIRST_TIME_DISCOUNT_CONFIG = {
  enabled: true,
  discountPercent: 20,
  description: '20% OFF on your first booking!',
  badgeText: 'First Time 20% OFF'
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculatePrice(serviceId: string, hours: number = 1, isFirstTime: boolean = false): number {
  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) return 0;
  
  const total = service.basePrice + (service.perHourRate * (hours - 1));
  
  // Apply 20% discount only for first-time users
  if (isFirstTime && FIRST_TIME_DISCOUNT_CONFIG.enabled) {
    return Math.round(total * 0.80); // 20% off
  }
  
  return Math.round(total); // Full price
}

export function getServiceById(serviceId: string) {
  return SERVICES.find(s => s.id === serviceId);
}

export function getServicesByCategory(category: string) {
  return SERVICES.filter(s => s.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(SERVICES.map(s => s.category))];
}

export function getDiscountedPrice(basePrice: number, isFirstTime: boolean = false): number {
  if (isFirstTime && FIRST_TIME_DISCOUNT_CONFIG.enabled) {
    return Math.round(basePrice * 0.80);
  }
  return basePrice;
}

export function getFirstTimeDiscountAmount(basePrice: number): number {
  return Math.round(basePrice * 0.20);
}
