import React from "react";
import styles from "./LoadingOverlay.module.css";

const LoadingOverlay = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>
          Please wait and approve the transactions in your wallet...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;