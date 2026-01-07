'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Ship,
  FileText,
  Anchor,
  Navigation,
  MapPin,
  User,
  Shield,
  TrendingUp,
  Copy,
  CheckCircle2,
} from 'lucide-react';

// Dynamic import for Leaflet to avoid SSR issues
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-maritime-deeper rounded-xl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-rlusd-primary/20 border-t-rlusd-primary rounded-full animate-spin" />
        <p className="text-text-muted text-sm">Loading map...</p>
      </div>
    </div>
  )
});

// Types
interface Ship {
  id: string;
  name: string;
  status: 'active' | 'parked' | 'maintenance';
  position: [number, number];
  speed: number;
  heading: number;
  destination: string;
  eta: string;
  voyageProgress: number;
}

// Mock ship data
const mockShips: Ship[] = [
  {
    id: 'ship-1',
    name: 'MV Pacific Meridian',
    status: 'active',
    position: [15.5, 73.8],
    speed: 18.5,
    heading: 285,
    destination: 'Rotterdam',
    eta: '2024-01-28',
    voyageProgress: 42
  },
  {
    id: 'ship-2',
    name: 'MV Atlantic Horizon',
    status: 'active',
    position: [35.2, -140.5],
    speed: 21.3,
    heading: 75,
    destination: 'Los Angeles',
    eta: '2024-01-18',
    voyageProgress: 68
  },
  {
    id: 'ship-3',
    name: 'MV Eastern Star',
    status: 'parked',
    position: [25.2, 55.3],
    speed: 0,
    heading: 0,
    destination: 'Dubai',
    eta: 'Arrived',
    voyageProgress: 100
  },
  {
    id: 'ship-4',
    name: 'MV Nordic Wind',
    status: 'active',
    position: [40.7, -50.2],
    speed: 19.8,
    heading: 95,
    destination: 'New York',
    eta: '2024-01-16',
    voyageProgress: 85
  }
];

type TabType = 'fleet' | 'invoices';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('fleet');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Get wallet address from localStorage
    const address = localStorage.getItem('walletAddress') || 'rN7n7otQDd6FczFgLdhmvTSCkNvVe4';
    setWalletAddress(address);
  }, []);

  const activeShips = mockShips.filter(s => s.status === 'active').length;

  // Hardcoded DID details
  const didDetails = {
    did: 'did:xrpl:1:rN7n7otQDd6FczFgLdhmvTSCkNvVe4',
    companyName: 'Pacific Maritime Trading Co.',
    creditScore: 847,
    verifiedSince: 'Jan 2023',
    totalVoyages: 24,
    onTimeRate: 98.5
  };

  return (
    <div className="min-h-screen bg-maritime-dark">
      {/* Header */}
      <header className="border-b border-white/5 bg-maritime-deeper/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rlusd-primary/30 to-rlusd-primary/10 flex items-center justify-center border border-rlusd-primary/30">
                <Ship className="w-5 h-5 text-rlusd-glow" />
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold text-text-primary">
                  Welcome Captain
                </h1>
                <p className="text-xs text-text-muted">Dashboard Overview</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-maritime-slate/30 border border-white/5">
                <div>
                  <p className="text-xs text-text-muted">Active Vessels</p>
                  <p className="text-lg font-mono font-bold text-rlusd-glow">{activeShips}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-text-muted">UTC Time</p>
                <p className="text-sm font-mono text-text-primary">
                  {currentTime.toUTCString().slice(17, 25)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-white/5 bg-maritime-deeper/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('fleet')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === 'fleet'
                  ? 'border-rlusd-primary text-rlusd-glow'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              <Ship className="w-4 h-4" />
              <span className="text-sm font-medium">Fleet Map</span>
            </button>

            <Link href="/dashboard/invoices">
              <button
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-text-muted hover:text-text-primary transition-all"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Invoices</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'fleet' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* DID Details Card */}
            <div className="card p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rlusd-primary/20 to-rlusd-primary/5 flex items-center justify-center border border-rlusd-primary/30">
                      <User className="w-6 h-6 text-rlusd-glow" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{didDetails.companyName}</h3>
                      <p className="text-sm text-text-muted">Verified Shipowner</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-rlusd-primary" />
                        <p className="text-xs text-text-muted uppercase tracking-wider">Decentralized ID</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm text-text-primary">{didDetails.did}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(didDetails.did);
                          }}
                          className="p-1 hover:bg-maritime-slate/50 rounded transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5 text-text-muted" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Ship className="w-4 h-4 text-accent-sky" />
                        <p className="text-xs text-text-muted uppercase tracking-wider">Wallet Address</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm text-text-primary">{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(walletAddress);
                          }}
                          className="p-1 hover:bg-maritime-slate/50 rounded transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5 text-text-muted" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-center px-6 py-4 rounded-xl bg-rlusd-primary/5 border border-rlusd-primary/20">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="w-5 h-5 text-rlusd-glow" />
                      <p className="text-3xl font-mono font-bold text-rlusd-glow">{didDetails.creditScore}</p>
                    </div>
                    <p className="text-xs text-text-muted">Credit Score</p>
                  </div>

                  <div className="text-center px-6 py-4 rounded-xl bg-maritime-slate/30 border border-white/5">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CheckCircle2 className="w-5 h-5 text-accent-sky" />
                      <p className="text-3xl font-mono font-bold text-text-primary">{didDetails.totalVoyages}</p>
                    </div>
                    <p className="text-xs text-text-muted">Total Voyages</p>
                  </div>

                  <div className="text-center px-6 py-4 rounded-xl bg-maritime-slate/30 border border-white/5">
                    <p className="text-3xl font-mono font-bold text-accent-sky">{didDetails.onTimeRate}%</p>
                    <p className="text-xs text-text-muted">On-Time Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fleet Overview Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {mockShips.map((ship) => (
                <motion.div
                  key={ship.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card p-4 hover-lift"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      ship.status === 'active'
                        ? 'bg-rlusd-primary/20 border border-rlusd-primary/30'
                        : 'bg-accent-sky/20 border border-accent-sky/30'
                    }`}>
                      {ship.status === 'parked' ? (
                        <Anchor className="w-5 h-5 text-accent-sky" />
                      ) : (
                        <Ship className="w-5 h-5 text-rlusd-glow" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {ship.name}
                      </p>
                      <p className="text-xs text-text-muted capitalize">{ship.status}</p>
                    </div>
                  </div>

                  {ship.status === 'active' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          Speed
                        </span>
                        <span className="text-text-primary font-mono">{ship.speed} kts</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Destination
                        </span>
                        <span className="text-text-primary">{ship.destination}</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-text-muted">Progress</span>
                          <span className="text-xs font-mono text-rlusd-glow">{ship.voyageProgress}%</span>
                        </div>
                        <div className="h-1.5 bg-maritime-slate/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-rlusd-dim to-rlusd-primary transition-all duration-1000"
                            style={{ width: `${ship.voyageProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {ship.status === 'parked' && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-accent-sky/10 border border-accent-sky/20">
                      <Anchor className="w-4 h-4 text-accent-sky" />
                      <p className="text-xs text-accent-sky">Docked at {ship.destination}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Map Container */}
            <div className="card p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-text-primary mb-1">Fleet Tracking</h2>
                <p className="text-sm text-text-muted">Real-time vessel positions and routes</p>
              </div>

              <div className="h-[600px] rounded-xl overflow-hidden border border-white/5">
                <MapView ships={mockShips} selectedShip={null} />
              </div>

              {/* Map Legend */}
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rlusd-glow" />
                  <span className="text-xs text-text-secondary">Active Vessel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent-sky" />
                  <span className="text-xs text-text-secondary">Parked Vessel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 border-2 border-rlusd-primary rounded-sm" />
                  <span className="text-xs text-text-secondary">Shipping Route</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-maritime-steel border border-rlusd-primary" />
                  <span className="text-xs text-text-secondary">Major Port</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
