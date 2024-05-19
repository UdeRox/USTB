import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  sepolia,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  localhost,
} from "wagmi/chains";
const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "f16d6e6d3e6679591769f23a80748a0b",
  chains: [sepolia, mainnet, polygon, optimism, arbitrum, base, localhost],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default config;
