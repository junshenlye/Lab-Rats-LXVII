/**
 * Credential Creation API Endpoint
 * Issues credentials on behalf of the platform (issuer-signed)
 *
 * POST /api/credential/create
 * Body: { userAddress, companyInfo, ipfsCid }
 * Returns: { success, transactionHash?, credentialId?, error? }
 */

import {
  buildCredentialCreateTransaction,
  validateCredentialCreate,
  type CredentialData,
} from '@/lib/credential-transaction';
import {
  signAndSubmitCredentialCreate,
  getIssuerAddress,
} from '@/lib/issuer-wallet';

interface CreateCredentialRequest {
  userAddress: string;
  companyInfo: {
    companyName: string;
    registrationNumber: string;
    countryOfIncorporation: string;
    contactEmail: string;
  };
  ipfsCid: string;
}

interface CreateCredentialResponse {
  success: boolean;
  transactionHash?: string;
  credentialId?: string;
  error?: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as CreateCredentialRequest;

    console.log('[Credential Create API] Request received:', {
      userAddress: body.userAddress,
      companyName: body.companyInfo?.companyName,
      ipfsCid: body.ipfsCid,
    });

    // Validate required fields
    if (!body.userAddress) {
      return Response.json(
        {
          success: false,
          error: 'Missing userAddress',
        } as CreateCredentialResponse,
        { status: 400 }
      );
    }

    if (!body.companyInfo?.companyName) {
      return Response.json(
        {
          success: false,
          error: 'Missing company name',
        } as CreateCredentialResponse,
        { status: 400 }
      );
    }

    if (!body.ipfsCid) {
      return Response.json(
        {
          success: false,
          error: 'Missing IPFS CID',
        } as CreateCredentialResponse,
        { status: 400 }
      );
    }

    // Validate XRPL address format
    const addressRegex = /^r[a-zA-Z0-9]{24,34}$/;
    if (!addressRegex.test(body.userAddress)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid XRPL address format',
        } as CreateCredentialResponse,
        { status: 400 }
      );
    }

    // Get issuer address
    let issuerAddress: string;
    try {
      issuerAddress = getIssuerAddress();
    } catch (error) {
      console.error('[Credential Create API] Issuer wallet error:', error);
      return Response.json(
        {
          success: false,
          error: 'Issuer wallet not configured. Please set ISSUER_SEED environment variable.',
        } as CreateCredentialResponse,
        { status: 500 }
      );
    }

    console.log('[Credential Create API] Issuer address:', issuerAddress);

    // Build CredentialCreate transaction
    const credentialData: CredentialData = {
      userAddress: body.userAddress,
      issuerAddress,
      companyInfo: body.companyInfo,
      ipfsCid: body.ipfsCid,
    };

    const transaction = buildCredentialCreateTransaction(credentialData);

    // Validate transaction structure
    if (!validateCredentialCreate(transaction)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid CredentialCreate transaction structure',
        } as CreateCredentialResponse,
        { status: 500 }
      );
    }

    console.log('[Credential Create API] Transaction built, signing and submitting...');

    // Sign and submit with issuer wallet
    const result = await signAndSubmitCredentialCreate(transaction);

    if (!result.success) {
      console.error('[Credential Create API] Submission failed:', result.error);
      return Response.json(
        {
          success: false,
          error: result.error || 'Failed to issue credential',
        } as CreateCredentialResponse,
        { status: 500 }
      );
    }

    // Generate credential ID
    const credentialId = `CRED-${Date.now()}-${body.userAddress.substring(0, 8)}`;

    console.log('[Credential Create API] Credential issued successfully');
    console.log('[Credential Create API] Transaction hash:', result.hash);
    console.log('[Credential Create API] Credential ID:', credentialId);

    return Response.json(
      {
        success: true,
        transactionHash: result.hash,
        credentialId,
      } as CreateCredentialResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('[Credential Create API] Error:', error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as CreateCredentialResponse,
      { status: 500 }
    );
  }
}
