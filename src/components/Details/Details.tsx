import React, { useEffect, useState } from "react";
import styles from "./Details.module.scss";
import { Link, useLocation } from "react-router-dom";
import { colors } from "../../stylesAndFunctions/colors";
import {
  capitalizeFirstLetter,
  insertZeros,
} from "../../stylesAndFunctions/functions";
import { Loader } from "../../stylesAndFunctions/Loader";

interface Information {
  id: number;
  name: string;
  image: string;
  desc: string;
  height: number;
  weight: number;
  abilities: string[];
  types: string[];
  stats: statsInt[];
}

interface flavourText {
  flavor_text: string;
  language: { name: string; url: string };
  version: { name: string; url: string };
}

interface statsInt {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

const Details: React.FC = () => {
  const [info, setInfo] = useState<Information>();

  const loc = useLocation().pathname.substring(9);

  useEffect(() => {
    async function getPokemonInfo(): Promise<Information> {
      let info = await fetch(`https://pokeapi.co/api/v2/pokemon/${loc}`)
        .then((res) => res.json())
        .then((data) => {
          let inf: Information = {
            id: data.id,
            name: data.name,
            image:
              data.sprites.other.dream_world.front_default !== null
                ? data.sprites.other.dream_world.front_default
                : data.sprites.other["official-artwork"].front_default,
            desc: "There is no description of this pokemon in API.",
            height: data.height,
            weight: data.weight,
            abilities: [],
            types: [],
            stats: data.stats,
          };
          //adding types
          data.types.forEach((t: any) => {
            inf.types.push(t.type.name);
          });
          //adding abilities
          data.abilities.forEach((a: any) => {
            inf.abilities.push(a.ability.name);
          });
          return inf;
        });

      info.desc = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${info.id}`
      )
        .then((res) => res.json())
        .then((data) => {
          let text: string = "";
          data.flavor_text_entries.forEach((d: flavourText) => {
            if (d.language.name === "en") {
              text = d.flavor_text;
            }
          });
          return text;
        })
        .catch((err) => {
          console.log(err);
          return info.desc;
        });

      return info;
    }
    getPokemonInfo().then((data) => {
      setInfo((i) => data);
    });
  }, [loc]);

  return (
    <div className={styles.container}>
      {info === undefined ? (
        <Loader variant={1} />
      ) : (
        <>
          <div className={styles.navigation}>
            <Link to="/">
              #001 XDDDDDDD
            </Link>
            <Link to="/">
              #001 XDDDDDDD
            </Link>
          </div>
          <div className={styles.card}>
            <h1 className={styles.name}>
              {insertZeros(info.id) + " " + capitalizeFirstLetter(info.name)}
            </h1>
            <div className={styles.image}>
              <img src={info.image} alt="could not download" />
            </div>
            <div className={styles.types}>
              {info.types.map((t: string, i: number) => {
                const temp = {
                  backgroundColor: "#" + colors[capitalizeFirstLetter(t)],
                } as React.CSSProperties;
                return (
                  <div style={temp} className={styles.type}>
                    {capitalizeFirstLetter(t)}
                  </div>
                );
              })}
            </div>
            <p className={styles.desc}>{info.desc}</p>
            <div className={styles.stats}>
              {info.stats.map((s: statsInt, i: number) => {
                return (
                  <div className={styles.stat}>
                    <p>{capitalizeFirstLetter(s.stat.name)}</p>
                    <p>{s.base_stat}</p>
                  </div>
                );
              })}
            </div>

            <div className={styles.info}>
              <div className={styles.entry}>
                <p className={styles.label}>Height</p>
                <p>{info.height + "'"}</p>
              </div>
              <div className={styles.entry}>
                <p className={styles.label}>Weight</p>
                <p>{info.weight + " lbs"}</p>
              </div>
              <div className={styles.entries}>
                <p className={styles.label}>Abilities</p>
                <div className={styles.entry}>
                  {info.abilities.map((a: string, i: number) => {
                    return <p>{capitalizeFirstLetter(a)}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Details;
