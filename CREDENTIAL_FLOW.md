# XLS-70 Credential Flow Implementation

## Overview
This document describes the complete XLS-70 credential issuance flow implemented in the Maritime Finance platform.

## Architecture

### 1. **Pending Step - CredentialCreate (Backend)**
- **Location**: `src/lib/issuer-wallet.ts` (lines 50-153)
- **API Endpoint**: `src/app/api/credential/create/route.ts`
- **Trigger**: When user reaches the "Pending" step in onboarding
- **Signer**: Platform issuer wallet (using `ISSUER_SEED` from `.env.local`)

#### Transaction Details:
```typescript
{
  TransactionType: 'CredentialCreate',
  Account: issuerAddress,           // From ISSUER_SEED
  Subject: userAddress,              // User's wallet address
  CredentialType: toHex('KYC'),     // 0x4B5943 (uppercase hex)
  URI: toHex('ipfs://...'),         // IPFS CID with documents
  Data: toHex(JSON.stringify({      // Company info
    companyName: '...',
    registrationNumber: '...',
    country: '...',
    email: '...',
    verifiedAt: '...',
    credentialType: 'KYC'
  }))
}
```

#### Implementation:
1. Connects to XRPL Testnet: `wss://s.altnet.rippletest.net:51233`
2. Loads issuer wallet from `ISSUER_SEED`
3. Uses `client.autofill()` to prepare transaction
4. Signs with issuer wallet: `wallet.sign(prepared)`
5. Submits and waits: `client.submitAndWait(signed.tx_blob)`
6. Returns transaction hash on success

### 2. **Accept Step - CredentialAccept (Frontend)**
- **Location**: `src/lib/credential-submit.ts`
- **API Endpoint**: `src/app/api/credential/accept/route.ts` (builds transaction)
- **Trigger**: When user clicks "Accept Credential" button
- **Signer**: User's Crossmark wallet

#### Transaction Details:
```typescript
{
  TransactionType: 'CredentialAccept',
  Account: userAddress,              // User's wallet address
  Issuer: issuerAddress,             // Platform issuer (from ISSUER_SEED)
  CredentialType: toHex('KYC')      // 0x4B5943 (MUST MATCH CredentialCreate!)
  // NO Fee, Sequence, LastLedgerSequence - Crossmark handles these
}
```

#### Implementation:
1. Backend builds "naked" transaction (no Fee/Sequence)
2. Frontend receives transaction
3. Calls Crossmark SDK: `sdk.async.signAndSubmitAndWait(nakedTx)`
4. Crossmark popup appears for user to sign
5. User signs with their wallet
6. Crossmark auto-fills Fee, Sequence, LastLedgerSequence
7. Transaction submitted to XRPL
8. Returns transaction hash on success

## Critical Requirements

### ✅ Credential Type Consistency
**MUST be identical in both transactions for ledger to link them:**
- CredentialCreate: `CredentialType: toHex('KYC')` → `0x4B5943`
- CredentialAccept: `CredentialType: toHex('KYC')` → `0x4B5943`

### ✅ Issuer/Subject Matching
- CredentialCreate: `Account: issuerAddress`, `Subject: userAddress`
- CredentialAccept: `Account: userAddress`, `Issuer: issuerAddress`

### ✅ Hex Encoding (Uppercase)
All string fields MUST be uppercase hex:
```typescript
// src/lib/hex-utils.ts
export function toHex(str: string): string {
  return Buffer.from(str, 'utf8').toString('hex').toUpperCase();
}
```

### ✅ Crossmark Integration
Use "naked" transactions (no Fee/Sequence):
- Crossmark is a smart wallet
- It handles Fee, Sequence, LastLedgerSequence automatically
- Sending these fields will cause errors

## User Flow

1. **Connect Wallet** → User connects Crossmark wallet
2. **Create DID** → User creates DID with company info
3. **Upload Documents** → User uploads KYC documents to IPFS
4. **⏳ Pending** → Backend issues CredentialCreate (platform signs)
   - Status: `vcStatus = 'awaiting-platform'`
   - API: `/api/credential/create`
   - Transaction appears on XRPL with issuer signature
5. **✅ Accept** → User accepts credential with Crossmark
   - Status: `vcStatus = 'ready-to-accept'`
   - User clicks "Accept Credential on XRPL"
   - Crossmark popup appears
   - User signs CredentialAccept transaction
   - Both transactions now linked on-chain
6. **🎉 Complete** → Onboarding finished
   - User has verifiable KYC credential on XRPL
   - Can view both transactions on explorer

## Testing

### Prerequisites
1. **Fund Issuer Wallet**:
   ```bash
   # Get the issuer address from logs or:
   # Run: npm run dev, check console for issuer address
   # Visit: https://faucet.altnet.rippletest.net/accounts
   # Fund the issuer address with testnet XRP
   ```

2. **Fund User Wallet**:
   - Crossmark wallet must have testnet XRP
   - Get from faucet or airdrop feature in Crossmark

### Testing Steps
1. Start dev server: `npm run dev`
2. Navigate to `/onboarding`
3. Complete all steps
4. Check console logs for transaction hashes
5. Verify on explorer: `https://testnet.xrpl.org/transactions/{hash}`

### Expected Results
- CredentialCreate transaction shows in ledger
- CredentialAccept transaction references the credential
- Both transactions show `tesSUCCESS`
- User's account shows active credential

## Environment Variables

```bash
# .env.local
ISSUER_SEED=sEdV...  # Platform wallet seed (DO NOT COMMIT!)
```

⚠️ **Security**: Never commit the production issuer seed to git!

## File Structure

```
src/
├── lib/
│   ├── issuer-wallet.ts          # Backend: Signs CredentialCreate
│   ├── credential-transaction.ts # Builds both transaction types
│   ├── credential-submit.ts      # Frontend: Crossmark integration
│   ├── hex-utils.ts             # Hex encoding utilities
│   └── credential.ts            # Orchestrates full flow
├── app/
│   ├── api/
│   │   └── credential/
│   │       ├── create/route.ts  # API: Issue credential
│   │       └── accept/route.ts  # API: Build accept tx
│   └── onboarding/page.tsx      # UI: Onboarding flow
└── .env.local                   # Config: ISSUER_SEED
```

## Debugging

### Common Issues

1. **"Account not found"**
   - Fund the issuer wallet on testnet faucet
   - Fund the user wallet with Crossmark

2. **"Transaction failed: tecNO_PERMISSION"**
   - CredentialType mismatch between Create and Accept
   - Verify both use `toHex('KYC')`

3. **"Crossmark not responding"**
   - Ensure Crossmark extension installed
   - Check wallet is on Testnet (not Mainnet)
   - Try refreshing the page

4. **"Invalid hex"**
   - All strings must be uppercase hex
   - Use `toHex()` utility for all string fields

### Useful Logs

Backend (CredentialCreate):
```
[Issuer] Connecting to XRPL Testnet...
[Issuer] Connected to XRPL Testnet
[Issuer] Issuer address: rXXX...
[Issuer] Transaction signed, hash: ABC123...
[Issuer] ✓ CredentialCreate submitted successfully
```

Frontend (CredentialAccept):
```
[Credential Submit] Naked transaction (no Sequence/Fee/etc)
[Credential Submit] Calling Crossmark signAndSubmitAndWait...
[Credential Submit] Transaction result: tesSUCCESS
[Credential Submit] ✓ CredentialAccept submitted successfully!
```

## References

- [XLS-70 Specification](https://github.com/XRPLF/XRPL-Standards/discussions/204)
- [XRPL Testnet Explorer](https://testnet.xrpl.org/)
- [Crossmark Wallet](https://crossmark.io/)
- [xrpl.js Documentation](https://js.xrpl.org/)
