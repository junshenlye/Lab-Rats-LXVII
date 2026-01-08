'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Ship,
  FileText,
  User,
  Shield,
  TrendingUp,
  Copy,
  CheckCircle2,
  Waves,
} from 'lucide-react';

export default function Dashboard() {
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
    <div className="min-h-screen bg-maritime-dark flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-maritime-deeper/80 backdrop-blur-xl">
        <div className="px-6 py-4">
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

            <div className="text-right">
              <p className="text-xs text-text-muted">UTC Time</p>
              <p className="text-sm font-mono text-text-primary">
                {currentTime.toUTCString().slice(17, 25)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with Full Profile */}
        <aside className="w-80 border-r border-white/5 bg-maritime-deeper/50 flex flex-col overflow-y-auto">
          {/* Navigation */}
          <nav className="p-4 border-b border-white/5">
            <div className="space-y-2">
              <Link href="/dashboard">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-rlusd-primary/10 border border-rlusd-primary/30 text-rlusd-glow transition-all">
                  <Ship className="w-5 h-5" />
                  <span className="text-sm font-medium">Fleet Map</span>
                </button>
              </Link>

              <Link href="/dashboard/invoices">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-transparent border border-transparent text-text-muted hover:bg-maritime-slate/30 hover:text-text-primary transition-all">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Invoices</span>
                </button>
              </Link>
            </div>
          </nav>

          {/* Full DID Profile in Sidebar */}
          <div className="flex-1 p-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Company Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rlusd-primary/20 to-rlusd-primary/5 flex items-center justify-center border border-rlusd-primary/30">
                    <User className="w-6 h-6 text-rlusd-glow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary truncate">{didDetails.companyName}</h3>
                    <p className="text-xs text-text-muted">Verified Shipowner</p>
                  </div>
                </div>
              </div>

              {/* Credit Score - Prominent */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-rlusd-primary/10 to-rlusd-primary/5 border border-rlusd-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted uppercase tracking-wider">Credit Score</span>
                  <TrendingUp className="w-4 h-4 text-rlusd-glow" />
                </div>
                <p className="text-4xl font-mono font-bold text-rlusd-glow mb-1">{didDetails.creditScore}</p>
                <p className="text-xs text-rlusd-primary">Excellent Standing</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-maritime-slate/30 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-sky" />
                    <span className="text-xs text-text-muted">Voyages</span>
                  </div>
                  <p className="text-2xl font-mono font-bold text-text-primary">{didDetails.totalVoyages}</p>
                </div>

                <div className="p-4 rounded-xl bg-maritime-slate/30 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-sky" />
                    <span className="text-xs text-text-muted">On-Time</span>
                  </div>
                  <p className="text-2xl font-mono font-bold text-accent-sky">{didDetails.onTimeRate}%</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/5" />

              {/* DID */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rlusd-primary" />
                  <p className="text-xs text-text-muted uppercase tracking-wider">Decentralized ID</p>
                </div>
                <div className="p-3 rounded-lg bg-maritime-slate/20 border border-white/5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-xs text-text-primary break-all">{didDetails.did}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(didDetails.did);
                      }}
                      className="p-1.5 hover:bg-maritime-slate/50 rounded transition-colors shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5 text-text-muted" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-accent-sky" />
                  <p className="text-xs text-text-muted uppercase tracking-wider">Wallet Address</p>
                </div>
                <div className="p-3 rounded-lg bg-maritime-slate/20 border border-white/5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs text-text-primary">{walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(walletAddress);
                      }}
                      className="p-1.5 hover:bg-maritime-slate/50 rounded transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-text-muted" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Verified Since */}
              <div className="p-4 rounded-lg bg-maritime-slate/20 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">Verified Since</span>
                  <span className="text-sm font-medium text-text-primary">{didDetails.verifiedSince}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </aside>

        {/* Main Content - Blank Placeholder */}
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center p-12"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-rlusd-primary/20 to-rlusd-primary/5 flex items-center justify-center mx-auto mb-6 border border-rlusd-primary/30">
              <Waves className="w-12 h-12 text-rlusd-glow" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-text-primary mb-3">
              Fleet Tracking
            </h2>
            <p className="text-text-muted max-w-md mx-auto">
              Map and vessel tracking features will be implemented here
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
