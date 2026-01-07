"""
Vessel data models.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class VesselType(str, Enum):
    BULK_CARRIER = "bulk_carrier"
    CONTAINER_SHIP = "container_ship"
    TANKER = "tanker"
    LNG_CARRIER = "lng_carrier"
    GENERAL_CARGO = "general_cargo"
    RO_RO = "ro_ro"


class VesselStatus(str, Enum):
    PENDING_VERIFICATION = "pending_verification"
    DOCUMENTS_SUBMITTED = "documents_submitted"
    VERIFIED = "verified"
    ACTIVE = "active"
    SUSPENDED = "suspended"


class DocumentStatus(str, Enum):
    UPLOADED = "uploaded"
    VERIFYING = "verifying"
    VERIFIED = "verified"
    REJECTED = "rejected"


class VesselDocumentType(str, Enum):
    CERTIFICATE_OF_REGISTRY = "certificate_of_registry"
    IMO_CERTIFICATE = "imo_certificate"
    HULL_INSURANCE = "hull_insurance"
    P_AND_I_INSURANCE = "p_and_i_insurance"
    CLASS_CERTIFICATE = "class_certificate"
    SAFETY_CERTIFICATE = "safety_certificate"


class VesselDocument(BaseModel):
    """Vessel document record."""
    id: str
    vessel_id: str
    type: VesselDocumentType
    file_name: str
    status: DocumentStatus = DocumentStatus.UPLOADED
    ipfs_cid: Optional[str] = None
    uploaded_at: datetime
    verified_at: Optional[datetime] = None


class Vessel(BaseModel):
    """Vessel record."""
    id: str
    imo: str
    name: str
    type: VesselType
    flag: str
    gross_tonnage: int
    year_built: int
    did: Optional[str] = None  # Platform-controlled Vessel DID
    owner_did: str  # Shipowner's DID
    status: VesselStatus = VesselStatus.PENDING_VERIFICATION
    documents: List[VesselDocument] = []
    ownership_credential_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class VesselCreate(BaseModel):
    """Request model for creating a vessel."""
    imo: str
    name: str
    type: VesselType
    flag: str
    gross_tonnage: int
    year_built: int
    owner_did: str


class VesselResponse(BaseModel):
    """Response model for vessel."""
    id: str
    imo: str
    name: str
    type: VesselType
    flag: str
    gross_tonnage: int
    year_built: int
    did: Optional[str]
    owner_did: str
    status: VesselStatus
    documents: List[VesselDocument]
    ownership_credential_id: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]


class VesselDIDCreate(BaseModel):
    """Request model for creating a vessel DID."""
    vessel_id: str


class VesselDIDResponse(BaseModel):
    """Response model for vessel DID creation."""
    vessel_id: str
    vessel_did: str
    managed_by: str  # Platform DID
    created_at: datetime


class DocumentUpload(BaseModel):
    """Request model for document upload."""
    type: VesselDocumentType
    file_name: str
