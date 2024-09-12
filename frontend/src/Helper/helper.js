export const TokenAddress = process.env.REACT_APP_USE_TESTNET === 'true'
  ? "0xcA4eea66c3595fAA923e9ec21b738b38c5c62Ea4"  // Testnet address
  : "0xf9bd1DCaFE10b66fFc4DCb7D4c003DAeb869B044"; // Mainnet address (replace with actual address)

export const metadata = {
  name: "Complain on Chain",
  description: "Submit your complaints on-chain",
  url: "https://complainonchain.com",
  icons: ["https://complainonchain.com/icon.png"],
};