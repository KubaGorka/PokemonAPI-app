import React from "react";
import styles from "./loader.module.css";


type Props = {
  variant: number;
}

export const Loader = ({variant}: Props) => {
  return (
    <div className={styles.index}>
      <div className={variant === 0 ? styles.ldsellipsis : styles.loader}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
