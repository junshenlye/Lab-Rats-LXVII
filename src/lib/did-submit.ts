/**
 * DID Transaction Submission with Crossmark Wallet
 * Signs DIDSet transactions using Crossmark wallet and submits to XRPL testnet
 */

import { Client } from 'xrpl';

interface DIDSetTransaction {
  TransactionType: string;
  Account: string;
  URI?: string;
  Fee: string;
}

interface SubmitDIDResult {
  success: boolean;
  transactionHash?: string;
  did?: string;
  error?: string;
}

/**
 * Sign a DIDSet transaction with Crossmark wallet and submit to XRPL testnet
 * 1. Requests Crossmark to sign the transaction
 * 2. Submits the signed transaction to XRPL testnet using xrpl Client
 * 3. Waits for confirmation and returns the transaction hash
 * @param transaction - The unsigned DIDSet transaction
 * @param did - The formatted DID string
 * @returns Result with transaction hash or error
 */
export async function signAndSubmitDIDWithCrossmark(
  transaction: DIDSetTransaction,
  did: string
): Promise<SubmitDIDResult> {
  let client: Client | null = null;

  try {
    // Check if Crossmark SDK is available
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: 'Crossmark signing is only available in browser environment',
      };
    }

    if (!(window as any).crossmark) {
      return {
        success: false,
        error: 'Crossmark wallet not available. Please ensure extension is installed.',
      };
    }

    // Get Crossmark SDK from window
    const sdk = (window as any).crossmark;

    console.log('[DID Submit] Preparing DIDSet transaction for signing:', transaction);

    // Cast transaction to any to access autofilled fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txWithFields = transaction as any;

    // Validate that transaction has required fields before sending to Crossmark
    if (!txWithFields.Sequence) {
      console.error('[DID Submit] ERROR: Transaction missing Sequence field!');
      return {
        success: false,
        error: 'Transaction missing required Sequence field. Please try again.',
      };
    }

    if (!txWithFields.LastLedgerSequence) {
      console.error('[DID Submit] ERROR: Transaction missing LastLedgerSequence field!');
      return {
        success: false,
        error: 'Transaction missing required LastLedgerSequence field. Please try again.',
      };
    }

    // Prepare the transaction for Crossmark to sign
    // Include all fields - Crossmark needs the complete transaction to sign
    const txRequest = {
      TransactionType: transaction.TransactionType,
      Account: transaction.Account,
      URI: transaction.URI,
      Fee: transaction.Fee,
      Sequence: txWithFields.Sequence,
      LastLedgerSequence: txWithFields.LastLedgerSequence,
      SigningPubKey: txWithFields.SigningPubKey || '',
    };

    console.log('[DID Submit] Full transaction to sign:', txRequest);
    console.log('[DID Submit] Requesting Crossmark to sign transaction...');

    // Request Crossmark to sign the transaction using the correct SDK method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const signResponse = await sdk.sign(txRequest) as any;

    console.log('[DID Submit] Crossmark sign response received:', signResponse);

    if (!signResponse) {
      console.error('[DID Submit] ERROR: No response from Crossmark!');
      return {
        success: false,
        error: 'Crossmark did not respond. Please try again.',
      };
    }

    if (!signResponse.signedTransaction) {
      console.error('[DID Submit] ERROR: Crossmark response missing signedTransaction:', signResponse);
      return {
        success: false,
        error: signResponse.error || 'Crossmark failed to sign the transaction. Please try again.',
      };
    }

    const signedTx = signResponse.signedTransaction;
    console.log('[DID Submit] Transaction signed successfully');
    console.log('[DID Submit] Signed transaction object:', signedTx);

    // Validate that signed transaction has a Signature field (proof of signing)
    if (!(signedTx as any).Signature) {
      console.error('[DID Submit] ERROR: Signed transaction missing Signature field!', signedTx);
      return {
        success: false,
        error: 'Transaction was not properly signed. Missing Signature field.',
      };
    }

    console.log('[DID Submit] ✓ Signature field confirmed present');

    // Now submit the signed transaction to XRPL testnet
    console.log('[DID Submit] ✓ Transaction ready for submission');
    console.log('[DID Submit] Connecting to XRPL testnet for submission...');
    client = new Client('wss://s.altnet.rippletest.net:51234');
    await client.connect();
    console.log('[DID Submit] ✓ Connected to XRPL testnet');

    console.log('[DID Submit] Submitting signed transaction to ledger...');

    // Submit and wait for confirmation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await client.submitAndWait(signedTx as any);

    console.log('[DID Submit] Full transaction result:', result);
    console.log('[DID Submit] Transaction result object:', result.result);

    // Check if transaction was successful
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txResult = result.result as any;
    const transactionResult = txResult.meta?.TransactionResult;
    const txHash = txResult.hash;

    console.log('[DID Submit] Transaction hash:', txHash);
    console.log('[DID Submit] Transaction result code:', transactionResult);

    if (transactionResult === 'tesSUCCESS') {
      if (!txHash) {
        console.error('[DID Submit] ERROR: Transaction confirmed but no hash returned');
        return {
          success: false,
          error: 'Transaction confirmed but no hash returned',
        };
      }

      console.log('[DID Submit] ✓✓✓ DIDSet transaction submitted successfully!');
      console.log('[DID Submit] Transaction hash:', txHash);
      console.log('[DID Submit] DID:', did);

      return {
        success: true,
        transactionHash: txHash,
        did,
      };
    } else {
      console.error('[DID Submit] ERROR: Transaction failed on ledger');
      console.error('[DID Submit] Failure reason:', transactionResult);
      console.error('[DID Submit] Full result:', txResult);

      return {
        success: false,
        error: `Transaction failed on ledger: ${transactionResult || 'Unknown error'}`,
      };
    }
  } catch (error) {
    console.error('[DID Submit] EXCEPTION ERROR:', error);

    // Distinguish between different error types
    let errorMessage = 'Failed to submit DID transaction';

    if (error instanceof Error) {
      console.error('[DID Submit] Error name:', error.name);
      console.error('[DID Submit] Error message:', error.message);

      if (
        error.message.includes('cancelled') ||
        error.message.includes('rejected') ||
        error.message.includes('Cancelled')
      ) {
        console.log('[DID Submit] User cancelled transaction in Crossmark');
        errorMessage = 'You cancelled the transaction in Crossmark. Please try again.';
      } else if (error.message.includes('timeout')) {
        console.log('[DID Submit] Transaction timed out');
        errorMessage = 'Transaction submission timed out. Please try again.';
      } else if (error.message.includes('network') || error.message.includes('connection')) {
        console.log('[DID Submit] Network connection error');
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('not found') || error.message.includes('No such account')) {
        console.log('[DID Submit] Account not found on ledger');
        errorMessage = 'Wallet account not found on XRPL testnet. Please check your wallet address.';
      } else {
        console.log('[DID Submit] Other error:', error.message);
        errorMessage = error.message;
      }
    }

    console.error('[DID Submit] Returning error:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  } finally {
    // Always disconnect the client
    if (client) {
      try {
        await client.disconnect();
      } catch (err) {
        console.error('[DID Submit] Error disconnecting client:', err);
      }
    }
  }
}
