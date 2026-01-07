# XRPL KYC Flow Implementation Guide

## Overview

This Next.js application implements a complete XRPL KYC flow using Crossmark wallet and XLS-40/XLS-70 standards for Decentralized Identifiers (DIDs) and Verifiable Credentials.

## Architecture

### Core Components

1. **Hex Utilities** ([src/lib/hex-utils.ts](src/lib/hex-utils.ts))
   - `toHex(str)`: Converts UTF-8 strings to uppercase hex using Node.js Buffer
   - `fromHex(hex)`: Decodes hex strings back to UTF-8
   - `isValidHex(hex)`: Validates hex string format

2. **Issuer Wallet** ([src/lib/issuer-wallet.ts](src/lib/issuer-wallet.ts))
   - Server-side platform wallet management
   - Signs `CredentialCreate` transactions on behalf of the platform
   - Uses `ISSUER_SEED` environment variable (never exposed to client)
   - Connects to XRPL Testnet: `wss://s.altnet.rippletest.net:51234`

3. **DID Management** ([src/lib/did.ts](src/lib/did.ts))
   - `checkDidOnTestnet(address)`: Queries XRPL for existing DIDs using `account_objects`
   - `createDID(address, companyName, details)`: Creates DID via Crossmark-signed `DIDSet` transaction

4. **Credential Transactions** ([src/lib/credential-transaction.ts](src/lib/credential-transaction.ts))
   - `buildCredentialCreateTransaction()`: Builds issuer-signed credential
   - `buildCredentialAcceptTransaction()`: Builds user-signed acceptance
   - All `CredentialType`, `URI`, and `Data` fields are hex-encoded

5. **Credential Flow** ([src/lib/credential.ts](src/lib/credential.ts))
   - Orchestrates full issuance flow:
     1. Upload documents to mock IPFS
     2. Issue credential (backend `CredentialCreate`)
     3. Accept credential (user signs `CredentialAccept` via Crossmark)

## Transaction Types

### 1. DIDSet (User-Signed via Crossmark)

**Purpose**: Create a DID for the user's wallet

**Transaction Structure**:
```typescript
{
  TransactionType: 'DIDSet',
  Account: string,           // User's wallet address
  URI: string,              // Hex-encoded DID document URI
  Data: string              // Hex-encoded company metadata
  // Fee, Sequence, LastLedgerSequence handled by Crossmark
}
```

**Example**:
```javascript
const uri = toHex(`https://kyc.dev/did/${registrationNumber}`);
const data = toHex(JSON.stringify({
  name: "ACME Corp",
  country: "Singapore"
}));
```

### 2. CredentialCreate (Issuer-Signed Server-Side)

**Purpose**: Platform issues KYC credential to user

**Transaction Structure**:
```typescript
{
  TransactionType: 'CredentialCreate',
  Account: string,          // Issuer's wallet address
  Subject: string,          // User's wallet address (recipient)
  CredentialType: string,   // Hex-encoded 'KYC_VERIFIED'
  URI: string,             // Hex-encoded IPFS link
  Data: string,            // Hex-encoded company data JSON
  Fee: '12'                // In drops (0.000012 XRP)
}
```

**Backend Flow**:
1. Backend builds transaction using `buildCredentialCreateTransaction()`
2. Backend autofills using `xrpl.Client.autofill()`
3. Issuer wallet signs with `wallet.sign()`
4. Backend submits with `client.submitAndWait()`

### 3. CredentialAccept (User-Signed via Crossmark)

**Purpose**: User accepts the issued credential

**Transaction Structure** (Naked - No Fee/Sequence):
```typescript
{
  TransactionType: 'CredentialAccept',
  Account: string,          // User's wallet address
  Issuer: string,          // Platform issuer address
  CredentialType: string   // Hex-encoded 'KYC_VERIFIED' (MUST match)
  // NO Fee, Sequence, LastLedgerSequence - Crossmark handles these!
}
```

## Crossmark Integration

### Critical Implementation Details

**⚠️ IMPORTANT**: Crossmark is a "smart wallet" - it auto-fills `Fee`, `Sequence`, and `LastLedgerSequence`

**Correct API Usage**:
```typescript
// Import the SDK
import sdk from '@crossmarkio/sdk';

// Send NAKED transaction (no Fee/Sequence/etc)
const response = await sdk.async.signAndSubmitAndWait({
  TransactionType: 'CredentialAccept',
  Account: userAddress,
  Issuer: issuerAddress,
  CredentialType: toHex('KYC_VERIFIED')
});

// Parse response
const result = response.response?.result || response.result;
const txResult = result?.meta?.TransactionResult;
const txHash = result?.hash;

if (txResult === 'tesSUCCESS') {
  // Transaction successful
}
```

**Response Structure**:
```typescript
{
  response: {
    result: {
      meta: {
        TransactionResult: 'tesSUCCESS'
      },
      hash: 'ABC123...'
    }
  }
}
```

## API Endpoints

### POST /api/did/check

Check if a DID exists for an address

**Request**:
```json
{
  "address": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXy2S"
}
```

**Response**:
```json
{
  "exists": true
}
```

### POST /api/credential/create

Issue a credential (server-signed)

**Request**:
```json
{
  "userAddress": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXy2S",
  "companyInfo": {
    "companyName": "ACME Corp",
    "registrationNumber": "202401234",
    "countryOfIncorporation": "Singapore",
    "contactEmail": "contact@acme.com"
  },
  "ipfsCid": "QmXXXXXXXXXX"
}
```

**Response**:
```json
{
  "success": true,
  "transactionHash": "ABC123...",
  "credentialId": "CRED-1234567890-rN7n7otQ"
}
```

### POST /api/credential/accept

Build CredentialAccept transaction (returns unsigned)

**Request**:
```json
{
  "userAddress": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXy2S"
}
```

**Response**:
```json
{
  "success": true,
  "transaction": {
    "TransactionType": "CredentialAccept",
    "Account": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXy2S",
    "Issuer": "rIssuerAddress...",
    "CredentialType": "4B59435F56455249464945440A"
  }
}
```

### POST /api/ipfs/upload

Mock IPFS upload for demo

**Request**: FormData with files and company info

**Response**:
```json
{
  "success": true,
  "cid": "QmFakeCIDForDemo"
}
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

Generate a testnet wallet at: https://faucet.altnet.rippletest.net/accounts

**Copy the seed** (starts with `s`) and add to `.env.local`:

```env
ISSUER_SEED=sXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ IMPORTANT**:
- The issuer wallet must be funded with at least 10 XRP on Testnet
- Never commit `.env.local` to version control
- The seed is server-side only and never exposed to the client

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 4. User Setup

**Users need**:
1. Crossmark wallet extension installed
2. Crossmark configured for **Testnet** (not Mainnet!)
3. At least 10 XRP in their testnet wallet

Get testnet XRP: https://faucet.altnet.rippletest.net/accounts

## Step-by-Step KYC Flow

### Step 1: Check DID

```typescript
import { checkDidOnTestnet } from '@/lib/did';

const result = await checkDidOnTestnet(userAddress);
if (!result.exists) {
  // Show "Create DID" UI
}
```

### Step 2: Create DID (if needed)

```typescript
import { createDID } from '@/lib/did';

const result = await createDID(
  userAddress,
  "ACME Corporation",
  {
    registrationNumber: "202401234",
    countryOfIncorporation: "Singapore",
    contactEmail: "contact@acme.com"
  }
);

if (result.success) {
  console.log('DID created:', result.did);
  console.log('Transaction:', result.transactionHash);
}
```

**What happens**:
- Builds `DIDSet` transaction with hex-encoded URI and Data
- Opens Crossmark popup for user to sign
- Submits to XRPL Testnet
- Returns DID in format: `did:xrpl:testnet:{address}`

### Step 3: Upload Documents

```typescript
import { uploadDocuments } from '@/lib/credential';

const result = await uploadDocuments(
  certificateFile,
  registryFile,
  companyInfo
);

if (result.success) {
  console.log('IPFS CID:', result.cid);
}
```

### Step 4: Issue Credential (Backend)

```typescript
import { issueCredential } from '@/lib/credential';

const result = await issueCredential({
  userAddress: "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXy2S",
  companyInfo: {
    companyName: "ACME Corp",
    registrationNumber: "202401234",
    countryOfIncorporation: "Singapore",
    contactEmail: "contact@acme.com"
  },
  ipfsCid: "QmXXXXXXXXXX"
});

if (result.success) {
  console.log('Credential ID:', result.credentialId);
  console.log('Create TX:', result.createTxHash);
  console.log('Accept TX:', result.acceptTxHash);
}
```

**What happens**:
1. **Backend** creates and signs `CredentialCreate` transaction
2. Backend submits to XRPL (issuer pays fee)
3. **Frontend** builds `CredentialAccept` transaction
4. Opens Crossmark popup for user to accept
5. User signs and submits (user pays fee)

## Common Issues & Solutions

### Issue: "Crossmark did not respond"

**Solution**:
- Ensure Crossmark extension is installed and unlocked
- Check that Crossmark is on **Testnet** (Settings → Network → Testnet)
- User must have at least 10 XRP in testnet wallet

### Issue: "Account not found on XRPL testnet"

**Solution**:
- Fund the account at: https://faucet.altnet.rippletest.net/accounts
- Wait 5-10 seconds for the ledger to validate
- Minimum balance: 10 XRP reserve

### Issue: "ISSUER_SEED not configured"

**Solution**:
- Create `.env.local` file in project root
- Add `ISSUER_SEED=sYourSeedHere`
- Restart the Next.js dev server

### Issue: "Transaction failed: tecUNFUNDED"

**Solution**:
- Issuer wallet has insufficient XRP
- Fund issuer wallet with at least 50 XRP for testing

### Issue: "Network Mismatch"

**Solution**:
- Crossmark must be on Testnet
- Open Crossmark → Settings → Network → Select "Testnet"
- Refresh the page

### Issue: "CredentialType mismatch"

**Solution**:
- `CredentialCreate` and `CredentialAccept` MUST use the same hex-encoded `CredentialType`
- Both should use: `toHex('KYC_VERIFIED')`
- The credential type is case-sensitive!

## Hex Encoding Rules

**All string fields in XRPL credentials MUST be hex-encoded**:

| Field | Example Input | Hex Output |
|-------|---------------|------------|
| CredentialType | `"KYC_VERIFIED"` | `4B59435F56455249464945440A` |
| URI | `"ipfs://QmXXX"` | `697066733A2F2F516D585858` |
| Data | `'{"name":"ACME"}'` | `7B226E616D65223A2241434D45227D` |

**Use the `toHex()` utility**:
```typescript
import { toHex } from '@/lib/hex-utils';

const credentialType = toHex('KYC_VERIFIED');
const uri = toHex('ipfs://QmABC123');
const data = toHex(JSON.stringify({ company: 'ACME' }));
```

## Transaction Fees

| Transaction Type | Fee (drops) | Fee (XRP) | Paid By |
|------------------|-------------|-----------|---------|
| DIDSet | 12 | 0.000012 | User (via Crossmark) |
| CredentialCreate | 12 | 0.000012 | Issuer (backend) |
| CredentialAccept | 12 | 0.000012 | User (via Crossmark) |

**Note**: 1 XRP = 1,000,000 drops

## Testing Checklist

- [ ] Issuer wallet has at least 50 XRP on Testnet
- [ ] User wallet has at least 10 XRP on Testnet
- [ ] Crossmark is set to **Testnet** (not Mainnet)
- [ ] `.env.local` has valid `ISSUER_SEED`
- [ ] Backend server is running
- [ ] Crossmark extension is unlocked
- [ ] User completes DID creation before credential issuance
- [ ] All hex encoding is uppercase
- [ ] `CredentialType` matches exactly between Create and Accept

## File Structure

```
src/
├── lib/
│   ├── hex-utils.ts              # Hex encoding utilities
│   ├── issuer-wallet.ts          # Server-side issuer management
│   ├── did.ts                    # DID check and creation
│   ├── didset-transaction.ts     # DIDSet transaction builder
│   ├── credential.ts             # Full credential flow
│   ├── credential-transaction.ts # Credential transaction builders
│   └── credential-submit.ts      # Crossmark signing logic
├── app/
│   ├── api/
│   │   ├── did/
│   │   │   ├── check/route.ts
│   │   │   └── create/route.ts
│   │   ├── credential/
│   │   │   ├── create/route.ts
│   │   │   └── accept/route.ts
│   │   └── ipfs/
│   │       └── upload/route.ts
│   ├── page.tsx                  # Landing page
│   └── onboarding/
│       └── page.tsx              # KYC onboarding flow
```

## Resources

- **XRPL Testnet Faucet**: https://faucet.altnet.rippletest.net/accounts
- **Crossmark Wallet**: https://crossmark.io/
- **Crossmark SDK Docs**: https://docs.crossmark.io/
- **XRPL Documentation**: https://xrpl.org/
- **XLS-40 (DIDs)**: https://github.com/XRPLF/XRPL-Standards/discussions/91
- **XLS-70 (Credentials)**: https://github.com/XRPLF/XRPL-Standards/discussions/126

## Security Considerations

1. **Never expose the issuer seed**
   - Keep `ISSUER_SEED` in `.env.local` (server-side only)
   - Add `.env.local` to `.gitignore`
   - Use environment variables in production

2. **Validate all inputs**
   - Check XRPL address format: `/^r[a-zA-Z0-9]{24,34}$/`
   - Validate company information before issuing credentials
   - Sanitize file uploads

3. **Rate limiting**
   - Implement rate limiting on credential creation endpoints
   - Prevent abuse of the issuer wallet

4. **Transaction verification**
   - Always check `TransactionResult === 'tesSUCCESS'`
   - Log all transaction hashes for audit trail
   - Monitor issuer wallet balance

## Next Steps

1. **Production Setup**:
   - Switch from Testnet to Mainnet
   - Use real IPFS (Pinata, NFT.Storage, etc.)
   - Implement proper authentication
   - Add rate limiting and abuse prevention

2. **Enhanced Features**:
   - Credential revocation (CredentialDelete)
   - Multiple credential types
   - Credential expiration dates
   - Visual credential badges/NFTs

3. **UX Improvements**:
   - Loading states and progress indicators
   - Better error messages
   - Transaction history view
   - QR code generation for credentials

## Support

For issues or questions:
1. Check the console logs (both browser and server)
2. Verify network settings in Crossmark
3. Check wallet balances on testnet
4. Review the transaction hashes on XRPL explorer

---

**Built with**: Next.js 14, React 18, XRPL.js 4.5, Crossmark SDK 0.4.0
