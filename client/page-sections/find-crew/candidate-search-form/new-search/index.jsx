/* eslint-disable @next/next/no-img-element */

import style from "./new.module.scss";

const NewSearch = () => {
  return (
    <>
      <div className={style.rightDiv}>
        <h6>New to Search?</h6>
        <div style={{ padding: "15px" }}>
          <p>More about search!</p>
          <ul>
            <li>
              You can search our database as specific or as general as you want in our search
              system.
            </li>
            <li>Start the search by selection what type of position your are hoping to fill.</li>
            <li>
              If you like to be more specific, let us know the availability, location or what level
              of experience you are looking for in a candidate.
            </li>
            <li>
              Yehaww will rank the candidates in the database based on the percentage match of your
              specific needs.
            </li>
            <li>
              Our extensive filters can help you find your perfect candidate and you can create a
              shortlist with all your favourites.
            </li>
            <li>Easy done!</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NewSearch;
