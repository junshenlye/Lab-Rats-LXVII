"""
DID Router - Endpoints for DID verification and management.
"""

from fastapi import APIRouter, HTTPException

from models.did import (
    ShipownerCreate, ShipownerResponse, DIDVerifyRequest,
    DIDVerifyResponse, PlatformDIDResponse
)
from services.did_service import DIDService
from config import PLATFORM_DID, PLATFORM_WALLET_ADDRESS, PLATFORM_NAME, PLATFORM_DESCRIPTION

router = APIRouter()
did_service = DIDService()


@router.get("/platform", response_model=PlatformDIDResponse)
async def get_platform_did():
    """Get the platform DID information."""
    return PlatformDIDResponse(
        did=PLATFORM_DID,
        name=PLATFORM_NAME,
        description=PLATFORM_DESCRIPTION,
        wallet_address=PLATFORM_WALLET_ADDRESS
    )


@router.post("/verify", response_model=DIDVerifyResponse)
async def verify_did(request: DIDVerifyRequest):
    """Verify if a DID exists and get its type."""
    result = did_service.verify_did(request.did)
    return DIDVerifyResponse(**result)


@router.post("/shipowner", response_model=ShipownerResponse)
async def create_shipowner(data: ShipownerCreate):
    """
    Create or get a shipowner DID record.
    The DID is derived from the wallet address.
    """
    return did_service.create_shipowner_did(data)


@router.get("/shipowner/{did}", response_model=ShipownerResponse)
async def get_shipowner(did: str):
    """Get a shipowner by DID."""
    # URL encode issue: replace %3A with :
    did = did.replace("%3A", ":")

    shipowner = did_service.get_shipowner_by_did(did)
    if not shipowner:
        raise HTTPException(status_code=404, detail="Shipowner not found")
    return shipowner


@router.get("/shipowner/wallet/{wallet_address}", response_model=ShipownerResponse)
async def get_shipowner_by_wallet(wallet_address: str):
    """Get a shipowner by wallet address."""
    shipowner = did_service.get_shipowner_by_wallet(wallet_address)
    if not shipowner:
        raise HTTPException(status_code=404, detail="Shipowner not found")
    return shipowner


@router.get("/shipowners", response_model=list[ShipownerResponse])
async def list_shipowners():
    """List all registered shipowners."""
    return did_service.list_all_shipowners()
