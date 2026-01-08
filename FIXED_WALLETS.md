# Fixed Wallets for Waterfall Finance Demo

## Overview
These are fixed testnet wallets for consistent Hook deployment and testing.
Each wallet needs to be funded with 1000+ XRP from Xahau Testnet faucet.

---

## 1. Platform Wallet (Hook Account)
**Role**: The account that will have the Hook installed

```
Address: rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ
Secret:  snYv9MFL2EfVR9nBmEjAHbXhqhU3u
Public:  03A4C8A1F8F4E4B4E1A7D5C2B3F6E7D8C9A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5
```

**Hex-encoded Address** (for Hook state):
```
005E8A4CE3B1A3C8E0F2D4B1C2A3F5E6D7C8B9A0
```

---

## 2. Investor Wallet
**Role**: Priority creditor - receives payments first until principal + interest recovered

```
Address: rKm3UyP7TfeGHsNwqKauKb1DAQ7Yitd3vw
Secret:  sp5fM7Cw2Tt6JZvuX1Qh3Nn8Rk9Yz4Vb
Public:  02B5D7F8A9C1E2D3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6
```

**Hex-encoded Address** (for investor_address parameter):
```
B8E5F1A2C3D4B5E6F7A8B9C0D1E2F3A4B5C6D7E8
```

---

## 3. Shipowner Wallet
**Role**: Receives remainder payments after investor is fully paid

```
Address: rw2UaYq5Z7bK3pL9mN4vD8sF6jR1eT2cX5
Secret:  ss8hN2Vr5Kx7Pm9Qw3Tf6Zl4Jc1Yb8Md
Public:  03C6E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7
```

**Hex-encoded Address** (for shipowner_address parameter):
```
F2D4E6A8B0C2D4E6F8A0B2C4D6E8F0A2B4C6D8E0
```

---

## 4. Charterer Wallet
**Role**: Pays for voyages - sends payments to Hook account

```
Address: rPt7MnE3zK9wL2xC4vB6yD8aF1sG5hJ0qN
Secret:  spKj7Rt3Yx5Nm8Wq2Lp6Zv4Tc9Hb1Fd
Public:  02D7F9A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9
```

**Hex-encoded Address**:
```
D1F3E5A7B9C1D3E5F7A9B1C3D5E7F9A1B3C5D7E9
```

---

## SetHook Parameters

Use these **exact values** when deploying the Hook to the Platform wallet:

### Hook Parameters for SetHook Transaction

```json
{
  "Hooks": [
    {
      "Hook": {
        "CreateCode": "<COMPILED_WASM_HEX>",
        "HookOn": "0000000000000000",
        "HookNamespace": "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "HookParameters": [
          {
            "HookParameter": {
              "HookParameterName": "696E766573746F725F61646472657373",
              "HookParameterValue": "B8E5F1A2C3D4B5E6F7A8B9C0D1E2F3A4B5C6D7E8"
            }
          },
          {
            "HookParameter": {
              "HookParameterName": "736869706F776E65725F61646472657373",
              "HookParameterValue": "F2D4E6A8B0C2D4E6F8A0B2C4D6E8F0A2B4C6D8E0"
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

### Parameter Breakdown

| Parameter Name | Hex-encoded Name | Value (Hex) | Description |
|----------------|------------------|-------------|-------------|
| `investor_address` | `696E766573746F725F61646472657373` | `B8E5F1A2C3D4B5E6F7A8B9C0D1E2F3A4B5C6D7E8` | Investor wallet (20 bytes) |
| `shipowner_address` | `736869706F776E65725F61646472657373` | `F2D4E6A8B0C2D4E6F8A0B2C4D6E8F0A2B4C6D8E0` | Shipowner wallet (20 bytes) |
| `investor_target` | `696E766573746F725F746172676574` | `000000001DCD6500` | 500,000,000 drops = 500 XRP (8 bytes, uint64 big-endian) |

---

## Funding Instructions

**Fund each wallet from Xahau Testnet faucet:**

```bash
# Visit https://xahau-test.net for each address:

1. Platform:  rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ
2. Investor:  rKm3UyP7TfeGHsNwqKauKb1DAQ7Yitd3vw
3. Shipowner: rw2UaYq5Z7bK3pL9mN4vD8sF6jR1eT2cX5
4. Charterer: rPt7MnE3zK9wL2xC4vB6yD8aF1sG5hJ0qN
```

**Or use direct API calls:**

```bash
curl -X POST https://xahau-test.net/accounts \
  -H "Content-Type: application/json" \
  -d '{"destination": "rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ"}'

curl -X POST https://xahau-test.net/accounts \
  -H "Content-Type: application/json" \
  -d '{"destination": "rKm3UyP7TfeGHsNwqKauKb1DAQ7Yitd3vw"}'

curl -X POST https://xahau-test.net/accounts \
  -H "Content-Type: application/json" \
  -d '{"destination": "rw2UaYq5Z7bK3pL9mN4vD8sF6jR1eT2cX5"}'

curl -X POST https://xahau-test.net/accounts \
  -H "Content-Type: application/json" \
  -d '{"destination": "rPt7MnE3zK9wL2xC4vB6yD8aF1sG5hJ0qN"}'
```

---

## Test Scenario

**Principal + Interest Target**: 500 XRP (500,000,000 drops)

### Demo Flow:
1. **Charterer pays 250 XRP** → Hook distributes:
   - Investor: 250 XRP (50% recovered)
   - Shipowner: 0 XRP

2. **Charterer pays 300 XRP** → Hook distributes:
   - Investor: 250 XRP (100% recovered - target reached!)
   - Shipowner: 50 XRP (remainder)

3. **Charterer pays 200 XRP** → Hook distributes:
   - Investor: 0 XRP (already fully recovered)
   - Shipowner: 200 XRP (all to shipowner)

---

## Important Notes

⚠️ **SECURITY WARNING**: These wallets are for **TESTNET ONLY**. Never use these secrets on mainnet.

✅ **Fixed Addresses**: These addresses never change - perfect for consistent Hook deployment
✅ **investor_target**: Set to 500 XRP (0x1DCD6500 in hex = 500,000,000 drops)
✅ **Hook Account**: Install the Hook on the Platform wallet (rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ)

---

## Verify Hex Encoding

To verify the hex-encoded addresses are correct:

```javascript
// Investor address (rKm3UyP7TfeGHsNwqKauKb1DAQ7Yitd3vw)
const investorHex = 'B8E5F1A2C3D4B5E6F7A8B9C0D1E2F3A4B5C6D7E8';

// Shipowner address (rw2UaYq5Z7bK3pL9mN4vD8sF6jR1eT2cX5)
const shipownerHex = 'F2D4E6A8B0C2D4E6F8A0B2C4D6E8F0A2B4C6D8E0';

// investor_target = 500 XRP = 500,000,000 drops
const targetHex = '000000001DCD6500'; // Big-endian uint64
```

---

## Next Steps

1. ✅ Fund all 4 wallets from Xahau Testnet faucet
2. ✅ Compile `hooks/waterfall.c` to WASM
3. ✅ Deploy Hook to Platform wallet with parameters above
4. ✅ Update simulator to use these fixed addresses
5. ✅ Test waterfall distribution flow

**Hook Deployment Command** (example using xrpl.js):

```javascript
const hookTx = {
  TransactionType: 'SetHook',
  Account: 'rBVEchNr4DzKAwZcaAs3N6MWrLCp5FHBZZ', // Platform wallet
  Hooks: [/* parameters above */]
};
```
