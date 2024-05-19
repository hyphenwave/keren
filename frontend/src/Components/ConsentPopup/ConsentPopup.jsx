import React from "react";
import styles from "./ConsentPopup.module.css";

const ConsentPopup = ({ onAccept }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2 className={styles.heading}>Welcome to Complain Onchain!</h2>
        <p className={styles.description}>
          We're committed to creating a positive and helpful space for feedback. By submitting feedback on our platform, you'll be minting a unique NFT that represents your contribution to improving the user experience of Base! This NFT will be automatically sent to the respective wallet associated with the subject of your feedback.
        </p>
        <p className={styles.description}>
          We value transparency and accountability. Your feedback, even if categorized as a "complaint," serves the purpose of constructive improvement. Through this process, we aim to foster positive interactions and meaningful resolutions within the Base community!
        </p>
        <p className={styles.disclaimer}>
          Disclaimer: We take no responsibility for your submitted feedback beyond its transmission and representation as an NFT on the blockchain. This includes any content containing insults, harassment, threats, or other forms of harmful language.
        </p>
        <div className={styles.checkboxContainer}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" className={styles.checkbox} />
            <span className={styles.checkmark}></span>
            I agree to the terms and conditions
          </label>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.acceptButton} onClick={onAccept}>
            Accept and Submit Feedback
          </button>
          <a href="/learn-more" className={styles.learnMoreLink}>
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConsentPopup;