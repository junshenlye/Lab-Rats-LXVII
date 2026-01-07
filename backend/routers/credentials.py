"""
Credentials Router - Endpoints for credential issuance and verification.
"""

from fastapi import APIRouter, HTTPException
from typing import List

from models.credential import (
    ShipownerCredentialRequest, VesselOwnershipCredentialRequest,
    CredentialResponse, CredentialVerifyRequest, CredentialVerifyResponse,
    CredentialRevokeRequest, CredentialType
)
from services.credential_service import CredentialService
from services.did_service import DIDService
from services.vessel_service import VesselService

router = APIRouter()
credential_service = CredentialService()
did_service = DIDService()
vessel_service = VesselService()


@router.post("/shipowner/verify", response_model=CredentialResponse)
async def issue_shipowner_credential(data: ShipownerCredentialRequest):
    """
    Issue a ShipownerVerificationCredential.
    This credential verifies that the platform has verified the shipowner's identity.
    """
    # Verify the shipowner exists
    shipowner = did_service.get_shipowner_by_did(data.shipowner_did)
    if not shipowner:
        raise HTTPException(status_code=404, detail="Shipowner not found. Please register first.")

    # Issue the credential
    credential = credential_service.issue_shipowner_credential(data)

    # Update shipowner verification status
    did_service.update_verification_status(data.shipowner_did, credential.id)

    return credential


@router.post("/vessel/ownership", response_model=CredentialResponse)
async def issue_vessel_ownership_credential(data: VesselOwnershipCredentialRequest):
    """
    Issue a VesselOwnershipCredential.
    This credential attests that a shipowner owns a specific vessel.
    """
    # Get the vessel
    vessel = vessel_service.get_vessel(data.vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    # Verify the vessel has a DID
    if not vessel.did:
        # Create vessel DID first
        vessel_service.create_vessel_did(data.vessel_id)
        vessel = vessel_service.get_vessel(data.vessel_id)

    # Get the shipowner info
    shipowner = did_service.get_shipowner_by_did(data.owner_did)
    if not shipowner:
        raise HTTPException(status_code=404, detail="Shipowner not found")

    # Get verified documents
    verified_docs = [doc.type for doc in vessel.documents if doc.status == 'verified']

    # Issue the credential
    credential = credential_service.issue_vessel_ownership_credential(
        data=data,
        vessel_did=vessel.did,
        vessel_imo=vessel.imo,
        vessel_name=vessel.name,
        owner_company_name=shipowner.company_name,
        verified_documents=verified_docs
    )

    # Update vessel with credential ID
    vessel_service.set_ownership_credential(data.vessel_id, credential.id)

    return credential


@router.get("/verify/{credential_id}", response_model=CredentialVerifyResponse)
async def verify_credential(credential_id: str):
    """
    Verify if a credential is valid.
    Checks: exists, not revoked, not expired.
    """
    result = credential_service.verify_credential(credential_id)
    return CredentialVerifyResponse(**result)


@router.post("/revoke", response_model=CredentialResponse)
async def revoke_credential(data: CredentialRevokeRequest):
    """
    Revoke a credential.
    """
    credential = credential_service.revoke_credential(data.credential_id, data.reason)
    if not credential:
        raise HTTPException(status_code=404, detail="Credential not found")
    return credential


@router.get("/{credential_id}", response_model=CredentialResponse)
async def get_credential(credential_id: str):
    """Get a credential by ID."""
    credential = credential_service.get_credential(credential_id)
    if not credential:
        raise HTTPException(status_code=404, detail="Credential not found")
    return credential


@router.get("/subject/{subject_did}", response_model=List[CredentialResponse])
async def get_credentials_by_subject(subject_did: str):
    """Get all credentials for a subject (shipowner or vessel)."""
    # URL decode
    subject_did = subject_did.replace("%3A", ":")
    return credential_service.list_credentials_by_subject(subject_did)


@router.get("/type/{credential_type}", response_model=List[CredentialResponse])
async def get_credentials_by_type(credential_type: CredentialType):
    """Get all credentials of a specific type."""
    return credential_service.list_credentials_by_type(credential_type)


@router.get("/", response_model=List[CredentialResponse])
async def list_all_credentials():
    """List all credentials."""
    return credential_service.list_all_credentials()
