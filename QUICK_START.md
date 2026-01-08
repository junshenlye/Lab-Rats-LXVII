# Waterfall Finance Simulator - Quick Start Guide

## 🚀 Setup in 5 Minutes

### Step 1: Get Testnet Wallets (2 minutes)

Visit the **Xahau Testnet** Faucet **4 times** to create 4 wallets:

👉 **https://xahau-test.net**

⚡ **Why Xahau?** We're using Xahau's native hooks for **trustless, single-transaction** waterfall distribution!

For each wallet:
1. Click **"Generate Testnet Credentials"**
2. Copy and save:
   - ✅ **Address** (starts with `r`)
   - ✅ **Secret** (starts with `s`)

**You need**:
- Wallet 1: Charterer (label it)
- Wallet 2: Investor (label it)
- Wallet 3: Shipowner (label it)
- Wallet 4: Platform (label it)

### Step 2: Run the Application (1 minute)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open browser: **http://localhost:3000**

### Step 3: Navigate to Simulator (30 seconds)

1. Click **Dashboard**
2. Click **"Waterfall Finance"** card (has "Live Demo" badge)
   - Or go directly to: http://localhost:3000/dashboard/simulator

### Step 4: Configure (1 minute)

**Wallet Setup Screen**:
- Paste the 4 secret keys you saved earlier
- Click **Next: Configure Terms**

**Financing Terms Screen**:
- Use default values:
  - Principal: 1000 XRP
  - Interest: 5%
  - Voyage Revenue: 1500 XRP
  - Penalty: 2%
- Click **Initialize Agreement**

Wait ~5 seconds for XRPL connection ✅

### Step 5: Demo! (30 seconds)

**Try a Payment**:
1. Click **"Charterer Pays 500 XRP"**
2. Watch the waterfall in action:
   - ✅ Transaction submitted to XRPL blockchain
   - ✅ Investor receives 500 XRP (47.6% recovered)
   - ✅ Shipowner receives 0 XRP (investor priority)
3. Click transaction hash to view on blockchain explorer

**Complete Recovery**:
1. Click **"Charterer Pays 750 XRP"**
2. Watch the split:
   - ✅ Investor receives 550 XRP (100% recovered! 🎉)
   - ✅ Shipowner receives 200 XRP (remainder)

---

## 🎯 What You'll See

### Real-Time Features

✅ **Live Wallet Balances** - XRP balances update from blockchain
✅ **Investor Recovery Tracker** - Progress bar showing principal + interest recovery
✅ **Waterfall Flow Diagram** - Animated payment distribution
✅ **Transaction Timeline** - All blockchain transactions with explorer links
✅ **Smart Distribution** - Automatic investor priority, shipowner remainder

### Example Demo Flow

**Initial State**:
- Investor needs: 1050 XRP (1000 principal + 50 interest)
- Investor recovered: 0 XRP
- Status: Active

**After 500 XRP Payment**:
- Investor recovered: 500 XRP (47.6%)
- To Investor: 500 XRP ✅
- To Shipowner: 0 XRP
- Status: Active

**After Another 750 XRP Payment**:
- Investor recovered: 1050 XRP (100%)
- To Investor: 550 XRP ✅
- To Shipowner: 200 XRP ✅
- Status: Investor Recovered 🎉

---

## 🔥 Quick Demo Scenarios

### Scenario A: Gradual Recovery
```
Payment 1: 250 XRP → Investor 23.8%
Payment 2: 300 XRP → Investor 52.4%
Payment 3: 300 XRP → Investor 81.0%
Payment 4: 300 XRP → Investor 100% ✅ + Shipowner 100 XRP
```

### Scenario B: Full Payment at Once
```
Payment 1: 1500 XRP → Investor 1050 XRP ✅ + Shipowner 450 XRP ✅
Status: Investor Recovered immediately
```

### Scenario C: Early Repayment
```
Payment 1: 500 XRP → Investor 47.6%
Shipowner Early Repayment: 550 XRP debt + 11 XRP penalty
Status: Completed (investor fully recovered via early payoff)
```

---

## 💡 Pro Tips

### For Best Demo Experience

1. **Start Fresh**: Use newly funded testnet wallets
2. **Verify Balances**: Click refresh to see real blockchain balances
3. **Click Transaction Hashes**: Show investors the actual blockchain proof
4. **Explain the Waterfall**: Use the flow diagram to visualize priority
5. **Try Early Repayment**: Show the penalty calculation

### Impressive Stats to Share

- ⚡ **Transaction Speed**: 3-5 seconds for blockchain confirmation
- 🔒 **Security**: All payments automatically enforced by XRPL
- 📊 **Transparency**: Every transaction verifiable on public blockchain
- 🎯 **Investor Protection**: Waterfall guarantees payment priority

---

## 🐛 Common Issues

### "Unfunded Wallet" Warning

**Solution**:
- Go to faucet and send XRP to that address
- Or generate a new wallet and use its secret key

### Transaction Failed

**Solution**:
- Refresh wallet balances
- Ensure wallets have enough XRP (at least 100 XRP each)
- Check internet connection

### Connection Error

**Solution**:
- Refresh the page
- Check that XRPL testnet is operational
- Clear browser cache if persisting

---

## 📚 Full Documentation

For detailed explanation of all features:
👉 **See WATERFALL_SIMULATOR_GUIDE.md**

---

## 🎥 Elevator Pitch (30 seconds)

*"This simulator shows how blockchain enforces investor protection in ship financing. When charterers pay for voyages, our smart waterfall system automatically pays investors first - principal plus interest - before any money reaches the shipowner. It's all happening live on the XRPL blockchain. Every transaction you see is real and verifiable. Click any transaction to see the blockchain proof."*

---

## ✨ Key Features to Highlight

1. **Investor Priority** - Always paid first, guaranteed by code
2. **Real Blockchain** - Not a simulation, actual XRPL transactions
3. **Transparent** - Every payment traceable on public ledger
4. **Automated** - No trust needed, waterfall logic enforced by platform
5. **Live Demo** - Show it working in real-time with real wallets

---

**Ready to impress investors! 🚢💰⚡**

Access the simulator:
**Dashboard → Waterfall Finance** or `/dashboard/simulator`
