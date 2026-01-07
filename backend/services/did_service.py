"""
DID (Decentralized Identifier) service for managing shipowner DIDs.
"""

from datetime import datetime
from typing import Optional
import uuid

from models.did import ShipownerDID, ShipownerCreate, ShipownerResponse
from services.json_store import JSONStore
from config import SHIPOWNERS_FILE, PLATFORM_DID


class DIDService:
    """Service for DID operations."""

    def __init__(self):
        self.store = JSONStore(SHIPOWNERS_FILE)

    def create_shipowner_did(self, data: ShipownerCreate) -> ShipownerResponse:
        """
        Create a shipowner DID record.
        The DID is derived from the wallet address: did:xrpl:1:{wallet_address}
        """
        did = f"did:xrpl:1:{data.wallet_address}"

        # Check if shipowner already exists
        existing = self.store.get_by_field('did', did)
        if existing:
            return ShipownerResponse(**existing)

        shipowner = {
            'id': str(uuid.uuid4()),
            'did': did,
            'wallet_address': data.wallet_address,
            'company_name': data.company_name,
            'registration_number': data.registration_number,
            'country': data.country,
            'is_verified': False,
            'verification_credential_id': None,
            'created_at': datetime.utcnow().isoformat()
        }

        self.store.create(shipowner)
        return ShipownerResponse(**shipowner)

    def get_shipowner_by_did(self, did: str) -> Optional[ShipownerResponse]:
        """Get a shipowner by DID."""
        record = self.store.get_by_field('did', did)
        if record:
            return ShipownerResponse(**record)
        return None

    def get_shipowner_by_wallet(self, wallet_address: str) -> Optional[ShipownerResponse]:
        """Get a shipowner by wallet address."""
        record = self.store.get_by_field('wallet_address', wallet_address)
        if record:
            return ShipownerResponse(**record)
        return None

    def verify_did(self, did: str) -> dict:
        """
        Verify if a DID exists and return its type.
        """
        # Check if it's the platform DID
        if did == PLATFORM_DID:
            return {
                'did': did,
                'exists': True,
                'type': 'platform',
                'wallet_address': did.split(':')[-1]
            }

        # Check if it's a shipowner DID
        shipowner = self.store.get_by_field('did', did)
        if shipowner:
            return {
                'did': did,
                'exists': True,
                'type': 'shipowner',
                'wallet_address': shipowner['wallet_address']
            }

        # Check if it's a vessel DID (vessel DIDs are managed by VesselService)
        # For now, return not found - VesselService will handle vessel DIDs
        return {
            'did': did,
            'exists': False,
            'type': None,
            'wallet_address': None
        }

    def update_verification_status(self, did: str, credential_id: str) -> Optional[ShipownerResponse]:
        """Update shipowner verification status after credential issuance."""
        shipowner = self.store.get_by_field('did', did)
        if shipowner:
            updated = self.store.update(shipowner['id'], {
                'is_verified': True,
                'verification_credential_id': credential_id
            })
            if updated:
                return ShipownerResponse(**updated)
        return None

    def list_all_shipowners(self) -> list:
        """List all registered shipowners."""
        records = self.store.get_all()
        return [ShipownerResponse(**r) for r in records]
