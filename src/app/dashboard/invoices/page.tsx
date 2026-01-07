'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Ship,
  FileText,
  ArrowLeft,
} from 'lucide-react';

export default function InvoicesPage() {
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
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-white/5 bg-maritime-deeper/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-text-muted hover:text-text-primary transition-all">
                <Ship className="w-4 h-4" />
                <span className="text-sm font-medium">Fleet Map</span>
              </button>
            </Link>

            <button className="flex items-center gap-2 px-4 py-3 border-b-2 border-rlusd-primary text-rlusd-glow transition-all">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Invoices</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card p-12 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-rlusd-primary/10 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-rlusd-glow" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
            Invoices Coming Soon
          </h2>
          <p className="text-text-muted mb-8">
            Invoice management features will be added here
          </p>
          <Link href="/dashboard">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rlusd-dim to-rlusd-primary text-white font-medium hover:shadow-glow-md transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Fleet Map
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
