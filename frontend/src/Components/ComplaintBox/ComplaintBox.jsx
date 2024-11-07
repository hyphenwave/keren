import React, { useState, useRef, useEffect } from "react";
import styles from "./ComplaintBox.module.css";
import { motion } from 'framer-motion';
import ConsentPopup from "../ConsentPopup/ConsentPopup";
import { useCallback } from 'react';
import { useConnect } from 'wagmi';
import { toast, Toaster } from 'sonner';
import { Link, useParams, Navigate } from 'react-router-dom';
import { TokenAddress } from "../../Helper/helper";
import { createClient } from '@supabase/supabase-js';
import { pinFileToIPFS, pinJSONToIPFS, generateRandomString } from "../../pinata";
import config from "../../config";
import { ConnectKitProvider, ConnectKitButton } from "connectkit";
import { useAccount, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt, readContract } from "@wagmi/core";
import abi from "./abi.json";
import { BlackCreateWalletButton } from '../BlackCreateWalletButton/BlackCreateWalletButton';
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const ComplaintBox = ({ recipient }) => {
  const [complaint, setComplaint] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showConsentPopup, setShowConsentPopup] = useState(true);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [checkboxes, setCheckboxes] = useState({});
  const { address } = useAccount();
  const canvasRef = useRef(null);
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    fetchRecipientInfo();
  }, [recipient]);

  const fetchRecipientInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('complaint_boxes')
        .select('*')
        .ilike('slug', recipient.toLowerCase())
        .single();

      if (error) throw error;

      if (!data) {
        console.error('Recipient not found');
        return;
      }

      setRecipientInfo(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching recipient:', error);
      setIsLoading(false);
    }
  };

  const handleOptionToggle = (optionName) => {
    setSelectedOptions(prevSelected =>
      prevSelected.includes(optionName)
        ? prevSelected.filter(name => name !== optionName)
        : [...prevSelected, optionName]
    );
  };

  const getCheckboxOptions = (name) => {
    const commonOptions = [
      { name: "transactionSpeedFees", label: "Transaction Speed and Fees" },
      { name: "coinbaseWalletUsability", label: "Coinbase Wallet and dApp Usability" },
      { name: "securityPrivacy", label: "Security and Privacy" },
    ];

    if (name?.toLowerCase() === "basedmerch") {
      return [
        ...commonOptions,
        { name: "supportPrivacy", label: "Support and Privacy" },
        { name: "shipping", label: "Shipping" },
        { name: "others", label: "Others" },
      ];
    } else {
      return [
        ...commonOptions,
        { name: "supportDocumentation", label: "Support and Documentation" },
        { name: "communityGovernance", label: "Community and Governance" },
        { name: "others", label: "Others" },
      ];
    }
  };

  useEffect(() => {
    if (recipientInfo) {
      const checkboxOptions = getCheckboxOptions(recipientInfo.name);
      const initialCheckboxes = checkboxOptions.reduce((acc, option) => {
        acc[option.name] = false;
        return acc;
      }, {});
      setCheckboxes(initialCheckboxes);
    }
  }, [recipientInfo]);

  const handleCheckboxChange = (event) => {
    setCheckboxes({
      ...checkboxes,
      [event.target.name]: event.target.checked,
    });
  };

  const generateComplaintImage = async (complaint, userAddress) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error('Canvas element not found');
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Load background image with error handling
      const backgroundImage = new Image();
      const backgroundImagePromise = new Promise((resolve, reject) => {
        backgroundImage.onload = resolve;
        backgroundImage.onerror = () => reject(new Error('Failed to load background image'));
        backgroundImage.src = recipientInfo.background_image;
      });

      try {
        await backgroundImagePromise;
      } catch (error) {
        console.error('Error loading background image:', error);
        throw new Error('Failed to load background image');
      }

      // Draw background and set styles
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      
      // Set font properties
      const fontSize = 38;
      const fontFamily = "Arial";
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = recipientInfo.text_color;
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
      ctx.fillStyle = recipientInfo.text_color;
      ctx.textAlign = "left";
      const userAddressY = 1720;
      ctx.fillText(`- ${userAddress}`, padding, userAddressY);

      return new Promise((resolve, reject) => {
        try {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create image blob'));
            }
          }, "image/png");
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      console.error('Error generating complaint image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (complaint.length > 500) {
      toast.error("Please limit your complaint to 500 characters.");
      return;
    }

    try {
      setIsLoading(true);
      toast.loading("Submitting complaint...");

      // Generate the image first with error handling
      let imageBlob;
      try {
        imageBlob = await generateComplaintImage(complaint, address);
        console.log("Image blob generated successfully");
      } catch (error) {
        console.error("Error generating image:", error);
        toast.error("Failed to generate complaint image. Please try again.");
        return;
      }

      const totalSupply = await readContract(config, {
        abi,
        address: TokenAddress,
        functionName: 'totalSupply',
      });
      const tokenId = (Number(totalSupply) + 1).toString();

      const randomString = generateRandomString();

      const imageFileName = `card-${randomString}.png`;
      const imageHash = await pinFileToIPFS(imageBlob, imageFileName);
      console.log("Image pinned to IPFS:", imageHash);

      const metadata = {
        name: `Complaint NFT #${tokenId}`,
        description: complaint,
        external_url: "https://www.basedkeren.com/",
        image: `ipfs://${imageHash}`,
        attributes: selectedOptions.map(option => ({
          trait_type: option,
          value: "Yes",
        })),
      };

      const metadataFileName = `metadata-${randomString}.json`;
      const metadataHash = await pinJSONToIPFS(metadata, metadataFileName);

      const hash = await writeContractAsync({
        address: TokenAddress,
        abi,
        functionName: "safeMint",
        args: [address, `ipfs://${metadataHash}`]
      });

      const mintReceipt = await waitForTransactionReceipt(config, {
        hash: hash,
      });

      if (mintReceipt.logs && mintReceipt.logs.length > 0) {
        const tokenIdHex = mintReceipt.logs[0].topics[3];
        const tokenIdDecimal = parseInt(tokenIdHex, 16);
        const tokenIdString = tokenIdDecimal.toString();

        await writeContractAsync({
          address: TokenAddress,
          abi,
          functionName: "safeTransferFrom",
          args: [address, recipientInfo.address, tokenIdString]
        });

        toast.success("Complaint submitted and NFT transferred successfully");
        setComplaint("");
        setSelectedOptions([]);
      } else {
        toast.warning("Complaint submitted, but token ID not found.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("An error occurred while submitting the complaint. Please try again.");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const WalletButtons = () => {
    const { connectors, connect } = useConnect();

    const handleCreateWallet = useCallback(() => {
      const coinbaseWalletConnector = connectors.find(
        (connector) => connector.id === 'coinbaseWalletSDK'
      );
      if (coinbaseWalletConnector) {
        connect({ connector: coinbaseWalletConnector });
      }
    }, [connectors, connect]);

    return (
      <div className="c-slip_btns">
        <ConnectKitProvider>
          <ConnectKitButton.Custom>
            {({ show }) => (
              <button onClick={show} className="btn">
                Connect Wallet
              </button>
            )}
          </ConnectKitButton.Custom>
          <button onClick={handleCreateWallet} className="btn cc-ghost w-button">
            Create Wallet
          </button>
        </ConnectKitProvider>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!recipientInfo) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="content">
        <Toaster position="top-center" />
        {showConsentPopup && <ConsentPopup onAccept={() => setShowConsentPopup(false)} />}
        {!showConsentPopup && (
          <>
            <div className="page-header cc-complain">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="c-back">
                  <div className="c-back_btn">
                    <img src="/images/left-chevron.svg" alt="" className="icon-20" />
                    <div>Back</div>
                  </div>
                </div>
              </Link>
              <h2 style={{ textTransform: 'capitalize' }}>
                Complain to {recipientInfo.name}
              </h2>
            </div>
            <div className="c-complaint_intro">
              {recipientInfo.description || (
                <>
                  Welcome to Complain Onchain, darling! If you have a complaint or feedback for {recipientInfo.name}, 
                  please feel free to write it below and it will get sent directly onchain.
                  <br /><br />
                  If you want something done right, you've got to do it onchain! Let's make Base a better place, together.
                </>
              )}
            </div>
            <div className="c-complaint_container">
              <div className="c-complaint_slip" id="w-node-_6a4cba5e-ab3e-6b94-3e8e-c03fcb434850-3884ff87">
                <div className="c-slip_header">
                  <div className="c-slip_avatar">
                    <div className="c-avatar-v2 cc-32">
                      <div className="avatar-initals cc-32">{recipientInfo.initials}</div>
                      <div className="v2-avatar-ellipse-1 cc-32"></div>
                      <div className="v2-avatar-ellipse-3"></div>
                      <div className="v2-avatar-ellipse-2"></div>
                    </div>
                  </div>
                  <div className="c-slip_title" style={{ textTransform: 'capitalize' }}>
                    <div className="c-slip_receipient">{recipientInfo.name}</div>
                    <div>{recipientInfo.title}</div>
                  </div>
                </div>
                <div className="hor-divider"></div>
                <div className="c-slip_body">
                  {address ? (
                    <form onSubmit={handleSubmit} className="c-slip_form">
                      <div className="c-slip_related">
                        <div>Related to</div>
                        <div className="c-related_group">
                          {getCheckboxOptions(recipientInfo.name).map((option) => (
                            <button
                              key={option.name}
                              type="button"
                              className={`c-related_pill ${selectedOptions.includes(option.name) ? 'selected' : ''}`}
                              onClick={() => handleOptionToggle(option.name)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="c-slip_message">
                        <div>Complaint</div>
                        <div className="c-input_max">{complaint.length}/500</div>
                        <textarea
                          value={complaint}
                          onChange={(e) => setComplaint(e.target.value.slice(0, 500))}
                          className="c-input"
                          placeholder="Type complaint"
                          required
                        />
                      </div>
                      <button type="submit" className="btn cc-primary cc-248" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit Complaint'}
                      </button>
                    </form>
                  ) : (
                    <div className="c-slip_empty">
                      <div style={{ textTransform: 'capitalize' }}>
                        Connect your wallet to <br />
                        complain to {recipientInfo.name}
                      </div>
                      <WalletButtons />
                    </div>
                  )}
                </div>
              </div>
              <div className="cc-complaint_box" id="w-node-e491cd5e-f8c8-14b5-3319-53c4438bd969-3884ff87">
                <img src="images/complaint-box.png" alt="Complaint Box" className="box-image" />
              </div>
            </div>
          </>
        )}
        <canvas 
          ref={canvasRef} 
          width="1414" 
          height="2000" 
          style={{ 
            display: "none", 
            position: "absolute", 
            left: "-9999px",
            visibility: "hidden",
            pointerEvents: "none"
          }} 
        />
      </div>
    </motion.div>
  );
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
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
}

export default ComplaintBox;