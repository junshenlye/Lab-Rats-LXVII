'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  Download,
  Key,
} from 'lucide-react';
import { walletService, WalletInfo } from '@/services/xrpl';

interface WalletGeneratorProps {
  onWalletGenerated?: (wallet: WalletInfo) => void;
  variant?: 'default' | 'compact';
  showTitle?: boolean;
}

export default function WalletGenerator({
  onWalletGenerated,
  variant = 'default',
  showTitle = true,
}: WalletGeneratorProps) {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSeed, setShowSeed] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  const generateWallet = useCallback(() => {
    setIsGenerating(true);
    // Small delay for UX feedback
    setTimeout(() => {
      const newWallet = walletService.generateWallet();
      setWallet(newWallet);
      setIsGenerating(false);
      setShowSeed(false);
      setShowPrivateKey(false);
      onWalletGenerated?.(newWallet);
    }, 500);
  }, [onWalletGenerated]);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const truncateValue = (value: string, chars: number = 12) => {
    if (value.length <= chars * 2) return value;
    return `${value.slice(0, chars)}...${value.slice(-chars)}`;
  };

  const downloadWalletBackup = () => {
    if (!wallet) return;
    const backup = {
      address: wallet.address,
      seed: wallet.seed,
      publicKey: wallet.publicKey,
      createdAt: new Date().toISOString(),
      warning: 'KEEP THIS FILE SECURE. Never share your seed or private key.',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xrpl-wallet-${wallet.address.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={variant === 'compact' ? '' : 'space-y-6'}>
      {showTitle && variant !== 'compact' && (
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-rlusd-primary/10 border border-rlusd-primary/20">
            <Wallet className="w-6 h-6 text-rlusd-primary" />
          </div>
          <div>
            <h2 className="section-title">Generate XRPL Wallet</h2>
            <p className="text-sm text-text-muted mt-0.5">Create a new wallet for the XRP Ledger</p>
          </div>
        </div>
      )}

      {/* Security Warning */}
      {!wallet && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent-amber/10 border border-accent-amber/20 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent-amber flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-accent-amber font-medium">Security Notice</p>
              <p className="text-xs text-text-secondary mt-1">
                Your wallet seed and private key will be generated locally. Store them securely —
                they cannot be recovered if lost.
              </p>
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAcknowledged}
                  onChange={(e) => setHasAcknowledged(e.target.checked)}
                  className="w-4 h-4 rounded border-maritime-mist bg-maritime-slate text-rlusd-primary focus:ring-rlusd-primary/50"
                />
                <span className="text-xs text-text-secondary">
                  I understand and will securely store my credentials
                </span>
              </label>
            </div>
          </div>
        </motion.div>
      )}

      {/* Generate Button */}
      {!wallet && (
        <motion.button
          onClick={generateWallet}
          disabled={isGenerating || !hasAcknowledged}
          className={`w-full py-4 px-6 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            hasAcknowledged
              ? 'bg-gradient-to-r from-rlusd-primary to-rlusd-dim text-maritime-dark hover:shadow-glow-md'
              : 'bg-maritime-slate text-text-muted cursor-not-allowed'
          }`}
          whileHover={hasAcknowledged ? { scale: 1.01 } : {}}
          whileTap={hasAcknowledged ? { scale: 0.99 } : {}}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating Wallet...
            </>
          ) : (
            <>
              <Key className="w-5 h-5" />
              Generate New Wallet
            </>
          )}
        </motion.button>
      )}

      {/* Wallet Details */}
      <AnimatePresence mode="wait">
        {wallet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Success Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rlusd-primary/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-rlusd-glow" />
                </div>
                <span className="text-sm font-medium text-rlusd-glow">Wallet Generated</span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={downloadWalletBackup}
                  className="p-2 rounded-lg bg-maritime-slate/50 hover:bg-maritime-mist/50 transition-colors border border-white/5"
                  whileTap={{ scale: 0.95 }}
                  title="Download Backup"
                >
                  <Download className="w-4 h-4 text-text-secondary" />
                </motion.button>
                <motion.button
                  onClick={generateWallet}
                  className="p-2 rounded-lg bg-maritime-slate/50 hover:bg-maritime-mist/50 transition-colors border border-white/5"
                  whileTap={{ scale: 0.95 }}
                  title="Generate New"
                >
                  <RefreshCw className="w-4 h-4 text-text-secondary" />
                </motion.button>
              </div>
            </div>

            {/* Address (Public) */}
            <div className="bg-gradient-to-r from-rlusd-primary/10 to-transparent rounded-xl p-4 border border-rlusd-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-rlusd-primary" />
                  <span className="text-xs text-rlusd-primary/80 font-medium">Wallet Address</span>
                </div>
                <span className="text-[10px] text-text-muted bg-maritime-slate/50 px-2 py-0.5 rounded">
                  Public
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="font-mono text-sm text-text-primary break-all">
                  {wallet.address}
                </code>
                <motion.button
                  onClick={() => copyToClipboard(wallet.address, 'address')}
                  className="p-2 rounded-lg bg-maritime-slate/50 hover:bg-maritime-mist/50 transition-colors border border-white/5 flex-shrink-0"
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedField === 'address' ? (
                    <Check className="w-4 h-4 text-rlusd-glow" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-muted" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Seed (Secret) */}
            <div className="bg-maritime-navy/50 rounded-xl p-4 border border-accent-coral/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-coral" />
                  <span className="text-xs text-accent-coral font-medium">Secret Seed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-accent-coral bg-accent-coral/10 px-2 py-0.5 rounded">
                    Keep Secret
                  </span>
                  <motion.button
                    onClick={() => setShowSeed(!showSeed)}
                    className="p-1.5 rounded-lg hover:bg-maritime-mist/50 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    {showSeed ? (
                      <EyeOff className="w-3.5 h-3.5 text-text-muted" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-text-muted" />
                    )}
                  </motion.button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="font-mono text-sm text-text-primary">
                  {showSeed ? wallet.seed : '••••••••••••••••••••••••••••••'}
                </code>
                <motion.button
                  onClick={() => copyToClipboard(wallet.seed, 'seed')}
                  className="p-2 rounded-lg bg-maritime-slate/50 hover:bg-maritime-mist/50 transition-colors border border-white/5 flex-shrink-0"
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedField === 'seed' ? (
                    <Check className="w-4 h-4 text-rlusd-glow" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-muted" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Private Key (Secret) */}
            <div className="bg-maritime-navy/50 rounded-xl p-4 border border-accent-coral/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-accent-coral" />
                  <span className="text-xs text-accent-coral font-medium">Private Key</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-accent-coral bg-accent-coral/10 px-2 py-0.5 rounded">
                    Keep Secret
                  </span>
                  <motion.button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="p-1.5 rounded-lg hover:bg-maritime-mist/50 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPrivateKey ? (
                      <EyeOff className="w-3.5 h-3.5 text-text-muted" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-text-muted" />
                    )}
                  </motion.button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="font-mono text-sm text-text-primary break-all">
                  {showPrivateKey ? truncateValue(wallet.privateKey, 16) : '••••••••••••••••••••••••••••••'}
                </code>
                <motion.button
                  onClick={() => copyToClipboard(wallet.privateKey, 'privateKey')}
                  className="p-2 rounded-lg bg-maritime-slate/50 hover:bg-maritime-mist/50 transition-colors border border-white/5 flex-shrink-0"
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedField === 'privateKey' ? (
                    <Check className="w-4 h-4 text-rlusd-glow" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-muted" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Public Key */}
            <div className="bg-maritime-navy/50 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-text-muted" />
                  <span className="text-xs text-text-muted font-medium">Public Key</span>
                </div>
                <span className="text-[10px] text-text-muted bg-maritime-slate/50 px-2 py-0.5 rounded">
                  Public
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="font-mono text-xs text-text-secondary break-all">
                  {truncateValue(wallet.publicKey, 16)}
                </code>
                <motion.button
                  onClick={() => copyToClipboard(wallet.publicKey, 'publicKey')}
                  className="p-2 rounded-lg bg-maritime-slate/50 hover:bg-maritime-mist/50 transition-colors border border-white/5 flex-shrink-0"
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedField === 'publicKey' ? (
                    <Check className="w-4 h-4 text-rlusd-glow" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-muted" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Funding Notice */}
            <div className="bg-accent-sky/10 border border-accent-sky/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent-sky flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-accent-sky font-medium">Activate Your Wallet</p>
                  <p className="text-xs text-text-secondary mt-1">
                    To activate this wallet on the XRP Ledger, send at least 10 XRP to the address
                    above. This is the minimum reserve required by the network.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
