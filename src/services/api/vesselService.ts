/**
 * Vessel Service - API calls for vessel management
 */

import apiClient from './apiClient';
import type { Vessel, VesselCreate, VesselDocument, VesselDID, VesselDocumentType } from '@/types';

interface VesselApiResponse {
  id: string;
  imo: string;
  name: string;
  type: string;
  flag: string;
  gross_tonnage: number;
  year_built: number;
  did: string | null;
  owner_did: string;
  status: string;
  documents: Array<{
    id: string;
    vessel_id: string;
    type: string;
    file_name: string;
    status: string;
    ipfs_cid: string | null;
    uploaded_at: string;
    verified_at: string | null;
  }>;
  ownership_credential_id: string | null;
  created_at: string;
  updated_at: string | null;
}

function transformVesselResponse(response: VesselApiResponse): Vessel {
  return {
    id: response.id,
    imo: response.imo,
    name: response.name,
    type: response.type as Vessel['type'],
    flag: response.flag,
    grossTonnage: response.gross_tonnage,
    yearBuilt: response.year_built,
    did: response.did || undefined,
    ownerDid: response.owner_did,
    status: response.status as Vessel['status'],
    documents: response.documents.map((doc) => ({
      id: doc.id,
      vesselId: doc.vessel_id,
      type: doc.type as VesselDocumentType,
      fileName: doc.file_name,
      status: doc.status as VesselDocument['status'],
      ipfsCid: doc.ipfs_cid || undefined,
      uploadedAt: doc.uploaded_at,
      verifiedAt: doc.verified_at || undefined,
    })),
    ownershipCredentialId: response.ownership_credential_id || undefined,
    createdAt: response.created_at,
    updatedAt: response.updated_at || undefined,
  };
}

export const vesselService = {
  /**
   * List all vessels, optionally filtered by owner DID
   */
  listVessels: async (ownerDid?: string): Promise<Vessel[]> => {
    const endpoint = ownerDid
      ? `/vessels/?owner_did=${encodeURIComponent(ownerDid)}`
      : '/vessels/';
    const response = await apiClient.get<VesselApiResponse[]>(endpoint);
    return response.map(transformVesselResponse);
  },

  /**
   * Create a new vessel
   */
  createVessel: async (data: VesselCreate): Promise<Vessel> => {
    const request = {
      imo: data.imo,
      name: data.name,
      type: data.type,
      flag: data.flag,
      gross_tonnage: data.grossTonnage,
      year_built: data.yearBuilt,
      owner_did: data.ownerDid,
    };
    const response = await apiClient.post<VesselApiResponse>('/vessels/', request);
    return transformVesselResponse(response);
  },

  /**
   * Get a vessel by ID
   */
  getVessel: async (vesselId: string): Promise<Vessel> => {
    const response = await apiClient.get<VesselApiResponse>(`/vessels/${vesselId}`);
    return transformVesselResponse(response);
  },

  /**
   * Get a vessel by IMO number
   */
  getVesselByIMO: async (imo: string): Promise<Vessel | null> => {
    try {
      const response = await apiClient.get<VesselApiResponse>(`/vessels/imo/${encodeURIComponent(imo)}`);
      return transformVesselResponse(response);
    } catch {
      return null;
    }
  },

  /**
   * Create a DID for a vessel (platform-controlled)
   */
  createVesselDID: async (vesselId: string): Promise<VesselDID> => {
    const response = await apiClient.post<{
      vessel_id: string;
      vessel_did: string;
      managed_by: string;
      created_at: string;
    }>(`/vessels/${vesselId}/did`);
    return {
      vesselId: response.vessel_id,
      vesselDid: response.vessel_did,
      managedBy: response.managed_by,
      createdAt: response.created_at,
    };
  },

  /**
   * Upload a document for a vessel
   */
  uploadDocument: async (
    vesselId: string,
    documentType: VesselDocumentType,
    fileName: string
  ): Promise<VesselDocument> => {
    const response = await apiClient.post<{
      id: string;
      vessel_id: string;
      type: string;
      file_name: string;
      status: string;
      ipfs_cid: string | null;
      uploaded_at: string;
      verified_at: string | null;
    }>(`/vessels/${vesselId}/documents`, {
      type: documentType,
      file_name: fileName,
    });
    return {
      id: response.id,
      vesselId: response.vessel_id,
      type: response.type as VesselDocumentType,
      fileName: response.file_name,
      status: response.status as VesselDocument['status'],
      ipfsCid: response.ipfs_cid || undefined,
      uploadedAt: response.uploaded_at,
      verifiedAt: response.verified_at || undefined,
    };
  },

  /**
   * Mark a document as verified
   */
  verifyDocument: async (vesselId: string, documentId: string): Promise<VesselDocument> => {
    const response = await apiClient.post<{
      id: string;
      vessel_id: string;
      type: string;
      file_name: string;
      status: string;
      ipfs_cid: string | null;
      uploaded_at: string;
      verified_at: string | null;
    }>(`/vessels/${vesselId}/documents/${documentId}/verify`);
    return {
      id: response.id,
      vesselId: response.vessel_id,
      type: response.type as VesselDocumentType,
      fileName: response.file_name,
      status: response.status as VesselDocument['status'],
      ipfsCid: response.ipfs_cid || undefined,
      uploadedAt: response.uploaded_at,
      verifiedAt: response.verified_at || undefined,
    };
  },

  /**
   * Update vessel status
   */
  updateVesselStatus: async (vesselId: string, status: Vessel['status']): Promise<Vessel> => {
    const response = await apiClient.put<VesselApiResponse>(
      `/vessels/${vesselId}/status?status=${status}`
    );
    return transformVesselResponse(response);
  },
};

export default vesselService;
