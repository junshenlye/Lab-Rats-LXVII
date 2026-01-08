# 🎯 NEW XRPL WALLETS FOR HOOK DEPLOYMENT

Generated: 2026-01-08

---

## ⚠️ WALLET SECRETS (Keep Secure!)

### 1. Platform Wallet (Hook Account)
```
Address: rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV
Secret:  sEdTk3FMu1ojhchiss2KXY8Uw71DMce
Hex:     B6CD95490495793CAAD58ECB1A068C7E0EFF5A13
```

### 2. Investor Wallet
```
Address: rCJjEYgwfwWEmJUQdgERXqdhRdeDfJq9r
Secret:  sEd7Km9NpihYLDC7xnidhRbtd38xFA9
Hex:     073E9B038A99276D26215F941B94ADBBF3D9FAC5
```

### 3. Shipowner Wallet
```
Address: rHferWyNi4ZzbTqmSBrZUsQPKmZVGGUJrZ
Secret:  sEdVFLV2ptE7mj4cboMUxM1khQdFeco
Hex:     B0C366DBE0AAE8F589EE31B5F2810D111C0F7080
```

### 4. Charterer Wallet
```
Address: rBucHbYrQkKNdWGqaLcS4gKELhkzrMCKKN
Secret:  sEdTYETVj89Vt8415esLEvqhRyXw516
Hex:     77A457DDBB6AE8195695850C14C2B02E9BE3EBBC
```

---

## 📋 COMPLETE SETHOOK TRANSACTION

Deploy your Hook with these **EXACT** parameters:

```json
{
  "TransactionType": "SetHook",
  "Account": "rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV",
  "Hooks": [
    {
      "Hook": {
        "CreateCode": "<YOUR_COMPILED_WASM_HEX>",
        "HookOn": "0000000000000000",
        "HookNamespace": "0000000000000000000000000000000000000000000000000000000000000000",
        "HookParameters": [
          {
            "HookParameter": {
              "HookParameterName": "696E766573746F725F61646472657373",
              "HookParameterValue": "073E9B038A99276D26215F941B94ADBBF3D9FAC5"
            }
          },
          {
            "HookParameter": {
              "HookParameterName": "736869706F776E65725F61646472657373",
              "HookParameterValue": "B0C366DBE0AAE8F589EE31B5F2810D111C0F7080"
            }
          },
          {
            "HookParameter": {
              "HookParameterName": "696E766573746F725F746172676574",
              "HookParameterValue": "000000001DCD6500"
            }
          }
        ]
      }
    }
  ]
}
```

---

## 🔑 PARAMETER BREAKDOWN

| Parameter | Hex Name | Value | Description |
|-----------|----------|-------|-------------|
| **investor_address** | `696E766573746F725F61646472657373` | `073E9B038A99276D26215F941B94ADBBF3D9FAC5` | Investor wallet (rCJjEY...) |
| **shipowner_address** | `736869706F776E65725F61646472657373` | `B0C366DBE0AAE8F589EE31B5F2810D111C0F7080` | Shipowner wallet (rHferW...) |
| **investor_target** | `696E766573746F725F746172676574` | `000000001DCD6500` | 500 XRP target (500,000,000 drops) |

---

## 💰 WALLET FUNDING STATUS

These wallets were funded via Xahau Testnet faucet API. Verify funding:

```bash
# Check Platform balance
curl -X POST https://xahau-test.net -H "Content-Type: application/json" \
  -d '{"method":"account_info","params":[{"account":"rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV","ledger_index":"validated"}]}'

# Check Investor balance
curl -X POST https://xahau-test.net -H "Content-Type: application/json" \
  -d '{"method":"account_info","params":[{"account":"rCJjEYgwfwWEmJUQdgERXqdhRdeDfJq9r","ledger_index":"validated"}]}'

# Check Shipowner balance
curl -X POST https://xahau-test.net -H "Content-Type: application/json" \
  -d '{"method":"account_info","params":[{"account":"rHferWyNi4ZzbTqmSBrZUsQPKmZVGGUJrZ","ledger_index":"validated"}]}'

# Check Charterer balance
curl -X POST https://xahau-test.net -H "Content-Type: application/json" \
  -d '{"method":"account_info","params":[{"account":"rBucHbYrQkKNdWGqaLcS4gKELhkzrMCKKN","ledger_index":"validated"}]}'
```

Or check on Xahau Explorer:
- Platform: https://explorer.xahau-test.net/accounts/rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV
- Investor: https://explorer.xahau-test.net/accounts/rCJjEYgwfwWEmJUQdgERXqdhRdeDfJq9r
- Shipowner: https://explorer.xahau-test.net/accounts/rHferWyNi4ZzbTqmSBrZUsQPKmZVGGUJrZ
- Charterer: https://explorer.xahau-test.net/accounts/rBucHbYrQkKNdWGqaLcS4gKELhkzrMCKKN

---

## 📝 DEPLOYMENT CHECKLIST

- [ ] 1. Fund all 4 wallets (if not already funded)
- [ ] 2. Compile `hooks/waterfall.c` to WASM
- [ ] 3. Convert WASM to hex string
- [ ] 4. Replace `<YOUR_COMPILED_WASM_HEX>` in SetHook parameters above
- [ ] 5. Sign and submit SetHook transaction using Platform wallet secret
- [ ] 6. Wait for transaction confirmation (tesSUCCESS)
- [ ] 7. Copy the transaction hash
- [ ] 8. Update the demo code with the new Hook address
- [ ] 9. Test the waterfall distribution

---

## 🎯 AFTER HOOK DEPLOYMENT

Once you deploy the Hook, provide:

1. **Transaction Hash** - The SetHook transaction hash
2. **Hook Installation Status** - Confirmation it succeeded (tesSUCCESS)
3. **Hook Account** - Should be: `rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV`

I'll then update the demo code to use these exact wallets and test the waterfall logic!

---

## 🔐 SECURITY NOTES

⚠️ **TESTNET ONLY** - These are testnet wallets. Never use testnet secrets on mainnet.

⚠️ **Keep Secrets Safe** - Store these wallet secrets securely. Anyone with the secret can control the wallet.

⚠️ **Hook Account Control** - The Platform wallet (`rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV`) will have the Hook installed. All incoming payments to this account will trigger the waterfall distribution logic.

---

## 🧪 TEST SCENARIO

After Hook deployment, test with these payments:

### Payment 1: 250 XRP
```
From: rBucHbYrQkKNdWGqaLcS4gKELhkzrMCKKN (Charterer)
To:   rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV (Hook)
```
**Expected Distribution:**
- Investor gets: 250 XRP (50% recovered)
- Shipowner gets: 0 XRP

### Payment 2: 300 XRP
```
From: rBucHbYrQkKNdWGqaLcS4gKELhkzrMCKKN (Charterer)
To:   rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV (Hook)
```
**Expected Distribution:**
- Investor gets: 250 XRP (100% recovered - target reached!)
- Shipowner gets: 50 XRP (remainder)

### Payment 3: 200 XRP
```
From: rBucHbYrQkKNdWGqaLcS4gKELhkzrMCKKN (Charterer)
To:   rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV (Hook)
```
**Expected Distribution:**
- Investor gets: 0 XRP (already fully recovered)
- Shipowner gets: 200 XRP (all to shipowner)

---

**Generated with**: `npm run generate-wallets`
