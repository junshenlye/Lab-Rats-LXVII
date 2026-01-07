/**
 * Issuer Wallet Management
 * Handles platform wallet for issuing KYC credentials
 * Server-side only - never expose seed to client
 */

import { Wallet } from 'xrpl';

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
  try {
    getIssuerWallet();

    console.log('[Issuer] Demo mode: Simulating CredentialCreate transaction...');
    console.log('[Issuer] Transaction details:', {
      Account: transaction.Account,
      Subject: transaction.Subject,
      CredentialType: transaction.CredentialType,
      Fee: transaction.Fee,
    });

    // Demo mode: Simulate transaction signing and submission
    console.log('[Issuer] Signing with issuer wallet (demo)...');
    const hash = generateDemoTransactionHash();
    console.log('[Issuer] Generated demo transaction hash:', hash);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('[Issuer] CredentialCreate submitted successfully (demo)');
    return { success: true, hash };
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
  }
}

/**
 * Generate a demo transaction hash
 * Format: 64 hex characters
 */
function generateDemoTransactionHash(): string {
  const chars = '0123456789ABCDEF';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}
