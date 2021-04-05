import React, { useEffect, useState } from "react";
import styles from "./Details.module.scss";
import { Link, useLocation } from "react-router-dom";
import { colors } from "../../stylesAndFunctions/colors";
import {
  capitalizeFirstLetter,
  insertZeros,
  getIdFromURL,
} from "../../stylesAndFunctions/functions";
import { Loader } from "../../stylesAndFunctions/Loader";
import { ReactComponent as Arrow } from "../../assets/arrow.svg";

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

interface AllPokemonData {
  name: string;
  url: string;
}

interface Props {
  pd: AllPokemonData[];
}

const Details: React.FC<Props> = ({ ...props }) => {
  const [info, setInfo] = useState<Information>();
  const [loading, setLoading] = useState<boolean>(false);


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
      setLoading((l) => false)
    });
  }, [loc]);

  let prevPoke: AllPokemonData | null = null;
  let nextPoke: AllPokemonData | null = null;

  if (info !== undefined) {
    info.id === 1
      ? (prevPoke = props.pd[props.pd.length - 1])
      : (prevPoke = props.pd[info.id - 2]);

    info.id === getIdFromURL(props.pd[props.pd.length - 1].url)
      ? (nextPoke = props.pd[0])
      : (nextPoke = props.pd[info.id]);
  }

  return (
    <div className={styles.container}>
      {info === undefined || loading === true? (
        <Loader variant={1} />
      ) : (
        <>
          <div className={styles.navigation} onClick={() => setLoading(true)}>
            <Link to={`/pokemon/${prevPoke?.name}`}>
              <Arrow />
              <div className={styles.name}>
                {prevPoke !== null
                  ? insertZeros(getIdFromURL(prevPoke.url)) +
                    " " +
                    capitalizeFirstLetter(prevPoke.name)
                  : ""}
              </div>
            </Link>
            <Link to={`/pokemon/${nextPoke?.name}`}>
              <div className={styles.name}>
                {nextPoke !== null
                  ? insertZeros(getIdFromURL(nextPoke.url)) +
                    " " +
                    capitalizeFirstLetter(nextPoke.name)
                  : ""}
              </div>
              <Arrow />
            </Link>
          </div>
          <div className={styles.card}>
            <h1 className={styles.name}>
              {capitalizeFirstLetter(info.name) + " " + insertZeros(info.id)}
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
                  <div style={temp} className={styles.type} key={i}>
                    {capitalizeFirstLetter(t)}
                  </div>
                );
              })}
            </div>
            <p className={styles.desc}>{info.desc}</p>
            <div className={styles.stats}>
              {info.stats.map((s: statsInt, i: number) => {
                return (
                  <div className={styles.stat} key={i}>
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
                    return <p key={i}>{capitalizeFirstLetter(a)}</p>;
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
