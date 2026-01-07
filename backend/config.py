"""
Platform configuration for Maritime Finance DID system.
The platform DID is used to issue credentials to shipowners and vessels.
"""

# Platform wallet - generated once for the Maritime Finance platform
# This wallet is controlled by the platform and used to:
# 1. Issue ShipownerVerificationCredentials
# 2. Create and manage Vessel DIDs
# 3. Issue VesselOwnershipCredentials
PLATFORM_WALLET_ADDRESS = "rMFPlatformDID1234567890abcdefghij"
PLATFORM_WALLET_SEED = "sEdPLATFORMSEEDFORDEMOONLY123"  # Demo only - not a real seed
PLATFORM_DID = f"did:xrpl:1:{PLATFORM_WALLET_ADDRESS}"

# Platform info
PLATFORM_NAME = "Maritime Finance"
PLATFORM_DESCRIPTION = "Decentralized maritime trade finance platform"

# Credential settings
CREDENTIAL_VALIDITY_DAYS = 365
SHIPOWNER_CREDENTIAL_TYPE = "ShipownerVerificationCredential"
VESSEL_OWNERSHIP_CREDENTIAL_TYPE = "VesselOwnershipCredential"

# XRPL Network
XRPL_NETWORK = "testnet"
XRPL_NETWORK_URL = "wss://s.altnet.rippletest.net:51233"

# Data storage paths
DATA_DIR = "data"
SHIPOWNERS_FILE = f"{DATA_DIR}/shipowners.json"
VESSELS_FILE = f"{DATA_DIR}/vessels.json"
CREDENTIALS_FILE = f"{DATA_DIR}/credentials.json"
