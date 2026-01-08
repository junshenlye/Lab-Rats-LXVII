# Troubleshooting Guide - Waterfall Finance Simulator

## Common Errors and Solutions

### "invalid_API_version" Error

**Symptoms**: Error appears when initializing the agreement after configuring financing terms.

**Possible Causes**:
1. Xahau Testnet may be experiencing temporary issues
2. Network connectivity problems
3. Wallets may not be properly funded

**Solutions**:

#### 1. Check Browser Console
Open the browser console (F12 or Right-click → Inspect → Console) to see detailed error messages. Look for:
- Connection errors to `wss://xahau-test.net`
- Wallet funding issues
- Specific error messages from XRPL

#### 2. Verify Xahau Testnet Status
Visit: https://xahau-test.net

Check if the testnet is operational and the faucet is working.

#### 3. Manual Wallet Funding
If auto-generation fails:
1. Go to https://xahau-test.net
2. Generate 4 wallets manually
3. Copy each secret key (starts with 's')
4. Enter them in the "OR ENTER MANUALLY" section
5. Verify each wallet has ~10,000 XRP

#### 4. Try Alternative Testnet
If Xahau Testnet is down, you can temporarily switch to standard XRPL Testnet:

**File**: `src/types/waterfall.ts`

Change:
```typescript
export const XRPL_TESTNET_URL = 'wss://s.altnet.rippletest.net:51233';
export const XRPL_TESTNET_EXPLORER = 'https://testnet.xrpl.org';
```

**Note**: Standard testnet doesn't support native hooks, so the simulator will use fallback mode (sequential transactions instead of single-transaction hooks).

#### 5. Clear State and Retry
1. Refresh the page (F5)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try auto-generating wallets again

#### 6. Check Network Connection
Ensure you have stable internet connectivity:
```bash
# Test connection to Xahau Testnet
ping xahau-test.net
```

### Wallet Funding Issues

**Symptoms**: "Wallet not funded" or "actNotFound" errors

**Solutions**:
1. Wait 30-60 seconds after auto-generation for funding to confirm
2. Click "Refresh Balances" button in the simulator
3. Manually fund wallets from faucet if auto-funding fails
4. Ensure each wallet has at least 100 XRP (10,000 is provided by faucet)

### Transaction Failures

**Symptoms**: Payments fail or don't appear in timeline

**Solutions**:
1. Check wallet balances - charterer needs enough XRP to pay
2. Wait for previous transactions to confirm before new ones
3. Verify all wallets are on same network (Xahau Testnet)
4. Check transaction hashes on explorer for details

## Debug Mode

To see detailed logs in the browser console:

1. Open Browser DevTools (F12)
2. Go to Console tab
3. Look for messages starting with:
   - 🎲 (wallet generation)
   - 💰 (funding)
   - 🚀 (hook deployment)
   - 🎯 (payment processing)
   - ✅ (success)
   - ❌ (errors)

## Getting Help

If issues persist:

1. **Check Console Logs**: Copy error messages from browser console
2. **Check Network Tab**: DevTools → Network tab, filter by "xahau"
3. **Verify Endpoints**:
   - WebSocket: `wss://xahau-test.net`
   - Faucet: `https://xahau-test.net/accounts`
   - Explorer: `https://explorer.xahau-test.net`

## Known Limitations

1. **Xahau Testnet**: Currently in testnet phase, may experience downtime
2. **Faucet Rate Limiting**: Auto-funding might fail if faucet is rate-limited
3. **Hook Compilation**: Native XRPL hooks require C-to-WASM compilation (currently using simulation)
4. **Browser Compatibility**: Best experience on Chrome/Edge. Safari may have WebSocket issues.

## Workaround: Manual Workflow

If auto-features fail, use manual workflow:

1. **Manual Wallet Creation**:
   - Visit https://xahau-test.net
   - Click "Generate" 4 times
   - Save all 4 secret keys

2. **Manual Entry**:
   - Paste each secret key in simulator
   - Click "Next: Configure Terms"

3. **Initialize**:
   - Review default terms (1000 XRP principal, 5% interest)
   - Click "Initialize Agreement"
   - Wait for blockchain confirmation

4. **Manual Demo**:
   - Enter custom amount (e.g., 500)
   - Click "Charterer Pays 500 XRP"
   - Wait for transaction confirmation
   - Repeat with 750 XRP to complete investor recovery

## Success Indicators

✅ **Setup Successful**:
- "Generated Wallets" section shows 4 addresses
- Each wallet shows balance > 0 XRP
- "Hook Active" badge appears in header
- Status shows "Active"

✅ **Payment Successful**:
- Transaction appears in timeline
- Transaction hash is clickable
- Investor recovery percentage increases
- Wallet balances update

✅ **Demo Complete**:
- Investor recovery reaches 100%
- Status changes to "Investor Recovered"
- Shipowner receives remainder payments
