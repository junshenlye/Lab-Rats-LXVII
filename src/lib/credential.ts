/**
 * Credential Issuance Frontend Logic
 * Orchestrates the full credential issuance flow:
 * 1. Upload documents to mock IPFS
 * 2. Issue credential (backend creates and signs CredentialCreate)
 * 3. Accept credential (user signs CredentialAccept with Crossmark)
 *
 * IMPORTANT: Crossmark is a smart wallet - send "naked" transactions only!
 * No autofill needed - Crossmark handles Sequence, Fee, LastLedgerSequence automatically.
 */

import { signAndSubmitCredentialWithCrossmark } from './credential-submit';

export interface IssueCredentialParams {
  userAddress: string;
  companyInfo: {
    companyName: string;
    registrationNumber: string;
    countryOfIncorporation: string;
    contactEmail: string;
  };
  ipfsCid: string;
}

export interface IssueCredentialResult {
  success: boolean;
  credentialId?: string;
  createTxHash?: string;
  acceptTxHash?: string;
  error?: string;
}

/**
 * Full credential issuance flow
 * 1. Issue credential (backend creates and signs CredentialCreate)
 * 2. Accept credential (user signs CredentialAccept with Crossmark - NO autofill needed)
 *
 * @param params - User address, company info, and IPFS CID
 * @returns Result with credential ID and transaction hashes
 */
export async function issueCredential(
  params: IssueCredentialParams
): Promise<IssueCredentialResult> {
  try {
    console.log('[Credential] Starting issuance flow...');
    console.log('[Credential] User address:', params.userAddress);
    console.log('[Credential] IPFS CID:', params.ipfsCid);

    // Step 1: Create credential (issuer-signed on backend)
    console.log('[Credential] Step 1: Creating credential (issuer signing)...');

    const createResponse = await fetch('/api/credential/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAddress: params.userAddress,
        companyInfo: params.companyInfo,
        ipfsCid: params.ipfsCid,
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(errorData.error || 'Failed to create credential');
    }

    const createResult = await createResponse.json();

    if (!createResult.success) {
      throw new Error(createResult.error || 'Credential creation failed');
    }

    console.log('[Credential] CredentialCreate submitted successfully');
    console.log('[Credential] Transaction hash:', createResult.transactionHash);
    console.log('[Credential] Credential ID:', createResult.credentialId);

    // Step 2: Build CredentialAccept transaction (naked - no Sequence/Fee/etc)
    console.log('[Credential] Step 2: Building naked CredentialAccept transaction...');

    const acceptResponse = await fetch('/api/credential/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAddress: params.userAddress,
      }),
    });

    if (!acceptResponse.ok) {
      const errorData = await acceptResponse.json();
      throw new Error(errorData.error || 'Failed to build accept transaction');
    }

    const acceptResult = await acceptResponse.json();

    if (!acceptResult.success || !acceptResult.transaction) {
      throw new Error(acceptResult.error || 'Accept transaction build failed');
    }

    console.log('[Credential] CredentialAccept transaction built (naked)');
    console.log('[Credential] Transaction:', acceptResult.transaction);

    // Step 3: Sign and submit with Crossmark (NO autofill needed!)
    // Crossmark is a smart wallet - it handles Sequence, Fee, LastLedgerSequence automatically
    console.log('[Credential] Step 3: Sending to Crossmark signAndSubmit...');

    const submitResult = await signAndSubmitCredentialWithCrossmark(acceptResult.transaction);

    if (!submitResult.success) {
      throw new Error(submitResult.error || 'Failed to accept credential');
    }

    console.log('[Credential] CredentialAccept submitted successfully');
    console.log('[Credential] Accept transaction hash:', submitResult.transactionHash);

    console.log('[Credential] Credential issuance complete!');

    return {
      success: true,
      credentialId: createResult.credentialId,
      createTxHash: createResult.transactionHash,
      acceptTxHash: submitResult.transactionHash,
    };
  } catch (error) {
    console.error('[Credential] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Credential issuance failed',
    };
  }
}

/**
 * Upload documents to mock IPFS
 * Returns a fake CID for demo purposes
 *
 * @param certificateFile - Certificate of incorporation file
 * @param registryFile - Registry extract file
 * @param companyInfo - Company information
 * @returns Result with IPFS CID
 */
export async function uploadDocuments(
  certificateFile: File,
  registryFile: File,
  companyInfo: {
    companyName: string;
    registrationNumber: string;
    countryOfIncorporation: string;
    contactEmail: string;
  }
): Promise<{ success: boolean; cid?: string; error?: string }> {
  try {
    console.log('[IPFS] Uploading documents...');
    console.log('[IPFS] Certificate file:', certificateFile.name, certificateFile.size, 'bytes');
    console.log('[IPFS] Registry file:', registryFile.name, registryFile.size, 'bytes');

    const formData = new FormData();
    formData.append('certificateOfIncorporation', certificateFile);
    formData.append('registryExtract', registryFile);
    formData.append('companyInfo', JSON.stringify(companyInfo));

    const response = await fetch('/api/ipfs/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    console.log('[IPFS] Documents uploaded successfully');
    console.log('[IPFS] CID:', result.cid);

    return {
      success: true,
      cid: result.cid,
    };
  } catch (error) {
    console.error('[IPFS] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
