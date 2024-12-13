/* eslint-disable @next/next/no-img-element */

import style from "./new.module.scss";

const InterviewQuestions = ({ questions }) => {
  return (
    <div>
      <div className={style.rightDiv}>
        <div className={style.headerInnerDiv}>
          <h6>Interview Questions</h6>
        </div>
        <ul className={style.ul}>
          {questions?.map((ele, index) => (
            <li key={index}>{ele}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InterviewQuestions;
