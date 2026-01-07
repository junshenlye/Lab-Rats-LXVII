"""
Credential service for issuing and managing verifiable credentials.
"""

from datetime import datetime, timedelta
from typing import Optional, List
import uuid

from models.credential import (
    Credential, CredentialType, CredentialStatus,
    ShipownerCredentialRequest, VesselOwnershipCredentialRequest,
    CredentialResponse
)
from services.json_store import JSONStore
from config import (
    CREDENTIALS_FILE, PLATFORM_DID, CREDENTIAL_VALIDITY_DAYS,
    SHIPOWNER_CREDENTIAL_TYPE, VESSEL_OWNERSHIP_CREDENTIAL_TYPE
)


class CredentialService:
    """Service for credential operations."""

    def __init__(self):
        self.store = JSONStore(CREDENTIALS_FILE)

    def issue_shipowner_credential(self, data: ShipownerCredentialRequest) -> CredentialResponse:
        """
        Issue a ShipownerVerificationCredential.
        This credential verifies that the platform has verified the shipowner's identity.
        """
        credential_id = f"CRED-{str(uuid.uuid4())[:8].upper()}"
        now = datetime.utcnow()
        expires = now + timedelta(days=CREDENTIAL_VALIDITY_DAYS)

        credential = {
            'id': credential_id,
            'type': CredentialType.SHIPOWNER_VERIFICATION.value,
            'issuer': PLATFORM_DID,
            'subject': data.shipowner_did,
            'issued_at': now.isoformat(),
            'expires_at': expires.isoformat(),
            'status': CredentialStatus.ACTIVE.value,
            'claims': {
                'company_name': data.company_name,
                'registration_number': data.registration_number,
                'country': data.country,
                'kyc_level': 'enhanced',
                'documents_verified': data.documents_verified
            },
            'revocation_reason': None,
            'revoked_at': None
        }

        self.store.create(credential)
        return CredentialResponse(**credential)

    def issue_vessel_ownership_credential(
        self,
        data: VesselOwnershipCredentialRequest,
        vessel_did: str,
        vessel_imo: str,
        vessel_name: str,
        owner_company_name: str,
        verified_documents: List[str]
    ) -> CredentialResponse:
        """
        Issue a VesselOwnershipCredential.
        This credential attests that a shipowner owns a specific vessel.
        """
        credential_id = f"CRED-{str(uuid.uuid4())[:8].upper()}"
        now = datetime.utcnow()
        expires = now + timedelta(days=CREDENTIAL_VALIDITY_DAYS)

        credential = {
            'id': credential_id,
            'type': CredentialType.VESSEL_OWNERSHIP.value,
            'issuer': PLATFORM_DID,
            'subject': data.owner_did,
            'issued_at': now.isoformat(),
            'expires_at': expires.isoformat(),
            'status': CredentialStatus.ACTIVE.value,
            'claims': {
                'vessel_did': vessel_did,
                'vessel_imo': vessel_imo,
                'vessel_name': vessel_name,
                'owner_did': data.owner_did,
                'owner_company_name': owner_company_name,
                'ownership_type': data.ownership_type,
                'verified_documents': verified_documents
            },
            'revocation_reason': None,
            'revoked_at': None
        }

        self.store.create(credential)
        return CredentialResponse(**credential)

    def get_credential(self, credential_id: str) -> Optional[CredentialResponse]:
        """Get a credential by ID."""
        record = self.store.get_by_id(credential_id)
        if record:
            return CredentialResponse(**record)
        return None

    def verify_credential(self, credential_id: str) -> dict:
        """
        Verify if a credential is valid.
        Checks: exists, not revoked, not expired.
        """
        record = self.store.get_by_id(credential_id)

        if not record:
            return {
                'credential_id': credential_id,
                'is_valid': False,
                'status': None,
                'reason': 'Credential not found'
            }

        # Check if revoked
        if record['status'] == CredentialStatus.REVOKED.value:
            return {
                'credential_id': credential_id,
                'is_valid': False,
                'status': CredentialStatus.REVOKED.value,
                'issuer': record['issuer'],
                'subject': record['subject'],
                'type': record['type'],
                'expires_at': record['expires_at'],
                'reason': f"Credential revoked: {record.get('revocation_reason', 'No reason provided')}"
            }

        # Check if expired
        expires_at = datetime.fromisoformat(record['expires_at'].replace('Z', '+00:00'))
        if datetime.utcnow() > expires_at.replace(tzinfo=None):
            # Update status to expired
            self.store.update(credential_id, {'status': CredentialStatus.EXPIRED.value})
            return {
                'credential_id': credential_id,
                'is_valid': False,
                'status': CredentialStatus.EXPIRED.value,
                'issuer': record['issuer'],
                'subject': record['subject'],
                'type': record['type'],
                'expires_at': record['expires_at'],
                'reason': 'Credential has expired'
            }

        # Credential is valid
        return {
            'credential_id': credential_id,
            'is_valid': True,
            'status': CredentialStatus.ACTIVE.value,
            'issuer': record['issuer'],
            'subject': record['subject'],
            'type': record['type'],
            'expires_at': record['expires_at'],
            'reason': None
        }

    def revoke_credential(self, credential_id: str, reason: str) -> Optional[CredentialResponse]:
        """Revoke a credential."""
        record = self.store.get_by_id(credential_id)
        if not record:
            return None

        updated = self.store.update(credential_id, {
            'status': CredentialStatus.REVOKED.value,
            'revocation_reason': reason,
            'revoked_at': datetime.utcnow().isoformat()
        })

        if updated:
            return CredentialResponse(**updated)
        return None

    def list_credentials_by_subject(self, subject_did: str) -> List[CredentialResponse]:
        """List all credentials for a subject (shipowner or vessel)."""
        records = self.store.find_by_field('subject', subject_did)
        return [CredentialResponse(**r) for r in records]

    def list_credentials_by_type(self, credential_type: CredentialType) -> List[CredentialResponse]:
        """List all credentials of a specific type."""
        records = self.store.find_by_field('type', credential_type.value)
        return [CredentialResponse(**r) for r in records]

    def list_all_credentials(self) -> List[CredentialResponse]:
        """List all credentials."""
        records = self.store.get_all()
        return [CredentialResponse(**r) for r in records]
