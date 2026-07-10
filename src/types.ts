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
  userId?: string; // Link to the user who registered as companion
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
  bio: string;
  interests: string[];
  photos: string[]; // Minimum 3 for companions, 1 for clients
  services: {
    serviceId: string;
    customBasePrice?: number;
    customPerHourRate?: number;
  }[];
  rating: number;
  reviews: Review[];
  status: 'Approved' | 'Pending' | 'Rejected';
  isVerified: boolean;
  rawPhotos?: string[]; // Raw storage paths relative to bucket
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
  bookingDate: string;
  timeSlot: 'Morning 9-12' | 'Afternoon 12-3' | 'Evening 3-6' | 'Night 6-9';
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
  paymentDetails?: {
    transactionId: string;
    senderName: string;
    method: string;
    account: string;
  };
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
  rawProfilePhoto?: string;
  bio?: string;
  interests?: string[];
  photos?: string[];
  rawPhotos?: string[];
  services?: { serviceId: string }[];
  isApprovedCompanion?: boolean;
  walletBalance?: number;
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
}
