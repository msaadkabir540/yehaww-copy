import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/button";
import Select from "components/select";

import StayCleanJobs from "./stay-clean-jobs";
import Loading from "components/loading";
import HandsOnJobs from "./hands-on-jobs";
import JobsPositions from "./jobs-positions";

import { getDashboardData } from "api-services/dashboard";

import style from "./jobs.module.scss";

const JobsSection = () => {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.app);

  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleGetDashboardData = async () => {
    setLoading(true);
    await getDashboardData({ dispatch });
    setLoading(false);
  };

  useEffect(() => {
    handleGetDashboardData();
  }, []);

  return (
    <div className={style.mainJob}>
      <div className={style.tabDiv}>
        <div onClick={() => setActive(0)}>
          <p
            style={{
              border: active === 0 ? "3px solid #B29E85" : "3px solid transparent",
              color: active === 0 ? "#B29E85" : "",
              fontWeight: active === 0 ? 600 : "",
            }}
          >
            JOBS & POSITIONS
          </p>
        </div>
        <div onClick={() => setActive(1)}>
          <p
            style={{
              border: active === 1 ? "3px solid #B29E85" : "3px solid transparent",
              color: active === 1 ? "#B29E85" : "",
              fontWeight: active === 1 ? 600 : "",
            }}
          >
            Barn jobs “Hands on”
          </p>
        </div>
        <div onClick={() => setActive(2)}>
          <p
            style={{
              border: active === 2 ? "3px solid #B29E85" : "3px solid transparent",
              color: active === 2 ? "#B29E85" : "",
              fontWeight: active === 2 ? 600 : "",
            }}
          >
            Office jobs “Stay clean”
          </p>
        </div>
      </div>
      <div className={style.selectDiv}>
        <Select
          name="jobs"
          onChange={(e) => {
            setActive(parseInt(e.target.value));
          }}
        >
          <option value={0}>JOBS & POSITIONS</option>
          <option value={1}>Barn jobs “Hands On”</option>
          <option value={2}>Office jobs “Stay clean”</option>
        </Select>
      </div>
      {loading ? (
        <Loading pageLoader={true} diffHeight={300} />
      ) : (
        <>
          {active === 0 && <JobsPositions dashboardData={dashboardData} />}
          {active === 1 && <HandsOnJobs dashboardData={dashboardData} />}
          {active === 2 && <StayCleanJobs dashboardData={dashboardData} />}
        </>
      )}
      <div className={style.btnDiv}>
        <Link href={"/jobs"}>
          <a>
            <Button title="Browse all Jobs" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default JobsSection;
