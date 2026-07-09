import { ServiceItem, Companion } from './types';

export const SERVICES: ServiceItem[] = [
  // Basic
  { id: 'srv_1', name: 'Coffee/Meal Date', category: 'Basic', basePrice: 2000, perHourRate: 300 },
  { id: 'srv_2', name: 'Shopping Companion', category: 'Basic', basePrice: 2500, perHourRate: 350 },
  { id: 'srv_3', name: 'Movie/Café Hangout', category: 'Basic', basePrice: 2000, perHourRate: 300 },
  { id: 'srv_4', name: 'Virtual Companion', category: 'Basic', basePrice: 1000, perHourRate: 200 },
  { id: 'srv_5', name: 'Language Practice', category: 'Basic', basePrice: 800, perHourRate: 150 },
  
  // Standard
  { id: 'srv_6', name: 'Dinner Date', category: 'Standard', basePrice: 5000, perHourRate: 500 },
  { id: 'srv_7', name: 'Event Companion', category: 'Standard', basePrice: 6000, perHourRate: 600 },
  { id: 'srv_8', name: 'Professional +1', category: 'Standard', basePrice: 8000, perHourRate: 700 },
  { id: 'srv_9', name: 'Cultural/Festival', category: 'Standard', basePrice: 5000, perHourRate: 500 },
  { id: 'srv_10', name: 'Hobby Partner', category: 'Standard', basePrice: 4000, perHourRate: 400 },
  
  // Premium
  { id: 'srv_11', name: 'Full Day Companion', category: 'Premium', basePrice: 10000, perHourRate: 800 },
  { id: 'srv_12', name: 'Travel Companion', category: 'Premium', basePrice: 12000, perHourRate: 1000 },
  { id: 'srv_13', name: 'Travel Guide', category: 'Premium', basePrice: 6000, perHourRate: 500 },
  { id: 'srv_14', name: 'Emotional Support', category: 'Premium', basePrice: 4000, perHourRate: 400 },
  
  // Exclusive
  { id: 'srv_15', name: 'Romantic Night', category: 'Exclusive', basePrice: 15000, perHourRate: 1200 },
  { id: 'srv_16', name: 'Weekend Companion', category: 'Exclusive', basePrice: 25000, perHourRate: 1500 },
  { id: 'srv_17', name: 'Vacation Companion', category: 'Exclusive', basePrice: 18000, perHourRate: 1200 }
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
      { serviceId: 'srv_1' }, // Coffee/Meal Date
      { serviceId: 'srv_3' }, // Movie/Café Hangout
      { serviceId: 'srv_5' }, // Language Practice
      { serviceId: 'srv_10' } // Hobby Partner
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
      { serviceId: 'srv_2' }, // Shopping Companion
      { serviceId: 'srv_6' }, // Dinner Date
      { serviceId: 'srv_7' }, // Event Companion
      { serviceId: 'srv_11' } // Full Day Companion
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
      { serviceId: 'srv_8' }, // Professional +1
      { serviceId: 'srv_9' }, // Cultural/Festival
      { serviceId: 'srv_13' }, // Travel Guide
      { serviceId: 'srv_14' } // Emotional Support
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
    bio: 'An outgoing host and local expert. Love guiding people through Multan’s rich spiritual and historic festival sites, tasting famous local sweets, or joining as an enthusiast for weekend getaways and vacation tours.',
    interests: ['Travel', 'Dining', 'Hobbies', 'Events'],
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    ],
    services: [
      { serviceId: 'srv_9' }, // Cultural/Festival
      { serviceId: 'srv_12' }, // Travel Companion
      { serviceId: 'srv_16' } // Weekend Companion
    ],
    rating: 4.7,
    reviews: [],
    status: 'Approved',
    isVerified: true
  }
];
