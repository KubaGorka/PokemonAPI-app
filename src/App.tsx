import React, { useEffect, useState, useCallback, useRef } from "react";
import { Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";

import "./styles/App.scss";
import Nav from "./components/Nav/Nav";
import Card from "./components/Card/Card";
import Settings from "./components/Settings/Settings";
import Details from "./components/Details/Details";

import background from "./assets/container_bg.png";
import { ReactComponent as Cogs } from "./assets/cogs.svg";
import { Loader } from "./styles/Loader";
import { colors } from "./styles/styles";

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
  gap: 1rem;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${(props) => props.size * 3}rem, 1fr)
  );
`;

function getIdFromURL(value: string): number {
  let res = value.split("/");
  return parseInt(res[res.length - 2]);
}

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pokemonData, setPokemonData] = useState<AllPokemonData[] | []>([]);
  const [pokemons, setPokemons] = useState<Pokemon[] | []>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [sizeOption, setSizeOption] = useState<number>(5);
  const [sortOption, setSortOption] = useState<number>(0);
  const [typeOption, setTypeOption] = useState<number | null>(null);
  const first = useRef(true);

  // Fetch all pokemon names and urls at load
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1118")
      .then((res) => res.json())
      .then((data) => setPokemonData(data.results));
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
    console.log("xd");
    console.log(pokemonData);
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
  const sortPokemonsN = useCallback(
    (option: number): AllPokemonData[] => {
      const res: AllPokemonData[] = pokemonData;
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
    },
    [pokemonData]
  );

  const sortPokemonsT = useCallback(async (): Promise<AllPokemonData[]> => {
    let res: AllPokemonData[] = [];
    if (typeOption === null) {
      let p: AllPokemonData[] = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1118"
      )
        .then((res) => res.json())
        .then((data) => {
          res = data.results;
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
    setPokemons([]);
    setPokemonData([...sortPokemonsN(sortOption)]);
  }, [sortOption]);

  useEffect(() => {
    if (first.current) {
      //prevents second fetch on init
      first.current = false;
      return;
    }
    setPokemons([]);
    sortPokemonsT().then((data: AllPokemonData[]) => {
      setPokemonData([...data]);
    });
  }, [typeOption]);

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
              {loading ? <Loader /> : "Load more"}
            </button>
          </div>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
