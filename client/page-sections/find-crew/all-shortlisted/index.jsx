import { useEffect } from "react";

import Container from "components/container";
import CandidatesTab from "../active-post-form/active-post-results/candidates-tabs";

import useFindResult from "helpers/find-candidate-helper";

import style from "styles/find-result.module.scss";

const AllShortlistedForm = () => {
  const {
    page,
    token,
    active,
    setPage,
    pageSize,
    setActive,
    candidates,
    getCandidates,
    candidateType,
    setCandidateType,
  } = useFindResult({ appliedCandidates: true, allShortListed: true });

  useEffect(() => {
    getCandidates();
  }, []);

  return (
    <div className={style.mainWrapper} style={{ minHeight: "auto" }}>
      <CandidatesTab
        page={page}
        token={token}
        active={active}
        setPage={setPage}
        pageSize={pageSize}
        allShortList={true}
        setActive={setActive}
        candidates={candidates}
        getCandidates={getCandidates}
        candidateType={candidateType}
        setCandidateType={setCandidateType}
      />
    </div>
  );
};

export default AllShortlistedForm;
