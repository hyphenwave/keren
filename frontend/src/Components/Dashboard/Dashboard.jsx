import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const Dashboard = () => {
  const [nfts, setNfts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nftsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("latest");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);

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

        const { data: categoryData, error } = await supabase
          .from("nft_categories")
          .select("token_id, categories");

        if (error) {
          console.error("Error fetching categories:", error);
        } else {
          const categoryMap = new Map(
            categoryData.map((item) => [item.token_id, item.categories])
          );
          allNfts = allNfts.map((nft) => ({
            ...nft,
            categories:
              categoryMap.get(parseInt(nft.id.tokenId)) ||
              getCategories(nft.metadata.attributes),
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

  const indexOfLastNft = currentPage * nftsPerPage;
  const indexOfFirstNft = indexOfLastNft - nftsPerPage;
  const currentNfts = nfts
    .sort((a, b) =>
      sortOrder === "latest"
        ? b.id.tokenId - a.id.tokenId
        : a.id.tokenId - b.id.tokenId
    )
    .slice(indexOfFirstNft, indexOfLastNft);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSortChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "latest" ? "oldest" : "latest"));
    setCurrentPage(1);
  };

  const getCategories = (attributes) => {
    if (!attributes) return [];
    return attributes
      .filter((attr) => attr.value === "Yes")
      .map((attr) => attr.trait_type);
  };

  const formatCategories = (categories) => {
    if (Array.isArray(categories)) {
      return categories.join(", ");
    } else if (typeof categories === "string") {
      try {
        const parsedCategories = JSON.parse(categories);
        return Array.isArray(parsedCategories)
          ? parsedCategories.join(", ")
          : parsedCategories;
      } catch (e) {
        return categories || "N/A";
      }
    }
    return categories || "N/A";
  };

  const openModal = (nft) => {
    setSelectedNft(nft);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedNft(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="content">
        <div className="page-header dashboard">
          <div className="c-sort">
            <div className="text-sub">Sort by </div>
            <div className="c-sort_by" onClick={handleSortChange}>
              <div>{sortOrder === "latest" ? "Latest" : "Oldest"}</div>
              <img src="images/down-chevron.svg" alt="" className="icon-20" />
            </div>
          </div>
          <h2>Dashboard</h2>
          <Pagination
            nftsPerPage={nftsPerPage}
            totalNfts={nfts.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
        {isLoading ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : (
          <div className="c-nft_grid">
            {currentNfts.map((nft) => (
              <div key={nft.id.tokenId} className="c-complaint_card">
                <div className="c-complaint_img">
                  <img
                    src={nft.media[0].gateway}
                    alt={nft.title}
                    className="c-image cc-cover"
                  />
                </div>
                <div className="c-complaint_details">
                  <div className="c-complaint_category">
                    {formatCategories(nft.categories)}
                  </div>
                  <div className="c-complaint_title">{nft.title}</div>
                  <div className="c-complaint_body">
                    {nft.metadata.description}
                  </div>
                  <button
                    onClick={() => openModal(nft)}
                    className="btn w-button"
                  >
                    View Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalIsOpen && (
        <motion.div
          className="modal-overlay"
          onClick={closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {selectedNft && (
              <div className="nft-details">
                <div className="c-nft_img">
                  <img
                    src={selectedNft.media[0].gateway}
                    loading="lazy"
                    alt=""
                    className="c-image cc-cover"
                  />
                </div>
                <div className="c-nft_details">
                  <div className="c-detail_group">
                    <div className="c-detail_title">Token ID</div>
                    <div>{selectedNft.title}</div>
                  </div>
                  <div className="c-detail_group">
                    <div className="c-detail_title">Categories</div>
                    <div>{formatCategories(selectedNft.categories)}</div>
                  </div>
                  <div className="c-detail_group">
                    <div className="c-detail_title">Description</div>
                    <div>{selectedNft.metadata.description}</div>
                  </div>
                </div>
                <button onClick={closeModal} className="btn cc-ghost w-button">
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

const Pagination = ({ nftsPerPage, totalNfts, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalNfts / nftsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="c-pagination">
      <div className="c-active_page">
        <div>{currentPage}</div>
      </div>
      <div className="w-layout-hflex c-total_pages">
        <div className="text-sub">of</div>
        <div>{pageNumbers.length}</div>
      </div>
      <div
        className="c-pagination_btn"
        onClick={() => paginate(Math.max(1, currentPage - 1))}
      >
        <img src="images/left-chevron.svg" alt="" className="icon-20" />
      </div>
      <div
        className="c-pagination_btn"
        onClick={() => paginate(Math.min(pageNumbers.length, currentPage + 1))}
      >
        <img src="images/right-chevron.svg" alt="" className="icon-20" />
      </div>
    </div>
  );
};

export default Dashboard;
