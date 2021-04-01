import React from "react";
import { Link } from "react-router-dom";
import styles from "./Nav.module.scss";

const Nav: React.FC = () => {
  return (
    <div className={styles.nav}>
      <div className={styles.logo}>
        <div className={styles.icon}></div>
        <p className={styles.text}>PokeAPI app</p>
      </div>
      <p className={styles.about}><Link to='/about'>About</Link></p>
    </div>
  );
};

export default Nav;
