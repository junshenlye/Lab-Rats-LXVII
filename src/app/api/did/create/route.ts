/**
 * DID Creation API Endpoint
 * Builds the DIDSet transaction for signing with Crossmark wallet in the browser
 *
 * NOTE: Transaction autofill (adding Sequence/LastLedgerSequence) happens on the browser side
 * because WebSocket connectivity works better from the browser than from Next.js server.
 */

import {
  buildDIDSetTransaction,
  validateDIDSetTransaction,
  formatDID,
  type CompanyDIDData,
} from '@/lib/didset-transaction';

interface CreateDIDRequest {
  walletAddress: string;
  companyName: string;
  registrationNumber: string;
  countryOfIncorporation: string;
  contactEmail: string;
  contactPhone?: string;
  registeredAddress?: string;
}

interface CreateDIDResponse {
  success: boolean;
  did?: string;
  transaction?: {
    TransactionType: string;
    Account: string;
    URI?: string;
    Fee: string;
  };
  error?: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the request body
    const body = (await request.json()) as CreateDIDRequest;

    console.log('[DID Create] Received request:', {
      walletAddress: body.walletAddress,
      companyName: body.companyName,
    });

    // Validate required fields
    if (!body.walletAddress || !body.companyName || !body.registrationNumber) {
      return Response.json(
        {
          success: false,
          error: 'Missing required fields: walletAddress, companyName, registrationNumber',
        } as CreateDIDResponse,
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!body.walletAddress.match(/^r[a-zA-Z0-9]{24,34}$/)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid XRPL wallet address format',
        } as CreateDIDResponse,
        { status: 400 }
      );
    }

    // Build DIDSet transaction
    const didData: CompanyDIDData = {
      walletAddress: body.walletAddress,
      companyName: body.companyName,
      registrationNumber: body.registrationNumber,
      countryOfIncorporation: body.countryOfIncorporation,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      registeredAddress: body.registeredAddress,
    };

    const transaction = buildDIDSetTransaction(didData);

    // Validate the transaction
    if (!validateDIDSetTransaction(transaction)) {
      return Response.json(
        {
          success: false,
          error: 'Failed to build valid DIDSet transaction',
        } as CreateDIDResponse,
        { status: 500 }
      );
    }

    console.log('[DID Create API] Built DIDSet transaction:', transaction);
    console.log('[DID Create API] Transaction will be autofilled on the browser side');

    // Return the unsigned transaction to the browser
    // The browser will autofill it with Sequence/LastLedgerSequence before signing
    const did = formatDID(body.walletAddress);

    return Response.json(
      {
        success: true,
        did,
        transaction: {
          TransactionType: transaction.TransactionType,
          Account: transaction.Account,
          URI: transaction.URI,
          Fee: transaction.Fee,
          // Sequence and LastLedgerSequence will be added by the browser via autofill()
        },
      } as CreateDIDResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('[DID Create] Error:', error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as CreateDIDResponse,
      { status: 500 }
    );
  }
}

// Handle other methods
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
