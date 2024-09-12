import React, { useState } from 'react';
import RatingSystem from '../RatingSystem/RatingSystem';

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Ecosystem projects");

  const complaintBoxes = {
    pinned: [
      { name: "Jesse", title: "Manager of Base", initials: "JE", twitter: "jessepollak" },
      { name: "Brian", title: "Manager of Coinbase", initials: "BR", twitter: "brian_armstrong" },
      { name: "TYBG", title: "Based God", initials: "TY", twitter: "tybasegod" },
    ],
    "Ecosystem projects": [
      { name: "Based Merch Store", title: "Manager", initials: "BM", twitter: "basedmerchstore" },
      { name: "Base Token Store", title: "Mykcryptodev", initials: "BT", twitter: "mykcryptodev" },
      { name: "PokPok", title: "Nibel.eth", initials: "PP", twitter: "Nibel_eth" },
    ],
    "Communities": [
      { name: "TYBG", title: "Based God", initials: "TY", twitter: "tybasegod" },
    ],
    "Influencers": [
      // Add influencer boxes here
    ],
  };

  const filterBoxes = (boxes) => {
    return boxes.filter((box) =>
      box.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderComplaintCard = (box, avatarClass) => (
    <div key={box.name} className="c-complain_card">
      <div className={`c-avatar-${avatarClass}`}>
        <div className="avatar-initals">{box.initials}</div>
        <div className={`${avatarClass}-avatar-ellipse-1`}></div>
        <div className={`${avatarClass}-avatar-ellipse-3`}></div>
        <div className={`${avatarClass}-avatar-ellipse-2`}></div>
      </div>
      <div>
        <div className="c-complain_title">{box.name}</div>
        <div className="c-title_sub">{box.title}</div>
      </div>
      <div className="c-complain_actions">
        <a href={`https://twitter.com/${box.twitter}`} className="c-complain_action w-inline-block">
          <img src="images/twitter.svg" loading="lazy" alt="" className="c-action_icon" />
        </a>
        <a href="#" className="c-complain_action w-inline-block">
          <img src="images/telegram.svg" loading="lazy" alt="" className="c-action_icon" />
        </a>
        <a href="#" className="c-complain_action w-inline-block">
          <img src="images/website.svg" loading="lazy" alt="" className="c-action_icon" />
        </a>
      </div>
      <RatingSystem boxName={box.name} twitterHandle={box.twitter} />
    </div>
  );

  return (
    <div className="body">
 
      <section className="content">
        <div className="hero-block">
          <h1>Complain Onchain</h1>
          <div className="c-hero_image"><img src="images/Keren-Mad-3.png" loading="lazy" sizes="(max-width: 767px) 96px, 200px" srcSet="images/Keren-Mad-3-p-500.png 500w, images/Keren-Mad-3.png 566w" alt="" className="c-image" /></div>
        </div>
        <div className="searchbar">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-icon"><img src="images/search.svg" loading="lazy" alt="" className="c-icon" /></div>
        </div>
        <div className="c-complain">
          <div>Speak directly to the manager</div>
          <div className="c-complain_cards">
            {filterBoxes(complaintBoxes.pinned).map((box, index) => renderComplaintCard(box, `v${index + 1}`))}
          </div>
        </div>
        <div className="c-complain_about">
          <div className="c-about_title">
            <div className="a-about_image"><img src="images/image-2.png" loading="lazy" alt="" className="c-image" /></div>
            <h3>Complain about</h3>
          </div>
          <div className="c-complain_categories">
            <div className="c-categories_container">
              <div className="c-categories">
                {Object.keys(complaintBoxes).filter(key => key !== 'pinned').map(category => (
                  <button
                    key={category}
                    className={`tab ${activeTab === category ? 'cc-active' : ''} w-button`}
                    onClick={() => setActiveTab(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="c-about_stack">
              {filterBoxes(complaintBoxes[activeTab]).map(box => renderComplaintCard(box, 'v1'))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;