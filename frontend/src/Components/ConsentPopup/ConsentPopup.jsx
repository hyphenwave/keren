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
    <div className="terms-modal">
      <div className="c-terms_title">Welcome to Complain Onchain</div>
      <div className="hor-divider"></div>
      <div className="c-terms_details">
        <div>
          We're committed to creating a positive and helpful space for feedback.
          By submitting feedback on our platform, you'll be minting a unique NFT
          that represents your contribution to improving the user experience of
          Base! This NFT will be automatically sent to the respective wallet
          associated with the subject of your feedback.
        </div>
        <div>
          We value transparency and accountability. Your feedback, even if
          categorized as a "complaint," serves the purpose of constructive
          improvement. Through this process, we aim to foster positive
          interactions and meaningful resolutions within the Base community!
        </div>
        <div className="text-disclaimer">
          Disclaimer: We take no responsibility for your submitted feedback
          beyond its transmission and representation as an NFT on the
          blockchain. This includes any content containing insults, harassment,
          threats, or other forms of harmful language. Any project can apply to
          get its complaint box listed, and we are not responsible for the
          actions or conduct of any listed projects.
        </div>
      </div>
      <div className="c-checkbox">
        <div className="c-checkbox_tick">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>
        <div>I agree to the terms and conditions</div>
      </div>
      <div className="c-terms_btns">
        <button
          className={`btn cc-primary cc-term-pri ${
            !isChecked ? "disabled" : ""
          }`}
          onClick={handleAccept}
          disabled={!isChecked}
        >
          Accept & Submit Feedback
        </button>
        <a href="https://www.basedkeren.com/complain-onchain" className="btn cc-ghost cc-stretch">
          Learn more
        </a>
      </div>
      <div className="terms-icon">
        <img
          src="images/Keren-Writing-A-Complaint-1.png"
          loading="lazy"
          alt="Keren Writing a Complaint"
          className="c-icon"
        />
      </div>
    </div>
  );
};

export default ConsentPopup;
