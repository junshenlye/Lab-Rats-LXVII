'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Ship,
  FileText,
  Upload,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

export default function CreateInvoicePage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [ocrData, setOcrData] = useState<any>(null);

  // Simulated OCR processing
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    // Simulate OCR processing delay
    setTimeout(() => {
      // Mock OCR extracted data
      setOcrData({
        invoiceNumber: 'INV-2026-001',
        date: '2026-01-08',
        dueDate: 'Upon Receipt',
        shipowner: {
          name: 'Blue Horizon Shipping Ltd.',
          address: '12 Maritime Plaza, Singapore',
          contact: 'operations@bluehorizon.com',
          vessel: 'MV Ocean Titan',
          voyageNo: 'OT-202B'
        },
        charterer: {
          name: 'Global Commodities Corp.',
          address: '4500 Park Avenue, New York, NY',
          contact: 'accounts@globalcomm.com'
        },
        lineItems: [
          { description: 'Lumpsum Freight (Port A to Port B)', quantity: 1, rate: 45000, total: 45000 },
          { description: 'Demurrage Fees (2 Days at Port A)', quantity: 2, rate: 1500, total: 3000 },
          { description: 'Bunker Adjustment Factor (BAF)', quantity: 1, rate: 2200, total: 2200 }
        ],
        subtotal: 50200,
        discount: 502,
        discountLabel: 'Blockchain Payment (1%)',
        grandTotal: 49698
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleCreateInvoice = () => {
    // Store invoice data in localStorage for demo
    if (ocrData) {
      const invoiceId = 'inv-' + Date.now();
      localStorage.setItem(invoiceId, JSON.stringify({
        ...ocrData,
        id: invoiceId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        paymentLink: `/dashboard/invoices/pay/${invoiceId}`
      }));

      // Redirect to invoices list
      router.push('/dashboard/invoices');
    }
  };

  return (
    <div className="min-h-screen bg-maritime-dark flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-maritime-deeper/80 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/invoices">
                <button className="p-2 hover:bg-maritime-slate/30 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-text-muted" />
                </button>
              </Link>
              <div>
                <h1 className="font-display text-xl font-semibold text-text-primary">
                  Create Invoice
                </h1>
                <p className="text-xs text-text-muted">Upload freight invoice document</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Upload Section */}
            {!ocrData && (
              <div className="card p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-rlusd-primary/10 flex items-center justify-center mx-auto mb-4 border border-rlusd-primary/30">
                    <Upload className="w-8 h-8 text-rlusd-glow" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
                    Upload Freight Invoice
                  </h2>
                  <p className="text-text-muted">
                    Upload your invoice document for automatic OCR processing
                  </p>
                </div>

                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessing}
                  />
                  <div className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    isProcessing
                      ? 'border-rlusd-primary/50 bg-rlusd-primary/5'
                      : 'border-white/10 hover:border-rlusd-primary/50 hover:bg-rlusd-primary/5'
                  }`}>
                    {isProcessing ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-rlusd-glow animate-spin" />
                        <div>
                          <p className="text-text-primary font-medium mb-1">Processing Invoice...</p>
                          <p className="text-sm text-text-muted">Extracting data from {uploadedFile?.name}</p>
                        </div>
                      </div>
                    ) : uploadedFile ? (
                      <div className="flex flex-col items-center gap-3">
                        <FileCheck className="w-12 h-12 text-rlusd-glow" />
                        <p className="text-text-primary font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-text-muted">Click to upload a different file</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="w-12 h-12 text-text-muted" />
                        <p className="text-text-primary font-medium">Click to upload invoice</p>
                        <p className="text-sm text-text-muted">PDF, JPG, or PNG (Max 10MB)</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            )}

            {/* OCR Results */}
            {ocrData && (
              <div className="space-y-6">
                {/* Success Message */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-rlusd-primary/10 border border-rlusd-primary/30">
                  <CheckCircle2 className="w-5 h-5 text-rlusd-glow shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Invoice data extracted successfully</p>
                    <p className="text-xs text-text-muted">Review the details below and create the invoice</p>
                  </div>
                </div>

                {/* Invoice Preview */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-text-primary">Freight Invoice</h2>
                      <p className="text-sm text-text-muted mt-1">Invoice #{ocrData.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-muted">Date</p>
                      <p className="text-sm font-mono text-text-primary">{ocrData.date}</p>
                      <p className="text-xs text-text-muted mt-2">Due Date</p>
                      <p className="text-sm font-mono text-text-primary">{ocrData.dueDate}</p>
                    </div>
                  </div>

                  {/* Parties */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 rounded-lg bg-maritime-slate/20 border border-white/5">
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-3">From (Shipowner)</p>
                      <p className="font-semibold text-text-primary mb-1">{ocrData.shipowner.name}</p>
                      <p className="text-sm text-text-muted mb-1">{ocrData.shipowner.address}</p>
                      <p className="text-sm text-text-muted">{ocrData.shipowner.contact}</p>
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-xs text-text-muted">Vessel: <span className="text-text-primary font-mono">{ocrData.shipowner.vessel}</span></p>
                        <p className="text-xs text-text-muted">Voyage: <span className="text-text-primary font-mono">{ocrData.shipowner.voyageNo}</span></p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-maritime-slate/20 border border-white/5">
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-3">To (Charterer)</p>
                      <p className="font-semibold text-text-primary mb-1">{ocrData.charterer.name}</p>
                      <p className="text-sm text-text-muted mb-1">{ocrData.charterer.address}</p>
                      <p className="text-sm text-text-muted">{ocrData.charterer.contact}</p>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="mb-6">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Transaction Details</p>
                    <div className="overflow-hidden rounded-lg border border-white/5">
                      <table className="w-full">
                        <thead className="bg-maritime-slate/30">
                          <tr>
                            <th className="text-left text-xs text-text-muted uppercase tracking-wider p-3">Description</th>
                            <th className="text-right text-xs text-text-muted uppercase tracking-wider p-3">Qty</th>
                            <th className="text-right text-xs text-text-muted uppercase tracking-wider p-3">Rate</th>
                            <th className="text-right text-xs text-text-muted uppercase tracking-wider p-3">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {ocrData.lineItems.map((item: any, index: number) => (
                            <tr key={index}>
                              <td className="p-3 text-sm text-text-primary">{item.description}</td>
                              <td className="p-3 text-sm text-text-primary text-right font-mono">{item.quantity}</td>
                              <td className="p-3 text-sm text-text-primary text-right font-mono">${item.rate.toLocaleString()}</td>
                              <td className="p-3 text-sm text-text-primary text-right font-mono">${item.total.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 p-4 rounded-lg bg-maritime-slate/20 border border-white/5">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Subtotal</span>
                      <span className="font-mono text-text-primary">${ocrData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">{ocrData.discountLabel}</span>
                      <span className="font-mono text-accent-sky">-${ocrData.discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-white/5">
                      <span className="font-semibold text-text-primary">GRAND TOTAL DUE</span>
                      <span className="font-mono font-bold text-2xl text-rlusd-glow">${ocrData.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setOcrData(null);
                      setUploadedFile(null);
                    }}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-text-primary font-medium hover:bg-maritime-slate/30 transition-all"
                  >
                    Upload Different Invoice
                  </button>
                  <button
                    onClick={handleCreateInvoice}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-rlusd-dim to-rlusd-primary text-white font-medium hover:shadow-glow-md transition-all"
                  >
                    Create Invoice & Get Payment Link
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
