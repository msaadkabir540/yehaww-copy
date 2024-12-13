/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/button";

import { setLogout } from "store";

import style from "./looking-recruit.module.scss";

const LookingRecruit = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.app);
  const isToken = typeof window !== "undefined" && window.localStorage.getItem("token") && true;

  return (
    <>
      <div className={style.parent_div}>
        <div className={style.grid}>
          <div className={style.left_sec}>
            <div style={{ width: "100%", overflowX: "hidden" }}>
              <h2>Are you hiring?</h2>
              <p>
                The “Yehaww connect “ account gives you access to our database of talented
                equestrian personnel all over the world and throughout the whole equine industry.
                Advertise your available position and start your search. The “Yehaww connect“
                account will help you pinpoint the person most fitted for the job. By giving you a
                list of all the people in the database that are best suited for what YOU are looking
                for, provide you with contact details, you can begin strengthening your team.
              </p>
              <div className={style.btn_sec}>
                <Link href="sign-up">
                  <Button
                    title={"Set Up Your Free Account "}
                    className={isToken ? style.disable : style.btn2}
                    disabled={isToken}
                    handleClick={() => {
                      user.type && dispatch(setLogout());
                      router.push("/sign-up/employer");
                    }}
                  />
                </Link>
                <Button
                  title={"View Subscription Options "}
                  className={style.btn2}
                  handleClick={() => {
                    user.type === "candidate" && dispatch(setLogout());
                    router.push("/subscription");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LookingRecruit;
