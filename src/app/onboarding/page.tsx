'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Building2,
  FileText,
  Shield,
  Fingerprint,
  ChevronRight,
  ChevronLeft,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  X,
  Wallet,
  Database,
  Link2,
  ExternalLink,
  Copy,
  PenLine,
  Ship,
  ArrowLeft,
  Zap,
  Key,
} from 'lucide-react';

type Step = 'wallet-connect' | 'did-company-info' | 'documents' | 'verification' | 'vc-issuance';
type VerificationStatus = 'pending' | 'uploading-ipfs' | 'awaiting-review' | 'verified' | 'failed';
type DocumentStatus = 'not-uploaded' | 'uploaded' | 'verifying' | 'verified' | 'rejected';
type DIDStatus = 'pending' | 'checking' | 'found' | 'not-found' | 'creating' | 'created' | 'failed';
type VCStatus = 'pending' | 'issuing' | 'issued' | 'failed';

interface CompanyInfo {
  companyName: string;
  registrationNumber: string;
  countryOfIncorporation: string;
  registeredAddress: string;
  contactEmail: string;
  contactPhone: string;
}

interface Document {
  name: string;
  file: File | null;
  status: DocumentStatus;
  uploadedAt?: string;
}

const steps: { id: Step; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'wallet-connect', label: 'Connect Wallet', icon: Wallet, description: 'Connect Crossmark wallet' },
  { id: 'did-company-info', label: 'DID & Company', icon: Fingerprint, description: 'Create DID with company info' },
  { id: 'documents', label: 'Documents', icon: FileText, description: 'Upload KYC documents' },
  { id: 'verification', label: 'Verification', icon: Shield, description: 'Platform verification' },
  { id: 'vc-issuance', label: 'VC Issuance', icon: Shield, description: 'Issue verification credential' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('wallet-connect');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: '',
    registrationNumber: '',
    countryOfIncorporation: '',
    registeredAddress: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [documents, setDocuments] = useState<{
    certificateOfIncorporation: Document;
    registryExtract: Document;
  }>({
    certificateOfIncorporation: { name: 'Certificate of Incorporation', file: null, status: 'not-uploaded' },
    registryExtract: { name: 'Registry Extract', file: null, status: 'not-uploaded' },
  });
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [didStatus, setDidStatus] = useState<DIDStatus>('pending');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');
  const [vcStatus, setVcStatus] = useState<VCStatus>('pending');
  const [ipfsCid, setIpfsCid] = useState<string | null>(null);

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (documentKey: 'certificateOfIncorporation' | 'registryExtract', file: File) => {
    setDocuments(prev => ({
      ...prev,
      [documentKey]: {
        ...prev[documentKey],
        file,
        status: 'uploaded',
        uploadedAt: new Date().toISOString(),
      },
    }));
  };

  const handleRemoveFile = (documentKey: 'certificateOfIncorporation' | 'registryExtract') => {
    setDocuments(prev => ({
      ...prev,
      [documentKey]: {
        ...prev[documentKey],
        file: null,
        status: 'not-uploaded',
        uploadedAt: undefined,
      },
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'wallet-connect':
        // Can proceed if wallet connected and DID check is not running and no network failure
        return connectedWalletAddress !== null && didStatus !== 'checking' && didStatus !== 'failed';
      case 'did-company-info':
        // Can proceed if DID creation was successful
        return didStatus === 'created';
      case 'documents':
        return documents.certificateOfIncorporation.file && documents.registryExtract.file;
      case 'verification':
        return verificationStatus === 'awaiting-review' || verificationStatus === 'verified';
      case 'vc-issuance':
        return vcStatus === 'issued';
      default:
        return false;
    }
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      const targetStep = steps[nextIndex].id;
      setCurrentStep(targetStep);

      // Simulate IPFS upload when reaching verification step
      if (targetStep === 'verification') {
        setVerificationStatus('uploading-ipfs');
        setTimeout(() => {
          setIpfsCid('QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco');
          setVerificationStatus('awaiting-review');
        }, 2000);
      }
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleConnectWallet = () => {
    setIsConnectingWallet(true);
    // Simulate wallet connection
    setTimeout(() => {
      setConnectedWalletAddress('rXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      setIsConnectingWallet(false);
      setDidStatus('not-found');
    }, 1500);
  };

  const handleCreateDID = () => {
    setDidStatus('creating');
    // Simulate DID creation
    setTimeout(() => {
      setDidStatus('created');
    }, 1500);
  };

  const handleIssueVC = () => {
    setVcStatus('issuing');
    // Simulate VC issuance
    setTimeout(() => {
      setVcStatus('issued');
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'wallet-connect':
        return (
          <WalletConnectStep
            walletAddress={connectedWalletAddress}
            isConnecting={isConnectingWallet}
            didStatus={didStatus}
            onConnect={handleConnectWallet}
          />
        );
      case 'did-company-info':
        return (
          <DIDCompanyInfoStep
            companyInfo={companyInfo}
            onChange={handleCompanyInfoChange}
            walletAddress={connectedWalletAddress!}
            didStatus={didStatus}
            onCreateDID={handleCreateDID}
          />
        );
      case 'documents':
        return (
          <DocumentsStep
            documents={documents}
            onUpload={handleFileUpload}
            onRemove={handleRemoveFile}
          />
        );
      case 'verification':
        return (
          <VerificationStep
            companyInfo={companyInfo}
            documents={documents}
            verificationStatus={verificationStatus}
            ipfsCid={ipfsCid}
            walletAddress={connectedWalletAddress}
          />
        );
      case 'vc-issuance':
        return (
          <VCIssuanceStep
            companyInfo={companyInfo}
            ipfsCid={ipfsCid}
            vcStatus={vcStatus}
            onIssueVC={handleIssueVC}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-maritime-deeper/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-rlusd-primary/30 to-rlusd-primary/10 flex items-center justify-center border border-rlusd-primary/30"
                whileHover={{ scale: 1.05 }}
              >
                <Ship className="w-5 h-5 text-rlusd-glow" />
              </motion.div>
              <span className="font-display text-lg font-semibold text-text-primary">Maritime Finance</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rlusd-primary/10 border border-rlusd-primary/20 text-xs text-rlusd-glow">
                <Zap className="w-3 h-3" />
                Built on XRPL
              </span>
              <Link href="/">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-text-secondary text-sm hover:bg-maritime-slate/30 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Page Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-sm text-accent-amber mb-4">
              <Shield className="w-4 h-4" />
              KYC Verification
            </div>
            <h1 className="font-display text-4xl font-bold text-text-primary mb-3">
              Ship Owner Onboarding
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Complete your company verification to receive a Decentralized Identifier (DID) on the XRP Ledger
            </p>
          </motion.div>

          {/* Progress Steps - Horizontal */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = index < currentStepIndex;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                          isCompleted
                            ? 'bg-rlusd-primary/20 border-rlusd-primary text-rlusd-glow'
                            : isActive
                            ? 'bg-rlusd-primary/10 border-rlusd-primary/50 text-rlusd-glow shadow-glow-sm'
                            : 'bg-maritime-slate/30 border-white/10 text-text-muted'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </motion.div>
                      <p className={`mt-3 text-sm font-medium ${
                        isActive || isCompleted ? 'text-text-primary' : 'text-text-muted'
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-text-muted hidden md:block text-center">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-12 md:w-24 h-0.5 mx-2 md:mx-4 bg-maritime-slate/30 relative self-start mt-7">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-rlusd-primary to-rlusd-glow"
                          initial={{ width: 0 }}
                          animate={{ width: isCompleted ? '100%' : '0%' }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-muted">Step {currentStepIndex + 1} of {steps.length}</span>
                <span className="text-xs text-rlusd-glow font-mono">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-maritime-slate/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-rlusd-dim to-rlusd-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Step Content */}
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <motion.div
            className="mt-10 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                currentStepIndex === 0
                  ? 'border-white/5 text-text-muted cursor-not-allowed'
                  : 'border-white/10 text-text-primary hover:bg-maritime-slate/30'
              }`}
              whileHover={currentStepIndex > 0 ? { scale: 1.02 } : {}}
              whileTap={currentStepIndex > 0 ? { scale: 0.98 } : {}}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </motion.button>

            {currentStep !== 'vc-issuance' && (
              <motion.button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-rlusd-dim to-rlusd-primary text-white hover:shadow-glow-md'
                    : 'bg-maritime-slate/30 text-text-muted cursor-not-allowed'
                }`}
                whileHover={canProceed() ? { scale: 1.02 } : {}}
                whileTap={canProceed() ? { scale: 0.98 } : {}}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}

            {currentStep === 'vc-issuance' && vcStatus === 'issued' && (
              <Link href="/dashboard">
                <motion.button
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-rlusd-dim to-rlusd-primary text-white hover:shadow-glow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Dashboard
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between text-sm text-text-muted">
            <p>Your data is encrypted and securely stored</p>
            <p>Powered by XRP Ledger • RLUSD</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Step Components

// Step 1: Connect Crossmark Wallet
function WalletConnectStep({
  walletAddress,
  isConnecting,
  didStatus,
  onConnect,
}: {
  walletAddress: string | null;
  isConnecting: boolean;
  didStatus: DIDStatus;
  onConnect: () => void;
}) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            walletAddress
              ? 'bg-gradient-to-br from-rlusd-primary/20 to-rlusd-primary/5'
              : 'bg-gradient-to-br from-accent-sky/20 to-accent-sky/5'
          }`}>
            {walletAddress ? (
              <CheckCircle2 className="w-6 h-6 text-rlusd-glow" />
            ) : (
              <Wallet className="w-6 h-6 text-accent-sky" />
            )}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              {walletAddress ? 'Wallet Connected' : 'Connect Your Wallet'}
            </h2>
            <p className="text-sm text-text-muted">
              {walletAddress
                ? 'Your Crossmark wallet is connected'
                : 'Connect your Crossmark wallet to continue'}
            </p>
          </div>
        </div>
      </div>
      <div className="card-body space-y-6">
        {!walletAddress ? (
          <>
            {/* Info Banner */}
            <div className="p-4 rounded-xl bg-accent-sky/5 border border-accent-sky/20">
              <div className="flex items-start gap-3">
                <Wallet className="w-5 h-5 text-accent-sky shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-text-primary font-medium">Why connect a wallet?</p>
                  <p className="text-xs text-text-muted mt-1">
                    Your XRPL wallet address is required to create your Decentralized Identifier (DID),
                    receive RLUSD payments, and interact with maritime contracts on the XRP Ledger.
                  </p>
                </div>
              </div>
            </div>

            {/* Connect Button */}
            <motion.button
              onClick={onConnect}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-rlusd-dim to-rlusd-primary text-white font-medium hover:shadow-glow-md transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Connect Crossmark Wallet
                </>
              )}
            </motion.button>

            <p className="text-xs text-text-muted text-center">
              Don&apos;t have Crossmark? <a href="https://crossmark.io" target="_blank" rel="noopener noreferrer" className="text-accent-sky hover:underline">Download it here</a>
            </p>
          </>
        ) : (
          <>
            {/* Connected State */}
            <motion.div
              className="flex flex-col items-center py-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rlusd-primary/30 to-rlusd-primary/10 flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Wallet className="w-10 h-10 text-rlusd-glow" />
              </motion.div>
              <h3 className="text-xl font-display font-semibold text-text-primary">Wallet Connected</h3>
              <p className="text-sm text-text-secondary mt-1">Ready to proceed</p>
            </motion.div>

            {/* Wallet Address Display */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-rlusd-primary/10 to-transparent border border-rlusd-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-rlusd-primary" />
                <span className="text-xs text-rlusd-primary/80 font-medium">Wallet Address</span>
              </div>
              <code className="font-mono text-sm text-text-primary break-all">{walletAddress}</code>
            </div>

            {/* DID Check Status */}
            {didStatus === 'checking' && (
              <div className="p-4 rounded-xl bg-accent-sky/5 border border-accent-sky/20">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-accent-sky animate-spin" />
                  <div>
                    <p className="text-sm text-text-primary">Checking for existing DID...</p>
                    <p className="text-xs text-text-muted">Looking up your wallet on the platform</p>
                  </div>
                </div>
              </div>
            )}


            {didStatus === 'not-found' && (
              <div className="p-4 rounded-xl bg-accent-amber/5 border border-accent-amber/20">
                <div className="flex items-start gap-3">
                  <Fingerprint className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-text-primary font-medium">No DID Found</p>
                    <p className="text-xs text-text-muted mt-1">
                      No DID was found — this is expected. In the next step we will create a Decentralized Identifier (DID) for your company.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {didStatus === 'failed' && (
              <div className="p-4 rounded-xl bg-accent-coral/5 border border-accent-coral/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-accent-coral shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-text-primary font-medium">DID check failed</p>
                    <p className="text-xs text-text-muted mt-1">There was a network or verification error. Please try again.</p>
                    <div className="mt-3">
                      <motion.button
                        onClick={onConnect}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-rlusd-dim to-rlusd-primary text-white text-sm"
                        whileHover={{ scale: 1.02 }}
                      >
                        Retry
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Step 2: DID & Company Info (combined)
function DIDCompanyInfoStep({
  companyInfo,
  onChange,
  walletAddress,
  didStatus,
  onCreateDID,
}: {
  companyInfo: CompanyInfo;
  onChange: (field: keyof CompanyInfo, value: string) => void;
  walletAddress: string;
  didStatus: DIDStatus;
  onCreateDID: () => void;
}) {
  const canCreate = companyInfo.companyName && companyInfo.registrationNumber &&
                    companyInfo.countryOfIncorporation && companyInfo.contactEmail;

  if (didStatus === 'created') {
    // DID Created - show success state
    return (
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rlusd-primary/30 to-rlusd-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-rlusd-glow" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-text-primary">DID Created Successfully</h2>
              <p className="text-sm text-text-muted">Your decentralized identity is ready</p>
            </div>
          </div>
        </div>
        <div className="card-body space-y-6">
          <motion.div
            className="flex flex-col items-center py-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rlusd-primary/30 to-rlusd-primary/10 flex items-center justify-center mb-4 shadow-glow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Fingerprint className="w-10 h-10 text-rlusd-glow" />
            </motion.div>
            <h3 className="text-xl font-display font-semibold text-text-primary">DID Created</h3>
            <p className="text-sm text-text-secondary mt-1">Your identity is anchored on XRPL</p>
          </motion.div>

          <div className="p-5 rounded-xl bg-gradient-to-r from-rlusd-primary/10 to-transparent border border-rlusd-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint className="w-4 h-4 text-rlusd-primary" />
              <span className="text-xs text-rlusd-primary/80 font-medium">Your DID</span>
            </div>
            <code className="font-mono text-sm text-rlusd-glow break-all">did:xrpl:1:{walletAddress.substring(0, 20)}...</code>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-maritime-slate/20 border border-white/5">
              <p className="text-xs text-text-muted mb-1">Company</p>
              <p className="text-sm text-text-primary font-medium">{companyInfo.companyName}</p>
            </div>
            <div className="p-4 rounded-xl bg-maritime-slate/20 border border-white/5">
              <p className="text-xs text-text-muted mb-1">Registration</p>
              <p className="text-sm text-text-primary font-mono">{companyInfo.registrationNumber}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rlusd-primary/5 border border-rlusd-primary/20">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-rlusd-glow shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-text-primary font-medium">Next: Upload Documents</p>
                <p className="text-xs text-text-muted mt-1">
                  Upload your KYC documents for platform verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-violet/5 flex items-center justify-center">
            <Fingerprint className="w-6 h-6 text-accent-violet" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">Create DID & Company Info</h2>
            <p className="text-sm text-text-muted">Enter company details to create your DID</p>
          </div>
        </div>
      </div>
      <div className="card-body space-y-6">
        {/* Wallet Address Context */}
        <div className="p-4 rounded-xl bg-maritime-slate/30 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-text-muted" />
            <span className="text-xs text-text-muted">Creating DID for wallet</span>
          </div>
          <code className="font-mono text-sm text-text-primary">{walletAddress}</code>
        </div>

        {/* Company Info Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Company Name *</label>
            <input
              type="text"
              value={companyInfo.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-maritime-slate/30 border border-white/10 text-text-primary placeholder-text-muted focus:border-rlusd-primary/50 focus:bg-maritime-slate/50 transition-all outline-none"
              placeholder="e.g., Pacific Maritime Ltd"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Registration Number *</label>
            <input
              type="text"
              value={companyInfo.registrationNumber}
              onChange={(e) => onChange('registrationNumber', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-maritime-slate/30 border border-white/10 text-text-primary placeholder-text-muted focus:border-rlusd-primary/50 focus:bg-maritime-slate/50 transition-all outline-none"
              placeholder="e.g., 202401234K"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Country of Incorporation *</label>
            <select
              value={companyInfo.countryOfIncorporation}
              onChange={(e) => onChange('countryOfIncorporation', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-maritime-slate/30 border border-white/10 text-text-primary focus:border-rlusd-primary/50 focus:bg-maritime-slate/50 transition-all outline-none"
            >
              <option value="" className="bg-maritime-navy">Select country</option>
              <option value="SG" className="bg-maritime-navy">Singapore</option>
              <option value="HK" className="bg-maritime-navy">Hong Kong</option>
              <option value="GB" className="bg-maritime-navy">United Kingdom</option>
              <option value="NL" className="bg-maritime-navy">Netherlands</option>
              <option value="DE" className="bg-maritime-navy">Germany</option>
              <option value="NO" className="bg-maritime-navy">Norway</option>
              <option value="GR" className="bg-maritime-navy">Greece</option>
              <option value="JP" className="bg-maritime-navy">Japan</option>
              <option value="US" className="bg-maritime-navy">United States</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Contact Email *</label>
            <input
              type="email"
              value={companyInfo.contactEmail}
              onChange={(e) => onChange('contactEmail', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-maritime-slate/30 border border-white/10 text-text-primary placeholder-text-muted focus:border-rlusd-primary/50 focus:bg-maritime-slate/50 transition-all outline-none"
              placeholder="e.g., compliance@company.com"
            />
          </div>
        </div>

        {/* Create DID Button */}
        <motion.button
          onClick={onCreateDID}
          disabled={!canCreate || didStatus === 'creating'}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
            canCreate && didStatus !== 'creating'
              ? 'bg-gradient-to-r from-rlusd-dim to-rlusd-primary text-white hover:shadow-glow-md'
              : 'bg-maritime-slate/30 text-text-muted cursor-not-allowed'
          }`}
          whileHover={canCreate ? { scale: 1.02 } : {}}
          whileTap={canCreate ? { scale: 0.98 } : {}}
        >
          {didStatus === 'creating' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating DID...
            </>
          ) : (
            <>
              <PenLine className="w-5 h-5" />
              Create DID
            </>
          )}
        </motion.button>

        <p className="text-xs text-text-muted text-center">
          <span className="text-accent-amber">*</span> Required fields. Your DID will be anchored on the XRP Ledger.
        </p>
      </div>
    </div>
  );
}

function CompanyInfoStep({
  companyInfo,
  onChange,
}: {
  companyInfo: CompanyInfo;
  onChange: (field: keyof CompanyInfo, value: string) => void;
}) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rlusd-primary/20 to-rlusd-primary/5 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-rlusd-glow" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">Company Information</h2>
            <p className="text-sm text-text-muted">Enter your company's legal details</p>
          </div>
        </div>
      </div>
      <div className="card-body space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Company Name *</label>
            <input
              type="text"
              value={companyInfo.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-maritime-slate/30 border border-white/10 text-text-primary placeholder-text-muted focus:border-rlusd-primary/50 focus:bg-maritime-slate/50 transition-all outline-none"
              placeholder="e.g., Pacific Maritime Ltd"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Registration Number *</label>
            <input
              type="text"
              value={companyInfo.registrationNumber}
              onChange={(e) => onChange('registrationNumber', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-maritime-slate/30 border border-white/10 text-text-primary placeholder-text-muted focus:border-rlusd-primary/50 focus:bg-maritime-slate/50 transition-all outline-none"
              placeholder="e.g., 202401234K"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Country of Incorporation *</label>
            <select
              value={companyInfo.countryOfIncorporation}
              onChange={(e) => onChange('countryOfIncorporation', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-maritime-slate/30 border border-white/10 text-text-primary focus:border-rlusd-primary/50 focus:bg-maritime-slate/50 transition-all outline-none"
            >
              <option value="" className="bg-maritime-navy">Select country</option>
              <option value="SG" className="bg-maritime-navy">Singapore</option>
              <option value="HK" className="bg-maritime-navy">Hong Kong</option>
              <option value="GB" className="bg-maritime-navy">United Kingdom</option>
              <option value="NL" className="bg-maritime-navy">Netherlands</option>
              <option value="DE" className="bg-maritime-navy">Germany</option>
              <option value="NO" className="bg-maritime-navy">Norway</option>
              <option value="GR" className="bg-maritime-navy">Greece</option>
              <option value="JP" className="bg-maritime-navy">Japan</option>
              <option value="US" className="bg-maritime-navy">United States</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Contact Email *</label>
            <input
              type="email"
              value={companyInfo.contactEmail}
              onChange={(e) => onChange('contactEmail', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-maritime-slate/30 border border-white/10 text-text-primary placeholder-text-muted focus:border-rlusd-primary/50 focus:bg-maritime-slate/50 transition-all outline-none"
              placeholder="e.g., compliance@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Registered Address</label>
          <textarea
            value={companyInfo.registeredAddress}
            onChange={(e) => onChange('registeredAddress', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-maritime-slate/30 border border-white/10 text-text-primary placeholder-text-muted focus:border-rlusd-primary/50 focus:bg-maritime-slate/50 transition-all outline-none resize-none"
            placeholder="Enter full registered address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Contact Phone</label>
          <input
            type="tel"
            value={companyInfo.contactPhone}
            onChange={(e) => onChange('contactPhone', e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-maritime-slate/30 border border-white/10 text-text-primary placeholder-text-muted focus:border-rlusd-primary/50 focus:bg-maritime-slate/50 transition-all outline-none"
            placeholder="e.g., +65 6123 4567"
          />
        </div>

        <div className="pt-4 border-t border-white/5">
          <p className="text-xs text-text-muted">
            <span className="text-accent-amber">*</span> Required fields. Please ensure all information matches your official registration documents.
          </p>
        </div>
      </div>
    </div>
  );
}

function DocumentsStep({
  documents,
  onUpload,
  onRemove,
}: {
  documents: { certificateOfIncorporation: Document; registryExtract: Document };
  onUpload: (key: 'certificateOfIncorporation' | 'registryExtract', file: File) => void;
  onRemove: (key: 'certificateOfIncorporation' | 'registryExtract') => void;
}) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-sky/20 to-accent-sky/5 flex items-center justify-center">
            <FileText className="w-6 h-6 text-accent-sky" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">KYC Documents</h2>
            <p className="text-sm text-text-muted">Upload required verification documents</p>
          </div>
        </div>
      </div>
      <div className="card-body space-y-6">
        <DocumentUpload
          label="Certificate of Incorporation"
          description="Official document proving your company's legal registration"
          document={documents.certificateOfIncorporation}
          onUpload={(file) => onUpload('certificateOfIncorporation', file)}
          onRemove={() => onRemove('certificateOfIncorporation')}
        />

        <DocumentUpload
          label="Registry Extract"
          description="Recent extract from the company registry (not older than 3 months)"
          document={documents.registryExtract}
          onUpload={(file) => onUpload('registryExtract', file)}
          onRemove={() => onRemove('registryExtract')}
        />

        <div className="p-4 rounded-xl bg-accent-amber/5 border border-accent-amber/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-text-primary font-medium">Document Requirements</p>
              <ul className="mt-2 text-xs text-text-muted space-y-1">
                <li>• Documents must be in PDF, JPG, or PNG format</li>
                <li>• Maximum file size: 10MB per document</li>
                <li>• Documents must be clearly legible</li>
                <li>• Registry extract must be dated within the last 3 months</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentUpload({
  label,
  description,
  document,
  onUpload,
  onRemove,
}: {
  label: string;
  description: string;
  document: Document;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
      <p className="text-xs text-text-muted mb-3">{description}</p>

      {document.status === 'not-uploaded' ? (
        <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-white/10 bg-maritime-slate/20 hover:bg-maritime-slate/30 hover:border-rlusd-primary/30 transition-all cursor-pointer">
          <Upload className="w-10 h-10 text-text-muted mb-3" />
          <span className="text-sm text-text-secondary">Click to upload or drag and drop</span>
          <span className="text-xs text-text-muted mt-1">PDF, JPG, PNG up to 10MB</span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-xl bg-maritime-slate/30 border border-rlusd-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-rlusd-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-rlusd-glow" />
            </div>
            <div>
              <p className="text-sm text-text-primary font-medium">{document.file?.name}</p>
              <p className="text-xs text-rlusd-glow">Ready for verification</p>
            </div>
          </div>
          <motion.button
            onClick={onRemove}
            className="p-2 rounded-lg hover:bg-maritime-steel/50 text-text-muted hover:text-accent-coral transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </div>
  );
}

function VerificationStep({
  companyInfo,
  documents,
  verificationStatus,
  ipfsCid,
  walletAddress,
}: {
  companyInfo: CompanyInfo;
  documents: { certificateOfIncorporation: Document; registryExtract: Document };
  verificationStatus: VerificationStatus;
  ipfsCid: string | null;
  walletAddress: string | null;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            verificationStatus === 'awaiting-review'
              ? 'bg-gradient-to-br from-accent-amber/20 to-accent-amber/5'
              : verificationStatus === 'uploading-ipfs'
              ? 'bg-gradient-to-br from-accent-sky/20 to-accent-sky/5'
              : 'bg-gradient-to-br from-accent-amber/20 to-accent-amber/5'
          }`}>
            {verificationStatus === 'uploading-ipfs' ? (
              <Database className="w-6 h-6 text-accent-sky" />
            ) : (
              <Shield className="w-6 h-6 text-accent-amber" />
            )}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">Platform Verification</h2>
            <p className="text-sm text-text-muted">
              {verificationStatus === 'uploading-ipfs'
                ? 'Generating IPFS metadata for your documents'
                : verificationStatus === 'awaiting-review'
                ? 'Submission complete - Pending platform review'
                : 'Preparing verification submission'}
            </p>
          </div>
        </div>
      </div>
      <div className="card-body space-y-6">
        {/* Company Summary */}
        <div className="p-5 rounded-xl bg-maritime-slate/30 border border-white/5">
          <p className="text-xs uppercase tracking-wider text-text-muted mb-4">Company Details</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-muted text-xs">Company Name</span>
              <p className="text-text-primary font-medium">{companyInfo.companyName || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-text-muted text-xs">Registration No.</span>
              <p className="text-text-primary font-mono">{companyInfo.registrationNumber || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-text-muted text-xs">Country</span>
              <p className="text-text-primary">{companyInfo.countryOfIncorporation || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-text-muted text-xs">Email</span>
              <p className="text-text-primary">{companyInfo.contactEmail || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* IPFS Upload Progress */}
        <div className="p-5 rounded-xl bg-maritime-slate/20 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                ipfsCid ? 'bg-rlusd-primary/20' : 'bg-accent-sky/20'
              }`}>
                {ipfsCid ? (
                  <CheckCircle2 className="w-6 h-6 text-rlusd-glow" />
                ) : (
                  <Loader2 className="w-6 h-6 text-accent-sky animate-spin" />
                )}
              </div>
              <div>
                <p className="text-sm text-text-primary font-medium">IPFS Metadata</p>
                <p className="text-xs text-text-muted">
                  {ipfsCid ? 'Successfully uploaded to IPFS' : 'Uploading documents to IPFS...'}
                </p>
              </div>
            </div>
            {ipfsCid && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rlusd-primary/20 text-xs text-rlusd-glow">
                <Check className="w-3 h-3" />
                Complete
              </div>
            )}
          </div>

          {ipfsCid && (
            <div className="p-3 rounded-lg bg-maritime-navy/50 border border-white/5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Link2 className="w-4 h-4 text-accent-sky shrink-0" />
                  <code className="text-xs font-mono text-accent-sky truncate">{ipfsCid}</code>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <motion.button
                    onClick={() => copyToClipboard(ipfsCid)}
                    className="p-2 rounded-md hover:bg-maritime-steel/50 text-text-muted hover:text-text-primary transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copied ? <Check className="w-4 h-4 text-rlusd-glow" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                  <motion.a
                    href={`https://ipfs.io/ipfs/${ipfsCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md hover:bg-maritime-steel/50 text-text-muted hover:text-text-primary transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documents Submitted */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-text-muted">Documents Submitted</p>

          <div className="flex items-center justify-between p-4 rounded-xl bg-maritime-slate/20 border border-white/5">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-text-muted" />
              <span className="text-sm text-text-primary">Certificate of Incorporation</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              ipfsCid ? 'bg-rlusd-primary/20 text-rlusd-glow' : 'bg-accent-amber/20 text-accent-amber'
            }`}>
              {ipfsCid ? <Check className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin" />}
              {ipfsCid ? 'Verified' : 'Verifying'}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-maritime-slate/20 border border-white/5">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-text-muted" />
              <span className="text-sm text-text-primary">Registry Extract</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              ipfsCid ? 'bg-rlusd-primary/20 text-rlusd-glow' : 'bg-accent-amber/20 text-accent-amber'
            }`}>
              {ipfsCid ? <Check className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin" />}
              {ipfsCid ? 'Verified' : 'Verifying'}
            </div>
          </div>
        </div>

        {/* Status Notice */}
        {verificationStatus === 'awaiting-review' && (
          <div className="p-4 rounded-xl bg-accent-amber/5 border border-accent-amber/20">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-text-primary font-medium">Pending Platform Review</p>
                <p className="text-xs text-text-muted mt-1">
                  Your KYC documents have been uploaded to IPFS and are now pending review by the platform.
                  You can proceed to the DID issuance step, but signing will require platform approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === 'uploading-ipfs' && (
          <div className="p-4 rounded-xl bg-accent-sky/5 border border-accent-sky/20">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-accent-sky animate-spin" />
              <div>
                <p className="text-sm text-text-primary">Generating IPFS Metadata</p>
                <p className="text-xs text-text-muted">Creating immutable record of your verification documents...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 5: VC Issuance (final step)
function VCIssuanceStep({
  companyInfo,
  ipfsCid,
  vcStatus,
  onIssueVC,
}: {
  companyInfo: CompanyInfo;
  ipfsCid: string | null;
  vcStatus: VCStatus;
  onIssueVC: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            vcStatus === 'issued'
              ? 'bg-gradient-to-br from-rlusd-primary/30 to-rlusd-primary/10'
              : vcStatus === 'issuing'
              ? 'bg-gradient-to-br from-accent-violet/20 to-accent-violet/5'
              : 'bg-gradient-to-br from-accent-amber/20 to-accent-amber/5'
          }`}>
            {vcStatus === 'issued' ? (
              <CheckCircle2 className="w-6 h-6 text-rlusd-glow" />
            ) : vcStatus === 'issuing' ? (
              <Loader2 className="w-6 h-6 text-accent-violet animate-spin" />
            ) : (
              <Shield className="w-6 h-6 text-accent-amber" />
            )}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              {vcStatus === 'issued'
                ? 'Verification Complete!'
                : vcStatus === 'issuing'
                ? 'Issuing Credential...'
                : 'Issue Verification Credential'}
            </h2>
            <p className="text-sm text-text-muted">
              {vcStatus === 'issued'
                ? 'Your verified credential is ready'
                : vcStatus === 'issuing'
                ? 'Creating your verification credential'
                : 'Request your platform verification credential'}
            </p>
          </div>
        </div>
      </div>
      <div className="card-body">
        {vcStatus === 'pending' && (
          <div className="space-y-6">
            {/* DID Summary */}
            <div className="p-5 rounded-xl bg-maritime-slate/30 border border-white/5">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-4">Your DID</p>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-maritime-navy/50 border border-white/5">
                <Fingerprint className="w-4 h-4 text-rlusd-primary shrink-0" />
                <code className="text-xs font-mono text-rlusd-glow truncate">did:xrpl:1:rXxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
              </div>
            </div>

            {/* Company Summary */}
            <div className="p-5 rounded-xl bg-maritime-slate/30 border border-white/5">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-4">Verified Company</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-muted text-xs">Company Name</span>
                  <p className="text-text-primary font-medium">{companyInfo.companyName}</p>
                </div>
                <div>
                  <span className="text-text-muted text-xs">Registration</span>
                  <p className="text-text-primary font-mono">{companyInfo.registrationNumber}</p>
                </div>
              </div>
            </div>

            {/* IPFS CID */}
            {ipfsCid && (
              <div className="p-4 rounded-xl bg-maritime-slate/20 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-4 h-4 text-accent-sky" />
                  <span className="text-xs text-text-muted">Verified Documents (IPFS)</span>
                </div>
                <code className="text-xs font-mono text-accent-sky">{ipfsCid}</code>
              </div>
            )}

            {/* Issue Button */}
            <motion.button
              onClick={onIssueVC}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-rlusd-dim to-rlusd-primary text-white font-medium hover:shadow-glow-md transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shield className="w-5 h-5" />
              Issue Verification Credential
            </motion.button>

            <p className="text-xs text-text-muted text-center">
              This will create a verifiable credential attesting to your company&apos;s KYC verification.
            </p>
          </div>
        )}

        {vcStatus === 'issuing' && (
          <div className="flex flex-col items-center py-12">
            <motion.div
              className="w-28 h-28 rounded-2xl bg-gradient-to-br from-accent-violet/20 to-accent-violet/5 flex items-center justify-center mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="w-14 h-14 text-accent-violet" />
            </motion.div>
            <p className="text-xl text-text-primary font-medium mb-2">Issuing Credential</p>
            <p className="text-sm text-text-muted text-center max-w-md">
              Creating your verification credential on the platform...
            </p>
            <div className="mt-6 flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-accent-violet animate-spin" />
              <span className="text-sm text-text-muted">Please wait...</span>
            </div>
          </div>
        )}

        {vcStatus === 'issued' && (
          <div className="space-y-6">
            <motion.div
              className="flex flex-col items-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-rlusd-primary/30 to-rlusd-primary/10 flex items-center justify-center mb-6 shadow-glow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <CheckCircle2 className="w-12 h-12 text-rlusd-glow" />
              </motion.div>
              <h3 className="text-2xl font-display font-semibold text-text-primary">Onboarding Complete!</h3>
              <p className="text-text-secondary mt-2">Your verification credential has been issued</p>
            </motion.div>

            {/* DID Display */}
            <div className="p-5 rounded-xl bg-maritime-slate/30 border border-rlusd-primary/20">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-3">Your Decentralized Identifier (DID)</p>
              <div className="flex items-center justify-between gap-2 p-4 rounded-lg bg-maritime-navy/50 border border-white/5">
                <div className="flex items-center gap-3 min-w-0">
                  <Fingerprint className="w-5 h-5 text-rlusd-primary shrink-0" />
                  <code className="text-sm font-mono text-rlusd-glow truncate">did:xrpl:1:rXxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
                </div>
                <motion.button
                  onClick={() => copyToClipboard('did:xrpl:1:rXxxxxxxxxxxxxxxxxxxxxxxxxxx')}
                  className="p-2 rounded-lg hover:bg-maritime-steel/50 text-text-muted hover:text-text-primary transition-colors shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? <Check className="w-5 h-5 text-rlusd-glow" /> : <Copy className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-accent-violet/5 border border-accent-violet/20">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-accent-violet" />
                <p className="text-sm text-text-primary font-medium">Verification Credential</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-text-muted">Credential ID</span>
                  <code className="text-xs text-accent-violet font-mono">VC-20240107-001</code>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-text-muted">Type</span>
                  <span className="text-text-primary">ShipownerVerification</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-text-muted">Issuer</span>
                  <span className="text-rlusd-glow text-xs">Maritime Finance Platform</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-text-muted">Status</span>
                  <span className="flex items-center gap-1 text-green-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-text-muted">Expires</span>
                  <span className="text-text-primary">{new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-rlusd-primary/5 border border-rlusd-primary/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-rlusd-glow shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-text-primary font-medium">What you can do now</p>
                  <ul className="mt-3 text-sm text-text-muted space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rlusd-glow" />
                      Create and sign maritime charter contracts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rlusd-glow" />
                      Receive RLUSD payments for charter agreements
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rlusd-glow" />
                      Verify your identity to charterers and partners
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rlusd-glow" />
                      Access the full Maritime Finance platform
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
