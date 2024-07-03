import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";
import RatingSystem from "../RatingSystem/RatingSystem"; 

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);

  const complaintBoxes = {
    pinned: [
      { name: "Jesse", link: "/jesse", title: "(Manager of Base)", twitter: "jessepollak" },
      { name: "Brian", link: "/brian", title: "(Manager of Coinbase)", twitter: "brian_armstrong" },
      { name: "TYBG", link: "/tybg", title: "(Based God)", twitter: "tybasegod" },
    ],
    "ecosystem projects": [
      { name: "Based Merch", link: "/basedmerch", title: "Store", twitter: "basedmerchstore" },
      { name: "Base Token Store", link: "/mykcryptodev", title: "(Mykcryptodev)", twitter: "mykcryptodev" },
      { name: "PokPok", link: "/pokpok", title: "(Nibel.eth)", twitter: "Nibel_eth" },
    ],
    communities: [
      { name: "TYBG", link: "/tybg", title: "(Based God)", twitter: "tybasegod" },
      { name: "Boris", link: "/boris", title: "(Boris The Wizard)", twitter: "bwizofficial" },
    ],
    influencers: [
      // Add influencer boxes here with their Twitter handles
    ],
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const filterBoxes = (boxes) => {
    return boxes.filter((box) =>
      box.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderBoxes = (boxes) => {
    return filterBoxes(boxes).map((box) => (
      <div key={box.name} className={styles.boxWrapper}>
        <Link to={box.link} className={styles.box}>
          <div>Complain To {box.name}</div>
          <div>{box.title}</div>
        </Link>
        <RatingSystem boxName={box.name} twitterHandle={box.twitter} />
      </div>
    ));
  };

  const isSearchActive = searchQuery.trim() !== "";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Complain OnChain</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchBar}
      />
      <div className={styles.boxesGrid}>
        {renderBoxes(complaintBoxes.pinned)}
      </div>
      <div className={styles.categoriesContainer}>
        {Object.entries(complaintBoxes).map(([category, boxes]) => {
          if (category === 'pinned') return null;
          const filteredBoxes = filterBoxes(boxes);
          return (
            <div key={category} className={styles.category}>
              <button
                className={styles.categoryButton}
                onClick={() => toggleCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <span className={styles.expandIcon}>
                  {expandedCategory === category ? '▼' : '▶'}
                </span>
              </button>
              {(isSearchActive || expandedCategory === category) && filteredBoxes.length > 0 && (
                <div className={styles.categoryContent}>
                  <div className={styles.boxesGrid}>
                    {renderBoxes(filteredBoxes)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {isSearchActive && Object.values(complaintBoxes).flat().filter(box => 
        box.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).length === 0 && (
        <p className={styles.noResults}>No results found</p>
      )}
      <Footer />
    </div>
  );
};

const Footer = () => {
  return (
    <div className={styles.Footer}>
      <a href="https://www.basedkeren.com/" className={styles.webLink}>
        Keren Website
      </a>
      <a href="https://t.me/kerenbase">Telegram</a>
      <a href="https://dexscreener.com/base/0x1ca25a133160beb02b18c1983c997fafbe98bc6e">
        Chart
      </a>
      <a href="https://warpcast.com/basedkeren">Warpcast</a>
      <a href="https://www.dextools.io/app/en/base/pair-explorer/0x1ca25a133160beb02b18c1983c997fafbe98bc6e?t=1715622444271">
        Video Tutorial
      </a>
      <a href="/dashboard">Dashboard</a>
    </div>
  );
};

export default Homepage;