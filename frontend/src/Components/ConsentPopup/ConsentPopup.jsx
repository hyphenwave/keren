import React, { useState } from "react";
import styles from "./ConsentPopup.module.css";

const ConsentPopup = ({ onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
    }
  };

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
        Disclaimer: We take no responsibility for your submitted feedback beyond its transmission and representation as an NFT on the blockchain. This includes any content containing insults, harassment, threats, or other forms of harmful language. Any project can apply to get its complaint box listed, and we are not responsible for the actions or conduct of any listed projects.
        </p>
        <div className={styles.checkboxContainer}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span className={styles.checkmark}></span>
            I agree to the terms and conditions
          </label>
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.acceptButton} ${
              !isChecked ? styles.disabledButton : ""
            }`}
            onClick={handleAccept}
            disabled={!isChecked}
          >
            Accept and Submit Feedback
          </button>
          <a href="https://www.basedkeren.com/complain-onchain" className={styles.learnMoreLink}>
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConsentPopup;