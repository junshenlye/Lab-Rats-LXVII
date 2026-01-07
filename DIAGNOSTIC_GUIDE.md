# DID Transaction 500 Error - Diagnostic Guide

## ⚠️ You're Getting a 500 Error - XRPL 401 Connection Issue

Based on your error message: "Failed to create DID: Error: Unexpected server response: 401"

This means the XRPL testnet endpoint is returning a 401 Unauthorized error when the API tries to connect.

### ✅ FIXED: We've Added Fallback Endpoints

The code now tries multiple XRPL endpoints in order:
1. `wss://s.altnet.rippletest.net:51234` (primary)
2. `wss://testnet.ripple.com:51234` (secondary)
3. `wss://xrplcluster.com` (public endpoint)

**Try again now** - one of these endpoints should work!

---

## 🔍 Step 1: Check What's Failing

### Open Browser DevTools (F12)

1. Go to your app in browser
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Fill out the company form and click "Create DID"
5. Watch for messages like:
   ```
   [DID Create API] Connecting to XRPL testnet for transaction autofill...
   [DID Create API] Wallet address: rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH
   [DID Create API] Awaiting client.connect()...
   ```

**Where do the logs stop?** This is where the error occurs.

---

## 🛠️ Step 2: Most Likely Issues

### Issue A: XRPL Testnet Connection Failure

**Symptom:** Logs show `[DID Create API] Awaiting client.connect()...` then nothing

**Cause:**
- Testnet is down or unreachable
- Network firewall blocking WebSocket
- DNS issues

**Fix:**
1. Open a new tab and try: `https://s.altnet.rippletest.net:51234`
2. You should see a JSON response (not an error page)
3. If you get an error, testnet is down - wait and retry

### Issue B: Wallet Account Not Found

**Symptom:** Error about "Account not found" or validation failure

**Cause:**
- Your wallet address doesn't exist on testnet
- Account has no XRP for transaction fee

**Fix:**
1. Check if your account exists:
   - Go to: `https://testnet.xrpl.org/accounts/{YOUR_WALLET_ADDRESS}`
   - Replace `{YOUR_WALLET_ADDRESS}` with your actual address from the form

2. If account not found:
   - Go to: `https://faucet.altnet.rippletest.net/`
   - Paste your wallet address
   - Get test XRP (this creates the account)
   - Wait 30 seconds
   - Retry creating DID

### Issue C: autofill() Method Failing

**Symptom:** Error occurs after "Autofilling transaction..."

**Cause:**
- Issue with xrpl.js library autofill() call
- Account state problem

**Fix:**
1. Try with a completely different wallet address
2. If that works, there was an issue with the first address
3. If that also fails, check your xrpl library version:
   ```bash
   npm ls xrpl
   # Should show xrpl@4.5.0
   ```

---

## 📋 Step 3: Check API Response Directly

### Method 1: Using Browser Network Tab

1. Open DevTools (F12)
2. Click **Network** tab
3. Fill form and click "Create DID"
4. Look for request to `/api/did/create`
5. Click on it
6. View **Response** tab
7. You'll see the exact error message

### Method 2: Using Terminal

```bash
# Fill out form with:
# Wallet: rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH (example)
# Company: Test Corp
# etc.

# Then manually test the API:
curl -X POST http://localhost:3000/api/did/create \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
    "companyName": "Test Corp",
    "registrationNumber": "12345",
    "countryOfIncorporation": "SG",
    "contactEmail": "test@example.com",
    "contactPhone": "+65123456",
    "registeredAddress": "123 Main St"
  }'

# The response will show the exact error
```

---

## 🔧 Step 4: Server Logs

### Start with Verbose Logging

1. Stop your dev server (Ctrl+C)
2. Run: `npm run dev`
3. Fill form and click "Create DID"
4. **Watch the terminal output**
5. You'll see server-side logs like:
   ```
   [DID Create API] Connecting to XRPL testnet for transaction autofill...
   [DID Create API] Wallet address: rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH
   [DID Create API] Awaiting client.connect()...
   [DID Create API] ✓ Connected to XRPL
   [DID Create API] Autofilling transaction...
   [DID Create API] ✓ Transaction autofilled successfully
   ```

**If logs stop somewhere, that's where the error is.**

---

## 🎯 Quick Fixes (In Order)

### Fix #1: Verify Testnet is Up
```bash
# In browser console, try:
fetch('https://s.altnet.rippletest.net:51234', {
  method: 'POST',
  body: JSON.stringify({method: 'server_info', params: []})
}).then(r => r.json()).then(console.log)
# Should return server info, not error
```

### Fix #2: Fund Your Testnet Account
```
1. Go to: https://faucet.altnet.rippletest.net/
2. Paste your wallet address
3. Click "Generate XRP"
4. Wait 30 seconds
5. Retry creating DID
```

### Fix #3: Try Different Wallet
```
If you have Crossmark or another wallet:
1. Generate a new testnet wallet address
2. Fund it via faucet
3. Use the new address in the form
4. Try creating DID again
```

### Fix #4: Restart Dev Server
```bash
# Stop: Ctrl+C
npm run dev
# This clears any stale connections
```

### Fix #5: Clear Node Modules
```bash
rm -rf node_modules
npm install
npm run dev
```

---

## ✅ Success Indicators

When it's working, you should see:

**Console Logs:**
```
[DID Create API] ✓ Connected to XRPL
[DID Create API] ✓ Transaction autofilled successfully
[DID Create] ✓ DIDSet transaction built successfully from API
[DID Submit] Requesting Crossmark to sign transaction...
[Onboarding] Setting status to "signing" - Crossmark popup should appear now
```

**UI Changes:**
- Status: "Waiting for Crossmark Signature"
- Crossmark popup appears
- After approval → "Submitting to XRPL Blockchain..."
- Then → "DID Created Successfully" with transaction hash

---

## 📞 If Still Stuck

Collect this information and share:

1. **The exact error message** (from browser console or API response)
2. **Where the logs stop** (which `[DID Create API]` log is the last one)
3. **Your wallet address** (first few chars like `rN7n7o...`)
4. **Terminal output** (run `npm run dev` and try again, copy terminal output)
5. **Browser console output** (screenshot or copy of all `[DID Create]` and `[DID Submit]` logs)

This will help identify the exact issue!

