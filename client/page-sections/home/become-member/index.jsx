/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/button";

import { setLogout } from "store";

import style from "./member.module.scss";

const MemberSection = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.app);

  return (
    <div className={style.parent}>
      <div className={style.detailsec}>
        <div className={style.headingsec}>
          <h6>Become a Member</h6>
          <p className={style.para1}>
            As members of the equine community ourselves, our main goal is to build a stronger, more
            trusted, and safer industry. At Yehaww, we are constantly striving for improvement.
            {/* <span
              className={style.para2}
              onClick={() => {
                router.push(token ? "/" : "/sign-up");
              }}
            >
              Find out more
            </span> */}
          </p>
        </div>
        <div className={style.btnsec}>
          {!(typeof window !== "undefined" && window.localStorage.getItem("token")) && (
            <Button
              title=" Free Sign Up"
              className={style.signupbtn}
              handleClick={() => {
                token && dispatch(setLogout());
                router.push("/sign-up");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberSection;
