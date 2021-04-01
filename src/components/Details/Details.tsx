import React, { useEffect, useState } from "react";
import styles from "./Details.module.scss";
import { Link, useLocation } from "react-router-dom";

interface Information {
  id: number;
  name: string;
  image: string;
  desc: string;
  height: number;
  weight: number;
  abilities: string[];
  types: string[];
  stats: object[];
}

const Details: React.FC = () => {
  const [info, setInfo] = useState<Information>();

  const loc = useLocation().pathname.substring(9);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${loc}`)
      .then((res) => res.json())
      .then((data) => {
        let inf: Information = {
          id: data.id,
          name: data.name,
          image:
            data.sprites.other.dream_world.front_default !== null
              ? data.sprites.other.dream_world.front_default
              : data.sprites.other["official-artwork"].front_default,
          desc: "string",
          height: data.height,
          weight: data.weight,
          abilities: [],
          types: [],
          stats: [],
        };
        
        setInfo(inf);
      });
  }, []);

  return <div className={styles.container}></div>;
};

export default Details;
