import React, { CSSProperties, useState } from "react";
import styles from "./Settings.module.scss";
import { colors } from "../../styles/styles";

const sortArr: string[] = [
  "Number (ascending)",
  "Number (descending)",
  "Name (A-Z)",
  "Name (Z-A)",
];

const optionStyle: CSSProperties = {
  color: "#000000",
  fontWeight: "bolder",
};

interface Props {
  setToggle(): void;
  toggle: boolean;
}

const Settings: React.FC<Props> = ({ ...props }) => {
  const [sizeOption, setSizeOption] = useState<number>(5);
  const [sortOption, setSortOption] = useState<number>(0);
  const [typeOption, setTypeOption] = useState<number | null>(null);

  const foo = props.toggle ? styles.settings : styles.hidden;

  return (
    <div className={foo} onClick={() => props.setToggle}>
      <div className={styles.container}>
        <h1>Size:</h1>
        <input
          type="range"
          className={styles.size}
          min="3"
          max="6"
          value={sizeOption}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSizeOption(parseInt(e.target.value))
          }
        ></input>
        <h1>Sort by:</h1>
        <ul>
          {sortArr.map((k: string, i: number) => {
            if (sortOption === i)
              return (
                <li key={i} style={optionStyle}>
                  {k}
                </li>
              );
            return <li key={i}>{k}</li>;
          })}
        </ul>
        <h1>Type:</h1>
        <ul>
          {typeOption === null ? (
            <li style={optionStyle}>All</li>
          ) : (
            <li>All</li>
          )}

          {Object.keys(colors).map((k: string, i: number) => {
            if (typeOption === i)
              return (
                <li key={i} style={optionStyle}>
                  {k}
                </li>
              );
            return <li key={i}>{k}</li>;
          })}
        </ul>
        <button className={styles.button} onClick={props.setToggle}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Settings;
