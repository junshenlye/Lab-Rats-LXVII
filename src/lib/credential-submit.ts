/**
 * Credential Transaction Submission with Crossmark
 * Uses Crossmark's signAndSubmit for automatic handling of sequence/fees
 *
 * IMPORTANT: Crossmark is a smart wallet - send "naked" transactions only!
 * Do NOT include: Sequence, Fee, LastLedgerSequence, NetworkID
 * Crossmark will handle all of these automatically.
 */

interface CredentialAcceptTransaction {
  TransactionType: string;
  Account: string;
  Issuer: string;
  CredentialType: string;
}

interface SubmitCredentialResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Sign and submit CredentialAccept with Crossmark wallet
 * Uses signAndSubmit (NOT sign) to let Crossmark handle everything
 *
 * @param transaction - The "naked" CredentialAccept transaction (no Sequence/Fee/etc)
 * @returns Result with transaction hash or error
 */
export async function signAndSubmitCredentialWithCrossmark(
  transaction: CredentialAcceptTransaction
): Promise<SubmitCredentialResult> {
  try {
    // Check if running in browser
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: 'Crossmark signing only available in browser',
      };
    }

    // Import Crossmark SDK
    const { default: sdk } = await import('@crossmarkio/sdk');

    // Verify Crossmark is connected
    if (!sdk.session?.address) {
      return {
        success: false,
        error: 'Crossmark wallet not connected',
      };
    }

    console.log('[Credential Submit] Preparing naked CredentialAccept transaction');

    // Build the NAKED transaction - Crossmark handles Sequence, Fee, LastLedgerSequence
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nakedTx: any = {
      TransactionType: 'CredentialAccept',
      Account: transaction.Account,
      Issuer: transaction.Issuer,
      CredentialType: transaction.CredentialType,
    };

    console.log('[Credential Submit] Naked transaction (no Sequence/Fee/etc):', nakedTx);
    console.log('[Credential Submit] Calling Crossmark signAndSubmitAndWait...');

    // Use sdk.async.signAndSubmitAndWait() - Crossmark SDK pattern
    // Returns: { request, response, createdAt, resolvedAt }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { request, response, createdAt, resolvedAt } = await (sdk.async.signAndSubmitAndWait(nakedTx) as any);

    console.log('[Credential Submit] Crossmark response:', { request, response, createdAt, resolvedAt });

    if (!response) {
      console.error('[Credential Submit] ERROR: No response from Crossmark');
      return {
        success: false,
        error: 'Crossmark did not respond. Please try again.',
      };
    }

    // Parse response from XRPL
    // Response structure: response.result.meta.TransactionResult
    const txResult = response?.result?.meta?.TransactionResult || response?.result?.engine_result;
    const txHash = response?.result?.hash || response?.result?.tx_json?.hash;

    console.log('[Credential Submit] Transaction result:', txResult);
    console.log('[Credential Submit] Transaction hash:', txHash);

    if (txResult === 'tesSUCCESS') {
      console.log('[Credential Submit] ✓ CredentialAccept submitted successfully!');
      return {
        success: true,
        transactionHash: txHash,
      };
    } else if (txResult) {
      // Transaction was submitted but failed
      console.error('[Credential Submit] Transaction failed:', txResult);
      return {
        success: false,
        error: `Transaction failed: ${txResult}`,
      };
    } else {
      // Check if we got a hash - might be pending
      if (txHash) {
        console.log('[Credential Submit] Transaction submitted, hash:', txHash);
        return {
          success: true,
          transactionHash: txHash,
        };
      }

      // Check for error in response
      const errorMsg = response.error || response.message || 'Unknown error from Crossmark';
      console.error('[Credential Submit] Error:', errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
  } catch (error) {
    console.error('[Credential Submit] Exception:', error);

    let errorMessage = 'Failed to submit credential transaction';

    if (error instanceof Error) {
      if (
        error.message.includes('cancelled') ||
        error.message.includes('rejected') ||
        error.message.includes('Cancelled') ||
        error.message.includes('denied')
      ) {
        errorMessage = 'You cancelled the transaction in Crossmark.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Transaction timed out. Please try again.';
      } else if (error.message.includes('network') || error.message.includes('connection')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('not found') || error.message.includes('No such account')) {
        errorMessage = 'Account not found on XRPL testnet. Please fund your wallet.';
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
