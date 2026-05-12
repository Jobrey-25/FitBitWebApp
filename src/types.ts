export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  idDocument?: string;
  medicalClearance?: string;
  role: 'member' | 'admin' | 'trainer';
  createdAt: any;
}

export interface Membership {
  id?: string;
  userId: string;
  planType: 'monthly' | 'quarterly' | 'annual';
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  startDate?: any;
  endDate?: any;
  updatedAt: any;
}

export interface PaymentRecord {
  id?: string;
  userId: string;
  amount: number;
  planType: string;
  paymentDate: any;
  status: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  photoUrl?: string;
  bio?: string;
}

export interface Appointment {
  id?: string;
  memberId: string;
  trainerId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}
