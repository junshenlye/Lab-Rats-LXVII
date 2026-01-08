# Quick Demo Instructions - Show Investors the Hook

## What You're Demonstrating

**XRPL Hook enforces investor priority on-chain** - the platform cannot bypass it.

---

## 3-Minute Demo (For Investors)

### Option A: Web UI (Best for presentations)

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Open demo page**:
   ```
   http://localhost:3000/demo
   ```

3. **Click "Run Full Demo"**:
   - Watch 3 payments execute automatically
   - See investor priority enforced in real-time
   - View balance changes immediately
   - Click transaction links to verify on blockchain

4. **Show investors**:
   - Expected vs Actual distributions ✅
   - Blockchain explorer links (proof!)
   - Real-time balance updates
   - Hook enforces waterfall automatically

---

### Option B: Command Line (For quick testing)

1. **Run demo**:
   ```bash
   npx tsx scripts/testHook.ts
   ```

2. **See 3 payments execute**:
   - Payment 1: 250 XRP → Investor 250, Shipowner 0
   - Payment 2: 300 XRP → Investor 250, Shipowner 50
   - Payment 3: 200 XRP → Investor 0, Shipowner 200

3. **Check balances**:
   ```bash
   npx tsx scripts/testHook.ts balances
   ```

4. **Send custom payment**:
   ```bash
   npx tsx scripts/testHook.ts pay 100 0
   # Pays 100 XRP (0 recovered so far)
   ```

---

## What Investors Will See

### 1. Expected Distribution (Calculated)
```
Payment: 300 XRP
Investor recovered so far: 250 XRP

Expected:
→ Investor: 250 XRP (completes 500 XRP target)
→ Shipowner: 50 XRP (remainder)
```

### 2. Actual Distribution (On-Chain)
```
Balances BEFORE:
  Investor:  10200.00 XRP
  Shipowner: 9950.00 XRP

⚡ Hook executing...

Balances AFTER:
  Investor:  10450.00 XRP (+250.00) ✅
  Shipowner: 10000.00 XRP (+50.00) ✅

✅ Hook executed waterfall distribution correctly!
```

### 3. Blockchain Proof
Every transaction has an explorer link:
```
🔗 https://explorer.xahau-test.net/transactions/ABC123...
```

Click to see:
- 1 incoming TX (Charterer → Hook)
- 2 emitted TXs (Hook → Investor, Hook → Shipowner)
- Amounts match expected distribution

---

## Key Talking Points

### 1. Trustless Enforcement
"The Hook is deployed on the blockchain - we cannot change it or bypass it."

### 2. Single Transaction
"Charterer pays once. The Hook automatically distributes. No human intervention."

### 3. Transparent & Verifiable
"Every payment is on the public blockchain. Anyone can verify the math."

### 4. Immutable Priority
"Investor always gets paid first. It's enforced by code, not trust."

---

## Demo Flow (Recommended)

### Step 1: Show Hook Deployment (2 minutes)
1. Open Hook account on explorer:
   ```
   https://explorer.xahau-test.net/accounts/rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ
   ```

2. Show SetHook transaction:
   ```
   TX: DDD572C29D696A967D13BB710D7986B844B40EA87EF1CEA2277903CE15DCF88F
   ```

3. Point out Hook parameters:
   - investor_address (fixed)
   - shipowner_address (fixed)
   - investor_target: 500 XRP

### Step 2: Run Demo (3 minutes)
1. Click "Run Full Demo"
2. Watch payments execute live
3. Show balance changes
4. Click transaction links

### Step 3: Verify On-Chain (2 minutes)
1. Click first transaction link
2. Show incoming payment (Charterer → Hook)
3. Show emitted transactions (Hook → Investor/Shipowner)
4. Verify amounts match expected distribution

### Step 4: Q&A
"Can you bypass investor priority?"
→ No, Hook code is immutable on blockchain

"How do I know it's working?"
→ Click any transaction - it's all on the public blockchain

"What if you change the code?"
→ Would require new SetHook transaction (visible on-chain)

---

## Fixed Wallets (Already Set Up)

| Role | Address | Purpose |
|------|---------|---------|
| Hook | rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ | Has Hook installed |
| Investor | rKm3UyP7TfeGHsNwqKauKb1DAQ7Yitd3vw | Priority creditor |
| Shipowner | rw2UaYq5Z7bK3pL9mN4vD8sF6jR1eT2cX5 | Remainder recipient |
| Charterer | rPt7MnE3zK9wL2xC4vB6yD8aF1sG5hJ0qN | Voyage payer |

All wallets funded from Xahau Testnet faucet.

---

## Troubleshooting

### "Wallets not funded"
Fund from faucet:
```bash
curl -X POST https://xahau-test.net/accounts \
  -H "Content-Type: application/json" \
  -d '{"destination": "rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ"}'
```

Repeat for all 4 wallets (see FIXED_WALLETS.md)

### "Transaction failed"
Check wallet balances:
```bash
npx tsx scripts/testHook.ts balances
```

Ensure Charterer has enough XRP.

### "Hook not executing"
Verify Hook is deployed:
```
https://explorer.xahau-test.net/accounts/rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ
```

Check for SetHook transaction.

---

## Files Reference

- **Demo Page**: [src/app/demo/page.tsx](src/app/demo/page.tsx)
- **Hook Logic**: [src/lib/waterfall/hookDemo.ts](src/lib/waterfall/hookDemo.ts)
- **Hook Code**: [hooks/waterfall.c](hooks/waterfall.c)
- **Fixed Wallets**: [FIXED_WALLETS.md](FIXED_WALLETS.md)
- **Full Guide**: [HOOK_DEMO_GUIDE.md](HOOK_DEMO_GUIDE.md)

---

## Success Criteria

✅ Investors see real blockchain transactions
✅ Expected matches actual distribution
✅ Explorer links verify on-chain execution
✅ Hook enforces investor priority automatically
✅ No trust required - it's all on the blockchain

---

**Ready to demo? Start here**: http://localhost:3000/demo

**Hook TX**: https://explorer.xahau-test.net/transactions/DDD572C29D696A967D13BB710D7986B844B40EA87EF1CEA2277903CE15DCF88F
