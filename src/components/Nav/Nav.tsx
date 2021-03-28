import React from "react";
import styles from "./Nav.module.scss";

const Nav: React.FC = () => {
  return (
    <div className={styles.nav}>
      <div className={styles.logo}>
        <div className={styles.icon}></div>
        <p className={styles.text}>PokeAPI app</p>
      </div>
      <p className={styles.about}>About</p>
    </div>
  );
};

export default Nav;
