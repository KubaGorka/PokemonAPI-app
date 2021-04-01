import React from "react";
import styles from "./Card.module.scss";
import {colors} from '../../styles/styles'

interface Props {
  name: string;
  id: number;
  types: Array<string>;
  image: string;
}

function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function insertZeros(value: number): string{
  let l = value.toString().length
  if(l >= 3) return '#' + value.toString()
  if(l === 2) return '#0' + value.toString()
  return '#00' + value
}

const Card: React.FC<Props> = ({ ...props }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={props.image} alt="Could not download from API" />
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
