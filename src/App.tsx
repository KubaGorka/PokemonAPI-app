import React, { useEffect, useState, useCallback, useRef } from "react";
import { Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";

import "./stylesAndFunctions/App.scss";
import Nav from "./components/Nav/Nav";
import Card from "./components/Card/Card";
import Settings from "./components/Settings/Settings";
import Details from "./components/Details/Details";

import background from "./assets/container_bg.png";
import { ReactComponent as Cogs } from "./assets/cogs.svg";
import { Loader } from "./stylesAndFunctions/Loader";
import { colors } from "./stylesAndFunctions/colors";
import { getIdFromURL, checkIfEnd, filterExcess } from "./stylesAndFunctions/functions";

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
const limit: number = 32;

const CardsDiv = styled.div<{
  size: number;
}>`
  display: grid;
  row-gap: 1rem;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${(props) => props.size * 2.5}rem, 1fr)
  );
`;

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pokemonData, setPokemonData] = useState<AllPokemonData[] | []>([]);
  const [pokemons, setPokemons] = useState<Pokemon[] | []>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [sizeOption, setSizeOption] = useState<number>(4);
  const [sortOption, setSortOption] = useState<number>(0);
  const [typeOption, setTypeOption] = useState<number | null>(null);
  const prevent = useRef(true);

  // Fetch all pokemon names and urls at load
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1118")
      .then((res) => res.json())
      .then((data) => {
        setPokemonData(
          data.results.filter(filterExcess)
        );
      });
  }, []);

  // Fetch next pokemon datailed data equal to limit
  const fetchLimit = useCallback(
    async (data: AllPokemonData[]): Promise<Pokemon[]> => {
      let arr: Pokemon[] = [];

      for (let i = pokemons.length; i < limit + pokemons.length; i++) {
        await fetchSingle(data[i])
          .then((d) => {
            arr.push(d);
          })
          .catch((err) => {
            //console.log('Could not fetch from API' + err);
          });
      }
      setPokemons((pokemons) => [...pokemons, ...arr]);
      return arr;
    },
    [pokemons]
  );

  // Fetch initial pokemons or on sort change
  useEffect(() => {
    //console.log(pokemonData);
    fetchLimit(pokemonData).then(() => setLoading((loading) => false));
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
          image:
            data.sprites.other.dream_world.front_default !== null
              ? data.sprites.other.dream_world.front_default
              : data.sprites.other["official-artwork"].front_default,
        };

        data.types.forEach((t: any) => {
          result.types.push(t.type.name);
        });
        return result;
      });
    return pokemon;
  };
  //Sorting functions
  const sortPokemonsN = useCallback((): AllPokemonData[] => {
    setPokemons([]);
    const res: AllPokemonData[] = pokemonData;
    let option = sortOption;
    switch (option) {
      case 0:
        res.sort((a, b) => {
          return getIdFromURL(a.url) - getIdFromURL(b.url);
        });
        break;
      case 1:
        res
          .sort((a, b) => {
            return getIdFromURL(a.url) - getIdFromURL(b.url);
          })
          .reverse();
        break;
      case 2:
        res.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        break;
      case 3:
        res.sort((a, b) => {
          if (a.name > b.name) {
            return -1;
          }
          if (a.name < b.name) {
            return 1;
          }
          return 0;
        });
        break;

      default:
        console.error("Something went wrong while sorting");
    }
    return res;
  }, [sortOption]);

  const sortPokemonsT = useCallback(async (): Promise<AllPokemonData[]> => {
    let res: AllPokemonData[] = [];
    if (typeOption === null) {
      let p: AllPokemonData[] = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=2000"
      )
        .then((res) => res.json())
        .then((data) => {
          res = data.results.filter((d: AllPokemonData) => {
            return getIdFromURL(d.url) < 10000;
          });
          return res;
        });
      return p;
    }
    let types = Object.keys(colors);
    let p: AllPokemonData[] = await fetch(
      `https://pokeapi.co/api/v2/type/${types[typeOption].toLowerCase()}`
    )
      .then((res) => res.json())
      .then((data) => {
        res = data.pokemon.map((f: any) => {
          return f.pokemon;
        });

        return res;
      });

    return p;
  }, [typeOption]);

  useEffect(() => {
    setPokemonData([...sortPokemonsN()]);
  }, [sortPokemonsN]);

  useEffect(() => {
    if (prevent.current) {
      //prevents second fetch on init
      prevent.current = false;
      return;
    }
    setPokemons([]);
    sortPokemonsT()
      .then((data: AllPokemonData[]) => {
        let res = data.filter(filterExcess)
        setPokemonData([...res]);
      })
      .then(() => setSortOption(0));
  }, [sortPokemonsT]);

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "repeat",
      }}
    >
      <Nav />
      <Switch>
        <Route path="/pokemon">
          <Details />
        </Route>
        <Route path="/">
          <div className="content">
            <div
              className="settingsToggle"
              onClick={() => {
                setShowSettings(!showSettings);
              }}
            >
              <Cogs />
            </div>
            <div className="settings">
              <Settings
                toggle={showSettings}
                sizeOption={sizeOption}
                sortOption={sortOption}
                typeOption={typeOption}
                setToggle={() => {
                  setShowSettings(!showSettings);
                }}
                setSizeOption={(value: number) => {
                  setSizeOption(value);
                }}
                setSortOption={(value: number) => {
                  setSortOption(value);
                }}
                setTypeOption={(value: number | null) => {
                  setTypeOption(value);
                }}
              />
            </div>
            {pokemons.length === 0 ? <Loader variant={1} /> : ""}
            <CardsDiv size={sizeOption}>
              {pokemons.map((p: Pokemon, i: number) => {
                let path: string = "/pokemon/" + p.name;
                return (
                  <Link to={path} key={i}>
                    <Card
                      name={p.name}
                      id={p.id}
                      types={p.types}
                      image={p.image}
                    />
                  </Link>
                );
              })}
            </CardsDiv>
            {checkIfEnd(pokemonData, pokemons) || pokemons.length === 0 ? (
              console.log()
            ) : (
              <button
                className="load"
                onClick={() => {
                  if (loading !== true) {
                    setLoading(!loading);
                    fetchLimit(pokemonData)
                      .then((d) => setPokemons([...pokemons, ...d]))
                      .then(() => setLoading((loading) => !loading))
                      .catch((err) => console.log(err));
                  }
                }}
              >
                {loading ? <Loader variant={0} /> : "Load more"}
              </button>
            )}
          </div>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
