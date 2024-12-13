import Link from "next/link";

import { newPositionArr } from "utils/arrayHelper";

import style from "./stay-clean.module.scss";

const StayClean = () => {
  return (
    <div className={style.main_card}>
      {Object.keys(newPositionArr)
        .filter((x) => x === "Office")
        ?.map((ele, index) => (
          <div className={style.deck_sec} key={index}>
            <div className={style.deck_heading}>
              <Link key={index} href={`/jobs/${ele}`}>
                <p>{ele}</p>
              </Link>
            </div>
            <div className={style.second_sec}>
              {newPositionArr[ele].map((t, ind) => (
                <Link key={ind} href={`/jobs/${ele}/${t.replace("/", "-")}`}>
                  <p>{t}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default StayClean;
