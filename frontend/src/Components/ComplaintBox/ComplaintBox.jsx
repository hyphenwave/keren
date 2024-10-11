import React, { useState, useRef, useEffect } from "react";
import styles from "./ComplaintBox.module.css";
import { motion } from 'framer-motion';
// import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import ConsentPopup from "../ConsentPopup/ConsentPopup";
import { useCallback } from 'react';
import { useConnect } from 'wagmi';
import { toast, Toaster } from 'sonner';
import { Link } from 'react-router-dom';
// import Swal from "sweetalert2";
import { TokenAddress } from "../../Helper/helper";
import {
	pinFileToIPFS,
	pinJSONToIPFS,
	generateRandomString,
} from "../../pinata";
import config from "../../config";
import { ConnectKitProvider, ConnectKitButton } from "connectkit";
import { useAccount, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt, readContract } from "@wagmi/core";
import abi from "./abi.json";
import { BlackCreateWalletButton } from '../BlackCreateWalletButton/BlackCreateWalletButton';
// import { initials } from "ts-utils";
// const ethersConfig = defaultConfig({ metadata });


const isTestnet = process.env.REACT_APP_USE_TESTNET === 'true';

const ComplaintBox = ({ recipient }) => {
	const [complaint, setComplaint] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showConsentPopup, setShowConsentPopup] = useState(true);
	const [checkboxes, setCheckboxes] = useState({});
	const { address } = useAccount();
	const canvasRef = useRef(null);

	const { writeContractAsync } = useWriteContract()

	const recipientInfo = {
		jesse: {
			name: "jesse",
			title: "Manager of Base",
			initials: "JE",
			address: "0x849151d7d0bf1f34b70d5cad5149d28cc2308bf1",
			backgroundImage: "/card.png",
			textColor: "black",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or
						feedback for the Base network, please feel free to write it below
						and it will get sent directly onchain to the manager of Base (Jesse
						Pollak).
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain!
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
		brian: {
			name: "brian",
			title: "Manager of Coinbase",
			initials: "BR",
			address: "0x5b76f5B8fc9D700624F78208132f91AD4e61a1f0",
			backgroundImage: "/card_brian.png",
			textColor: "white",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or
						feedback for Coinbase, please feel free to write it below and it
						will get sent directly onchain to the manager of Coinbase (Brian
						Armstrong).
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain! Let's
						make Coinbase a better place, together.
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
		basedmerch: {
			name: "Based Merch",
			initials: "BM",
			address: "0x26A3737261178eed0E66a70967F2DBDd9798afb0",
			backgroundImage: "/card_merch.png",
			textColor: "white",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or
						feedback for Based Merch Store, please feel free to write it below
						and it will get sent directly onchain to the manager of the store!
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain!
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
		mykcryptodev: {
			name: "Base Token Store",
			initials: "BT",
			title: "Mykcryptodev",
			address: "0x5079EC85c3c8F8E932Bd011B669b77d703DEEea7",
			backgroundImage: "/card_myk.png",
			textColor: "white",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or
						feedback for{" "}
						<a
							href="https://www.basetokenstore.com/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Base Token Store
						</a>
						, please feel free to write it below and it will get sent directly
						onchain to the manager:{" "}
						<a
							href="https://x.com/mykcryptodev"
							target="_blank"
							rel="noopener noreferrer"
						>
							mykcryptodev
						</a>
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain!
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
		boris: {
			name: "Boris",
			initials: "BR",
			title: "Manager of Coinbase",
			address: "0x4381C13BC325349a5214B463Eb85DD660A9629B5",
			backgroundImage: "/card_boris.png",
			textColor: "black",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or feedback for the Boris The Wizard, please feel free to write it below and it will get sent directly onchain to the manager of Boris.
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain!
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
		tybg: {
			name: "TYBG",
			initials: "TY",
			title: "Based God",
			address: "0x2270a4ca23614eCE42905045b1fF2CB2a396c4Ff",
			backgroundImage: "/card_tybg.png",
			textColor: "black",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or feedback for Based God, please feel free to write it below and it will get sent directly onchain to the manager of TYBG ( Based Disciple ).
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain!
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
		pokpok: {
			name: "Pok Pok",
			initials: "PP",
			title: "Nibel.eth",
			address: "0xC2ca7C647c7959F14700d8fD5B6219b44Ca56930",
			backgroundImage: "/card_pok.png",
			textColor: "black",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or feedback for the PokPok Protocol, please feel free to write it below and it will get sent directly onchain to the manager of PokPok (Nibel.eth).
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain!
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
		jeetolax: {
			name: "jeetolax",
			title: "Community",
			initials: "JT",
			address: "0x3F2E8Ec867148CB0F61e7eD7eDF04f986d84a94",
			backgroundImage: "/card_jeetolax.png",
			textColor: "white",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or
						feedback for the Base network, please feel free to write it below
						and it will get sent directly onchain to the manager of Base (Jesse
						Pollak).
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain!
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
		jessechrist: {
			name: "Jesse Christ",
			title: "Community",
			initials: "JC",
			address: "0xB88E66613a1614b29443521b0A3A02E4590c7922",
			backgroundImage: "/card_jessechrist.png",
			textColor: "black",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or
						feedback for the Base network, please feel free to write it below
						and it will get sent directly onchain to the manager of Base (Jesse
						Pollak).
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain!
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
		millionbit: {
			name: "MillionBitHomepage",
			title: "Community",
			initials: "MB",
			address: "0x91a0C767E86e832D279fAa2b4B9DEDA28BBb26cE",
			backgroundImage: "/card_million.png",
			textColor: "white",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or
						feedback for the Base network, please feel free to write it below
						and it will get sent directly onchain to the manager of Base (Jesse
						Pollak).
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain!
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
		rachel: {
			name: "rachel",
			title: "Influencer",
			initials: "RC",
			address: "0x1c3e54735D30912d391EcdF34B049d3e3743EbbB",
			backgroundImage: "/card_rachel.png",
			textColor: "black",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or
						feedback for the Base network, please feel free to write it below
						and it will get sent directly onchain to the manager of Base (Jesse
						Pollak).
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain!
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
		crypticpoet: {
			name: "crypticpoet",
			title: "Influencer",
			initials: "CP",
			address: "0x9d32572997DA4948063E3Fc11c2552Eb82F7208E",
			backgroundImage: "/card_crypticpoet.png",
			textColor: "white",
			description: (
				<>
					<p className={styles.description}>
						Welcome to Complain Onchain, darling! If you have a complaint or
						feedback for the Base network, please feel free to write it below
						and it will get sent directly onchain to the manager of Base (Jesse
						Pollak).
					</p>
					<p className={styles.description}>
						If you want something done right, you've got to do it onchain!
						<br />
						Let's make Base a better place, together.
					</p>
				</>
			),
		},
	};

	const [selectedOptions, setSelectedOptions] = useState([]);

	const handleOptionToggle = (optionName) => {
		setSelectedOptions(prevSelected =>
			prevSelected.includes(optionName)
				? prevSelected.filter(name => name !== optionName)
				: [...prevSelected, optionName]
		);
	};

	const getCheckboxOptions = (recipient) => {
		const commonOptions = [
			{ name: "transactionSpeedFees", label: "Transaction Speed and Fees" },
			{ name: "coinbaseWalletUsability", label: "Coinbase Wallet and dApp Usability" },
			{ name: "securityPrivacy", label: "Security and Privacy" },
		];

		if (recipient === "BasedMerch") {
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

	const checkboxOptions = getCheckboxOptions(recipient);
	const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

	useEffect(() => {
		const checkboxOptions = getCheckboxOptions(recipient);
		const initialCheckboxes = checkboxOptions.reduce((acc, option) => {
			acc[option.name] = false;
			return acc;
		}, {});
		setCheckboxes(initialCheckboxes);
	}, [recipient]);

	const handleCheckboxChange = (event) => {
		setCheckboxes({
			...checkboxes,
			[event.target.name]: event.target.checked,
		});
	};

	const getRecipientWebsite = (recipient) => {
		switch (recipient) {
			case "Jesse":
				return "https://jesse.xyz/";
			case "Brian":
				return "https://x.com/brian_armstrong";
			default:
				return "#";
		}
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

	const handleConsentAccept = () => {
		setShowConsentPopup(false);
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

			const totalSupply = await readContract(config, {
				abi,
				address: TokenAddress,
				functionName: 'totalSupply',
			});
			const tokenId = (Number(totalSupply) + 1).toString();

			const randomString = generateRandomString();

			const imageBlob = await generateComplaintImage(complaint, address);
			const imageFileName = `card-${randomString}.png`;
			const imageHash = await pinFileToIPFS(imageBlob, imageFileName);

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
					args: [address, recipientInfo[recipient].address, tokenIdString]
				});

				toast.success("Complaint submitted and NFT transferred successfully");
				setComplaint("");
				setSelectedOptions([]);
			} else {
				toast.warning("Complaint submitted, but token ID not found. The complaint was submitted successfully, but the token ID could not be retrieved.");
			}
		} catch (error) {
			console.error("Error submitting complaint:", error);
			toast.error("An error occurred while submitting the complaint. Please try again.");
		} finally {
			setIsLoading(false);
			toast.dismiss();
		}
	};


	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			<div className="content">
				<Toaster position="top-center" />
				{showConsentPopup && <ConsentPopup onAccept={handleConsentAccept} />}
				{/* conditionally render the rest of the page */}
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
							<h2 style={{ textTransform: 'capitalize' }}>Complain to {recipientInfo[recipient].name}</h2>
						</div>
						<div className="c-complaint_intro">
							Welcome to Complain Onchain, darling! If you have a complaint or feedback for {capitalize(recipientInfo[recipient].name)}, please feel free to write it below and it will get sent directly onchain.
							<br />
							<br />
							If you want something done right, you've got to do it onchain! Let's make Base a better place, together.
						</div>
						<div className="c-complaint_container">
							<div className="c-complaint_slip" id="w-node-_6a4cba5e-ab3e-6b94-3e8e-c03fcb434850-3884ff87">
								<div className="c-slip_header">
									<div className="c-slip_avatar">
										<div className="c-avatar-v2 cc-32">
											<div className="avatar-initals cc-32">{recipientInfo[recipient].initials}</div>
											<div className="v2-avatar-ellipse-1 cc-32"></div>
											<div className="v2-avatar-ellipse-3"></div>
											<div className="v2-avatar-ellipse-2"></div>
										</div>
									</div>
									<div className="c-slip_title" style={{ textTransform: 'capitalize' }}>
										<div className="c-slip_receipient" >{recipientInfo[recipient].name}</div>
										<div>{recipientInfo[recipient].title}</div>
									</div>
								</div>
								<div className="hor-divider"></div>
								<div className="c-slip_body">
									{address ? (
										<form onSubmit={handleSubmit} className="c-slip_form">
											<div className="c-slip_related">
												<div>Related to</div>
												<div className="c-related_group">
													{checkboxOptions.map((option) => (
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
										<div className="c-slip_empty" >
											<div style={{ textTransform: 'capitalize' }}>
												Connect your wallet to <br />
												complain to {recipientInfo[recipient].name}
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

				<canvas ref={canvasRef} style={{ display: "none" }} />
			</div>
		</motion.div>
	);
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



export default ComplaintBox;

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