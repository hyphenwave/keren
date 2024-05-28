import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlayDashboard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [nfts, setNfts] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [nftsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

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
          const url = `${baseURL}?contractAddress=${address}&withMetadata=${withMetadata}${
            nextToken ? `&startToken=${nextToken}` : ""
          }`;

          const response = await axios.get(url);
          allNfts = [...allNfts, ...response.data.nfts];
          nextToken = response.data.nextToken;
        } while (nextToken);

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
  const currentNfts = nfts.slice(indexOfFirstNft, indexOfLastNft);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatIpfsLink = (ipfsLink) => {
    if (ipfsLink && ipfsLink.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${ipfsLink.slice(7)}`;
    }
    return ipfsLink;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>NFT Dashboard</h1>
        <Link to="/" className={styles.backLink}>
          Back to Complain OnChain
        </Link>
      </div>
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Description</th>
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
              className={`${styles.pageLink} ${
                currentPage === number ? styles.activePageLink : ""
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