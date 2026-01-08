'use client';

import { useState, useEffect } from 'react';
import {
  loadAndSaveFixedWallets,
  loadSavedWallets,
  clearSavedWallets,
  fundAllRealWallets,
  pollAllWalletBalances,
  pollTransactionConfirmation,
} from '@/lib/waterfall/realWallets';
import { sendXRP } from '@/lib/xrpl/transactions';
import { dropsToXRP } from '@/lib/xrpl/wallets';
import { WalletConfig } from '@/types/waterfall';
import { ExternalLink, Play, DollarSign, Ship, Building2, Shield, RefreshCw, Wallet as WalletIcon } from 'lucide-react';

interface PaymentResult {
  txHash: string;
  paymentAmount: number;
  investorBalanceBefore: number;
  shipownerBalanceBefore: number;
  investorBalanceAfter: number;
  shipownerBalanceAfter: number;
  actualToInvestor: number;
  actualToShipowner: number;
  expectedToInvestor: number;
  expectedToShipowner: number;
  timestamp: string;
}

export default function HookDemoPage() {
  const [wallets, setWallets] = useState<any>(null);
  const [balances, setBalances] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [results, setResults] = useState<PaymentResult[]>([]);
  const [customAmount, setCustomAmount] = useState(250);
  const [investorRecovered, setInvestorRecovered] = useState(0);
  const [hookAddress, setHookAddress] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const INVESTOR_TARGET = 500; // 500 XRP

  // Load saved wallets on mount
  useEffect(() => {
    const saved = loadSavedWallets();
    if (saved) {
      setWallets(saved);
      setHookAddress(saved.platform.address);
      loadBalances(saved);
    }
  }, []);

  // Calculate expected distribution
  const calculateExpectedDistribution = (
    paymentAmount: number,
    recoveredSoFar: number
  ) => {
    const remaining = INVESTOR_TARGET - recoveredSoFar;

    if (remaining <= 0) {
      return { toInvestor: 0, toShipowner: paymentAmount };
    }

    if (paymentAmount >= remaining) {
      return { toInvestor: remaining, toShipowner: paymentAmount - remaining };
    } else {
      return { toInvestor: paymentAmount, toShipowner: 0 };
    }
  };

  // Load fixed wallets
  const handleGenerateWallets = async () => {
    setIsProcessing(true);
    setStatusMessage('📂 Loading fixed wallets (matching Hook deployment)...');

    const newWallets = loadAndSaveFixedWallets();
    setWallets(newWallets);
    setHookAddress(newWallets.platform.address);

    setStatusMessage('💸 Funding wallets from Xahau Testnet faucet...');
    await fundAllRealWallets(newWallets);

    setStatusMessage('🔄 Polling balances...');
    await loadBalances(newWallets);

    setStatusMessage('✅ Wallets ready!');
    setIsProcessing(false);
  };

  // Load balances with polling
  const loadBalances = async (walletsToLoad?: any) => {
    const targetWallets = walletsToLoad || wallets;
    if (!targetWallets) return;

    setIsPolling(true);
    try {
      const bal = await pollAllWalletBalances(targetWallets);
      setBalances(bal);
      setIsPolling(false);
    } catch (error) {
      console.error('Failed to load balances:', error);
      setIsPolling(false);
    }
  };

  // Send payment through Hook
  const handleSendPayment = async (amount: number) => {
    if (!wallets || !hookAddress) {
      alert('Please generate wallets first!');
      return;
    }

    setIsProcessing(true);
    setStatusMessage(`💰 Sending ${amount} XRP to Hook...`);

    try {
      // Calculate expected distribution
      const expected = calculateExpectedDistribution(amount, investorRecovered);

      // Get balances BEFORE payment
      setStatusMessage('📊 Getting balances before payment...');
      await loadBalances();
      const balancesBefore = { ...balances };

      // Send payment: Charterer → Hook
      setStatusMessage(`📤 Charterer paying ${amount} XRP to Hook...`);
      const tx = await sendXRP(
        wallets.charterer,
        hookAddress,
        amount,
        'charterer_payment',
        `Voyage payment: ${amount} XRP`
      );

      setStatusMessage(`⏳ Waiting for transaction confirmation...`);
      const confirmed = await pollTransactionConfirmation(tx.hash!, 15);

      if (!confirmed) {
        throw new Error('Transaction not confirmed');
      }

      // Wait for Hook execution
      setStatusMessage('⚡ Hook executing waterfall distribution...');
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Get balances AFTER Hook execution
      setStatusMessage('📊 Getting balances after Hook execution...');
      await loadBalances();

      // Calculate actual amounts received
      const actualToInvestor = balances.investor - balancesBefore.investor;
      const actualToShipowner = balances.shipowner - balancesBefore.shipowner;

      const result: PaymentResult = {
        txHash: tx.hash!,
        paymentAmount: amount,
        investorBalanceBefore: balancesBefore.investor,
        shipownerBalanceBefore: balancesBefore.shipowner,
        investorBalanceAfter: balances.investor,
        shipownerBalanceAfter: balances.shipowner,
        actualToInvestor,
        actualToShipowner,
        expectedToInvestor: expected.toInvestor,
        expectedToShipowner: expected.toShipowner,
        timestamp: new Date().toISOString(),
      };

      setResults((prev) => [...prev, result]);
      setInvestorRecovered((prev) => prev + actualToInvestor);

      setStatusMessage(`✅ Payment complete! Investor: +${actualToInvestor.toFixed(2)} XRP, Shipowner: +${actualToShipowner.toFixed(2)} XRP`);
    } catch (error: any) {
      console.error('Payment failed:', error);
      setStatusMessage(`❌ Payment failed: ${error.message}`);
    }

    setIsProcessing(false);
  };

  // Run full demo
  const handleFullDemo = async () => {
    setIsProcessing(true);
    setResults([]);
    setInvestorRecovered(0);

    try {
      // Payment 1: 250 XRP
      await handleSendPayment(250);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Payment 2: 300 XRP
      await handleSendPayment(300);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Payment 3: 200 XRP
      await handleSendPayment(200);

      setStatusMessage('✅ Full demo complete!');
    } catch (error) {
      console.error('Demo failed:', error);
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-maritime-deep p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rlusd-primary to-rlusd-dim flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Waterfall Hook Demo</h1>
              <p className="text-gray-400">Live XRPL Hook - Investor Priority Enforcement</p>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="bg-maritime-slate/50 rounded-lg p-4 border border-white/10 mb-4">
              <p className="text-white text-sm">{statusMessage}</p>
            </div>
          )}

          {/* Hook Info */}
          {wallets && (
            <div className="bg-maritime-slate/50 rounded-lg p-4 border border-white/10">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Hook Address:</span>
                  <div className="font-mono text-white flex items-center gap-2">
                    {hookAddress.slice(0, 20)}...
                    <a
                      href={`https://explorer.xahau-test.net/accounts/${hookAddress}`}
                      target="_blank"
                      className="text-rlusd-glow hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Investor Target:</span>
                  <div className="font-mono text-white">{INVESTOR_TARGET} XRP</div>
                </div>
                <div>
                  <span className="text-gray-400">Investor Recovered:</span>
                  <div className="font-mono text-rlusd-glow">
                    {investorRecovered.toFixed(2)} XRP (
                    {((investorRecovered / INVESTOR_TARGET) * 100).toFixed(1)}%)
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <div className="font-mono text-white">
                    {investorRecovered >= INVESTOR_TARGET ? (
                      <span className="text-green-400">✅ Fully Recovered</span>
                    ) : (
                      <span className="text-yellow-400">⏳ Recovering...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Setup Wallets */}
        {!wallets && (
          <div className="bg-maritime-slate/50 rounded-lg p-8 border border-white/10 mb-8 text-center">
            <WalletIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-white mb-4">Load Fixed Wallets</h2>
            <p className="text-gray-400 mb-6">
              Load the 4 fixed XRPL wallets that match your Hook deployment and fund them from Xahau Testnet faucet
            </p>
            <button
              onClick={handleGenerateWallets}
              disabled={isProcessing}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-rlusd-primary to-rlusd-dim text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Loading & Funding...' : 'Load Fixed Wallets'}
            </button>
          </div>
        )}

        {/* Wallets & Controls */}
        {wallets && balances && (
          <>
            {/* Wallet Balances */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <WalletCard
                label="Charterer"
                address={wallets.charterer.address}
                balance={balances.charterer}
                icon={Ship}
                color="blue"
                isPolling={isPolling}
              />
              <WalletCard
                label="Investor"
                address={wallets.investor.address}
                balance={balances.investor}
                icon={DollarSign}
                color="green"
                isPolling={isPolling}
              />
              <WalletCard
                label="Shipowner"
                address={wallets.shipowner.address}
                balance={balances.shipowner}
                icon={Building2}
                color="amber"
                isPolling={isPolling}
              />
              <WalletCard
                label="Hook"
                address={wallets.platform.address}
                balance={balances.platform}
                icon={Shield}
                color="purple"
                isPolling={isPolling}
              />
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Single Payment */}
              <div className="bg-maritime-slate/50 rounded-lg p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Single Payment</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Amount (XRP)</label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-lg bg-maritime-deep border border-white/10 text-white"
                    />
                  </div>
                  <button
                    onClick={() => handleSendPayment(customAmount)}
                    disabled={isProcessing || customAmount <= 0}
                    className="w-full px-6 py-3 rounded-lg bg-rlusd-primary text-white font-medium hover:bg-rlusd-dim transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : `Pay ${customAmount} XRP via Hook`}
                  </button>
                </div>
              </div>

              {/* Full Demo */}
              <div className="bg-maritime-slate/50 rounded-lg p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Auto Demo</h2>
                <div className="space-y-4">
                  <div className="text-sm text-gray-400">
                    <p className="mb-2">Runs 3 payments automatically:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>250 XRP (50% recovery)</li>
                      <li>300 XRP (100% + 50 to shipowner)</li>
                      <li>200 XRP (all to shipowner)</li>
                    </ul>
                  </div>
                  <button
                    onClick={handleFullDemo}
                    disabled={isProcessing}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-rlusd-primary to-rlusd-dim text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    {isProcessing ? 'Running Demo...' : 'Run Full Demo'}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => loadBalances()}
                disabled={isProcessing}
                className="px-6 py-2 rounded-lg bg-maritime-slate border border-white/10 text-white hover:bg-maritime-slate/70 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isPolling ? 'animate-spin' : ''}`} />
                Refresh Balances
              </button>
              <button
                onClick={() => {
                  clearSavedWallets();
                  setWallets(null);
                  setBalances(null);
                  setResults([]);
                  setInvestorRecovered(0);
                }}
                disabled={isProcessing}
                className="px-6 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all"
              >
                Reset Wallets
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Transaction Results</h2>
                {results.map((result, idx) => (
                  <ResultCard key={idx} result={result} index={idx + 1} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function WalletCard({
  label,
  address,
  balance,
  icon: Icon,
  color,
  isPolling,
}: {
  label: string;
  address: string;
  balance?: number;
  icon: any;
  color: string;
  isPolling?: boolean;
}) {
  const colors: any = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-lg p-4 border`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-white" />
        <span className="font-bold text-white">{label}</span>
      </div>
      <div className="text-xs text-gray-400 font-mono mb-2 truncate">{address}</div>
      {balance !== undefined && (
        <div className="text-lg font-bold text-white flex items-center gap-2">
          {balance.toFixed(2)} XRP
          {isPolling && <RefreshCw className="w-4 h-4 animate-spin" />}
        </div>
      )}
      <a
        href={`https://explorer.xahau-test.net/accounts/${address}`}
        target="_blank"
        className="text-xs text-rlusd-glow hover:underline flex items-center gap-1"
      >
        View on Explorer <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

function ResultCard({ result, index }: { result: PaymentResult; index: number }) {
  const investorMatch = Math.abs(result.actualToInvestor - result.expectedToInvestor) < 0.01;
  const shipownerMatch = Math.abs(result.actualToShipowner - result.expectedToShipowner) < 0.01;

  return (
    <div className="bg-maritime-slate/50 rounded-lg p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Payment #{index}</h3>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
          Confirmed
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        {/* Expected */}
        <div>
          <h4 className="text-sm font-bold text-gray-400 mb-3">Expected Distribution</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Payment Amount:</span>
              <span className="text-white font-mono">{result.paymentAmount} XRP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">→ Investor:</span>
              <span className="text-green-400 font-mono">{result.expectedToInvestor} XRP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">→ Shipowner:</span>
              <span className="text-amber-400 font-mono">{result.expectedToShipowner} XRP</span>
            </div>
          </div>
        </div>

        {/* Actual */}
        <div>
          <h4 className="text-sm font-bold text-gray-400 mb-3">Actual Distribution (On-Chain)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">→ Investor:</span>
              <span className="flex items-center gap-2">
                <span className="text-green-400 font-mono">
                  {result.actualToInvestor.toFixed(2)} XRP
                </span>
                {investorMatch ? '✅' : '⚠️'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">→ Shipowner:</span>
              <span className="flex items-center gap-2">
                <span className="text-amber-400 font-mono">
                  {result.actualToShipowner.toFixed(2)} XRP
                </span>
                {shipownerMatch ? '✅' : '⚠️'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Link */}
      <a
        href={`https://explorer.xahau-test.net/transactions/${result.txHash}`}
        target="_blank"
        className="inline-flex items-center gap-2 text-rlusd-glow hover:underline text-sm"
      >
        View Transaction on Explorer <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
