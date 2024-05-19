import {
    RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import config from '../config';
import '../process-polyfill';
import ConnectWallet from './ConnectWallet';

const queryClient = new QueryClient();
const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
            <ConnectWallet  />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App