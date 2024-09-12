import React, { useState, useRef, useEffect } from "react";
import styles from "./ComplaintBox.module.css";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import ConsentPopup from "../ConsentPopup/ConsentPopup";
import Swal from "sweetalert2";
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
		Jesse: {
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
		Brian: {
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

		BasedMerch: {
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

		Mykcryptodev: {
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
		Boris: {
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
		TYBG: {
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
		PokPok: {
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
			Swal.fire({
				title: "Character Limit Exceeded",
				text: "Please limit your complaint to 500 characters.",
				icon: "warning",
			});
			return;
		}

		try {
			setIsLoading(true);

			const totalSupply = await readContract(config, {
				abi,
				address: TokenAddress,
				functionName: 'totalSupply',
			})
			const tokenId = (Number(totalSupply) + 1).toString();

			console.log("total supply", Number(totalSupply))

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
				attributes: checkboxOptions.map(option => ({
					trait_type: option.label,
					value: checkboxes[option.name] ? "Yes" : "No",
				})),
			};


			// Pin the metadata to IPFS
			const metadataFileName = `metadata-${randomString}.json`;
			const metadataHash = await pinJSONToIPFS(metadata, metadataFileName);

			console.log("sending tx")
			const hash = await writeContractAsync({
				address: TokenAddress,
				abi,
				functionName: "safeMint",
				args: [address, `ipfs://${metadataHash}`]
			})

			console.log("sent tx")

			const mintReceipt = await waitForTransactionReceipt(config, {
				hash: hash,
			})

			// Log the mint transaction receipt to check for emitted events

			// Check if the transaction receipt has logs
			if (mintReceipt.logs && mintReceipt.logs.length > 0) {
				// Retrieve the token ID from the first log entry (Transfer event)
				const tokenIdHex = mintReceipt.logs[0].topics[3];

				// Convert the tokenId from hexadecimal to decimal
				const tokenIdDecimal = parseInt(tokenIdHex, 16);

				// Convert the tokenId to a string
				const tokenIdString = tokenIdDecimal.toString();

				await writeContractAsync({
					address: TokenAddress,
					abi,
					functionName: "safeTransferFrom",
					args: [address, recipientInfo[recipient].address, tokenIdString]
				})

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
			console.log(error)
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
			{isTestnet && (
				<div className={styles.testnetBanner}>
					You are currently on the Testnet
				</div>
			)}
			<img
				src="/keren_sit.png"
				alt="Keren sitting"
				className={styles.kerenImage}
			/>

			{showConsentPopup && <ConsentPopup onAccept={handleConsentAccept} />}
			{isLoading && <LoadingOverlay />}
			<h1 className={styles.heading}>
				Base Complaint Box - Complain to{" "}
				<a
					href={
						recipient === "BasedMerch"
							? "https://shop.slice.so/store/508"
							: recipient === "Mykcryptodev"
								? "https://x.com/mykcryptodev"
								: getRecipientWebsite(recipient)
					}
					target="_blank"
					rel="noopener noreferrer"
				>
					{recipient === "BasedMerch"
						? "Based Merch Store"
						: recipient === "Mykcryptodev"
							? "Base Token Store"
							: recipient === "Boris"
								? "Boris The Wizard"
								: recipient === "TYBG"
									? "Based God"
									: recipient}
				</a>
			</h1>
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
						{checkboxOptions.map((option) => (
							<label key={option.name} className={styles.checkboxLabel}>
								<input
									type="checkbox"
									name={option.name}
									checked={checkboxes[option.name]}
									onChange={handleCheckboxChange}
									className={styles.checkbox}
								/>
								<span className={styles.checkmark}></span>
								{option.label}
							</label>
						))}
					</div>
				</div>
				<canvas
					ref={canvasRef}
					width="1414"
					height="2000"
					style={{ display: "none" }}
				/>
				<ConnectKitProvider>
					<ConnectKitButton.Custom>
						{({ isConnected, show }) => {
							if (isConnected) {
								return (<button type="submit" className={styles.button}>
									Send Complaint
								</button>)
							}

							return (
								<div className={styles.buttonBox}>
									<BlackCreateWalletButton width={200} height={48} />

									<button
										type="button"
										onClick={() => show()}
										className={styles.button}
									>
										Connect Wallet
									</button>
								</div>
							)
						}}
					</ConnectKitButton.Custom>
				</ConnectKitProvider>
			</form>
		</div >

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