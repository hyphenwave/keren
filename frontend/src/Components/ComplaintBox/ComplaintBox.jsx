import React, { useState, useRef } from "react";
import styles from "./ComplaintBox.module.css";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import ConsentPopup from "../ConsentPopup/ConsentPopup";

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
import {
  pinFileToIPFS,
  pinJSONToIPFS,
  generateRandomString,
} from "../../pinata";

const ethersConfig = defaultConfig({ metadata });

createWeb3Modal({
  ethersConfig,
  chains: [testnet],
  projectId: process.env.REACT_APP_PROJECT_ID,
  enableAnalytics: true,
  featuredWalletIds: [
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
  ],
});

const ComplaintBox = ({ recipient }) => {
  const [complaint, setComplaint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConsentPopup, setShowConsentPopup] = useState(true);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const canvasRef = useRef(null);

  const recipientInfo = {
    Jesse: {
      address: "0x849151d7d0bf1f34b70d5cad5149d28cc2308bf1",
      backgroundImage: "/card.png",
      textColor: "black",
      description: (
        <>
          <p className={styles.description}>
            Welcome to Complain Onchain, darling! If you have a complaint or
            feedback for the Base network, please feel free to write it below and it
            will get sent directly onchain to the manager of Base (Jesse Pollak).
          </p>
          <p className={styles.description}>
            If you want something done right, you've got to do it onchain!
            <br />
            Let's make Base a better place, together.
          </p>
        </>
      ),
    },
    Brian: {
      address: "0x5b76f5B8fc9D700624F78208132f91AD4e61a1f0",
      backgroundImage: "/card_brian.png",
      textColor: "white",
      description: (
        <>
          <p className={styles.description}>
            Welcome to Complain Onchain, darling! If you have a complaint or feedback for Coinbase, please feel free to write it below and it will get sent directly onchain to the manager of Coinbase (Brian Armstrong).
          </p>
          <p className={styles.description}>
            If you want something done right, you've got to do it onchain! Let's make Coinbase a better place, together.
            <br />
            Let's make Base a better place, together.
          </p>
        </>
      ),
    },
  };

  const generateComplaintImage = async (complaint, userAddress) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load background image
    const backgroundImage = new Image();
    backgroundImage.src = recipientInfo[recipient].backgroundImage;
    await new Promise((resolve) => {
      backgroundImage.onload = resolve;
    });
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Set font properties
    const fontSize = 38;
    const fontFamily = "Arial";
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = recipientInfo[recipient].textColor;
    ctx.textAlign = "center";

    // Set padding and line height
    const padding = 180;
    const lineHeight = fontSize * 1.2;

    // Add complaint text with wrapping and center alignment
    const complaintLines = wrapText(
      ctx,
      ` ${complaint}`,
      padding,
      0,
      canvas.width - padding * 2,
      lineHeight
    );
    complaintLines.forEach((line, index) => {
      const centerX = canvas.width / 2;
      ctx.fillText(line, centerX, 880 + index * lineHeight);
    });

    // Add user address at a fixed position
    ctx.font = "26px Arial";
    ctx.fillStyle = recipientInfo[recipient].textColor;
    ctx.textAlign = "left";
    const userAddressY = 1720; // Fixed y-coordinate for the user address
    ctx.fillText(`- ${userAddress}`, padding, userAddressY);

    // Convert canvas to blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });
    return blob;
  };

  // Helper function to wrap text
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    const lines = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    return lines;
  };

  const handleConsentAccept = () => {
    setShowConsentPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) throw Error("User disconnected");

    if (complaint.length > 500) {
      Swal.fire({
        title: "Character Limit Exceeded",
        text: "Please limit your complaint to 500 characters.",
        icon: "warning",
      });
      return;
    }

    try {
      setIsLoading(true);

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const TokenContract = new Contract(TokenAddress, TokenABI, signer);

      // Get the current total supply of tokens
      const totalSupply = await TokenContract.totalSupply();
      const totalSupplyNumber = Number(totalSupply);
      const tokenId = (totalSupplyNumber + 1).toString();

      // Generate a random string for the file names
      const randomString = generateRandomString();

      // Generate the complaint image with the user's complaint and address
      const imageBlob = await generateComplaintImage(complaint, address);
      const imageFileName = `card-${randomString}.png`;
      const imageHash = await pinFileToIPFS(imageBlob, imageFileName);

      // Create the metadata object with the correct IPFS gateway URL and token ID
      const metadata = {
        name: `Complaint NFT #${tokenId}`,
        description: complaint,
        external_url: "https://www.basedkeren.com/",
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
      const mintReceipt = await mintTx.wait();

      // Log the mint transaction receipt to check for emitted events

      // Check if the transaction receipt has logs
      if (mintReceipt.logs && mintReceipt.logs.length > 0) {
        // Retrieve the token ID from the first log entry (Transfer event)
        const tokenIdHex = mintReceipt.logs[0].topics[3];

        // Convert the tokenId from hexadecimal to decimal
        const tokenIdDecimal = parseInt(tokenIdHex, 16);

        // Convert the tokenId to a string
        const tokenIdString = tokenIdDecimal.toString();

        // Transfer the NFT to the specified wallet address
        const transferTx = await TokenContract.safeTransferFrom(
          address,
          recipientInfo[recipient].address,
          tokenIdString
        );
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
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className={styles.container}>
      <img src="/keren_sit.png" alt="Keren sitting" className={styles.kerenImage} />
      
      {showConsentPopup && <ConsentPopup onAccept={handleConsentAccept} />}
      {isLoading && <LoadingOverlay />}
      <h1 className={styles.heading}>Base Complaint Box - Complain to {recipient}</h1>
      {recipientInfo[recipient].description}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="complaint" className={styles.label}>
            Complain here *
          </label>
          <textarea
            id="complaint"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value.slice(0, 500))}
            className={styles.textarea}
            required
          />
          <div className={styles.characterCounter}>
            {complaint.length}/500 characters
          </div>
        </div>
        <div className={styles.relatedToSection}>
          <p className={styles.relatedToText}>Related to:</p>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.checkmark}></span>
              Transaction Speed and Fees
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.checkmark}></span>
              Coinbase Wallet and dApp Usability
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.checkmark}></span>
              Security and Privacy
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.checkmark}></span>
              Support and Documentation
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.checkmark}></span>
              Community and Governance
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.checkmark}></span>
              Others
            </label>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width="1414"
          height="2000"
          style={{ display: "none" }}
        />
        {isConnected ? (
          <button type="submit" className={styles.button}>
            Send Complaint
          </button>
        ) : (
          <button
            type="button"
            onClick={() => open()}
            className={styles.button}
          >
            Connect Wallet
          </button>
        )}
      </form>
    </div>
  );
};

export default ComplaintBox;