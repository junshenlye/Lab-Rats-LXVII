# Waterfall Finance Simulator - User Guide

## Overview

The **Waterfall Finance Simulator** is a live blockchain demonstration tool built on **XRPL Testnet** that shows investors how their capital is protected through waterfall payment distribution in ship financing.

### Key Features

✅ **Real XRPL Transactions** - All payments are actual blockchain transactions on XRPL testnet
✅ **4-Party System** - Charterer, Investor, Shipowner, and Platform wallets
✅ **Investor Priority** - Investor gets paid first (principal + interest) before shipowner
✅ **Early Repayment** - Shipowner can pay off loan early with penalty
✅ **Live Visualization** - Real-time transaction tracking and waterfall flow diagrams
✅ **Transparent** - All transactions viewable on XRPL testnet explorer

---

## How It Works

### Waterfall Payment Logic

```
Charterer → Platform Hook → Distribution:
  1. Pay Investor (until principal + interest recovered)
  2. Pay Shipowner (remainder after investor fully paid)
```

### Financial Structure

- **Principal**: Loan amount investor provides to shipowner (e.g., 1000 XRP)
- **Interest Rate**: Return on investment (e.g., 5% = 50 XRP)
- **Total Recovery Target**: Principal + Interest (e.g., 1050 XRP)
- **Voyage Revenue**: Expected payment from charterer (e.g., 1500 XRP)

**Example Distribution**:
- Charterer pays 1500 XRP
- First 1050 XRP → Investor (principal + interest)
- Remaining 450 XRP → Shipowner

---

## Getting Started

### Step 1: Prepare XRPL Testnet Wallets

You need **4 funded XRPL testnet wallets**:

1. **Get Free Testnet Wallets**:
   - Visit: https://xrpl.org/xrp-testnet-faucet.html
   - Click "Generate Testnet Credentials" 4 times
   - Save each wallet's **Address** and **Secret Key**

2. **Required Wallets**:
   - **Charterer**: Pays for voyage (needs ~2000 XRP for demos)
   - **Investor**: Receives principal + interest (needs ~100 XRP for tx fees)
   - **Shipowner**: Receives remainder (needs ~100 XRP for tx fees)
   - **Platform**: Facilitates waterfall distribution (needs ~200 XRP for multiple txs)

### Step 2: Access the Simulator

1. Navigate to **Dashboard** → **Waterfall Finance** (badge: "Live Demo")
2. Or directly visit: `/dashboard/simulator`

### Step 3: Configure Wallets

**Wallet Setup Screen**:
- Enter the **secret keys** for all 4 wallets
- Format: `sXXXXXXXXXXXXXXXXXXXXXXXXXXX` (starts with 's')
- Click **Next: Configure Terms**

⚠️ **Security Note**: Secret keys are only stored in browser memory, never sent to any server.

### Step 4: Set Financing Terms

Configure your demonstration parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| Loan Principal | Amount investor lends to shipowner | 1000 XRP |
| Interest Rate | Annual interest percentage | 5% |
| Expected Voyage Revenue | What charterer will pay | 1500 XRP |
| Early Repayment Penalty | Penalty for early loan payoff | 2% |

**Financing Summary** automatically calculates:
- Investor Target: 1050 XRP (principal + interest)
- Shipowner Gets: 450 XRP (after investor fully paid)

Click **Initialize Agreement** to connect to XRPL testnet.

---

## Using the Simulator

### Main Dashboard

Once configured, you'll see:

1. **Wallet Balances** (top) - Live XRP balances for all 4 wallets
2. **Investor Recovery Tracker** (left) - Progress toward full recovery
3. **Simulator Actions** (left) - Transaction buttons
4. **Waterfall Flow Diagram** (right) - Visual payment distribution
5. **Transaction Timeline** (bottom) - All blockchain transactions with explorer links

### Scenario 1: Normal Charterer Payment

Demonstrates typical voyage payment flowing through the waterfall.

**Steps**:
1. Set payment amount (e.g., 500 XRP)
2. Click **"Charterer Pays X XRP"**
3. Watch the transaction flow:
   - Charterer → Platform (confirmed on blockchain)
   - Platform → Investor (priority payment)
   - Platform → Shipowner (if investor fully paid)

**What You'll See**:
- Real-time waterfall calculation
- Animated payment flow diagram
- Live transaction confirmations with XRPL hashes
- Updated investor recovery progress
- Refreshed wallet balances

**Example**:
- Payment: 500 XRP
- To Investor: 500 XRP (partial recovery)
- To Shipowner: 0 XRP (investor not fully paid yet)
- Investor Progress: 47.6% → 95.2%

### Scenario 2: Completing Investor Recovery

Show the moment investor is fully recovered.

**Steps**:
1. Make payments totaling more than investor target
2. Watch waterfall switch to shipowner

**Example**:
- First Payment: 500 XRP → 500 XRP to investor
- Second Payment: 750 XRP → 550 XRP to investor, **200 XRP to shipowner**
- Status: "Investor Recovered" 🎉

### Scenario 3: Early Repayment

Shipowner pays off loan early to start receiving charterer payments directly.

**Steps**:
1. View **Early Repayment** section showing:
   - Remaining Debt: 200 XRP
   - Penalty (2%): 4 XRP
   - **Total Due: 204 XRP**
2. Click **"Shipowner Early Repayment"**
3. Watch two transactions:
   - Shipowner → Investor (200 XRP debt)
   - Shipowner → Platform (4 XRP penalty)

**Result**: Investor fully recovered, agreement completed.

### Scenario 4: Multiple Small Payments

Demonstrate gradual investor recovery with voyage milestones.

**Example Flow**:
- Milestone 1: 250 XRP → Investor 23.8%
- Milestone 2: 300 XRP → Investor 52.4%
- Milestone 3: 300 XRP → Investor 81.0%
- Milestone 4: 300 XRP → Investor 100%, Shipowner gets 150 XRP

---

## Understanding the UI

### Investor Recovery Tracker

**Progress Bar**: Visual representation of principal + interest recovery
**Recovery Progress**: Percentage completed (0-100%)
**Principal**: Original loan amount
**Interest**: Calculated interest (principal × rate)
**Total Target**: Amount needed for full recovery
**Recovered**: Amount paid to investor so far
**Remaining**: Still owed to investor

### Waterfall Flow Diagram

**Animated Visualization** showing money flow:
- Charterer (blue) at top
- Platform Hook (green) in middle
- Investor (green) and Shipowner (amber) at bottom
- Arrow animations during transactions
- Amount highlights showing distribution

**Distribution Logic** panel shows step-by-step calculation:
- "Investor recovery payment: 500 XRP"
- "Remainder to shipowner: 200 XRP"

### Transaction Timeline

Each transaction card shows:
- **Type**: Charterer Payment, Investor Recovery, Shipowner Payment, etc.
- **Status**: Pending → Submitted → Confirmed ✅
- **Amount**: XRP transferred
- **From/To**: Wallet addresses (truncated)
- **Transaction Hash**: Click to view on XRPL testnet explorer
- **Timestamp**: When transaction occurred

### Wallet Balance Cards

Real-time XRP balances for each participant:
- **Charterer** (blue): Voyage payment source
- **Investor** (green): Principal + interest recipient
- **Shipowner** (amber): Remainder recipient
- **Platform** (purple): Waterfall facilitator

Click **Refresh** to update balances from blockchain.

---

## Transaction Verification

All transactions are **real and verifiable** on the XRPL testnet.

### View on Blockchain Explorer

1. Click any transaction hash in the timeline
2. Opens XRPL Testnet Explorer: `https://testnet.xrpl.org/transactions/{hash}`
3. Verify:
   - From/To addresses
   - Amount transferred
   - Ledger confirmation
   - Fee paid
   - Memo data (includes "waterfall-finance")

### Manual Verification

Check wallet balances directly:
- Visit: https://testnet.xrpl.org/
- Enter any wallet address
- View transaction history and current balance

---

## Demonstration Script for Investors

### Introduction (30 seconds)

*"Let me show you how your investment is protected through our waterfall payment system. This is a live demonstration using the XRPL blockchain - every transaction you'll see is real and verifiable."*

### Setup (1 minute)

1. Show the 4 wallet participants
2. Explain the financing structure:
   - "You invest 1000 XRP with 5% interest"
   - "Your total recovery target is 1050 XRP"
   - "The voyage generates 1500 XRP in revenue"

### Demo Flow (3-4 minutes)

**First Payment (500 XRP)**:
- *"The charterer makes their first payment of 500 XRP"*
- Show transaction confirming on blockchain
- Point to Investor Recovery: "You've received 500 XRP, 47.6% recovered"
- Point to Shipowner: "Gets nothing until you're fully paid"

**Second Payment (750 XRP)**:
- *"Another payment comes in - 750 XRP"*
- Highlight the split: "You get your remaining 550 XRP"
- *"Now you're fully recovered - principal plus interest!"*
- Show shipowner receiving remainder: "Now the shipowner gets the remaining 200 XRP"

**Transaction Verification**:
- Click transaction hash
- *"Here's the actual blockchain record - completely transparent and immutable"*
- Show sender, receiver, amount confirmed

### Early Repayment Demo (1 minute)

- *"If the shipowner wants to receive payments directly, they can pay you off early"*
- Show penalty calculation: "There's a 2% penalty"
- Execute early repayment
- Show two transactions: "Debt to you, penalty to platform"

### Closing (30 seconds)

*"This waterfall structure ensures you always get paid first, automatically enforced by the blockchain. No trust required - the code guarantees your priority."*

---

## Technical Details

### XRPL Integration

- **Network**: XRPL Testnet (wss://s.altnet.rippletest.net:51233)
- **Library**: xrpl.js v4.5.0
- **Currency**: XRP (native currency)
- **Transaction Type**: Payment
- **Confirmation**: Auto-wait for ledger validation

### Waterfall Implementation

Uses **sequential transactions** (XRPL Hooks are still in development):

```
Charterer Payment → Platform Receipt → Distribution Calculation
  → If (investor not fully paid):
      → Send to investor (remaining recovery amount)
      → Send to shipowner (remainder, if any)
  → Else (investor fully paid):
      → Send to shipowner (full amount)
```

### Transaction Fees

Each XRPL transaction costs a small fee (typically 0.000012 XRP). The simulator handles fees automatically.

### Security

- Secret keys stored only in browser memory (React state)
- Never transmitted to any server
- Client-side transaction signing
- Testnet-only (no real value at risk)

---

## Troubleshooting

### "Transaction Failed"

**Causes**:
- Insufficient wallet balance
- Network connectivity issues
- Invalid secret key

**Solutions**:
- Check wallet has enough XRP (use faucet)
- Refresh page and reconnect
- Verify secret key format

### "Unfunded Wallet" Warning

**Fix**:
- Visit XRPL faucet: https://xrpl.org/xrp-testnet-faucet.html
- Generate new credentials OR send funds to existing address
- Minimum: 10 XRP per wallet

### Balances Not Updating

**Fix**:
- Click refresh button on wallet cards
- Wait 5-10 seconds for ledger confirmation
- Check network connection

### Connection Failed

**Fix**:
- Check internet connection
- XRPL testnet may be under maintenance (rare)
- Try refreshing page
- Clear browser cache

---

## Advanced Usage

### Custom Payment Scenarios

Use custom amounts to demonstrate:
- **Partial payments**: 100 XRP increments showing gradual recovery
- **Overpayment**: More than expected revenue
- **Underpayment**: Less than investor target

### Quick Payment Buttons

Pre-configured amounts for fast demonstrations:
- 500 XRP
- 750 XRP
- 1000 XRP

### Multi-Voyage Simulation

Create multiple agreements with different terms:
- Conservative: 3% interest, high voyage revenue
- Aggressive: 10% interest, tight margins
- Risky: Low voyage revenue vs high loan amount

---

## API Reference (for Developers)

### Core Functions

```typescript
// Initialize financing agreement
const agreement = await initializeAgreement({
  principal: 1000,
  interestRate: 5,
  expectedRevenue: 1500,
  penaltyRate: 2,
  wallets: { charterer, investor, shipowner, platform }
});

// Process charterer payment
await processChartererPayment(agreement, 500);

// Early repayment
await processEarlyRepayment(agreement);

// Refresh balances
await refreshWalletBalances(agreement);
```

### Waterfall Calculation

```typescript
const distribution = calculateWaterfallDistribution(
  paymentAmount: 500,
  investorRecovery: {
    principal: 1000,
    interestRate: 5,
    recovered: 500,
    // ...
  }
);

// Returns:
{
  toInvestor: 500,
  toShipowner: 0,
  investorFullyPaid: false,
  // ...
}
```

---

## FAQ

**Q: Is this using real money?**
A: No, this is XRPL **testnet** with test XRP that has no monetary value.

**Q: Can I use this for production?**
A: This is a demonstration tool. For production, you would need:
- Mainnet XRPL integration
- Legal agreements
- Regulatory compliance
- Enhanced security

**Q: How long do transactions take?**
A: 3-5 seconds for blockchain confirmation on testnet.

**Q: What if the charterer doesn't pay?**
A: In a real system, the shipowner would be liable to cover the investor's recovery (not implemented in simulator but can be demonstrated manually).

**Q: Can I save my configuration?**
A: Currently configurations are session-based. Refresh will reset.

**Q: What blockchain features does this use?**
A: Real XRPL Payment transactions with memos for traceability.

---

## Support & Resources

- **XRPL Documentation**: https://xrpl.org/
- **Testnet Faucet**: https://xrpl.org/xrp-testnet-faucet.html
- **Block Explorer**: https://testnet.xrpl.org/
- **XRPL.js Docs**: https://js.xrpl.org/

---

## Version

**Version**: 1.0.0
**Last Updated**: January 2025
**Network**: XRPL Testnet
**License**: Demo/Educational Use

---

**Ready to demonstrate the power of waterfall finance on blockchain!** 🚢💰⛓️
