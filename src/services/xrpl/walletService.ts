import { Wallet, Client } from 'xrpl';

export interface WalletInfo {
  address: string;
  publicKey: string;
  privateKey: string;
  seed: string;
}

export interface FundedWalletInfo extends WalletInfo {
  balance: number;
}

const XRPL_NETWORKS = {
  mainnet: 'wss://xrplcluster.com',
  testnet: 'wss://s.altnet.rippletest.net:51233',
  devnet: 'wss://s.devnet.rippletest.net:51233',
} as const;

export type NetworkType = keyof typeof XRPL_NETWORKS;

/**
 * XRPL Wallet Service
 * Provides wallet generation and management for the XRP Ledger
 */
export const walletService = {
  /**
   * Generate a new random XRPL wallet (offline)
   * This creates a wallet that is not yet funded on the ledger
   */
  generateWallet(): WalletInfo {
    const wallet = Wallet.generate();
    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      seed: wallet.seed!,
    };
  },

  /**
   * Generate a wallet from an existing seed
   */
  fromSeed(seed: string): WalletInfo {
    const wallet = Wallet.fromSeed(seed);
    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      seed: wallet.seed!,
    };
  },

  /**
   * Generate a wallet from a mnemonic phrase
   */
  fromMnemonic(mnemonic: string): WalletInfo {
    const wallet = Wallet.fromMnemonic(mnemonic);
    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      seed: wallet.seed!,
    };
  },

  /**
   * Validate an XRPL address format
   */
  isValidAddress(address: string): boolean {
    // XRPL addresses start with 'r' and are 25-35 characters
    const xrplAddressRegex = /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/;
    return xrplAddressRegex.test(address);
  },

  /**
   * Format wallet address for display (truncated)
   */
  formatAddress(address: string, chars: number = 6): string {
    if (!address || address.length < chars * 2) return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  },

  /**
   * Generate and fund a wallet on testnet/devnet (for development only)
   * This connects to the network and requests test XRP from the faucet
   */
  async generateFundedWallet(
    network: 'testnet' | 'devnet' = 'testnet'
  ): Promise<FundedWalletInfo> {
    const client = new Client(XRPL_NETWORKS[network]);

    try {
      await client.connect();
      const { wallet, balance } = await client.fundWallet();

      return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        seed: wallet.seed!,
        balance: Number(balance),
      };
    } finally {
      await client.disconnect();
    }
  },

  /**
   * Get the balance of an existing wallet
   */
  async getBalance(
    address: string,
    network: NetworkType = 'devnet'
  ): Promise<number> {
    const client = new Client(XRPL_NETWORKS[network]);

    try {
      await client.connect();
      const response = await client.request({
        command: 'account_info',
        account: address,
        ledger_index: 'validated',
      });

      // Balance is in drops (1 XRP = 1,000,000 drops)
      return Number(response.result.account_data.Balance) / 1_000_000;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const xrplError = error as { data?: { error?: string } };
        if (xrplError.data?.error === 'actNotFound') {
          return 0; // Account not found means no balance
        }
      }
      throw error;
    } finally {
      await client.disconnect();
    }
  },

  /**
   * Check if an account exists on the ledger
   */
  async accountExists(
    address: string,
    network: NetworkType = 'mainnet'
  ): Promise<boolean> {
    const client = new Client(XRPL_NETWORKS[network]);

    try {
      await client.connect();
      await client.request({
        command: 'account_info',
        account: address,
        ledger_index: 'validated',
      });
      return true;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const xrplError = error as { data?: { error?: string } };
        if (xrplError.data?.error === 'actNotFound') {
          return false;
        }
      }
      throw error;
    } finally {
      await client.disconnect();
    }
  },

  /**
   * Get network URLs for reference
   */
  getNetworkUrl(network: NetworkType): string {
    return XRPL_NETWORKS[network];
  },
};

export default walletService;
