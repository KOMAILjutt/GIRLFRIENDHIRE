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
    discountPercent: 50,
    discountedPrice: 999,
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
    discountPercent: 50,
    discountedPrice: 1999,
    tags: ['shopping', 'fashion', 'lifestyle']
  },
  {
    id: 'movie-cafe-hangout',
    name: 'Movie/Café Hangout',
    category: 'Basic',
    basePrice: 1999,
    perHourRate: 299,
    description: 'Watch a movie or chill at a café',
    icon: 'Film',
    discountPercent: 50,
    discountedPrice: 999,
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
    discountPercent: 50,
    discountedPrice: 1499,
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
    discountPercent: 50,
    discountedPrice: 749,
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
    discountPercent: 50,
    discountedPrice: 3999,
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
    discountPercent: 50,
    discountedPrice: 4999,
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
    discountPercent: 50,
    discountedPrice: 5999,
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
    discountPercent: 50,
    discountedPrice: 3999,
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
    discountPercent: 50,
    discountedPrice: 2999,
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
    discountPercent: 50,
    discountedPrice: 7499,
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
    discountPercent: 50,
    discountedPrice: 8999,
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
    discountPercent: 50,
    discountedPrice: 4499,
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
    discountPercent: 50,
    discountedPrice: 2999,
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
    discountPercent: 50,
    discountedPrice: 12499,
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
    discountPercent: 50,
    discountedPrice: 17499,
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
    discountPercent: 50,
    discountedPrice: 14999,
    tags: ['vacation', 'holiday', 'luxury']
  }
];

// Helper function to calculate final price
export function calculatePrice(serviceId: string, hours: number = 1): number {
  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) return 0;
  
  const total = service.basePrice + (service.perHourRate * (hours - 1));
  const discounted = total * (service.discountPercent / 100);
  
  return Math.round(discounted);
}

// Helper to get service by ID
export function getServiceById(serviceId: string) {
  return SERVICES.find(s => s.id === serviceId);
}

// Helper to get services by category
export function getServicesByCategory(category: string) {
  return SERVICES.filter(s => s.category === category);
}
