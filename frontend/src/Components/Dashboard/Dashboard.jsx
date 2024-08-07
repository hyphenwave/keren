import React, { useState, useEffect } from "react";
import axios from "axios";
import { createClient } from '@supabase/supabase-js';
import styles from "./Dashboard.module.css";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlayDashboard";
import { Link } from "react-router-dom";

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const Dashboard = () => {
  const [nfts, setNfts] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [nftsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const address = "0xf9bd1DCaFE10b66fFc4DCb7D4c003DAeb869B044";
        const withMetadata = "true";
        const apiKey = process.env.REACT_APP_ALCHEMY_API_KEY;
        const baseURL = `https://base-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTsForCollection`;

        let allNfts = [];
        let nextToken = null;

        do {
          const url = `${baseURL}?contractAddress=${address}&withMetadata=${withMetadata}${nextToken ? `&startToken=${nextToken}` : ""
            }`;

          const response = await axios.get(url);
          allNfts = [...allNfts, ...response.data.nfts];
          nextToken = response.data.nextToken;
        } while (nextToken);

        // Fetch categories from Supabase
        const { data: categoryData, error } = await supabase
          .from('nft_categories')
          .select('token_id, categories');

        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          // Create a map of token_id to categories
          const categoryMap = new Map(categoryData.map(item => [item.token_id, item.categories]));

          // Merge NFT data with categories
          allNfts = allNfts.map(nft => ({
            ...nft,
            categories: categoryMap.get(parseInt(nft.id.tokenId)) || getCategories(nft.metadata.attributes)
          }));
        }

        setNfts(allNfts);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const toggleDescription = (tokenId) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [tokenId]: !prevState[tokenId],
    }));
  };

  const indexOfLastNft = currentPage * nftsPerPage;
  const indexOfFirstNft = indexOfLastNft - nftsPerPage;
  const currentNfts = nfts
    .sort((a, b) => {
      if (sortOrder === "latest") {
        return b.id.tokenId - a.id.tokenId;
      } else {
        return a.id.tokenId - b.id.tokenId;
      }
    })
    .slice(indexOfFirstNft, indexOfLastNft);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatIpfsLink = (ipfsLink) => {
    if (ipfsLink && ipfsLink.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${ipfsLink.slice(7)}`;
    }
    return ipfsLink;
  };

  const handleSortChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "latest" ? "oldest" : "latest"));
    setCurrentPage(1);
  };

  const getCategories = (attributes) => {
    if (!attributes) return [];
    return attributes
      .filter(attr => attr.value === "Yes")
      .map(attr => attr.trait_type);
  };

  const formatCategories = (categories) => {
    if (Array.isArray(categories)) {
      return categories.join(', ');
    } else if (typeof categories === 'string') {
      // If it's a string, it might be a stringified array
      try {
        const parsedCategories = JSON.parse(categories);
        if (Array.isArray(parsedCategories)) {
          return parsedCategories.join(', ');
        }
      } catch (e) {
        // If parsing fails, it's probably already a comma-separated string
      }
    }
    return categories || 'N/A';
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>NFT Dashboard</h1>
        <div className={styles.headerActions}>
          <button className={styles.sortButton} onClick={handleSortChange}>
            Sort by: {sortOrder === "latest" ? "Latest" : "Oldest"}
          </button>
          <Link to="/" className={styles.backLink}>
            Back to Complain OnChain
          </Link>
        </div>
      </div>
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Token ID</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {currentNfts.map((nft) => (
                  <tr key={nft.id.tokenId}>
                    <td>{nft.title}</td>
                    <td>
                      {expandedDescriptions[nft.id.tokenId] ? (
                        <div>
                          {nft.metadata.description}{" "}
                          <button
                            onClick={() => toggleDescription(nft.id.tokenId)}
                          >
                            Show Less
                          </button>
                        </div>
                      ) : (
                        <div>
                          {nft.metadata.description.slice(0, 50)}...{" "}
                          <button
                            onClick={() => toggleDescription(nft.id.tokenId)}
                          >
                            Read More
                          </button>
                        </div>
                      )}
                    </td>
                    <td>{formatCategories(nft.categories)}</td>
                    <td>
                      <a
                        href={formatIpfsLink(nft.media[0].gateway)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Image
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            nftsPerPage={nftsPerPage}
            totalNfts={nfts.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
};

const Pagination = ({ nftsPerPage, totalNfts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalNfts / nftsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className={styles.pagination}>
        {pageNumbers.map((number) => (
          <li key={number} className={styles.pageItem}>
            <button
              onClick={() => paginate(number)}
              className={`${styles.pageLink} ${currentPage === number ? styles.activePageLink : ""
                }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Dashboard;