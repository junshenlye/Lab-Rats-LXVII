"""
JSON file storage utilities for data persistence.
"""

import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime


class JSONStore:
    """Simple JSON file-based storage."""

    def __init__(self, file_path: str):
        self.file_path = file_path
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        """Create the file with empty list if it doesn't exist."""
        if not os.path.exists(self.file_path):
            os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
            self._write([])

    def _read(self) -> List[Dict[str, Any]]:
        """Read all records from the JSON file."""
        try:
            with open(self.file_path, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []

    def _write(self, data: List[Dict[str, Any]]):
        """Write all records to the JSON file."""
        with open(self.file_path, 'w') as f:
            json.dump(data, f, indent=2, default=str)

    def get_all(self) -> List[Dict[str, Any]]:
        """Get all records."""
        return self._read()

    def get_by_id(self, record_id: str) -> Optional[Dict[str, Any]]:
        """Get a record by ID."""
        records = self._read()
        for record in records:
            if record.get('id') == record_id:
                return record
        return None

    def get_by_field(self, field: str, value: Any) -> Optional[Dict[str, Any]]:
        """Get a record by a specific field value."""
        records = self._read()
        for record in records:
            if record.get(field) == value:
                return record
        return None

    def find_by_field(self, field: str, value: Any) -> List[Dict[str, Any]]:
        """Find all records matching a specific field value."""
        records = self._read()
        return [r for r in records if r.get(field) == value]

    def create(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new record."""
        records = self._read()
        records.append(record)
        self._write(records)
        return record

    def update(self, record_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a record by ID."""
        records = self._read()
        for i, record in enumerate(records):
            if record.get('id') == record_id:
                records[i] = {**record, **updates, 'updated_at': datetime.utcnow().isoformat()}
                self._write(records)
                return records[i]
        return None

    def delete(self, record_id: str) -> bool:
        """Delete a record by ID."""
        records = self._read()
        original_length = len(records)
        records = [r for r in records if r.get('id') != record_id]
        if len(records) < original_length:
            self._write(records)
            return True
        return False
