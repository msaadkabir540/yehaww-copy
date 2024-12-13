import Link from "next/link";
import { Router, useRouter } from "next/router";

import { newPositionArr } from "utils/arrayHelper";

import style from "./hands-on.module.scss";

const HandsOn = ({ setBrowse }) => {
  const router = useRouter();
  return (
    <div className={style.main_card}>
      {Object.keys(newPositionArr)
        .filter((x) => x !== "Office")
        ?.map((ele, index) => (
          <div className={style.deck_sec} key={index}>
            <div className={style.deck_heading}>
              <p
                key={index}
                onClick={() => {
                  router.push(`/jobs/${ele}`);
                  setBrowse(false);
                }}
              >
                <p>{ele}</p>
              </p>
            </div>
            <div className={style.second_sec}>
              {newPositionArr[ele].map((t, ind) => (
                <p
                  key={ind}
                  onClick={() => {
                    router.push(`/jobs/${ele}/${t.replace("/", "-")}`);
                    setBrowse(false);
                  }}
                >
                  <p>{t}</p>
                </p>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default HandsOn;
