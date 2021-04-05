import React from "react";
import styles from "./About.module.scss";
import { useHistory } from "react-router-dom";
import { ReactComponent as Arrow } from "../../assets/arrow.svg";

const About: React.FC = () => {
  const hist = useHistory();
  return (
    <div className={styles.container}>
      <div className={styles.back} onClick={() => hist.goBack()}>
        <Arrow />
        <h3>Back</h3>
      </div>
      <div className={styles.desc}>
        <h2>What's in this project:</h2>
        <p>
          On the main page you can find all pokemons up to generation VIII. Each
          pokemon is represented by a card that can be clicked to see more
          details about it. Cards can be sorted by name or number, as well as
          filtered by type.
        </p>
        <p>Design is a simplified design from original pokemon site.</p>
        <p>
          The whole project is using an API that can be found 
          <a href="https://pokeapi.co/"> here</a> .
        </p>
        <p>App was created using React with Typescript.</p>
      </div>
    </div>
  );
};

export default About;
