import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const complaintBoxes = [
    { name: "Jesse", link: "/jesse" },
    { name: "Brian", link: "/brian" },
  ];

  const filteredBoxes = complaintBoxes.filter((box) =>
    box.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {filteredBoxes.length > 0 ? (
          filteredBoxes.map((box) => (
            <Link key={box.name} to={box.link} className={styles.box}>
              Complain To {box.name}
            </Link>
          ))
        ) : (
          <p className={styles.noResults}>No results</p>
        )}
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