// app/providers.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { mainnet, arbitrum } from 'viem/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Setup queryClient
const queryClient = new QueryClient();

// Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Create a metadata object
const metadata = {
  name: 'Soodio',
  description: 'NFT Gate App',
  url: 'https://www.soodio.io/', // Update this
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Define the Ethereum mainnet network as the primary network
const primaryNetwork = {
  type: 'evm',
  id: mainnet.id,
  name: 'Ethereum',
  network: 'mainnet',
  nativeCurrency: mainnet.nativeCurrency,
  rpcUrls: mainnet.rpcUrls,
  blockExplorers: mainnet.blockExplorers,
  contracts: mainnet.contracts
} as const;

// Additional networks
const additionalNetworks = [
  {
    id: arbitrum.id,
    name: 'Arbitrum',
    network: 'arbitrum',
    nativeCurrency: arbitrum.nativeCurrency,
    rpcUrls: arbitrum.rpcUrls,
    blockExplorers: arbitrum.blockExplorers,
    contracts: arbitrum.contracts
  }
] as const;

// Create Wagmi Adapter with all networks
const wagmiAdapter = new WagmiAdapter({
  networks: [primaryNetwork, ...additionalNetworks],
  projectId,
  ssr: true,
});

// Create and export the appKit instance
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [primaryNetwork, ...additionalNetworks] as [typeof primaryNetwork, ...typeof additionalNetworks],
  projectId,
  metadata,
  features: {
    analytics: false,
    email: false, // default to true
    socials: [],
    emailShowWallets: true, // default to true
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration issues
  if (!mounted) return null;

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}