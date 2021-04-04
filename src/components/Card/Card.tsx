import React from "react";
import styles from "./Card.module.scss";
import { colors } from "../../stylesAndFunctions/colors";
import {
  capitalizeFirstLetter,
  insertZeros,
} from "../../stylesAndFunctions/functions";

interface Props {
  name: string;
  id: number;
  types: Array<string>;
  image: string;
}

const Card: React.FC<Props> = ({ ...props }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={props.image} alt="No data in API" />
      </div>
      <p className={styles.id}>{insertZeros(props.id)}</p>
      <p className={styles.name}>{capitalizeFirstLetter(props.name)}</p>
      <div className={styles.types}>
        {props.types.map((type: string, i: number) => {
          const temp = {
            backgroundColor: "#" + colors[capitalizeFirstLetter(type)],
          } as React.CSSProperties;
          return (
            <div key={i} style={temp} className={styles.type}>
              {capitalizeFirstLetter(type)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
