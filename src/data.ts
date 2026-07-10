import { ServiceItem, Companion } from './types';

export const SERVICES: ServiceItem[] = [
  // Basic
  { id: 'srv_1', name: 'Coffee/Meal Date', category: 'Basic', basePrice: 1000, perHourRate: 200 },
  { id: 'srv_2', name: 'Shopping Companion', category: 'Basic', basePrice: 2500, perHourRate: 350 },
  { id: 'srv_3', name: 'Movie/Café Hangout', category: 'Basic', basePrice: 1000, perHourRate: 200 },
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
    'Darya Khan', 'Sakrand', 'Daur',

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
    'Torkham', 'Khar',

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
    'Chagai', 'Dalbandin', 'Nokundi', 'Taftan', 'Saindak',

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
    'Kashmore', 'Ghauspur', 'Chak', 'Rojhan',
    'Jatoi', 'Alipur', 'Rajanpur', 'Jampur', 'Kot Addu',
    'Muzaffargarh', 'Khanga', 'Sarai Sidhu', 'Kot Sultan',
    'Kabirwala', 'Mian Channu', 'Tulamba', 'Shorkot', 'Kamir',
    'Pirmahal', 'Gojra', 'Toba Tek Singh', 'Chichawatni',
    'Depalpur', 'Hujra', 'Renala Khurd',
    'Pattoki', 'Chunian', 'Kasur', 'Raiwind', 'Kot Lakhpat',
    'Shahdara', 'Wagah', 'Batapur', 'Badiana', 'Sialkot',
    'Daska', 'Sambrial', 'Pasrur', 'Zafarwal', 'Shakargarh',
    'Narowal', 'Baddomalhi', 'Qila Sobha Singh', 'Ferozewala',
    'Muridke', 'Sharqpur', 'Nankana Sahib', 'Sangla Hill',
    'Sukheke', 'Mandi', 'Phalia', 'Khairpur',
    'Jalalpur', 'Shadiwal', 'Dinga', 'Kharian', 'Lalamusa',
    'Jalalpur Jattan', 'Gujar Khan', 'Kallar Syedan', 'Rawat',
    'Mankiala', 'Tarnol', 'Fateh Jang', 'Pindigheb', 'Jand',
    'Hazro', 'Attock', 'Hasan Abdal', 'Wah', 'Taxila',
    'Kamra', 'Nurpur', 'Kundian', 'Piplan',
    'Isa Khel', 'Mianwali', 'Daud Khel',
    'Musa Khel', 'Chakwal', 'Talagang', 'Lawa',
    'Mailsi', 'Gaggo', 'Khangarh', 'Rohilanwali',
    'Taunsa', 'Fort Munro',
    'Kohlu', 'Dera Bugti', 'Sibi', 'Mach', 'Lehri',
    'Bolan', 'Mastung', 'Dasht', 'Nushki', 'Dalbandin',
    'Nokundi', 'Chagai', 'Taftan', 'Washuk', 'Awaran',
    'Jhal Magsi', 'Gandawa', 'Usta Muhammad', 'Sohbatpur',
    'Dera Murad Jamali', 'Bhag', 'Chaman', 'Killa Abdullah',
    'Gulistan', 'Qilla Saifullah', 'Loralai', 'Barkhan',
    'Duki', 'Musakhel', 'Ziarat', 'Sharigh', 'Harnai',
    'Khost', 'Sanzala', 'Wadh', 'Khuzdar', 'Naal',
    'Besima', 'Mashkay', 'Gishkore', 'Nag',
    'Panjgur', 'Tump', 'Mand', 'Buleda', 'Hoshab',
    'Dasht', 'Gwadar', 'Pasni', 'Ormara', 'Jiwani',
    'Suntsar', 'Turbat', 'Balnigor', 'Mand'
  ]
};

export const INTEREST_OPTIONS = [
  'Dining', 'Travel', 'Events', 'Conversation', 'Hobbies', 
  'Gaming', 'Movies', 'Books', 'Music', 'Fitness', 'Art'
];

export const SEED_COMPANIONS: Companion[] = []; // No fake seed data
// Discount Configuration
export const DISCOUNT_CONFIG = {
  firstTimeDiscountPercent: 30, // 30% off for first-time bookings
  firstTimeDiscountMultiplier: 0.7, // Pay 70% of original price
  isEnabled: true
};

/**
 * Calculate discounted price for first-time users
 * @param originalPrice - The original service price
 * @param isFirstTime - Whether this is the user's first booking
 * @returns Final price after discount
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  isFirstTime: boolean = true
): number {
  if (!isFirstTime || !DISCOUNT_CONFIG.isEnabled) {
    return originalPrice;
  }
  return Math.round(originalPrice * DISCOUNT_CONFIG.firstTimeDiscountMultiplier);
}

/**
 * Get discount amount for display
 * @param originalPrice - The original service price
 * @returns Discount amount
 */
export function getDiscountAmount(originalPrice: number): number {
  return Math.round(originalPrice * (DISCOUNT_CONFIG.firstTimeDiscountPercent / 100));
}
