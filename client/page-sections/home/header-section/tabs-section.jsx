import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/button";
import ProfessionalTab from "./professional";
import JobSelectionTab from "./job-selection";

import { setLogout } from "store";

import style from "./header.module.scss";

const TabsSection = ({ active, setActive }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { dashboardData, user } = useSelector((state) => state.app);

  return (
    <div className={style.mainDiv}>
      <div className={style.tabDiv}>
        <p onClick={() => setActive(0)} className={active === 0 ? style.p : ""}>
          <span className={active === 0 ? style.p1 : ""}>
            Candidates {dashboardData?.candidateCount ? `(${dashboardData?.candidateCount})` : ""}
          </span>
        </p>
        <p onClick={() => setActive(1)} className={active === 1 ? style.p : ""}>
          <span className={active === 1 ? style.p1 : ""}>
            Available positions {dashboardData?.jobCount ? `(${dashboardData?.jobCount})` : ""}
          </span>
        </p>
      </div>
      {active === 0 && <ProfessionalTab />}
      {active === 1 && <JobSelectionTab />}
      <div className={style.buttonDiv}>
        <p>
          By subscribing to Yehaww.com you will get access to a first of its kind database,
          assisting equine professionals all over the world to connect with each other safely.
          Advertise a position or look through the database to find your newest member of staff.
        </p>

        {typeof window !== "undefined" &&
          window.localStorage.getItem("token") &&
          user?.type === "employer" && (
            <Button
              title={"Post a Job"}
              handleClick={() => {
                user.type !== "employer" && dispatch(setLogout());
                router.push(
                  user?.type === "employer" ? "/candidate/post-position" : "/sign-up/employer"
                );
              }}
            />
          )}
        {!(typeof window !== "undefined" && window.localStorage.getItem("token")) && (
          <Button
            title={"Sign Up"}
            handleClick={() => {
              user.type !== "employer" && dispatch(setLogout());
              router.push(
                user?.type === "employer" ? "/candidate/post-position" : "/sign-up/employer"
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TabsSection;
