/**
 * Credential Transaction Builders
 * Creates CredentialCreate and CredentialAccept transactions for XLS-40/XLS-70
 */

import { toHex } from './hex-utils';

export interface CredentialCompanyInfo {
  companyName: string;
  registrationNumber: string;
  countryOfIncorporation: string;
  contactEmail: string;
}

export interface CredentialData {
  userAddress: string;
  issuerAddress: string;
  companyInfo: CredentialCompanyInfo;
  ipfsCid: string;
}

export interface CredentialCreateTransaction {
  TransactionType: 'CredentialCreate';
  Account: string;
  Subject: string;
  CredentialType: string;
  URI?: string;
  Data?: string;
  Fee: string;
}

export interface CredentialAcceptTransaction {
  TransactionType: 'CredentialAccept';
  Account: string;
  Issuer: string;
  CredentialType: string;
  Fee?: string;
  Sequence?: number;
  LastLedgerSequence?: number;
  SigningPubKey?: string;
}

/**
 * Get the hex-encoded credential type for KYC_VERIFIED
 * This is consistent across all credential transactions
 */
export function getKYCCredentialType(): string {
  return toHex('KYC_VERIFIED');
}

/**
 * Build CredentialCreate transaction (issuer signs)
 *
 * @param data - Credential data including user address, company info, and IPFS CID
 * @returns CredentialCreate transaction ready for issuer signing
 */
export function buildCredentialCreateTransaction(
  data: CredentialData
): CredentialCreateTransaction {
  // Encode credential type
  const credentialType = getKYCCredentialType();

  // Build IPFS URI and encode to hex
  const ipfsUri = `ipfs://${data.ipfsCid}`;
  const uriHex = toHex(ipfsUri);

  // Build company data JSON and encode to hex
  const companyData = {
    companyName: data.companyInfo.companyName,
    registrationNumber: data.companyInfo.registrationNumber,
    country: data.companyInfo.countryOfIncorporation,
    email: data.companyInfo.contactEmail,
    verifiedAt: new Date().toISOString(),
    credentialType: 'KYC_VERIFIED',
  };
  const dataHex = toHex(JSON.stringify(companyData));

  console.log('[CredentialCreate] Building transaction:', {
    issuer: data.issuerAddress,
    subject: data.userAddress,
    credentialType: 'KYC_VERIFIED',
    credentialTypeHex: credentialType,
    uri: ipfsUri,
  });

  return {
    TransactionType: 'CredentialCreate',
    Account: data.issuerAddress,
    Subject: data.userAddress,
    CredentialType: credentialType,
    URI: uriHex,
    Data: dataHex,
    Fee: '12',
  };
}

/**
 * Build CredentialAccept transaction (user signs via Crossmark)
 *
 * @param userAddress - User's wallet address (signs and accepts)
 * @param issuerAddress - Platform issuer address
 * @returns CredentialAccept transaction ready for user signing
 */
export function buildCredentialAcceptTransaction(
  userAddress: string,
  issuerAddress: string
): CredentialAcceptTransaction {
  const credentialType = getKYCCredentialType();

  console.log('[CredentialAccept] Building transaction:', {
    user: userAddress,
    issuer: issuerAddress,
    credentialTypeHex: credentialType,
  });

  return {
    TransactionType: 'CredentialAccept',
    Account: userAddress,
    Issuer: issuerAddress,
    CredentialType: credentialType,
    // Fee: '12', // Removed as Crossmark handles this
  };
}

/**
 * Validate CredentialCreate transaction structure
 */
export function validateCredentialCreate(
  tx: CredentialCreateTransaction
): boolean {
  if (tx.TransactionType !== 'CredentialCreate') {
    console.error('[Validate] Invalid TransactionType:', tx.TransactionType);
    return false;
  }

  if (!tx.Account) {
    console.error('[Validate] Missing Account (issuer)');
    return false;
  }

  if (!tx.Subject) {
    console.error('[Validate] Missing Subject (user)');
    return false;
  }

  if (!tx.CredentialType) {
    console.error('[Validate] Missing CredentialType');
    return false;
  }

  // Validate XRPL address format
  const addressRegex = /^r[a-zA-Z0-9]{24,34}$/;
  if (!addressRegex.test(tx.Account)) {
    console.error('[Validate] Invalid Account address format');
    return false;
  }

  if (!addressRegex.test(tx.Subject)) {
    console.error('[Validate] Invalid Subject address format');
    return false;
  }

  return true;
}

/**
 * Validate CredentialAccept transaction structure
 */
export function validateCredentialAccept(
  tx: CredentialAcceptTransaction
): boolean {
  if (tx.TransactionType !== 'CredentialAccept') {
    console.error('[Validate] Invalid TransactionType:', tx.TransactionType);
    return false;
  }

  if (!tx.Account) {
    console.error('[Validate] Missing Account (user)');
    return false;
  }

  if (!tx.Issuer) {
    console.error('[Validate] Missing Issuer');
    return false;
  }

  if (!tx.CredentialType) {
    console.error('[Validate] Missing CredentialType');
    return false;
  }

  // Validate XRPL address format
  const addressRegex = /^r[a-zA-Z0-9]{24,34}$/;
  if (!addressRegex.test(tx.Account)) {
    console.error('[Validate] Invalid Account address format');
    return false;
  }

  if (!addressRegex.test(tx.Issuer)) {
    console.error('[Validate] Invalid Issuer address format');
    return false;
  }

  return true;
}
