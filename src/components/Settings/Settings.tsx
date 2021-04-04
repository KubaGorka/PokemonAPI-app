import React, { CSSProperties } from "react";
import styles from "./Settings.module.scss";
import { colors } from "../../stylesAndFunctions/colors";

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
  toggle: boolean;
  sizeOption: number;
  sortOption: number;
  typeOption: number | null;
  setToggle(): void;
  setSizeOption(value: number): void;
  setSortOption(value: number): void;
  setTypeOption(value: number | null): void;
}

const Settings: React.FC<Props> = ({ ...props }) => {
  const foo = props.toggle ? styles.settings : styles.hidden;

  return (
    <div className={foo} onClick={() => props.setToggle}>
      <div className={styles.container}>
        <div>
        <h1>Size:</h1>
        <input
          type="range"
          className={styles.size}
          min="3"
          max="6"
          value={props.sizeOption}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.setSizeOption(parseInt(e.target.value))
          }
        ></input>
        </div>
        <div>
        <h1>Sort by:</h1>
        <ul>
          {sortArr.map((k: string, i: number) => {
            return (
              <li
                key={i}
                style={props.sortOption === i ? optionStyle : undefined}
                onClick={() => props.setSortOption(i)}
              >
                {k}
              </li>
            );
          })}
        </ul>
        </div>
        <div>
          <h1>Type:</h1>
          <ul>
            {
              <li
                style={props.typeOption === null ? optionStyle : undefined}
                onClick={() => {
                  props.setTypeOption(null);
                }}
              >
                All
              </li>
            }

            {Object.keys(colors).map((k: string, i: number) => {
              return (
                <li
                  key={i}
                  style={props.typeOption === i ? optionStyle : undefined}
                  onClick={() => {
                    props.setTypeOption(i);
                  }}
                >
                  {k}
                </li>
              );
            })}
          </ul>
        </div>
        <button className={styles.button} onClick={props.setToggle}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Settings;
