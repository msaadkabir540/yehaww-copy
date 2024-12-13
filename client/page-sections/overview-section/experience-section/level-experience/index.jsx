import React, { useState, useEffect } from "react";
import style from "./level.module.scss";

const LevelExperience = ({ type, star, title, expLevel, typeName, setValue, levelName }) => {
  const [selectedBtn, setSelectedBtn] = useState();
  const [sliderValue, setSliderValue] = useState(0);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);

  useEffect(() => {
    const index = level.findIndex((item) => item.experienceLevel === expLevel);
    if (index !== -1) {
      setSelectedLevelIndex(index);
      setSliderValue(index * 25);
    }
  }, [expLevel]);

  useEffect(() => {
    setValue && setValue(levelName, level[selectedLevelIndex]?.experienceLevel);
  }, [selectedLevelIndex]);

  const handleSliderChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setSliderValue(newValue);

    const index = Math.floor(newValue / 25);
    setSelectedLevelIndex(index);
  };

  return (
    <div className={style.container}>
      {title && (
        <p>
          {title} {star && star}
        </p>
      )}
      <div
        className={style.range}
        style={{
          zIndex: 600,
          position: "relative",
        }}
      >
        <div className={style.outerDiv}>
          <div className={style.innerDiv}></div>
          <div className={style.innerDiv1}></div>
        </div>
        <input
          min="0"
          max="100"
          step="25"
          type="range"
          value={sliderValue}
          onChange={handleSliderChange}
        />
        <p>{level[selectedLevelIndex]?.experienceLevel}</p>
      </div>
      <div className={style.main}>
        {btn?.map(({ text }, index) => {
          return (
            <span
              key={index}
              className={`${style.btn} ${(selectedBtn || type) === text ? style.selected : ""}`}
              onClick={() => {
                setSelectedBtn(text);
                setValue && setValue(typeName, text);
              }}
            >
              {text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default LevelExperience;

const btn = [
  { index: "1", text: "Hobby" },
  { index: "2", text: "Amateur" },
  { index: "3", text: "Professional" },
];
const level = [
  { experienceLevel: "None" },
  { experienceLevel: "Little" },
  { experienceLevel: "Some" },
  { experienceLevel: "Considerable" },
  { experienceLevel: "Extensive" },
];
