"""
DID (Decentralized Identifier) data models.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DIDDocument(BaseModel):
    """DID Document structure."""
    id: str  # did:xrpl:1:{address}
    controller: str
    wallet_address: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class ShipownerDID(BaseModel):
    """Shipowner DID record."""
    did: str
    wallet_address: str
    company_name: str
    registration_number: str
    country: str
    is_verified: bool = False
    verification_credential_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class ShipownerCreate(BaseModel):
    """Request model for creating a shipowner DID record."""
    wallet_address: str
    company_name: str
    registration_number: str
    country: str


class ShipownerResponse(BaseModel):
    """Response model for shipowner."""
    did: str
    wallet_address: str
    company_name: str
    registration_number: str
    country: str
    is_verified: bool
    verification_credential_id: Optional[str]
    created_at: datetime


class DIDVerifyRequest(BaseModel):
    """Request model for DID verification."""
    did: str


class DIDVerifyResponse(BaseModel):
    """Response model for DID verification."""
    did: str
    exists: bool
    wallet_address: Optional[str] = None
    type: Optional[str] = None  # 'shipowner' | 'vessel' | 'platform'


class PlatformDIDResponse(BaseModel):
    """Response model for platform DID info."""
    did: str
    name: str
    description: str
    wallet_address: str
