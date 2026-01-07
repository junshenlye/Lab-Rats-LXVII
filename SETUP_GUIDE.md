# Setup Guide - XRPL KYC Flow

## ⚠️ SECURITY ALERT

Your previous seed (`sEdVJnyx5LxwPWv791t1Ai9uPZkoKQC`) is now **PUBLIC** and exposed in this conversation. You must:

1. ✅ **IMMEDIATELY** generate a NEW wallet
2. ✅ Transfer any funds from old wallet to new one
3. ✅ Never share seeds again

---

## 🚀 Quick Start (5 minutes)

### Step 1: Generate New Testnet Wallet

1. Visit: https://faucet.altnet.rippletest.net/accounts
2. Click "Generate Testnet Credentials"
3. You'll get:
   - **Account (Address)**: `rN7n7otQDd6FczFgLdlqtyMVrn3HMfXy2S` (example)
   - **Seed**: `sEdYourNewSeedHere` (KEEP SECRET!)
   - **XRP**: 1000 XRP (testnet only)

### Step 2: Configure Environment

Create `.env.local` in project root:

```bash
# Copy the seed from Step 1
ISSUER_SEED=sEdYourNewSeedHereFromTestnet
```

⚠️ **NEVER commit `.env.local` to git** - it's in `.gitignore`

### Step 3: Run Development Server

```bash
npm install
npm run dev
```

Visit: http://localhost:3000/onboarding

---

## 📋 Complete Setup Checklist

- [ ] Generated NEW testnet wallet at https://faucet.altnet.rippletest.net/accounts
- [ ] Copied the seed (starts with 's')
- [ ] Created `.env.local` with the seed
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Opened http://localhost:3000/onboarding
- [ ] Clicked "Connect Wallet" → Approved Crossmark popup
- [ ] Saw "No DID Found" message

---

## 🧪 Testing the Full Flow

### Prerequisites

You need:
- ✅ Testnet wallet with 10+ XRP (created above)
- ✅ Crossmark extension installed
- ✅ Crossmark set to **Testnet** (not Mainnet!)

### Step-by-Step Test

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Wait 1-3 seconds (simulated checking)
   - Crossmark popup appears
   - Approve wallet connection
   - See "No DID Found" ✓

2. **Create DID**
   - Click "Continue"
   - Fill in company info
   - Click "Create DID"
   - Crossmark popup → Approve
   - See "DID Created" ✓

3. **Upload Documents**
   - Click "Continue"
   - Upload two files (any files work in demo)
   - Click "Continue"

4. **Verification Pending**
   - Status: "Uploading Documents..." → "Platform Verifying..." → "Credential Ready!"
   - See credential details
   - Click "Continue"

5. **Accept Credential**
   - See "Accept Verification Credential" button
   - Click it
   - Crossmark popup → Approve
   - See "Onboarding Complete!" ✓

6. **Success!**
   - Shows DID
   - Shows Credential
   - Shows Transaction Hashes
   - "Go to Dashboard" button

---

## 🔑 Environment Variables Explained

### `.env.local`

```env
# Your issuer wallet seed
# Generate at: https://faucet.altnet.rippletest.net/accounts
# This is SERVER-SIDE ONLY (never exposed to frontend)
ISSUER_SEED=sEdYourNewSeedHere
```

**Security**:
- ✅ Only used on backend (Next.js API routes)
- ✅ Never sent to browser
- ✅ Never committed to git (in `.gitignore`)
- ✅ Safe to use in development

---

## 🆘 Troubleshooting

### Issue: "ISSUER_SEED not configured"

**Solution**:
```bash
# Create .env.local in project root with:
ISSUER_SEED=sEdYourNewSeedHere
```

Then restart dev server:
```bash
npm run dev
```

### Issue: "Issuer account has insufficient XRP balance"

**Solution**:
- Issuer needs 50+ XRP for testing
- Generate new wallet (you get 1000 XRP) or
- Use faucet again on same account

### Issue: "Account not found on XRPL testnet"

**Solution**:
- Seed might be invalid
- Generate new wallet at: https://faucet.altnet.rippletest.net/accounts
- Use the seed from the faucet (starts with 's')

### Issue: Crossmark shows "Network Mismatch"

**Solution**:
- Open Crossmark extension
- Click Settings
- Select "Testnet" (not Mainnet)
- Refresh the page

### Issue: Build fails with "ISSUER_SEED not configured"

**Solution**:
- Create `.env.local` with your seed
- The build doesn't need it, but Next.js checks it at runtime
- Dev server needs the env var to run

---

## 📱 Using with Testnet

All transactions use XRPL Testnet:
- **RPC**: `wss://s.altnet.rippletest.net:51234`
- **Explorer**: https://testnet.xrpl.org/
- **Network**: Testnet (no real money!)

Testnet reset: The testnet is reset approximately every 1-2 weeks. When reset, all wallets are cleared and you need to regenerate.

---

## 🏗️ Architecture

### Frontend (React/Next.js)
- Wallet connection via Crossmark
- DID creation (user signs via Crossmark)
- Document upload
- Credential acceptance (user signs via Crossmark)

### Backend (Next.js API Routes)
- Stores `ISSUER_SEED` in `.env.local`
- Never exposes seed to client
- Issues credentials on behalf of platform
- Uses xrpl.js for signing

### Crossmark (Wallet)
- Signs transactions for user
- Auto-fills Fee, Sequence, LastLedgerSequence
- Submits to XRPL
- Manages user's accounts

---

## 🔐 Security Notes

✅ **What's Secure**:
- Issuer seed in `.env.local` only
- Seed never sent to frontend
- All transactions signed server-side or by user via Crossmark
- `.env.local` in `.gitignore`

⚠️ **Never Do**:
- Commit `.env.local` to git
- Share your seed
- Use seed from commits (regenerate if exposed)
- Expose seed in error messages (be careful with logging)

---

## 📚 File Structure

```
project/
├── .env.local                    ← CREATE THIS (not in git)
├── .env.local.example            ← Reference template
├── src/
│   ├── app/
│   │   ├── onboarding/page.tsx   ← Main UI
│   │   └── api/
│   │       ├── credential/       ← Issue & accept
│   │       ├── did/              ← DID operations
│   │       └── ipfs/             ← Document upload
│   └── lib/
│       ├── issuer-wallet.ts      ← Server-side issuer
│       ├── did.ts                ← DID logic
│       └── credential*.ts        ← Credential logic
└── scripts/
    └── issue-credential.ts       ← CLI tool to issue credentials
```

---

## 🎯 Next Steps

1. ✅ Create `.env.local` with your new seed
2. ✅ Run `npm run dev`
3. ✅ Test the full flow
4. ✅ Check transaction hashes on https://testnet.xrpl.org/

---

## 📞 Getting Help

**Common Issues**:
- Check console logs: Browser DevTools (F12) + Terminal
- Verify seed format: Must start with 's'
- Check wallet balance: Visit faucet with your address
- Verify Crossmark network: Must be on Testnet

**Resource Links**:
- XRPL Faucet: https://faucet.altnet.rippletest.net/accounts
- Testnet Explorer: https://testnet.xrpl.org/
- Crossmark: https://crossmark.io/
- XRPL Docs: https://xrpl.org/

---

**🎉 You're ready to go!** Create `.env.local` and run `npm run dev`
