/**
 * DID Service - API calls for DID management
 */

import apiClient from './apiClient';
import type { ShipownerDID, PlatformDID } from '@/types';

interface ShipownerCreateRequest {
  wallet_address: string;
  company_name: string;
  registration_number: string;
  country: string;
}

interface DIDVerifyResponse {
  did: string;
  exists: boolean;
  wallet_address: string | null;
  type: 'shipowner' | 'vessel' | 'platform' | null;
}

export const didService = {
  /**
   * Get platform DID information
   */
  getPlatformDID: async (): Promise<PlatformDID> => {
    return apiClient.get<PlatformDID>('/did/platform');
  },

  /**
   * Verify if a DID exists
   */
  verifyDID: async (did: string): Promise<DIDVerifyResponse> => {
    return apiClient.post<DIDVerifyResponse>('/did/verify', { did });
  },

  /**
   * Create or get a shipowner DID record
   */
  createShipowner: async (data: {
    walletAddress: string;
    companyName: string;
    registrationNumber: string;
    country: string;
  }): Promise<ShipownerDID> => {
    const request: ShipownerCreateRequest = {
      wallet_address: data.walletAddress,
      company_name: data.companyName,
      registration_number: data.registrationNumber,
      country: data.country,
    };
    const response = await apiClient.post<{
      did: string;
      wallet_address: string;
      company_name: string;
      registration_number: string;
      country: string;
      is_verified: boolean;
      verification_credential_id: string | null;
      created_at: string;
    }>('/did/shipowner', request);

    return {
      did: response.did,
      walletAddress: response.wallet_address,
      companyName: response.company_name,
      registrationNumber: response.registration_number,
      country: response.country,
      isVerified: response.is_verified,
      verificationCredentialId: response.verification_credential_id || undefined,
      createdAt: response.created_at,
    };
  },

  /**
   * Get a shipowner by DID
   */
  getShipownerByDID: async (did: string): Promise<ShipownerDID | null> => {
    try {
      const encodedDID = encodeURIComponent(did);
      const response = await apiClient.get<{
        did: string;
        wallet_address: string;
        company_name: string;
        registration_number: string;
        country: string;
        is_verified: boolean;
        verification_credential_id: string | null;
        created_at: string;
      }>(`/did/shipowner/${encodedDID}`);

      return {
        did: response.did,
        walletAddress: response.wallet_address,
        companyName: response.company_name,
        registrationNumber: response.registration_number,
        country: response.country,
        isVerified: response.is_verified,
        verificationCredentialId: response.verification_credential_id || undefined,
        createdAt: response.created_at,
      };
    } catch {
      return null;
    }
  },

  /**
   * Get a shipowner by wallet address
   */
  getShipownerByWallet: async (walletAddress: string): Promise<ShipownerDID | null> => {
    try {
      const response = await apiClient.get<{
        did: string;
        wallet_address: string;
        company_name: string;
        registration_number: string;
        country: string;
        is_verified: boolean;
        verification_credential_id: string | null;
        created_at: string;
      }>(`/did/shipowner/wallet/${walletAddress}`);

      return {
        did: response.did,
        walletAddress: response.wallet_address,
        companyName: response.company_name,
        registrationNumber: response.registration_number,
        country: response.country,
        isVerified: response.is_verified,
        verificationCredentialId: response.verification_credential_id || undefined,
        createdAt: response.created_at,
      };
    } catch {
      return null;
    }
  },

  /**
   * List all shipowners
   */
  listShipowners: async (): Promise<ShipownerDID[]> => {
    const response = await apiClient.get<Array<{
      did: string;
      wallet_address: string;
      company_name: string;
      registration_number: string;
      country: string;
      is_verified: boolean;
      verification_credential_id: string | null;
      created_at: string;
    }>>('/did/shipowners');

    return response.map((item) => ({
      did: item.did,
      walletAddress: item.wallet_address,
      companyName: item.company_name,
      registrationNumber: item.registration_number,
      country: item.country,
      isVerified: item.is_verified,
      verificationCredentialId: item.verification_credential_id || undefined,
      createdAt: item.created_at,
    }));
  },
};

export default didService;
