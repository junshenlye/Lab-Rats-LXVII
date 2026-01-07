"""
Vessels Router - Endpoints for vessel management.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from models.vessel import (
    VesselCreate, VesselResponse, VesselDIDCreate, VesselDIDResponse,
    DocumentUpload, VesselDocument, VesselStatus
)
from services.vessel_service import VesselService

router = APIRouter()
vessel_service = VesselService()


@router.get("/", response_model=List[VesselResponse])
async def list_vessels(owner_did: Optional[str] = Query(None, description="Filter by owner DID")):
    """
    List all vessels, optionally filtered by owner DID.
    """
    if owner_did:
        return vessel_service.list_vessels_by_owner(owner_did)
    return vessel_service.list_all_vessels()


@router.post("/", response_model=VesselResponse)
async def create_vessel(data: VesselCreate):
    """
    Register a new vessel.
    """
    return vessel_service.create_vessel(data)


@router.get("/{vessel_id}", response_model=VesselResponse)
async def get_vessel(vessel_id: str):
    """Get a vessel by ID."""
    vessel = vessel_service.get_vessel(vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return vessel


@router.get("/imo/{imo}", response_model=VesselResponse)
async def get_vessel_by_imo(imo: str):
    """Get a vessel by IMO number."""
    vessel = vessel_service.get_vessel_by_imo(imo)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return vessel


@router.post("/{vessel_id}/did", response_model=VesselDIDResponse)
async def create_vessel_did(vessel_id: str):
    """
    Create a DID for a vessel.
    Vessel DIDs are platform-controlled (neutral).
    """
    result = vessel_service.create_vessel_did(vessel_id)
    if not result:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return VesselDIDResponse(**result)


@router.post("/{vessel_id}/documents", response_model=VesselDocument)
async def upload_document(vessel_id: str, document: DocumentUpload):
    """
    Add a document to a vessel.
    In production, this would also handle actual file upload.
    """
    doc = vessel_service.add_document(vessel_id, document)
    if not doc:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return doc


@router.post("/{vessel_id}/documents/{document_id}/verify", response_model=VesselDocument)
async def verify_document(vessel_id: str, document_id: str):
    """Mark a document as verified."""
    doc = vessel_service.verify_document(vessel_id, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.put("/{vessel_id}/status", response_model=VesselResponse)
async def update_vessel_status(vessel_id: str, status: VesselStatus):
    """Update a vessel's status."""
    vessel = vessel_service.update_vessel_status(vessel_id, status)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return vessel


@router.get("/{vessel_id}/credentials")
async def get_vessel_credentials(vessel_id: str):
    """Get all credentials associated with a vessel."""
    vessel = vessel_service.get_vessel(vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    # Import here to avoid circular imports
    from services.credential_service import CredentialService
    credential_service = CredentialService()

    credentials = []

    # Get ownership credential if exists
    if vessel.ownership_credential_id:
        cred = credential_service.get_credential(vessel.ownership_credential_id)
        if cred:
            credentials.append(cred)

    # Also get any credentials where vessel DID is the subject
    if vessel.did:
        vessel_creds = credential_service.list_credentials_by_subject(vessel.did)
        credentials.extend(vessel_creds)

    return credentials
