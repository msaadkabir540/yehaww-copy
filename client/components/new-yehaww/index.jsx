/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import Button from "components/button";

import style from "./new.module.scss";

const NewYehaww = ({ para1, para2, para3 }) => {
  return (
    <div>
      <div className={style.rightDiv}>
        <h6>First time on Yehaww.com?</h6>
        <div>
          <p>
            {para1
              ? para1
              : " You can access the Yehaww database, with staff profiles and available positions even if you don’t have an account on the website. However if you want to show interest in a  position, advertise a job or just get the latest updates you can easily create a Yehaww account for free."}
          </p>
          <p>
            {para2
              ? para2
              : "As an employer we can offer you a paid subscription to our “Yehaww connect” account to  find the staff that you are looking for."}
          </p>
          <p>
            {para3
              ? para3
              : "Click the button below and find out what Yehaww can do for you, whether you are an  employer looking for staff or a talent looking for your next dream job."}
          </p>
          <Link href="/sign-up">
            <a className={style.link}>
              <Button title="Free Sign Up" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewYehaww;
