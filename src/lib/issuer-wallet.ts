/**
 * Issuer Wallet Management
 * Handles platform wallet for issuing KYC credentials
 * Server-side only - never expose seed to client
 */

import { Wallet, Client } from 'xrpl';

const TESTNET_URL = 'wss://s.altnet.rippletest.net:51234';

let issuerWallet: Wallet | null = null;

/**
 * Initialize issuer wallet from environment variable
 * Throws if ISSUER_SEED not configured
 */
export function getIssuerWallet(): Wallet {
  if (issuerWallet) {
    return issuerWallet;
  }

  const seed = process.env.ISSUER_SEED;

  if (!seed) {
    throw new Error('ISSUER_SEED not configured in environment variables');
  }

  if (!seed.startsWith('s')) {
    throw new Error('Invalid ISSUER_SEED format. XRPL seeds must start with "s"');
  }

  issuerWallet = Wallet.fromSeed(seed);
  console.log('[Issuer Wallet] Initialized with address:', issuerWallet.address);

  return issuerWallet;
}

/**
 * Get issuer wallet address without exposing seed
 */
export function getIssuerAddress(): string {
  return getIssuerWallet().address;
}

/**
 * Sign and submit a CredentialCreate transaction
 * This is called server-side to issue credentials on behalf of the platform
 *
 * @param transaction - Unsigned CredentialCreate transaction
 * @returns Result with transaction hash or error
 */
export async function signAndSubmitCredentialCreate(
  transaction: {
    TransactionType: 'CredentialCreate';
    Account: string;
    Subject: string;
    CredentialType: string;
    URI?: string;
    Data?: string;
    Fee: string;
  }
): Promise<{ success: boolean; hash?: string; error?: string }> {
  let client: Client | null = null;

  try {
    const wallet = getIssuerWallet();

    console.log('[Issuer] Connecting to XRPL testnet...');
    client = new Client(TESTNET_URL);
    await client.connect();
    console.log('[Issuer] Connected to XRPL testnet');

    console.log('[Issuer] Autofilling transaction...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autofilled = await client.autofill(transaction as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autofilledAny = autofilled as any;
    console.log('[Issuer] Transaction autofilled:', {
      Sequence: autofilledAny.Sequence,
      LastLedgerSequence: autofilledAny.LastLedgerSequence,
    });

    console.log('[Issuer] Signing transaction with issuer wallet...');
    const signed = wallet.sign(autofilled);
    console.log('[Issuer] Transaction signed');

    console.log('[Issuer] Submitting signed transaction...');
    const result = await client.submitAndWait(signed.tx_blob);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txResult = result.result as any;
    const hash = txResult.hash;
    const transactionResult = txResult.meta?.TransactionResult;

    console.log('[Issuer] Transaction result:', transactionResult);
    console.log('[Issuer] Transaction hash:', hash);

    if (transactionResult === 'tesSUCCESS') {
      console.log('[Issuer] CredentialCreate submitted successfully');
      return { success: true, hash };
    } else {
      console.error('[Issuer] Transaction failed:', transactionResult);
      return {
        success: false,
        error: `Transaction failed: ${transactionResult}`,
      };
    }
  } catch (error) {
    console.error('[Issuer] Error:', error);

    let errorMessage = 'Failed to issue credential';

    if (error instanceof Error) {
      if (error.message.includes('actNotFound') || error.message.includes('Account not found')) {
        errorMessage = 'Issuer account not found on XRPL testnet. Please fund the account.';
      } else if (error.message.includes('tecUNFUNDED')) {
        errorMessage = 'Issuer account has insufficient XRP balance.';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  } finally {
    if (client) {
      try {
        await client.disconnect();
        console.log('[Issuer] Disconnected from XRPL testnet');
      } catch (err) {
        console.error('[Issuer] Error disconnecting:', err);
      }
    }
  }
}
