import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { setLogout } from "store";
import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./navbar-popup.module.scss";

const NavbarPopUp = ({ setPopUp, path }) => {
  const router = useRouter();
  const wrapperRef = useRef(null);
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.app);

  useOutsideClickHook(wrapperRef, () => {
    setPopUp(false);
  });

  const handleLogout = () => {
    dispatch(setLogout());
    setPopUp(false);
    if (router.pathname === "/subscription") {
      router.push("/");
    }
  };

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        <span className={style.head}>My Account</span>
        <Link href={role === "employer" ? "/my-profile" : "/profile-overview/profile"}>
          <p onClick={() => setPopUp(false)}>My Profile</p>
        </Link>
        {role === "employer" && (
          <>
            <Link href={"/subscription"}>
              <p onClick={() => setPopUp(false)}>Payments and Subscription</p>
            </Link>
            <Link href={"/referral-code"}>
              <p onClick={() => setPopUp(false)}>Referral Code</p>
            </Link>
          </>
        )}
        <span className={style.logout} onClick={handleLogout}>
          Logout
        </span>
      </div>
    </>
  );
};

export default NavbarPopUp;
