# 🎯 HOOK REDEPLOYMENT PARAMETERS

## ✅ ALL WALLETS FUNDED AND READY!

---

## 💰 WALLET CONFIGURATION

### Existing Wallets (Already Funded):

#### Platform (Hook Account)
```
Address: rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV
Secret:  sEdTk3FMu1ojhchiss2KXY8Uw71DMce
Balance: 999.61 XRP
```

#### Charterer
```
Address: rBucHbYrQkKNdWGqaLcS4gKELhkzrMCKKN
Secret:  sEdTYETVj89Vt8415esLEvqhRyXw516
Balance: 1000.00 XRP
```

### NEW Wallets (Just Funded):

#### Investor ✅
```
Address: rLecPbHft8JmVMVb1gzBwKj6tWNZ7nuao3
Secret:  sh4aB8cCKe1eZJifqA2G6y9hpSU2Y
Balance: 1000.00 XRP
Funding TX: 300F3101921B255B5EBFAE0C6A3EA95DA9BEB72B82F5704088E7C6F629567199
```

#### Shipowner ✅
```
Address: r4ZGB1C8JB7KpckzfFXewzo7W9T8NF9q2g
Secret:  spz3s87D3i8ntTEBPt6nxs8DAX9if
Balance: 1000.00 XRP
Funding TX: 8541289BDB6107509B315DB3D6B0B12BE2E1214B6A14179B3908263B8C7A6E90
```

---

## 📋 SETHOOK PARAMETERS

### Hex-Encoded Addresses:

```
Investor Hex:  D787527815B1A26FD7AA5A50923F58315845DE55
Shipowner Hex: EC74A14E6D2D82A86298123F7EFB009B6A84CE2B
```

### Complete SetHook Transaction:

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
              "HookParameterValue": "D787527815B1A26FD7AA5A50923F58315845DE55"
            }
          },
          {
            "HookParameter": {
              "HookParameterName": "736869706F776E65725F61646472657373",
              "HookParameterValue": "EC74A14E6D2D82A86298123F7EFB009B6A84CE2B"
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

## 🔍 QUICK REFERENCE

| Role | Address | Hex (for Hook) |
|------|---------|----------------|
| **Platform (Hook)** | `rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV` | N/A (Hook account) |
| **Investor** | `rLecPbHft8JmVMVb1gzBwKj6tWNZ7nuao3` | `D787527815B1A26FD7AA5A50923F58315845DE55` |
| **Shipowner** | `r4ZGB1C8JB7KpckzfFXewzo7W9T8NF9q2g` | `EC74A14E6D2D82A86298123F7EFB009B6A84CE2B` |
| **Charterer** | `rBucHbYrQkKNdWGqaLcS4gKELhkzrMCKKN` | N/A (not in Hook params) |

**Investor Target**: `000000001DCD6500` (500 XRP = 500,000,000 drops)

---

## 📝 DEPLOYMENT STEPS

1. **Compile your Hook** (`hooks/waterfall.c` → WASM → HEX)

2. **Replace `<YOUR_COMPILED_WASM_HEX>`** in the SetHook JSON above

3. **Sign and Submit** the SetHook transaction using the Platform wallet:
   - Account: `rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV`
   - Secret: `sEdTk3FMu1ojhchiss2KXY8Uw71DMce`

4. **Wait for confirmation** (tesSUCCESS status)

5. **Reply with the transaction hash** so I can update the demo code

---

## 🔐 VERIFY ON EXPLORER

**Platform Account** (Hook will be installed here):
https://explorer.xahau-test.net/accounts/rHC2GnCo9agZVhQMiGBF2dt4Ht5mpxzWnV

**Investor Account** (NEW):
https://explorer.xahau-test.net/accounts/rLecPbHft8JmVMVb1gzBwKj6tWNZ7nuao3

**Shipowner Account** (NEW):
https://explorer.xahau-test.net/accounts/r4ZGB1C8JB7KpckzfFXewzo7W9T8NF9q2g

**Charterer Account**:
https://explorer.xahau-test.net/accounts/rBucHbYrQkKNdWGqaLcS4gKELhkzrMCKKN

---

## ⚠️ IMPORTANT NOTES

- ✅ All 4 wallets are REAL and FUNDED on Xahau Testnet
- ✅ Investor and Shipowner are NEW wallets (just created)
- ✅ Platform and Charterer are the SAME as before (already had funds)
- ⚠️  Make sure to use the SAME Platform address for Hook deployment
- ⚠️  Hex addresses MUST match exactly (case-sensitive)

---

## 📊 AFTER DEPLOYMENT

Once you deploy and share the Hook transaction hash, I will:

1. ✅ Verify the Hook installation
2. ✅ Update the demo code with new wallet addresses
3. ✅ Test the waterfall distribution
4. ✅ Confirm everything works end-to-end

---

**Ready to deploy!** 🚀
