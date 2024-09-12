import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const categories = [
  "Transaction Speed and Fees",
  "Coinbase Wallet and dApp Usability",
  "Security and Privacy",
  "Support and Documentation",
  "Community and Governance",
  "Others",
];

async function fetchNFTs() {
  const address = "0xf9bd1DCaFE10b66fFc4DCb7D4c003DAeb869B044";
  const withMetadata = "true";
  const baseURL = `https://base-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTsForCollection`;

  let allNfts = [];
  let nextToken = null;

  do {
    const url = `${baseURL}?contractAddress=${address}&withMetadata=${withMetadata}${
      nextToken ? `&startToken=${nextToken}` : ""
    }`;

    const response = await axios.get(url);
    allNfts = [...allNfts, ...response.data.nfts];
    nextToken = response.data.nextToken;
  } while (nextToken && allNfts.length < 239); // Fetch up to 239 to account for potential 0-indexing

  // Sort NFTs by token ID to ensure we're processing the first 238 (or 239 if 0-indexed)
  allNfts.sort((a, b) => parseInt(a.id.tokenId) - parseInt(b.id.tokenId));

  // Slice to get the first 238 (or 239 if 0-indexed) NFTs
  return allNfts.slice(0, 239);
}

async function classifyComplaint(description) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a complaint classifier. Classify the following complaint into one or more of these categories: ${categories.join(
            ", "
          )}. Respond with only the category names, separated by commas.`,
        },
        {
          role: "user",
          content: description,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content.split(", ");
}

async function storeCategories(tokenId, categories) {
  const { error } = await supabase
    .from("nft_categories")
    .upsert({ token_id: tokenId, categories });

  if (error) console.error("Error storing categories:", error);
}

async function main() {
  const nfts = await fetchNFTs();

  for (const nft of nfts) {
    const description = nft.metadata.description;
    const tokenId = parseInt(nft.id.tokenId);

    console.log(`Processing NFT #${tokenId}`);

    // Skip NFTs that already have categories in their metadata
    if (
      nft.metadata.attributes &&
      nft.metadata.attributes.some(
        (attr) => attr.trait_type && categories.includes(attr.trait_type)
      )
    ) {
      console.log(
        `NFT #${tokenId} already has categories in metadata. Skipping.`
      );
      continue;
    }

    const classifiedCategories = await classifyComplaint(description);
    await storeCategories(tokenId, classifiedCategories);

    console.log(
      `NFT #${tokenId} classified as: ${classifiedCategories.join(", ")}`
    );
  }

  console.log("All NFTs processed");
}

main().catch(console.error);
