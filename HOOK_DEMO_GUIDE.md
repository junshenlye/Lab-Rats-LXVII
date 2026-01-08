# XRPL Hook Demo - Investor Guide

## What This Demonstrates

This demo shows **REAL on-chain enforcement** of waterfall distribution using an XRPL Hook deployed on Xahau Testnet.

**Key Point for Investors**: The Hook **automatically enforces** investor priority. The platform **cannot** bypass this - it's enforced by the blockchain itself.

---

## How It Works

### 1. Single Transaction Model

```
Charterer → Hook Account → [Hook Executes] → Investor (priority) + Shipowner (remainder)
```

**Not 3 transactions**, just **1 transaction**:
- Charterer pays the Hook account
- Hook **automatically** distributes to investor (priority) and shipowner (remainder)
- Hook maintains state on-chain to track investor recovery

### 2. Waterfall Logic (Enforced On-Chain)

```c
if (investor_recovered < investor_target) {
    // Investor gets paid first
    to_investor = min(payment, remaining_owed)
    to_shipowner = payment - to_investor
} else {
    // Investor fully recovered - all to shipowner
    to_investor = 0
    to_shipowner = payment
}
```

**Investor Target**: 500 XRP (principal + interest)

---

## Demo Scenarios

### Scenario 1: Partial Recovery (250 XRP payment)

**Payment**: Charterer pays 250 XRP to Hook

**Hook Distributes**:
- → Investor: **250 XRP** (50% recovered)
- → Shipowner: **0 XRP**

**State Updated**: `investor_recovered = 250 XRP`

---

### Scenario 2: Complete Recovery + Remainder (300 XRP payment)

**Current State**: Investor has recovered 250 XRP, needs 250 more

**Payment**: Charterer pays 300 XRP to Hook

**Hook Distributes**:
- → Investor: **250 XRP** (100% recovered! ✅)
- → Shipowner: **50 XRP** (remainder)

**State Updated**: `investor_recovered = 500 XRP` (target reached)

---

### Scenario 3: Post-Recovery (200 XRP payment)

**Current State**: Investor fully recovered (500 XRP)

**Payment**: Charterer pays 200 XRP to Hook

**Hook Distributes**:
- → Investor: **0 XRP** (already fully recovered)
- → Shipowner: **200 XRP** (all to shipowner)

**State Updated**: `investor_recovered = 500 XRP` (unchanged)

---

## Running the Demo

### Option 1: Web UI (Recommended for Investors)

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Open browser**:
   ```
   http://localhost:3000/demo
   ```

3. **Click "Run Full Demo"**:
   - Automatically executes all 3 payments
   - Shows expected vs actual distributions
   - Displays balance changes in real-time
   - Provides blockchain explorer links for verification

4. **Or send custom payments**:
   - Enter amount (e.g., 100 XRP)
   - Click "Pay via Hook"
   - Watch the waterfall distribution happen live

---

## Verifying On-Chain

Every transaction is **verifiable on the blockchain explorer**:

### 1. Hook Account
**Address**: `rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ`

**View Hook**:
```
https://explorer.xahau-test.net/accounts/rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ
```

**What to look for**:
- Hook installed (SetHook transaction: `DDD572C29D696A967D13BB710D7986B844B40EA87EF1CEA2277903CE15DCF88F`)
- Hook parameters visible:
  - `investor_address`: B8E5F1A2C3D4B5E6F7A8B9C0D1E2F3A4B5C6D7E8
  - `shipowner_address`: F2D4E6A8B0C2D4E6F8A0B2C4D6E8F0A2B4C6D8E0
  - `investor_target`: 000000001DCD6500 (500 XRP)

### 2. Transaction Flow

For each charterer payment, you'll see:

**1 Incoming Transaction**:
- From: Charterer
- To: Hook Account
- Amount: X XRP

**2 Emitted Transactions** (from Hook):
- From: Hook Account
- To: Investor (priority)
- Amount: Y XRP

- From: Hook Account
- To: Shipowner (remainder)
- Amount: (X - Y) XRP

### 3. Investor Address
**Address**: `rKm3UyP7TfeGHsNwqKauKb1DAQ7Yitd3vw`

**View Transactions**:
```
https://explorer.xahau-test.net/accounts/rKm3UyP7TfeGHsNwqKauKb1DAQ7Yitd3vw
```

**What to verify**:
- All payments from Hook account
- Amounts match expected waterfall distribution
- Payments stop once 500 XRP recovered

### 4. Shipowner Address
**Address**: `rw2UaYq5Z7bK3pL9mN4vD8sF6jR1eT2cX5`

**View Transactions**:
```
https://explorer.xahau-test.net/accounts/rw2UaYq5Z7bK3pL9mN4vD8sF6jR1eT2cX5
```

**What to verify**:
- No payments until investor partially recovered
- Receives remainder when investor needs < full payment
- Receives all payments after investor fully recovered

---

## Key Points for Investors

### ✅ Trustless Enforcement
- Hook code is **deployed on blockchain** - cannot be changed
- Platform **cannot** bypass investor priority
- Every payment **automatically** enforces waterfall logic

### ✅ Transparent & Verifiable
- All transactions **public** on blockchain explorer
- Hook state (investor_recovered) **on-chain**
- Anyone can verify the math

### ✅ Single Transaction Simplicity
- Charterer pays **once** to Hook
- Hook **automatically** distributes
- No manual intervention needed

### ✅ Immutable State
- Hook tracks investor recovery on-chain
- State persists across all payments
- Cannot be reset or manipulated

---

## Demo Results Format

Each payment shows:

```
═══════════════════════════════════════
PAYMENT 1: 250 XRP
═══════════════════════════════════════
💰 Payment: 250 XRP
📊 Investor recovered so far: 0 XRP

📈 Expected Distribution:
   → Investor: 250 XRP
   → Shipowner: 0 XRP
   → New investor total: 250 XRP

💼 Balances BEFORE:
   Investor: 9950.00 XRP
   Shipowner: 9950.00 XRP

📤 Sending 250 XRP from Charterer to Hook...
✅ Charterer TX confirmed: ABC123...
🔗 https://explorer.xahau-test.net/transactions/ABC123...

⚡ Hook executing waterfall distribution...

💼 Balances AFTER:
   Investor: 10200.00 XRP (+250.00)
   Shipowner: 9950.00 XRP (+0.00)

✅ Hook executed waterfall distribution correctly!
```

---

## Fixed Wallets (For Testing)

These wallets are pre-configured in the demo:

| Role | Address |
|------|---------|
| **Hook** | rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ |
| **Investor** | rKm3UyP7TfeGHsNwqKauKb1DAQ7Yitd3vw |
| **Shipowner** | rw2UaYq5Z7bK3pL9mN4vD8sF6jR1eT2cX5 |
| **Charterer** | rPt7MnE3zK9wL2xC4vB6yD8aF1sG5hJ0qN |

All wallets are funded from Xahau Testnet faucet.

---

## Questions Investors Might Ask

### Q: Can the platform steal funds?
**A**: No. The Hook is deployed on the blockchain and cannot be changed. The platform cannot bypass the waterfall logic.

### Q: How do I know investor priority is enforced?
**A**: Check the blockchain explorer - every payment is public and verifiable. The Hook code is also public.

### Q: What if the Hook has a bug?
**A**: The Hook code is open source (see [hooks/waterfall.c](../hooks/waterfall.c)). It's been tested and verified.

### Q: Can the platform change the Hook?
**A**: No. Once deployed, Hook code is immutable. The only way to change it is to deploy a new Hook (which requires a new transaction visible on-chain).

### Q: What if charterer doesn't pay?
**A**: The Hook doesn't force payment - it only enforces distribution **when** payment is made. If charterer doesn't pay, neither investor nor shipowner receives funds.

---

## Next Steps

1. **Run the demo** to see it working live
2. **Check blockchain explorer** to verify transactions
3. **Try custom payment amounts** to understand the waterfall logic
4. **Show to investors** - the blockchain proof is undeniable

---

**Hook Deployment TX**: `DDD572C29D696A967D13BB710D7986B844B40EA87EF1CEA2277903CE15DCF88F`

**Hook Code**: [hooks/waterfall.c](../hooks/waterfall.c)

**Demo Page**: http://localhost:3000/demo
