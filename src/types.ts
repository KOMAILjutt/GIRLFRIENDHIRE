export interface ServiceItem {
  id: string;
  name: string;
  category: 'Basic' | 'Standard' | 'Premium' | 'Exclusive';
  basePrice: number;
  perHourRate: number;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Companion {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
  bio: string;
  interests: string[];
  photos: string[]; // Minimum 3 for companions, 1 for clients
  services: {
    serviceId: string;
    customBasePrice?: number; // Optional custom pricing override
    customPerHourRate?: number;
  }[];
  rating: number;
  reviews: Review[];
  status: 'Approved' | 'Pending' | 'Rejected';
  isVerified: boolean;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  companionId: string;
  companionName: string;
  companionPhoto: string;
  serviceId: string;
  serviceName: string;
  durationHours: number;
  totalPrice: number;
  meetingLocation: string;
  bookingDate: string; // YYYY-MM-DD (must be minimum 2 days from today)
  timeSlot: 'Morning 9-12' | 'Afternoon 12-3' | 'Evening 3-6' | 'Night 6-9';
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Client' | 'Companion' | 'Admin' | null;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  city?: string;
  profilePhoto?: string;
  // Companion specific registration fields
  bio?: string;
  interests?: string[];
  photos?: string[];
  services?: { serviceId: string }[];
  isApprovedCompanion?: boolean;
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
}
