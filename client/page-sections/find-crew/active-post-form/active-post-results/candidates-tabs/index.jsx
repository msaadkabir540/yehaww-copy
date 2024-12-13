/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";

import Image from "next/image";
import Container from "components/container";
import Pagination from "components/pagination";
import AllCandidatesGrid from "./all-candidates/grid-view";
import CandidatesListView from "./all-candidates/list-view";
import NotAppliedErrorMessage from "components/not-applied-error";

import { updateShortlistCandidates } from "api-services/employer";

import gridWhite from "public/assets/grid-white.svg";
import gridGray from "public/assets/grid-gray.svg";
import listWhite from "public/assets/list-white.svg";
import listGray from "public/assets/list-gray.svg";
import style from "styles/find-result.module.scss";

const CandidatesTab = ({
  page,
  token,
  active,
  setPage,
  pageSize,
  setActive,
  candidates,
  candidateType,
  getCandidates,
  setCandidateType,
  allShortList = false,
}) => {
  const handleShortlistCandidates = async (data) => {
    await updateShortlistCandidates({
      data,
    });
    getCandidates();
  };

  const router = useRouter();

  return (
    <>
      <div className={style.contentWrapper}>
        <div
          className={style.header_wrapper}
          style={{
            justifyContent: allShortList ? "flex-end" : "",
          }}
        >
          {!allShortList && (
            <div
              style={{
                alignItems: "center",
                display: !allShortList ? "flex" : "none",
                width: "100%",
                borderBottom: "1px solid #ebebeb",
              }}
            >
              <p
                className={style.header_title1}
                style={{
                  color: candidateType ? "" : "#b29e85",
                  border: candidateType ? "" : "1px solid #b29e85",
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "4px",
                }}
                onClick={() => {
                  setCandidateType("");
                  setPage(0);
                }}
              >
                All Candidates
              </p>
              <p
                className={style.header_title1}
                style={{
                  color: candidateType === "shortlisted" ? "#b29e85" : "",
                  border: candidateType === "shortlisted" ? "1px solid #b29e85" : "",
                  padding: "10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setCandidateType("shortlisted");
                  setPage(0);
                }}
              >
                Shortlist
              </p>
              <p
                className={style.header_title1}
                style={{
                  color: candidateType === "notInterested" ? "#b29e85" : "",
                  border: candidateType === "notInterested" ? "1px solid #b29e85" : "",
                  padding: "10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setCandidateType("notInterested");
                  setPage(0);
                }}
              >
                Not Shorlisted
              </p>
            </div>
          )}
          <div className={style.toggleWrapper} style={{ marginTop: "5px" }}>
            <div
              onClick={() => setActive(true)}
              className={`${style.firstIcon} ${active ? style.active : ""}`}
            >
              <Image src={active ? gridWhite : gridGray} alt={"grid icon"} />
            </div>
            <div
              onClick={() => setActive(false)}
              className={`${style.firstIcon} ${active ? "" : style.active}`}
            >
              <Image src={!active ? listWhite : listGray} alt={"list icon"} />
            </div>
          </div>
        </div>

        {active ? (
          <>
            {candidates?.candidates?.length === 0 && (
              <NotAppliedErrorMessage
                paraText={"There are no talents on your shortlist yet. Find candidates"}
                clickText="here"
              />
            )}
            <AllCandidatesGrid
              token={token}
              candidates={candidates}
              getCandidates={getCandidates}
              handleShortlistCandidates={handleShortlistCandidates}
            />
          </>
        ) : (
          <>
            {candidates?.candidates?.length === 0 && (
              <NotAppliedErrorMessage
                paraText={"There are no talents on your shortlist yet. Find candidates"}
                clickText="here"
                onClick={() => {
                  router.push(token ? "/candidate/search" : "/sign-up");
                }}
              />
            )}
            <CandidatesListView
              token={token}
              candidates={candidates}
              getCandidates={getCandidates}
              handleShortlistCandidates={handleShortlistCandidates}
            />
          </>
        )}
        <div>
          {candidates?.candidates?.length > 0 && (
            <Pagination
              count={candidates?.count}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CandidatesTab;
