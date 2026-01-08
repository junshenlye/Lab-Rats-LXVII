# 🪝 XRPL Hook - Waterfall Distribution Demo

**Status**: ✅ Deployed on Xahau Testnet

**Hook TX**: [DDD572C29D696A967D13BB710D7986B844B40EA87EF1CEA2277903CE15DCF88F](https://explorer.xahau-test.net/transactions/DDD572C29D696A967D13BB710D7986B844B40EA87EF1CEA2277903CE15DCF88F)

---

## 🚀 Quick Start

### Web Demo (Recommended)
```bash
npm install
npm run dev
# Open: http://localhost:3000/demo
```

Click **"Run Full Demo"** → Watch 3 payments execute with waterfall distribution!

### Command Line Demo
```bash
npm install
npm run demo
```

---

## 📊 What You'll See

### Payment Flow
```
Charterer pays 300 XRP → Hook
                          ↓
                    [Auto-distributes]
                          ↓
        Investor: 250 XRP (priority) ✅
        Shipowner: 50 XRP (remainder)
```

### Results
- ✅ Expected vs Actual distribution (they match!)
- ✅ Real-time balance updates
- ✅ Blockchain explorer links (proof!)
- ✅ Hook enforces waterfall automatically

---

## 🔗 Verify On-Chain

**Hook Account**: [rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ](https://explorer.xahau-test.net/accounts/rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZB)

**Investor Account**: [rKm3UyP7TfeGHsNwqKauKb1DAQ7Yitd3vw](https://explorer.xahau-test.net/accounts/rKm3UyP7TfeGHsNwqKauKb1DAQ7Yitd3vw)

Every transaction is public and verifiable!

---

## 📚 Documentation

- **[HOOK_SUMMARY.md](HOOK_SUMMARY.md)** - Quick overview
- **[DEMO_INSTRUCTIONS.md](DEMO_INSTRUCTIONS.md)** - Presentation guide
- **[HOOK_DEMO_GUIDE.md](HOOK_DEMO_GUIDE.md)** - Complete investor guide
- **[FIXED_WALLETS.md](FIXED_WALLETS.md)** - Wallet addresses & parameters

---

## 💡 For Investors

**Key Message**: The Hook is deployed on the blockchain and **cannot be bypassed**. Investor priority is **enforced by code**, not trust.

Click any transaction in the demo to see blockchain proof!

---

Built with XRPL Hooks on Xahau Testnet 🚢💰⚡
