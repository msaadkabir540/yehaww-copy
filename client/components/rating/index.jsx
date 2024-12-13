import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useController } from "react-hook-form";

import style from "./rating.module.scss";

const Rating = ({ control, name }) => {
  const { pathname } = useRouter();
  const verified = pathname === "/verified-reference";

  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: 1,
  });

  return (
    <div className={style.contain}>
      {Array(5)
        .fill(0)
        .map((e, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            onClick={() => {
              !verified && onChange(index + 1);
            }}
            className={`${style.fa} ${index + 1 <= value ? style.checked : ""}`}
          />
        ))}
    </div>
  );
};

export default Rating;
