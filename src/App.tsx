import React, { useEffect, useState, useCallback } from "react";
import { Switch, Route, Link } from "react-router-dom";

import "./styles/App.scss";
import Nav from "./components/Nav/Nav";
import Card from "./components/Card/Card";
import Settings from "./components/Settings/Settings";
import background from "./assets/container_bg.png";
import { ReactComponent as Cogs } from "./assets/cogs.svg";
import { Loader } from "./styles/Loader";

interface AllPokemonData {
  name: string;
  url: string;
}
interface Pokemon {
  name: string;
  id: number;
  types: Array<string>;
  image: string;
}

const App: React.FC = () => {
  const limit: number = 32;
  const [loading, setLoading] = useState<boolean>(false);
  const [pokemonData, setPokemonData] = useState<AllPokemonData[] | []>([]);
  const [pokemons, setPokemons] = useState<Pokemon[] | []>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Fetch all pokemon names and urls at load
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=898")
      .then((res) => res.json())
      .then((data) => setPokemonData(data.results));
  }, []);

  // Fetch next pokemon datailed data equal to limit
  const fetchLimit = useCallback(
    async (data: AllPokemonData[]): Promise<Pokemon[]> => {
      let arr: Pokemon[] = [];
      let start = 0;
      if (pokemons.length !== 0) {
        start = pokemons[pokemons.length - 1].id;
      }
      for (let i = start; i < limit + pokemons.length; i++) {
        await fetchSingle(data[i])
          .then((d) => {
            arr.push(d);
          })
          .catch((err) => {
            //console.log('Could not fetch from API' + err);
          });
      }
      arr.sort((a, b) => a.id - b.id);
      return arr;
    },
    [pokemons]
  );

  // Fetch initial pokemons
  useEffect(() => {
    fetchLimit(pokemonData)
      .then((d) => {
        setPokemons((pokemons) => [...pokemons, ...d]);
      })
      .then(() => setLoading((loading) => !loading));
  }, [pokemonData]);

  //Fetch individual pokemon data
  const fetchSingle = async (data: AllPokemonData): Promise<Pokemon> => {
    const pokemon: Pokemon = await fetch(data.url)
      .then((res) => res.json())
      .then((data) => {
        let result: Pokemon = {
          name: data.name,
          id: data.id,
          types: [],
          image: data.sprites.other.dream_world.front_default,
        };
        result.types.push(data.types[0].type.name);
        if (data.types.length === 2) {
          result.types.push(data.types[1].type.name);
        }
        return result;
      });
    return pokemon;
  };

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "repeat",
      }}
    >
      <Nav />
      <div className="content">
        <div
          className="settingsToggle"
          onClick={() => {
            setShowSettings(!showSettings);
            console.log("xd");
          }}
        >
          <Cogs />
        </div>
        <div className="settings">
          <Settings
            setToggle={() => {
              setShowSettings(!showSettings);
            }}
            toggle={showSettings}
          />
        </div>
        <div className="cards">
          {pokemons.map((p: Pokemon, i: number) => {
            let path: string = "/pokemon?name=" + p.name;
            return (
              <Link to={path} key={i}>
                <Card name={p.name} id={p.id} types={p.types} image={p.image} />
              </Link>
            );
          })}
        </div>
        <button
          className="load"
          onClick={() => {
            setLoading(!loading);
            fetchLimit(pokemonData)
              .then((d) => setPokemons([...pokemons, ...d]))
              .then(() => setLoading((loading) => !loading))
              .catch((err) => console.log(err));
          }}
        >
          {loading ? <Loader /> : "Load more"}
        </button>
      </div>
    </div>
  );
};

export default App;
