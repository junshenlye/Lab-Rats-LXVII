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

// Vessel Types
export type VesselType = 'bulk_carrier' | 'container_ship' | 'tanker' | 'lng_carrier' | 'general_cargo' | 'ro_ro';
export type VesselStatus = 'pending_verification' | 'documents_submitted' | 'verified' | 'active' | 'suspended';
export type VesselDocumentType = 'certificate_of_registry' | 'imo_certificate' | 'hull_insurance' | 'p_and_i_insurance' | 'class_certificate' | 'safety_certificate';
export type DocumentVerificationStatus = 'uploaded' | 'verifying' | 'verified' | 'rejected';

export interface VesselDocument {
  id: string;
  vesselId: string;
  type: VesselDocumentType;
  fileName: string;
  status: DocumentVerificationStatus;
  ipfsCid?: string;
  uploadedAt: string;
  verifiedAt?: string;
}

export interface Vessel {
  id: string;
  imo: string;
  name: string;
  type: VesselType;
  flag: string;
  grossTonnage: number;
  yearBuilt: number;
  did?: string;
  ownerDid: string;
  status: VesselStatus;
  documents: VesselDocument[];
  ownershipCredentialId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VesselCreate {
  imo: string;
  name: string;
  type: VesselType;
  flag: string;
  grossTonnage: number;
  yearBuilt: number;
  ownerDid: string;
}

// DID Types
export interface ShipownerDID {
  did: string;
  walletAddress: string;
  companyName: string;
  registrationNumber: string;
  country: string;
  isVerified: boolean;
  verificationCredentialId?: string;
  createdAt: string;
}

export interface VesselDID {
  vesselId: string;
  vesselDid: string;
  managedBy: string;
  createdAt: string;
}

// Credential Types
export type CredentialType = 'ShipownerVerificationCredential' | 'VesselOwnershipCredential';
export type CredentialStatus = 'active' | 'revoked' | 'expired';

export interface Credential {
  id: string;
  type: CredentialType;
  issuer: string;
  subject: string;
  issuedAt: string;
  expiresAt: string;
  status: CredentialStatus;
  claims: Record<string, unknown>;
}

export interface ShipownerCredentialClaims {
  companyName: string;
  registrationNumber: string;
  country: string;
  kycLevel: string;
  documentsVerified: string[];
}

export interface VesselOwnershipClaims {
  vesselDid: string;
  vesselImo: string;
  vesselName: string;
  ownerDid: string;
  ownerCompanyName: string;
  ownershipType: string;
  verifiedDocuments: string[];
}

// Platform DID
export interface PlatformDID {
  did: string;
  name: string;
  description: string;
  walletAddress: string;
}
