import React from "react";
import styles from "./LoadingOverlay.module.css";

const LoadingOverlay = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>
          Please wait for the NFTs information to load.
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;