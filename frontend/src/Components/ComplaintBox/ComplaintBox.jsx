import React, { useState } from "react";
import styles from "./ComplaintBox.module.css";
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";
import Swal from "sweetalert2";
import { metadata, testnet, TokenAddress, TokenABI } from "../../Helper/helper";
import { pinFileToIPFS, pinJSONToIPFS, generateRandomString } from "../../pinata";

const ethersConfig = defaultConfig({ metadata });

createWeb3Modal({
  ethersConfig,
  chains: [testnet],
  projectId: process.env.REACT_APP_PROJECT_ID,
  enableAnalytics: true,
});

const ComplaintBox = () => {
  const [complaint, setComplaint] = useState("");
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) throw Error("User disconnected");

    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const TokenContract = new Contract(TokenAddress, TokenABI, signer);

      // Generate a random string for the file names
      const randomString = generateRandomString();

      // Pin the image to IPFS
      const imageFile = await fetch("/card.png").then((res) => res.blob());
      const imageFileName = `card-${randomString}.png`;
      const imageHash = await pinFileToIPFS(imageFile, imageFileName);

      // Create the metadata object with the correct IPFS gateway URL
      const metadata = {
        name: "Complaint NFT",
        description: complaint,
        external_url: "https://pinata.cloud",
        image: `ipfs://${imageHash}`,
      };

      // Pin the metadata to IPFS
      const metadataFileName = `metadata-${randomString}.json`;
      const metadataHash = await pinJSONToIPFS(metadata, metadataFileName);

      // Mint the NFT with the metadata URI using the correct IPFS gateway URL
      const mintTx = await TokenContract.safeMint(
        address,
        `ipfs://${metadataHash}`
      );
      console.log("Mint transaction:", mintTx);
      const mintReceipt = await mintTx.wait();

      // Log the mint transaction receipt to check for emitted events
      console.log("Mint transaction receipt:", mintReceipt);

      // Check if the transaction receipt has logs
      if (mintReceipt.logs && mintReceipt.logs.length > 0) {
        // Retrieve the token ID from the first log entry (Transfer event)
        const tokenId = mintReceipt.logs[0].topics[3];
        console.log("Token ID (hex):", tokenId);

        // Convert the tokenId from hexadecimal to decimal
        const tokenIdDecimal = parseInt(tokenId, 16);
        console.log("Token ID (decimal):", tokenIdDecimal);

        // Convert the tokenId to a string
        const tokenIdString = tokenIdDecimal.toString();
        console.log("Token ID (string):", tokenIdString);

        // Transfer the NFT to the specified wallet address
        const transferTx = await TokenContract.safeTransferFrom(
          address,
          "0x36567E2d9354a310Dc64FF2E6B48eC0D77558e97",
          tokenIdString
        );
        console.log("Transfer transaction:", transferTx);
        await transferTx.wait();

        Swal.fire({
          title: "Complaint submitted and NFT transferred successfully:",
          icon: "success",
        });
        setComplaint("");
      } else {
        console.warn("No logs found in the mint transaction receipt");
        Swal.fire({
          title: "Complaint submitted, but token ID not found:",
          text: "The complaint was submitted successfully, but the token ID could not be retrieved.",
          icon: "warning",
        });
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Swal.fire({
        title: "Error submitting complaint:",
        text: "An error occurred while submitting the complaint. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Keren's Complaint Box</h1>
      <p className={styles.description}>
        Have a complaint to make? Darling, if you want something done right,
        you've got to do it yourself!
      </p>
      <p className={styles.description}>
        Welcome to Keren's Complaint Box. Rest assured, I will personally
        hand-deliver your complaints to the meneger every week.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="complaint" className={styles.label}>
            Complain here *
          </label>
          <textarea
            id="complaint"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            className={styles.textarea}
            required
          />
        </div>
        {isConnected ? (
          <button type="submit" className={styles.button}>
            Send Complaint
          </button>
        ) : (
          <button type="button" onClick={() => open()} className={styles.button}>
            Connect Wallet
          </button>
        )}
      </form>
    </div>
  );
};

export default ComplaintBox;