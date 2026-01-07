"""
Vessel service for managing vessel records and DIDs.
"""

from datetime import datetime
from typing import Optional, List
import uuid

from models.vessel import (
    Vessel, VesselCreate, VesselResponse, VesselDocument,
    VesselStatus, DocumentStatus, VesselDocumentType, DocumentUpload
)
from services.json_store import JSONStore
from config import VESSELS_FILE, PLATFORM_DID


class VesselService:
    """Service for vessel operations."""

    def __init__(self):
        self.store = JSONStore(VESSELS_FILE)

    def create_vessel(self, data: VesselCreate) -> VesselResponse:
        """Create a new vessel record."""
        # Check if vessel with same IMO already exists
        existing = self.store.get_by_field('imo', data.imo)
        if existing:
            return VesselResponse(**existing)

        vessel_id = f"VSL-{str(uuid.uuid4())[:8].upper()}"

        vessel = {
            'id': vessel_id,
            'imo': data.imo,
            'name': data.name,
            'type': data.type.value,
            'flag': data.flag,
            'gross_tonnage': data.gross_tonnage,
            'year_built': data.year_built,
            'did': None,  # Will be created by platform
            'owner_did': data.owner_did,
            'status': VesselStatus.PENDING_VERIFICATION.value,
            'documents': [],
            'ownership_credential_id': None,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': None
        }

        self.store.create(vessel)
        return VesselResponse(**vessel)

    def get_vessel(self, vessel_id: str) -> Optional[VesselResponse]:
        """Get a vessel by ID."""
        record = self.store.get_by_id(vessel_id)
        if record:
            return VesselResponse(**record)
        return None

    def get_vessel_by_imo(self, imo: str) -> Optional[VesselResponse]:
        """Get a vessel by IMO number."""
        record = self.store.get_by_field('imo', imo)
        if record:
            return VesselResponse(**record)
        return None

    def get_vessel_by_did(self, did: str) -> Optional[VesselResponse]:
        """Get a vessel by DID."""
        record = self.store.get_by_field('did', did)
        if record:
            return VesselResponse(**record)
        return None

    def list_vessels_by_owner(self, owner_did: str) -> List[VesselResponse]:
        """List all vessels owned by a specific shipowner."""
        records = self.store.find_by_field('owner_did', owner_did)
        return [VesselResponse(**r) for r in records]

    def list_all_vessels(self) -> List[VesselResponse]:
        """List all vessels."""
        records = self.store.get_all()
        return [VesselResponse(**r) for r in records]

    def create_vessel_did(self, vessel_id: str) -> Optional[dict]:
        """
        Create a DID for a vessel.
        Vessel DIDs are platform-controlled (neutral).
        Format: did:xrpl:1:rVESSEL{vessel_id}
        """
        vessel = self.store.get_by_id(vessel_id)
        if not vessel:
            return None

        if vessel.get('did'):
            # DID already exists
            return {
                'vessel_id': vessel_id,
                'vessel_did': vessel['did'],
                'managed_by': PLATFORM_DID,
                'created_at': vessel.get('created_at')
            }

        # Generate a vessel DID (platform-controlled)
        # In production, this would create an actual XRPL account
        vessel_did = f"did:xrpl:1:rVESSEL{vessel_id.replace('-', '')}"

        updated = self.store.update(vessel_id, {
            'did': vessel_did,
            'status': VesselStatus.VERIFIED.value
        })

        if updated:
            return {
                'vessel_id': vessel_id,
                'vessel_did': vessel_did,
                'managed_by': PLATFORM_DID,
                'created_at': datetime.utcnow().isoformat()
            }
        return None

    def add_document(self, vessel_id: str, doc: DocumentUpload) -> Optional[VesselDocument]:
        """Add a document to a vessel."""
        vessel = self.store.get_by_id(vessel_id)
        if not vessel:
            return None

        doc_id = f"DOC-{str(uuid.uuid4())[:8].upper()}"
        document = {
            'id': doc_id,
            'vessel_id': vessel_id,
            'type': doc.type.value,
            'file_name': doc.file_name,
            'status': DocumentStatus.UPLOADED.value,
            'ipfs_cid': None,
            'uploaded_at': datetime.utcnow().isoformat(),
            'verified_at': None
        }

        documents = vessel.get('documents', [])
        documents.append(document)

        # Update vessel status if documents submitted
        new_status = VesselStatus.DOCUMENTS_SUBMITTED.value if len(documents) >= 2 else vessel['status']

        self.store.update(vessel_id, {
            'documents': documents,
            'status': new_status
        })

        return VesselDocument(**document)

    def verify_document(self, vessel_id: str, document_id: str) -> Optional[VesselDocument]:
        """Mark a document as verified."""
        vessel = self.store.get_by_id(vessel_id)
        if not vessel:
            return None

        documents = vessel.get('documents', [])
        for i, doc in enumerate(documents):
            if doc['id'] == document_id:
                documents[i]['status'] = DocumentStatus.VERIFIED.value
                documents[i]['verified_at'] = datetime.utcnow().isoformat()
                self.store.update(vessel_id, {'documents': documents})
                return VesselDocument(**documents[i])
        return None

    def update_vessel_status(self, vessel_id: str, status: VesselStatus) -> Optional[VesselResponse]:
        """Update vessel status."""
        updated = self.store.update(vessel_id, {'status': status.value})
        if updated:
            return VesselResponse(**updated)
        return None

    def set_ownership_credential(self, vessel_id: str, credential_id: str) -> Optional[VesselResponse]:
        """Set the ownership credential ID for a vessel."""
        updated = self.store.update(vessel_id, {
            'ownership_credential_id': credential_id,
            'status': VesselStatus.ACTIVE.value
        })
        if updated:
            return VesselResponse(**updated)
        return None
