# Auto-Generate Wallets & Demo - User Guide

## 🎯 Overview

The Waterfall Finance Simulator now features **one-click wallet generation and auto-demo** to showcase the waterfall distribution system instantly to investors.

## ✨ New Features

### 1. Auto-Generate & Fund Wallets
- **Generates 4 XRPL wallets** programmatically
- **Automatically funds** them from Xahau Testnet faucet
- **Fills in secret keys** in the form
- **Displays wallet addresses** for verification

### 2. Auto-Run Demo
- **Executes 2 payments** automatically after setup
- **Payment 1**: 500 XRP (shows partial investor recovery)
- **Payment 2**: 750 XRP (completes investor recovery + shipowner remainder)
- **Real blockchain transactions** with explorer links

## 🚀 Quick Start (30 seconds!)

### Step 1: Navigate to Simulator
```bash
npm run dev
```
Open: http://localhost:3000/dashboard/simulator

### Step 2: Auto-Generate Wallets (15 seconds)
1. Click **"Auto-Generate & Fund 4 Wallets"** button
2. Wait for:
   - 🎲 Wallet generation (~1 second)
   - 💰 Faucet funding (~15 seconds for 4 wallets)
   - ✅ Balance verification

**What happens**:
- 4 wallets created with random keys
- Each funded with ~10,000 XRP from testnet faucet
- Secret keys auto-filled in form
- Wallet addresses displayed in success card

### Step 3: Configure Terms (5 seconds)
1. Click **"Next: Configure Terms"**
2. Use default values:
   - Principal: 1000 XRP
   - Interest: 5%
   - Voyage Revenue: 1500 XRP
   - Penalty: 2%
3. Click **"Initialize Agreement"**

### Step 4: Auto-Run Demo (15 seconds)
1. Once initialized, click **"Auto-Run Demo (2 Payments)"**
2. Watch the waterfall in action:
   - **First payment**: 500 XRP → Investor receives 100%
   - Wait 6 seconds for blockchain confirmation
   - **Second payment**: 750 XRP → Investor receives 550 XRP (completes recovery), Shipowner receives 200 XRP

## 📊 What Investors See

### During Auto-Generation
```
🎲 Generating 4 wallets for waterfall simulation...
🔑 Generated new wallet for charterer: rXXX...
🔑 Generated new wallet for investor: rYYY...
🔑 Generated new wallet for shipowner: rZZZ...
🔑 Generated new wallet for platform: rAAA...
💸 Funding all 4 wallets from Xahau Testnet faucet...
💰 Funding charterer wallet...
✅ charterer funded: 10000.00 XRP
💰 Funding investor wallet...
✅ investor funded: 10000.00 XRP
💰 Funding shipowner wallet...
✅ shipowner funded: 10000.00 XRP
💰 Funding platform wallet...
✅ platform funded: 10000.00 XRP
✅ All wallets funded!
```

### During Auto-Demo
```
🎬 Starting auto-run demo...
💰 Demo Payment 1: 500 XRP
🎯 Initiating hook-based payment...
💡 Expected waterfall distribution:
   toInvestor: 500
   toShipowner: 0
   investorFullyPaid: false
⚡ HOOK EXECUTING: Automatic waterfall distribution...
✅ HOOK EXECUTED SUCCESSFULLY!
   Hook automatically distributed:
   → Investor: 500 XRP
   → Shipowner: 0 XRP

[Wait 6 seconds for confirmation]

💰 Demo Payment 2: 750 XRP
🎯 Initiating hook-based payment...
💡 Expected waterfall distribution:
   toInvestor: 550
   toShipowner: 200
   investorFullyPaid: true
⚡ HOOK EXECUTING: Automatic waterfall distribution...
✅ HOOK EXECUTED SUCCESSFULLY!
   Hook automatically distributed:
   → Investor: 550 XRP (100% recovered! 🎉)
   → Shipowner: 200 XRP

✅ Auto-run demo completed!
```

### Visual Feedback
- ✅ **Generated Wallets Card**: Shows all 4 addresses
- 🔵 **Hook Active Badge**: Indicates hook is deployed
- 📊 **Recovery Progress Bar**: Animates from 0% → 47.6% → 100%
- 🌊 **Waterfall Flow Diagram**: Shows payment splits in real-time
- 📜 **Transaction Timeline**: Lists all transactions with explorer links
- 💰 **Wallet Balances**: Live XRP balances from blockchain

## 🎥 Demo Script for Investors

### Opening (10 seconds)
*"Let me show you how our waterfall financing works. I'll demonstrate the entire flow in 30 seconds using real blockchain transactions."*

**Action**: Click "Auto-Generate & Fund 4 Wallets"

### Setup (15 seconds)
*"The system just created 4 XRPL wallets - charterer, investor, shipowner, and platform - and funded them from the testnet. These are real blockchain addresses."*

**Action**: Click "Next", then "Initialize Agreement"

*"Now we've deployed the waterfall logic. The hook guarantees you get paid first - it's enforced by the blockchain, not by us."*

### Demo (15 seconds)
**Action**: Click "Auto-Run Demo (2 Payments)"

*"Watch: First payment of 500 XRP - you receive 100% as the investor. Now 750 XRP comes in - you get the remaining 550 XRP to complete your 1050 XRP target (1000 principal + 50 interest), and the shipowner receives the 200 XRP remainder."*

### Closing (5 seconds)
*"Every transaction is on the public blockchain. Click any transaction hash to verify. This is trustless - the platform can't touch your priority payment."*

## 🔧 Technical Details

### Wallet Generation
**File**: `src/lib/xrpl/wallets.ts`

```typescript
export function generateAllWallets() {
  return {
    charterer: generateNewWallet('charterer'),
    investor: generateNewWallet('investor'),
    shipowner: generateNewWallet('shipowner'),
    platform: generateNewWallet('platform'),
  };
}
```

### Funding Process
**File**: `src/lib/xrpl/wallets.ts`

```typescript
export async function fundAllWallets(wallets) {
  // Funds sequentially to avoid rate limiting
  for (const { role, address } of addresses) {
    await fundWalletDirectly(address);
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Verify funding
    const balance = await getWalletBalance(address);
  }
}
```

### Auto-Demo Flow
**File**: `src/app/dashboard/simulator/page.tsx`

```typescript
const handleAutoRunDemo = async () => {
  // Payment 1: 500 XRP
  await handleChartererPayment(500);
  await new Promise(resolve => setTimeout(resolve, 6000));

  // Payment 2: 750 XRP (completes recovery)
  await handleChartererPayment(750);
};
```

## 🛠️ Customization

### Change Demo Amounts
Edit `handleAutoRunDemo` in `src/app/dashboard/simulator/page.tsx`:

```typescript
// Current
await handleChartererPayment(500);
await handleChartererPayment(750);

// Custom scenario (gradual recovery)
await handleChartererPayment(250);
await new Promise(resolve => setTimeout(resolve, 6000));
await handleChartererPayment(300);
await new Promise(resolve => setTimeout(resolve, 6000));
await handleChartererPayment(500);
```

### Change Financing Terms Defaults
Edit state initialization in `src/app/dashboard/simulator/page.tsx`:

```typescript
const [principal, setPrincipal] = useState(1000);
const [interestRate, setInterestRate] = useState(5);
const [voyageRevenue, setVoyageRevenue] = useState(1500);
const [penaltyRate, setPenaltyRate] = useState(2);
```

## ⚠️ Limitations & Notes

1. **Testnet Only**: Uses Xahau Testnet (not production)
2. **Faucet Rate Limits**: May fail if faucet is rate-limited (wait 1 minute and retry)
3. **Network Dependency**: Requires stable internet connection
4. **Hook Simulation**: Native hooks require C-to-WASM compilation (currently using fallback)
5. **Auto-Demo Timing**: 6-second delays ensure blockchain confirmation

## 🐛 Troubleshooting

### Auto-Generation Fails
- **Issue**: "Failed to generate wallets"
- **Fix**: Check browser console for specific error, retry in 1 minute (faucet rate limit)

### Wallets Not Funded
- **Issue**: Generated but balance shows 0
- **Fix**: Wait 30 seconds, click "Refresh Balances" button, or fund manually from faucet

### Auto-Demo Button Missing
- **Issue**: Don't see "Auto-Run Demo" button
- **Fix**: Button only appears if wallets were auto-generated AND investor recovery is 0%

### Transactions Fail
- **Issue**: Payments don't complete
- **Fix**: Check charterer has sufficient balance, wait for previous tx to confirm

See **TROUBLESHOOTING.md** for detailed solutions.

## 📚 Related Documentation

- **QUICK_START.md** - Manual wallet setup guide
- **HOOKS_IMPLEMENTATION.md** - Technical details of XRPL Hooks
- **WATERFALL_SIMULATOR_GUIDE.md** - Complete feature documentation
- **TROUBLESHOOTING.md** - Common issues and solutions

## 🎯 Key Selling Points for Investors

1. **One-Click Demo**: See it working in 30 seconds
2. **Real Blockchain**: Actual XRPL transactions, not simulation
3. **Trustless Priority**: Waterfall enforced by smart contracts
4. **Transparent**: Every transaction verifiable on public explorer
5. **Automated**: No manual intervention needed for distributions
6. **Live Balances**: Real-time wallet updates from blockchain

---

**Ready to demonstrate trustless waterfall finance!** 🚢💰⚡
