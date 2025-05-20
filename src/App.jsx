import React from "react"
import { WagmiProvider } from "wagmi"
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from "./utils/wagmiConfig"
import WalletConnect from "./components/WalletConnect"
import Home from "./homepage/Home";
import { GlobalContext } from "./utils/GlobalContext";

function App() {

  // client for TanStack Query
const queryClient = new QueryClient();

  
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
      <GlobalContext>
        <RainbowKitProvider>
          <Home />
          </RainbowKitProvider>
          </GlobalContext>
      </QueryClientProvider>
      </WagmiProvider>

  )
}

export default App