import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);

  const complaintBoxes = {
    pinned: [
      { name: "Jesse", link: "/jesse", title: "(Manager of Base)" },
      { name: "Brian", link: "/brian", title: "(Manager of Coinbase)" },
    ],
    projects: [
      { name: "Based Merch", link: "/basedmerch", title: "Store" },
      { name: "Base Token Store", link: "/mykcryptodev", title: "(Mykcryptodev)" },
    ],
    communities: [
      // Add community boxes here
    ],
    influencers: [
      // Add influencer boxes here
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
      <Link key={box.name} to={box.link} className={styles.box}>
        <div>Complain To {box.name}</div>
        <div>{box.title}</div>
      </Link>
    ));
  };

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
      <div className={styles.boxesContainer}>
        {renderBoxes(complaintBoxes.pinned)}
      </div>
      <div className={styles.categoriesContainer}>
        {Object.entries(complaintBoxes).map(([category, boxes]) => {
          if (category === 'pinned') return null;
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
              {expandedCategory === category && (
                <div className={styles.categoryContent}>
                  {renderBoxes(boxes)}
                </div>
              )}
            </div>
          );
        })}
      </div>
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