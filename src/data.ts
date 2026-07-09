import { ServiceItem, Companion } from './types';

export const SERVICES: ServiceItem[] = [
  // Basic
  { id: 'srv_1', name: 'Coffee/Meal Date', category: 'Basic', basePrice: 1999, perHourRate: 299, description: 'A relaxed meeting over coffee or a light meal', icon: 'Coffee', tags: ['Social', 'Casual'], discountPercent: 50 },
  { id: 'srv_2', name: 'Shopping Companion', category: 'Basic', basePrice: 3999, perHourRate: 499, description: 'Shop together at malls or local bazaars', icon: 'ShoppingBag', tags: ['Shopping', 'Fashion'], discountPercent: 50 },
  { id: 'srv_3', name: 'Movie/Cafe Hangout', category: 'Basic', basePrice: 1999, perHourRate: 299, description: 'Watch a movie or chill at a cafe', icon: 'Film', tags: ['Entertainment', 'Casual'], discountPercent: 50 },
  { id: 'srv_4', name: 'Virtual Companion', category: 'Basic', basePrice: 2999, perHourRate: 399, description: 'Video calls and online chat sessions', icon: 'Video', tags: ['Online', 'Global'], discountPercent: 50 },
  { id: 'srv_5', name: 'Language Practice', category: 'Basic', basePrice: 1499, perHourRate: 249, description: 'Practice Urdu, Punjabi, or English', icon: 'Languages', tags: ['Learning', 'Education'], discountPercent: 50 },
  
  // Standard
  { id: 'srv_6', name: 'Dinner Date', category: 'Standard', basePrice: 7999, perHourRate: 799, description: 'Elegant fine-dining experience', icon: 'Utensils', tags: ['Formal', 'Dining'], discountPercent: 50 },
  { id: 'srv_7', name: 'Event Companion', category: 'Standard', basePrice: 9999, perHourRate: 899, description: 'Weddings, parties, corporate events', icon: 'Ticket', tags: ['Events', 'Social'], discountPercent: 50 },
  { id: 'srv_8', name: 'Professional +1', category: 'Standard', basePrice: 11999, perHourRate: 999, description: 'Business dinners and networking', icon: 'Briefcase', tags: ['Professional', 'Corporate'], discountPercent: 50 },
  { id: 'srv_9', name: 'Cultural/Festival', category: 'Standard', basePrice: 7999, perHourRate: 799, description: 'Festivals, Basant, cultural events', icon: 'Map', tags: ['Culture', 'Traditional'], discountPercent: 50 },
  { id: 'srv_10', name: 'Hobby Partner', category: 'Standard', basePrice: 5999, perHourRate: 599, description: 'Gym, sports, gaming partner', icon: 'Gamepad', tags: ['Activities', 'Fitness'], discountPercent: 50 },
  
  // Premium
  { id: 'srv_11', name: 'Full Day Companion', category: 'Premium', basePrice: 14999, perHourRate: 1199, description: 'Complete day-long company (8 hours)', icon: 'Sun', tags: ['Daily', 'Comprehensive'], discountPercent: 50 },
  { id: 'srv_12', name: 'Travel Companion', category: 'Premium', basePrice: 17999, perHourRate: 1499, description: 'Inter-city travel and trips', icon: 'Plane', tags: ['Travel', 'Adventure'], discountPercent: 50 },
  { id: 'srv_13', name: 'Travel Guide', category: 'Premium', basePrice: 8999, perHourRate: 799, description: 'City tours and hidden gems', icon: 'Compass', tags: ['Tourism', 'Local'], discountPercent: 50 },
  { id: 'srv_14', name: 'Emotional Support', category: 'Premium', basePrice: 5999, perHourRate: 599, description: 'Compassionate listener and support', icon: 'Heart', tags: ['Empathy', 'Wellness'], discountPercent: 50 },
  
  // Exclusive
  { id: 'srv_15', name: 'Romantic Night', category: 'Exclusive', basePrice: 24999, perHourRate: 1999, description: 'Premium romantic experience', icon: 'Moon', tags: ['Luxury', 'Exclusive'], discountPercent: 50 },
  { id: 'srv_16', name: 'Weekend Companion', category: 'Exclusive', basePrice: 34999, perHourRate: 2499, description: 'Full weekend of activities', icon: 'CalendarDays', tags: ['Weekend', 'Premium'], discountPercent: 50 },
  { id: 'srv_17', name: 'Vacation Companion', category: 'Exclusive', basePrice: 29999, perHourRate: 1999, description: 'Ultimate vacation partner', icon: 'Palmtree', tags: ['Holiday', 'VIP'], discountPercent: 50 }
];

export const CITIES = {
  tier1: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'],
  tier2: [
    'Multan', 'Gujranwala', 'Peshawar', 'Quetta', 'Sialkot', 
    'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana', 'Abbottabad', 'Muzaffarabad'
  ],
  tier3: [
    'Jhelum', 'Sahiwal', 'Okara', 'Mandi Bahauddin', 'Hafizabad', 
    'Nowshera', 'Charsadda', 'Swat', 'Mardan', 'Dera Ghazi Khan', 
    'Rahim Yar Khan', 'Mirpur Khas', 'Nawabshah', 'Gilgit', 'Skardu', 
    'Kotli', 'Mirpur'
  ]
};

export const INTEREST_OPTIONS = [
  'Dining', 'Travel', 'Events', 'Conversation', 'Hobbies', 
  'Gaming', 'Movies', 'Books', 'Music', 'Fitness', 'Art'
];

export const SEED_COMPANIONS: Companion[] = [
  {
    id: 'comp_1',
    name: 'Aisha Khan',
    age: 24,
    gender: 'Female',
    city: 'Lahore',
    bio: 'Avid reader, movie enthusiast, and conversationalist. I love exploring new cafes in Lahore, sharing stories, and practicing different languages over a warm cup of tea. Looking forward to professional meetups or shopping hangout guidance!',
    interests: ['Dining', 'Conversation', 'Movies', 'Books'],
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
    ],
    services: [
      { serviceId: 'srv_1' },
      { serviceId: 'srv_3' },
      { serviceId: 'srv_5' },
      { serviceId: 'srv_10' }
    ],
    rating: 4.9,
    reviews: [
      {
        id: 'rev_1_1',
        reviewerName: 'Kamran Ali',
        rating: 5,
        comment: 'Aisha is an incredibly polite and well-spoken guide. We enjoyed a great conversation and coffee in DHA Lahore.',
        date: '2026-06-15'
      },
      {
        id: 'rev_1_2',
        reviewerName: 'Zara Sheikh',
        rating: 4.8,
        comment: 'Wonderful experience practicing Spanish and English language terms. Super patient and intellectual.',
        date: '2026-07-02'
      }
    ],
    status: 'Approved',
    isVerified: true
  },
  {
    id: 'comp_2',
    name: 'Zain Ahmed',
    age: 26,
    gender: 'Male',
    city: 'Karachi',
    bio: 'Fitness trainer, music producer, and food explorer. I know the absolute best places in Karachi for shopping and dinner dates. Let me accompany you to your next social event or help you find authentic local street food!',
    interests: ['Dining', 'Travel', 'Fitness', 'Music', 'Events'],
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'
    ],
    services: [
      { serviceId: 'srv_2' },
      { serviceId: 'srv_6' },
      { serviceId: 'srv_7' },
      { serviceId: 'srv_11' }
    ],
    rating: 4.8,
    reviews: [
      {
        id: 'rev_2_1',
        reviewerName: 'Bilal Butt',
        rating: 5,
        comment: 'Very professional. Assisted me during some heavy shopping at Clifton Mall and recommended outstanding spots.',
        date: '2026-06-20'
      }
    ],
    status: 'Approved',
    isVerified: true
  },
  {
    id: 'comp_3',
    name: 'Sana Malik',
    age: 25,
    gender: 'Female',
    city: 'Islamabad',
    bio: 'Freelance designer and cultural enthusiast. Extremely passionate about Pakistani festivals, travel, and emotional support. I offer professional +1 companionship and curated cultural city guides in Rawalpindi/Islamabad.',
    interests: ['Travel', 'Art', 'Conversation', 'Events', 'Hobbies'],
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400'
    ],
    services: [
      { serviceId: 'srv_8' },
      { serviceId: 'srv_9' },
      { serviceId: 'srv_13' },
      { serviceId: 'srv_14' }
    ],
    rating: 5.0,
    reviews: [
      {
        id: 'rev_3_1',
        reviewerName: 'Dr. Sameer',
        rating: 5,
        comment: 'Sana was my professional +1 for a medical conference dinner. Exceptional etiquette and brilliant socializing skills.',
        date: '2026-05-11'
      }
    ],
    status: 'Approved',
    isVerified: true
  },
  {
    id: 'comp_4',
    name: 'Hamza Ali',
    age: 27,
    gender: 'Male',
    city: 'Multan',
    bio: 'An outgoing host and local expert. Love guiding people through Multans rich spiritual and historic festival sites, tasting famous local sweets, or joining as an enthusiast for weekend getaways and vacation tours.',
    interests: ['Travel', 'Dining', 'Hobbies', 'Events'],
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    ],
    services: [
      { serviceId: 'srv_9' },
      { serviceId: 'srv_12' },
      { serviceId: 'srv_16' }
    ],
    rating: 4.7,
    reviews: [],
    status: 'Approved',
    isVerified: true
  }
];
