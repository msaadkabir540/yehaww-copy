import Link from "next/link";
import { useRef } from "react";
import { useSelector } from "react-redux";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./list.module.scss";

const DownloadPopUp = ({ setDownloadPopUp, data: { cvLink, references, certifications } }) => {
  const wrapperRef = useRef(null);

  const { user } = useSelector((state) => state?.app);

  useOutsideClickHook(wrapperRef, () => {
    setDownloadPopUp(false);
  });

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        {cvLink && user?.subscriptionStatus === "active" && (
          <a href={cvLink} target="_blank">
            <p
              onClick={(e) => {
                e.stopPropagation();
                setDownloadPopUp(false);
              }}
              className={style.borderClass}
            >
              Download CV
            </p>
          </a>
        )}
        {certifications?.[0]?.url && (
          <a href={certifications?.[0]?.url} target="_blank">
            <p
              onClick={(e) => {
                e.stopPropagation();
                setDownloadPopUp(false);
              }}
              className={style.borderClass}
            >
              Download Certificates
            </p>
          </a>
        )}
        {references?.[0]?.url && (
          <a href={references?.[0]?.url} target="_blank">
            <p
              onClick={(e) => {
                e.stopPropagation();
                setDownloadPopUp(false);
              }}
              className={style.borderClass}
            >
              Download References
            </p>
          </a>
        )}
      </div>
    </>
  );
};

export default DownloadPopUp;
