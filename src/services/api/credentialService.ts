/**
 * Credential Service - API calls for credential management
 */

import apiClient from './apiClient';
import type { Credential, CredentialType } from '@/types';

interface CredentialApiResponse {
  id: string;
  type: string;
  issuer: string;
  subject: string;
  issued_at: string;
  expires_at: string;
  status: string;
  claims: Record<string, unknown>;
}

function transformCredentialResponse(response: CredentialApiResponse): Credential {
  return {
    id: response.id,
    type: response.type as CredentialType,
    issuer: response.issuer,
    subject: response.subject,
    issuedAt: response.issued_at,
    expiresAt: response.expires_at,
    status: response.status as Credential['status'],
    claims: response.claims,
  };
}

interface CredentialVerifyResponse {
  credentialId: string;
  isValid: boolean;
  status: Credential['status'];
  issuer: string;
  subject: string;
  type: CredentialType;
  expiresAt: string;
  reason: string | null;
}

export const credentialService = {
  /**
   * Issue a ShipownerVerificationCredential
   */
  issueShipownerCredential: async (data: {
    shipownerDid: string;
    companyName: string;
    registrationNumber: string;
    country: string;
    documentsVerified?: string[];
  }): Promise<Credential> => {
    const request = {
      shipowner_did: data.shipownerDid,
      company_name: data.companyName,
      registration_number: data.registrationNumber,
      country: data.country,
      documents_verified: data.documentsVerified || ['certificate_of_incorporation', 'registry_extract'],
    };
    const response = await apiClient.post<CredentialApiResponse>('/credentials/shipowner/verify', request);
    return transformCredentialResponse(response);
  },

  /**
   * Issue a VesselOwnershipCredential
   */
  issueVesselOwnershipCredential: async (data: {
    vesselId: string;
    ownerDid: string;
    ownershipType?: string;
  }): Promise<Credential> => {
    const request = {
      vessel_id: data.vesselId,
      owner_did: data.ownerDid,
      ownership_type: data.ownershipType || 'registered_owner',
    };
    const response = await apiClient.post<CredentialApiResponse>('/credentials/vessel/ownership', request);
    return transformCredentialResponse(response);
  },

  /**
   * Get a credential by ID
   */
  getCredential: async (credentialId: string): Promise<Credential> => {
    const response = await apiClient.get<CredentialApiResponse>(`/credentials/${credentialId}`);
    return transformCredentialResponse(response);
  },

  /**
   * Verify if a credential is valid
   */
  verifyCredential: async (credentialId: string): Promise<CredentialVerifyResponse> => {
    const response = await apiClient.get<{
      credential_id: string;
      is_valid: boolean;
      status: string;
      issuer: string;
      subject: string;
      type: string;
      expires_at: string;
      reason: string | null;
    }>(`/credentials/verify/${credentialId}`);
    return {
      credentialId: response.credential_id,
      isValid: response.is_valid,
      status: response.status as Credential['status'],
      issuer: response.issuer,
      subject: response.subject,
      type: response.type as CredentialType,
      expiresAt: response.expires_at,
      reason: response.reason,
    };
  },

  /**
   * Revoke a credential
   */
  revokeCredential: async (credentialId: string, reason: string): Promise<Credential> => {
    const response = await apiClient.post<CredentialApiResponse>('/credentials/revoke', {
      credential_id: credentialId,
      reason,
    });
    return transformCredentialResponse(response);
  },

  /**
   * Get all credentials for a subject (shipowner or vessel)
   */
  getCredentialsBySubject: async (subjectDid: string): Promise<Credential[]> => {
    const encodedDid = encodeURIComponent(subjectDid);
    const response = await apiClient.get<CredentialApiResponse[]>(`/credentials/subject/${encodedDid}`);
    return response.map(transformCredentialResponse);
  },

  /**
   * Get all credentials of a specific type
   */
  getCredentialsByType: async (credentialType: CredentialType): Promise<Credential[]> => {
    const response = await apiClient.get<CredentialApiResponse[]>(`/credentials/type/${credentialType}`);
    return response.map(transformCredentialResponse);
  },

  /**
   * List all credentials
   */
  listCredentials: async (): Promise<Credential[]> => {
    const response = await apiClient.get<CredentialApiResponse[]>('/credentials/');
    return response.map(transformCredentialResponse);
  },
};

export default credentialService;
