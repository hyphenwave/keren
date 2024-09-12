import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import styles from  './Dashboard.module.css';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const Dashboard = () => {
  const [nfts, setNfts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nftsPerPage] = useState(6);
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
          const url = `${baseURL}?contractAddress=${address}&withMetadata=${withMetadata}${nextToken ? `&startToken=${nextToken}` : ""}`;
          const response = await axios.get(url);
          allNfts = [...allNfts, ...response.data.nfts];
          nextToken = response.data.nextToken;
        } while (nextToken);

        const { data: categoryData, error } = await supabase
          .from('nft_categories')
          .select('token_id, categories');

        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          const categoryMap = new Map(categoryData.map(item => [item.token_id, item.categories]));
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
    <div className="content">
      <div className="page-header">
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
        <div>Loading...</div>
      ) : (
        <div className="c-nft_grid">
          {currentNfts.map((nft) => (
            <div key={nft.id.tokenId} className="c-complaint_card">
              <div className="c-complaint_img">
                <img src={nft.media[0].gateway} alt={nft.title} className="c-image cc-cover" />
              </div>
              <div className="c-complaint_details">
                <div className="c-complaint_category">{formatCategories(nft.categories)}</div>
                <div className="c-complaint_title">{nft.title}</div>
                <div className="c-complaint_body">{nft.metadata.description}</div>
                <Link to={`/nft/${nft.id.tokenId}`} className="btn w-button">Details</Link>
              </div>
            </div>
          ))}
        </div>
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
    <div className="c-pagination">
      <div className="c-active_page">
        <div>{currentPage}</div>
      </div>
      <div className="w-layout-hflex c-total_pages">
        <div className="text-sub">of</div>
        <div>{pageNumbers.length}</div>
      </div>
      <div className="c-pagination_btn" onClick={() => paginate(Math.max(1, currentPage - 1))}>
        <img src="images/left-chevron.svg" alt="" className="icon-20" />
      </div>
      <div className="c-pagination_btn" onClick={() => paginate(Math.min(pageNumbers.length, currentPage + 1))}>
        <img src="images/right-chevron.svg" alt="" className="icon-20" />
      </div>
    </div>
  );
};

export default Dashboard;