import { getDefaultConfig } from "connectkit";
import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { metadata } from "./Helper/helper";
import { coinbaseWallet } from "wagmi/connectors";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [base],
    connectors: [
      coinbaseWallet({
        appName: 'Complain on Chain',
        preference: 'smartWalletOnly',
      }),
    ],
    transports: {
      // RPC URL for each chain
      [base.id]: http(
        `https://base-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`
      ),
    },

    // Required API Keys
    walletConnectProjectId: process.env.REACT_APP_PROJECT_ID,

    // Required App Info
    appName: metadata.name,

    // Optional App Info
    appDescription: metadata.description,
    appUrl: metadata.url, // your app's url
    appIcon: metadata.icons[0], // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

export default config;