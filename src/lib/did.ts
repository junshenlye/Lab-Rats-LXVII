/**
 * DID (Decentralized Identifier) Validation Utilities
 * Handles DID lookups on XRPL testnet
 */

export interface DIDCheckResult {
  exists: boolean;
  error?: 'testnet_unreachable' | 'did_not_found' | 'unknown_error';
  errorMessage?: string;
}

// API Proxy endpoint (uses Next.js API route to avoid CORS)
const API_PROXY = '/api/xrpl';

/**
 * Check if a DID exists for a wallet address on XRPL testnet
 *
 * Uses the local API proxy (/api/xrpl) to forward requests to testnet
 * This avoids CORS issues that occur when calling testnet directly from browser.
 *
 * Distinguishes between:
 * - DID exists (DID found in wallet's account data)
 * - DID doesn't exist (testnet responds but no DID found)
 * - Testnet is unreachable (network error only)
 *
 * @param walletAddress - The XRPL wallet address
 * @returns DIDCheckResult indicating if DID exists, and error type if applicable
 */
export async function checkDidOnTestnet(walletAddress: string): Promise<DIDCheckResult> {
  try {
    // Validate wallet address format (XRPL addresses start with 'r')
    if (!walletAddress.match(/^r[a-zA-Z0-9]{24,34}$/)) {
      return {
        exists: false,
        error: 'did_not_found',
        errorMessage: 'Invalid XRPL wallet address format',
      };
    }

    console.log('Checking if DID exists on testnet for wallet:', walletAddress);

    // Query the testnet via API proxy
    const response = await fetch(API_PROXY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'account_info',
        params: [
          {
            account: walletAddress,
            ledger_index: 'validated',
          },
        ],
      }),
      signal: AbortSignal.timeout(10000), // 10 second timeout for proxy
    });

    const data = await response.json();
    console.log('Testnet response:', data);

    // If we got ANY response (success or error), testnet is reachable
    // Check if account has a DID
    if (data.result?.status === 'success' && data.result.account_data) {
      const accountData = data.result.account_data;

      // Check if this account has a DID by looking for did: protocol in the account URI or metadata
      const accountUri = accountData.URI || accountData.Domain;
      const isDIDAccount = accountUri && (accountUri.includes('did:') || accountUri.includes('DID'));

      if (isDIDAccount) {
        console.log('DID found for wallet:', walletAddress);
        return {
          exists: true,
        };
      }

      // Account exists but no DID registered yet
      console.log('No DID found for wallet:', walletAddress);
      return {
        exists: false,
        error: 'did_not_found',
        errorMessage: 'No DID found for this wallet. We will create one for you.',
      };
    }

    // If we got here, testnet responded with an error (e.g., account not found)
    // But testnet is still reachable, so user can proceed
    console.log('Testnet responded but account/DID not found');
    return {
      exists: false,
      error: 'did_not_found',
      errorMessage: 'No DID found for this wallet. We will create one for you.',
    };
  } catch (error) {
    console.error('DID check error:', error);

    // Only treat as unreachable if we get an actual network error
    if (error instanceof TypeError) {
      // Network/CORS error
      return {
        exists: false,
        error: 'testnet_unreachable',
        errorMessage: 'Cannot reach XRPL testnet. Please check your internet connection and try again.',
      };
    }

    if (error instanceof Error && error.name === 'AbortError') {
      // Timeout error
      return {
        exists: false,
        error: 'testnet_unreachable',
        errorMessage: 'XRPL testnet request timed out. Please try again.',
      };
    }

    // Any other error - also treat as testnet unreachable since we couldn't communicate
    console.error('Unknown error checking DID:', error instanceof Error ? error.message : error);
    return {
      exists: false,
      error: 'testnet_unreachable',
      errorMessage: 'Failed to connect to XRPL testnet. Please try again.',
    };
  }
}

/**
 * Format a DID string based on wallet address
 * DID format: did:xrpl:1:{walletAddress}
 *
 * @param walletAddress - The XRPL wallet address
 * @returns Formatted DID string
 */
export function formatDID(walletAddress: string): string {
  // Remove 'r' prefix and create base DID
  const addressPart = walletAddress.substring(1);
  return `did:xrpl:1:${walletAddress}`;
}

/**
 * Create a new DID for the wallet
 * This should trigger a DIDSet transaction on XRPL testnet
 *
 * In production, this would:
 * 1. Call your backend API to generate the DID
 * 2. Your backend would sign and submit a DIDSet transaction to XRPL testnet
 * 3. Wait for transaction confirmation
 * 4. Return the created DID
 *
 * @param walletAddress - The XRPL wallet address
 * @param companyName - The company name
 * @returns Promise resolving to created DID string
 */
export async function createDID(
  walletAddress: string,
  companyName: string
): Promise<{ success: boolean; did?: string; error?: string }> {
  try {
    console.log('Creating DID for wallet:', walletAddress, 'Company:', companyName);

    // Format the DID string
    const did = formatDID(walletAddress);

    // TODO: Call your backend API to create the DID
    // The backend should:
    // 1. Validate the wallet address
    // 2. Create a DIDSet transaction
    // 3. Sign it with your server's key
    // 4. Submit to XRPL testnet
    // 5. Wait for confirmation
    // 6. Return the confirmed DID
    //
    // Example backend call:
    // const response = await fetch('/api/did/create', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     walletAddress,
    //     companyName,
    //     did
    //   })
    // });
    // const result = await response.json();
    // if (!result.success) throw new Error(result.error);
    // return { success: true, did: result.did };

    // For now, simulate the operation
    console.log('DID to be created:', did);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      did,
    };
  } catch (error) {
    console.error('Failed to create DID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create DID',
    };
  }
}
