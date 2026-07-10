import { ServiceItem, Companion } from './types';

export const SERVICES: ServiceItem[] = [
  // Basic
  { id: 'srv_1', name: 'Coffee/Meal Date', category: 'Basic', basePrice: 500, perHourRate: 100 },
  { id: 'srv_2', name: 'Shopping Companion', category: 'Basic', basePrice: 2500, perHourRate: 350 },
  { id: 'srv_3', name: 'Movie/Café Hangout', category: 'Basic', basePrice: 500, perHourRate: 100 },
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
  // Major Metros (Tier 1)
  tier1: [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'
  ],

  // Provincial Capitals & Large Cities (Tier 2)
  tier2: [
    // Punjab
    'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 
    'Sheikhupura', 'Gujrat', 'Jhang', 'Sahiwal', 'Okara',
    'Rahim Yar Khan', 'Kasur', 'Dera Ghazi Khan', 'Mandi Bahauddin',
    'Wah Cantonment', 'Nankana Sahib', 'Pakpattan', 'Chishtian',
    'Kamalia', 'Hafizabad', 'Muzaffargarh', 'Khanewal', 'Vehari',
    'Layyah', 'Bhakkar', 'Khushab', 'Chakwal', 'Talagang',
    'Mianwali', 'Narowal', 'Burewala', 'Haroonabad', 'Kot Addu',
    'Daska', 'Wazirabad', 'Gojra', 'Muridke', 'Jalalpur Jattan',
    'Kamoke', 'Mailsi', 'Shakargarh', 'Shujabad', 'Lodhran',
    'Mian Channu', 'Kotli', 'Jampur', 'Jatoi', 'Pattoki',
    'Toba Tek Singh', 'Arif Wala', 'Bhalwal', 'Lala Musa',
    'Phool Nagar', 'Haveli Lakha', 'Dipalpur', 'Farooqabad',
    'Chichawatni', 'Sangla Hill', 'Gujar Khan', 'Kharian',
    'Pasrur', 'Jauharabad', 'Shahkot', 'Ahmedpur East',
    'Hasilpur', 'Kot Abdul Malik', 'Renala Khurd', 'Raiwind',
    'Kahna', 'Thokar Niaz Baig', 'Shahdara', 'Walton',

    // Sindh
    'Hyderabad', 'Sukkur', 'Larkana', 'Mirpur Khas', 'Nawabshah',
    'Jacobabad', 'Shikarpur', 'Khairpur', 'Badin', 'Dadu',
    'Tando Allahyar', 'Tando Muhammad Khan', 'Umerkot', 'Moro',
    'Ghotki', 'Kamber Ali Khan', 'Shahdadkot', 'Kotri',
    'Rohri', 'Sanghar', 'Thatta', 'Mithi', 'Mehar',
    'Daharki', 'Pano Aqil', 'Kandiaro', 'Daulatpur',
    'Naushahro Feroze', 'Gambat', 'Ranipur', 'Hala',
    'Matiari', 'Sehwan', 'Kot Diji', 'Thul', 'Garhi Yasin',
    'Kandhkot', 'Tangwani', 'Kashmore', 'Chak', 'Bhiria',
    'Darya Khan', 'Kotri', 'Sakrand', 'Daur', 'Kotri',

    // Khyber Pakhtunkhwa
    'Peshawar', 'Mardan', 'Swat', 'Abbottabad', 'Mansehra',
    'Haripur', 'Charsadda', 'Nowshera', 'Swabi', 'Kohat',
    'Bannu', 'Dera Ismail Khan', 'Lakki Marwat', 'Tank',
    'Karak', 'Batagram', 'Shangla', 'Upper Dir', 'Lower Dir',
    'Malakand', 'Buner', 'Hangu', 'Orakzai', 'Kurram',
    'North Waziristan', 'South Waziristan', 'Bajaur', 'Mohmand',
    'Khyber', 'Kolachi', 'Gumbat', 'Lachi', 'Dargai',
    'Batkhela', 'Timergara', 'Chakdara', 'Mingora', 'Saidu Sharif',
    'Matta', 'Kabal', 'Bahrain', 'Kalam', 'Alpuri', 'Puran',
    'Besham', 'Dir', 'Wari', 'Thal', 'Barawal', 'Daggar',
    'Sawari', 'Doaba', 'Kalaya', 'Parachinar', 'Sadda',
    'Alizai', 'Miranshah', 'Mir Ali', 'Wana', 'Shakai',
    'Ladha', 'Makeen', 'Sararogha', 'Razmak', 'Datta Khel',
    'Ghulam Khan', 'Boya', 'Spinwam', 'Jamrud', 'Landi Kotal',
    'Torkham', 'Khar', 'Wana', 'Sararogha', 'Sarwakai',
    'Serwekai', 'Tiarza', 'Birmil', 'Ziarat', 'Kan Mehtarzai',

    // Balochistan
    'Quetta', 'Turbat', 'Khuzdar', 'Hub', 'Chaman',
    'Pishin', 'Dera Murad Jamali', 'Panjgur', 'Kalat',
    'Mastung', 'Nushki', 'Kharan', 'Sibi', 'Zhob',
    'Loralai', 'Barkhan', 'Musakhel', 'Kohlu', 'Dera Bugti',
    'Jaffarabad', 'Nasirabad', 'Bolan', 'Jhal Magsi',
    'Awaran', 'Washuk', 'Ketch', 'Surab', 'Usta Muhammad',
    'Gandawa', 'Bela', 'Uthal', 'Ormara', 'Pasni', 'Gwadar',
    'Jiwani', 'Suntsar', 'Mand', 'Tump', 'Balnigor', 'Buleda',
    'Hoshab', 'Dasht', 'Qalat', 'Mekhtar', 'Bagh',
    'Chagai', 'Dalbandin', 'Nokundi', 'Taftan', ' Saindak',

    // Azad Kashmir & Gilgit-Baltistan
    'Muzaffarabad', 'Mirpur', 'Kotli', 'Bhimber', 'Rawalakot',
    'Bagh', 'Pallandri', 'Hajira', 'Athmuqam', 'Chakothi',
    'Forward Kahuta', 'Hattian Bala', 'Chikar', 'Leepa',
    'Gilgit', 'Skardu', 'Hunza', 'Chilas', 'Gahkuch',
    'Gupis', 'Ishkoman', 'Khaplu', 'Shigar', 'Rondu',
    'Astore', 'Diamer', 'Darel', 'Tangir', 'Nagar',
    'Aliabad', 'Karimabad', 'Gulmit', 'Sost', 'Passu',
    'Chatorkhand', 'Phander', 'Teru', 'Yasin', 'Punial',
    'Sherqilla', 'Singal', 'Thore', 'Thoi', 'Bardar'
  ],

  // Smaller Towns (Tier 3)
  tier3: [
    'Jhelum', 'Sahiwal', 'Okara', 'Mandi Bahauddin', 'Hafizabad', 
    'Nowshera', 'Charsadda', 'Swat', 'Mardan', 'Dera Ghazi Khan', 
    'Rahim Yar Khan', 'Mirpur Khas', 'Nawabshah', 'Gilgit', 'Skardu', 
    'Kotli', 'Mirpur', 'Tando Adam', 'Shahdadpur', 'Sakrand',
    'Dokri', 'Bakrani', 'Ratodero', 'Qambar', 'Mirokhan',
    'Shahdadkot', 'Warah', 'Nasirabad', 'Sobhodero', 'Gambat',
    'Khairpur Nathan Shah', 'Thul', 'Tangwani', 'Kandhkot',
    'Kashmore', 'Tangwani', 'Ghauspur', 'Chak', 'Rojhan',
    'Jatoi', 'Alipur', 'Rajanpur', 'Jampur', 'Kot Addu',
    'Muzaffargarh', 'Khanga', 'Sarai Sidhu', 'Kot Sultan',
    'Kabirwala', 'Mian Channu', 'Tulamba', 'Shorkot', 'Kamir',
    'Pirmahal', 'Gojra', 'Toba Tek Singh', 'Chichawatni',
    'Sahiwal', 'Okara', 'Depalpur', 'Hujra', 'Renala Khurd',
    'Pattoki', 'Chunian', 'Kasur', 'Raiwind', 'Kot Lakhpat',
    'Shahdara', 'Wagah', 'Batapur', 'Badiana', 'Sialkot',
    'Daska', 'Sambrial', 'Pasrur', 'Zafarwal', 'Shakargarh',
    'Narowal', 'Baddomalhi', 'Qila Sobha Singh', 'Ferozewala',
    'Muridke', 'Sharqpur', 'Nankana Sahib', 'Sangla Hill',
    'Sukheke', 'Mandi', 'Phalia', 'Kotli', 'Khairpur',
    'Jalalpur', 'Shadiwal', 'Dinga', 'Kharian', 'Lalamusa',
    'Jalalpur Jattan', 'Gujar Khan', 'Kallar Syedan', 'Rawat',
    'Mankiala', 'Tarnol', 'Fateh Jang', 'Pindigheb', 'Jand',
    'Hazro', 'Attock', 'Hasan Abdal', 'Wah', 'Taxila',
    'Kamra', 'Nurpur', 'Kundian', 'Piplan', 'Kotli',
    'Isa Khel', 'Mianwali', 'Kundian', 'Daud Khel',
    'Musa Khel', 'Chakwal', 'Talagang', 'Lawa', 'Multan',
    'Mailsi', 'Gaggo', 'Muzaffargarh', 'Khangarh', 'Rohilanwali',
    'Kot Addu', 'Dera Ghazi Khan', 'Taunsa', 'Fort Munro',
    'Kohlu', 'Dera Bugti', 'Sibi', 'Mach', 'Lehri',
    'Bolan', 'Mastung', 'Dasht', 'Nushki', 'Dalbandin',
    'Nokundi', 'Chagai', 'Taftan', 'Washuk', 'Awaran',
    'Jhal Magsi', 'Gandawa', 'Usta Muhammad', 'Sohbatpur',
    'Dera Murad Jamali', 'Bhag', 'Chaman', 'Killa Abdullah',
    'Gulistan', 'Qilla Saifullah', 'Loralai', 'Barkhan',
    'Duki', 'Musakhel', 'Ziarat', 'Sharigh', 'Harnai',
    'Khost', 'Sanzala', 'Wadh', 'Khuzdar', 'Naal',
    'Wadh', 'Besima', 'Mashkay', 'Gishkore', 'Nag',
    'Panjgur', 'Tump', 'Mand', 'Buleda', 'Hoshab',
    'Dasht', 'Gwadar', 'Pasni', 'Ormara', 'Jiwani',
    'Suntsar', 'Turbat', 'Tump', 'Balnigor', 'Mand'
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
