import { VoyageInfo, ShipOwner, Charterer, Transaction, TimelineEvent } from '@/types';

export const mockVoyage: VoyageInfo = {
  id: 'VOY-2024-0847',
  vesselName: 'MV Pacific Meridian',
  vesselIMO: 'IMO 9876543',
  vesselType: 'Bulk Carrier',
  origin: {
    port: 'Singapore',
    country: 'Singapore',
    coordinates: { lat: 1.2897, lng: 103.8501 }
  },
  destination: {
    port: 'Rotterdam',
    country: 'Netherlands',
    coordinates: { lat: 51.9225, lng: 4.4792 }
  },
  currentPosition: {
    coordinates: { lat: 12.8797, lng: 77.6166 },
    speed: 14.2,
    heading: 285,
    lastUpdate: '2024-12-15T14:32:00Z'
  },
  eta: '2024-12-28T08:00:00Z',
  departureDate: '2024-12-01T06:00:00Z',
  cargoType: 'Iron Ore',
  cargoWeight: 75000,
  progress: 42
};

export const mockShipOwner: ShipOwner = {
  id: 'SO-9283',
  companyName: 'Meridian Maritime Holdings',
  country: 'Singapore',
  registrationNumber: 'SG-201832847H',
  fleetSize: 24,
  xrplWallet: 'rN7n3473SaZBCG4dFL83w7a1RXtXtbk2D9',
  contactName: 'Captain James Chen',
  contactEmail: 'j.chen@meridianmaritime.sg',
  rating: 4.8,
  totalVoyages: 847
};

export const mockCharterer: Charterer = {
  id: 'CH-4521',
  companyName: 'Rotterdam Steel Industries B.V.',
  country: 'Netherlands',
  registrationNumber: 'NL-KVK-72834561',
  xrplWallet: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
  contactName: 'Erik van der Berg',
  contactEmail: 'e.vandenberg@rotterdamsteel.nl',
  rating: 4.9,
  totalCharters: 156,
  creditScore: 'AAA'
};

export const mockTransaction: Transaction = {
  id: 'TXN-2024-0847',
  contractNumber: 'MC-2024-SG-NL-0847',
  status: 'active',
  totalValue: 2850000,
  currency: 'RLUSD',
  escrowBalance: 1425000,
  paidAmount: 855000,
  remainingAmount: 1995000,
  milestones: [
    {
      id: 'M1',
      name: 'Cargo Loading Complete',
      description: 'Full cargo loaded at Singapore port with documentation verified',
      amount: 570000,
      status: 'paid',
      dueDate: '2024-12-02T00:00:00Z',
      completedDate: '2024-12-01T18:45:00Z',
      txHash: 'A1B2C3D4E5F6789012345678'
    },
    {
      id: 'M2',
      name: 'Departure & Transit Initiation',
      description: 'Vessel departed Singapore and entered international waters',
      amount: 285000,
      status: 'paid',
      dueDate: '2024-12-03T00:00:00Z',
      completedDate: '2024-12-02T08:15:00Z',
      txHash: 'F6E5D4C3B2A1098765432109'
    },
    {
      id: 'M3',
      name: 'Suez Canal Transit',
      description: 'Successful passage through Suez Canal',
      amount: 712500,
      status: 'in_progress',
      dueDate: '2024-12-18T00:00:00Z'
    },
    {
      id: 'M4',
      name: 'Mediterranean Passage',
      description: 'Transit through Mediterranean Sea to Gibraltar',
      amount: 570000,
      status: 'pending',
      dueDate: '2024-12-22T00:00:00Z'
    },
    {
      id: 'M5',
      name: 'Cargo Delivery Complete',
      description: 'Full cargo offloaded at Rotterdam with final inspection',
      amount: 712500,
      status: 'pending',
      dueDate: '2024-12-28T00:00:00Z'
    }
  ],
  createdAt: '2024-11-20T10:00:00Z',
  acceptedAt: '2024-11-22T14:30:00Z'
};

export const mockTimeline: TimelineEvent[] = [
  {
    id: 'EVT-001',
    type: 'payment',
    title: 'Milestone 2 Payment Released',
    description: '285,000 RLUSD transferred to ship owner wallet',
    timestamp: '2024-12-02T08:20:00Z',
    icon: 'Banknote',
    metadata: { amount: 285000, txHash: 'F6E5D4C3B2A1098765432109' }
  },
  {
    id: 'EVT-002',
    type: 'milestone',
    title: 'Milestone 2 Completed',
    description: 'Departure & Transit Initiation verified',
    timestamp: '2024-12-02T08:15:00Z',
    icon: 'CheckCircle'
  },
  {
    id: 'EVT-003',
    type: 'voyage',
    title: 'Vessel Departed Singapore',
    description: 'MV Pacific Meridian left Singapore port, heading west',
    timestamp: '2024-12-01T06:00:00Z',
    icon: 'Ship',
    metadata: { speed: 12.5, heading: 270 }
  },
  {
    id: 'EVT-004',
    type: 'payment',
    title: 'Milestone 1 Payment Released',
    description: '570,000 RLUSD transferred to ship owner wallet',
    timestamp: '2024-12-01T18:50:00Z',
    icon: 'Banknote',
    metadata: { amount: 570000, txHash: 'A1B2C3D4E5F6789012345678' }
  },
  {
    id: 'EVT-005',
    type: 'milestone',
    title: 'Milestone 1 Completed',
    description: 'Cargo Loading Complete - 75,000 MT iron ore loaded',
    timestamp: '2024-12-01T18:45:00Z',
    icon: 'CheckCircle'
  },
  {
    id: 'EVT-006',
    type: 'document',
    title: 'Bill of Lading Uploaded',
    description: 'B/L document verified and stored on-chain',
    timestamp: '2024-12-01T17:30:00Z',
    icon: 'FileText'
  },
  {
    id: 'EVT-007',
    type: 'payment',
    title: 'Escrow Funded',
    description: '1,425,000 RLUSD deposited to escrow contract',
    timestamp: '2024-11-30T09:00:00Z',
    icon: 'Lock',
    metadata: { amount: 1425000 }
  },
  {
    id: 'EVT-008',
    type: 'system',
    title: 'Contract Accepted',
    description: 'Charterer accepted charter party terms',
    timestamp: '2024-11-22T14:30:00Z',
    icon: 'Handshake'
  },
  {
    id: 'EVT-009',
    type: 'system',
    title: 'Invoice Created',
    description: 'Ship owner created charter invoice with 5 milestones',
    timestamp: '2024-11-20T10:00:00Z',
    icon: 'FileText'
  }
];
