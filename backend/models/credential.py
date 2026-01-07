"""
Credential data models.
"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class CredentialType(str, Enum):
    SHIPOWNER_VERIFICATION = "ShipownerVerificationCredential"
    VESSEL_OWNERSHIP = "VesselOwnershipCredential"


class CredentialStatus(str, Enum):
    ACTIVE = "active"
    REVOKED = "revoked"
    EXPIRED = "expired"


class Credential(BaseModel):
    """Base credential record."""
    id: str
    type: CredentialType
    issuer: str  # Platform DID
    subject: str  # Subject DID (shipowner or vessel)
    issued_at: datetime
    expires_at: datetime
    status: CredentialStatus = CredentialStatus.ACTIVE
    claims: Dict[str, Any]
    revocation_reason: Optional[str] = None
    revoked_at: Optional[datetime] = None


class ShipownerCredentialClaims(BaseModel):
    """Claims for ShipownerVerificationCredential."""
    company_name: str
    registration_number: str
    country: str
    kyc_level: str = "enhanced"
    documents_verified: List[str]


class VesselOwnershipClaims(BaseModel):
    """Claims for VesselOwnershipCredential."""
    vessel_did: str
    vessel_imo: str
    vessel_name: str
    owner_did: str
    owner_company_name: str
    ownership_type: str = "registered_owner"
    verified_documents: List[str]


class ShipownerCredentialRequest(BaseModel):
    """Request model for issuing shipowner verification credential."""
    shipowner_did: str
    company_name: str
    registration_number: str
    country: str
    documents_verified: List[str] = ["certificate_of_incorporation", "registry_extract"]


class VesselOwnershipCredentialRequest(BaseModel):
    """Request model for issuing vessel ownership credential."""
    vessel_id: str
    owner_did: str
    ownership_type: str = "registered_owner"


class CredentialResponse(BaseModel):
    """Response model for credential."""
    id: str
    type: CredentialType
    issuer: str
    subject: str
    issued_at: datetime
    expires_at: datetime
    status: CredentialStatus
    claims: Dict[str, Any]


class CredentialVerifyRequest(BaseModel):
    """Request model for verifying a credential."""
    credential_id: str


class CredentialVerifyResponse(BaseModel):
    """Response model for credential verification."""
    credential_id: str
    is_valid: bool
    status: CredentialStatus
    issuer: str
    subject: str
    type: CredentialType
    expires_at: datetime
    reason: Optional[str] = None  # If invalid, reason why


class CredentialRevokeRequest(BaseModel):
    """Request model for revoking a credential."""
    credential_id: str
    reason: str
