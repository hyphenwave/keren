import { getDefaultConfig } from "connectkit";
import { http, createConfig } from "wagmi";
import { base, sepolia } from "wagmi/chains";
import { metadata } from "./Helper/helper";
import { coinbaseWallet } from "wagmi/connectors";

const isTestnet = process.env.REACT_APP_USE_TESTNET === "true";

const config = createConfig(
  getDefaultConfig({
    chains: [isTestnet ? sepolia : base],
    connectors: [
      coinbaseWallet({
        appName: "Complain on Chain",
        preference: "smartWalletOnly",
      }),
    ],
    transports: {
      [base.id]: http(
        `https://base-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`
      ),
      [sepolia.id]: http(`https://base-sepolia.blastapi.io/${process.env.REACT_APP_BLAST_API_HASH}`),
    },

    walletConnectProjectId: process.env.REACT_APP_PROJECT_ID,

    appName: metadata.name,
    appDescription: metadata.description,
    appUrl: metadata.url,
    appIcon: metadata.icons[0],
  })
);

export default config;
