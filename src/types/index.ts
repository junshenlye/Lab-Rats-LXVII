export interface Milestone {
  id: string;
  name: string;
  description: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'paid';
  dueDate: string;
  completedDate?: string;
  txHash?: string;
}

export interface VoyageInfo {
  id: string;
  vesselName: string;
  vesselIMO: string;
  vesselType: string;
  origin: {
    port: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  destination: {
    port: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  currentPosition: {
    coordinates: { lat: number; lng: number };
    speed: number;
    heading: number;
    lastUpdate: string;
  };
  eta: string;
  departureDate: string;
  cargoType: string;
  cargoWeight: number;
  progress: number;
}

export interface ShipOwner {
  id: string;
  companyName: string;
  country: string;
  registrationNumber: string;
  fleetSize: number;
  xrplWallet: string;
  contactName: string;
  contactEmail: string;
  rating: number;
  totalVoyages: number;
}

export interface Charterer {
  id: string;
  companyName: string;
  country: string;
  registrationNumber: string;
  xrplWallet: string;
  contactName: string;
  contactEmail: string;
  rating: number;
  totalCharters: number;
  creditScore: string;
}

export interface Transaction {
  id: string;
  contractNumber: string;
  status: 'draft' | 'pending_acceptance' | 'active' | 'completed' | 'disputed';
  totalValue: number;
  currency: 'RLUSD';
  escrowBalance: number;
  paidAmount: number;
  remainingAmount: number;
  milestones: Milestone[];
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface TimelineEvent {
  id: string;
  type: 'voyage' | 'payment' | 'milestone' | 'system' | 'document';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  metadata?: Record<string, string | number>;
}
