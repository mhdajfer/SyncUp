import React from "react";
import styles from "./Loading.module.css";

function Loading({ background = "bg-white" }) {
  return (
    <div className={`h-screen w-full ${background}`}>
      <figure className={styles.loader}>
        <div className={`${styles.dot} ${styles.white}`} />
        <div className={styles.dot} />
        <div className={styles.dot} />
        <div className={styles.dot} />
        <div className={styles.dot} />
      </figure>
    </div>
  );
}

export default Loading;
