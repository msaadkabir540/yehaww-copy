import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "store";
import style from "./question.module.scss";
import { TrafficLayer } from "@react-google-maps/api";

const AboutContent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.app);
  return (
    <div className={style.main}>
      <h1 style={{ marginTop: "0px" }}>
        Yehaww was created as a way to connect equestrians all over the world. The site is a first
        of its kind in the industry and the idea is to have a database with all the members of the
        equine community in one place. Looking for a job ? We can find the perfect position for you,
        based on your skill set and preferences. Looking to hire ? Yehaww can help you find the
        candidate you have been searching for in just a moment.
      </h1>
      <h1>Only interested in what job offers that is out there.</h1>
      <h1>
        Don’t worry, you can just have a look and decide yourself if you want to be available. The
        goal is to reach out to as many disciplines within the equestrian world as possible,
        connecting riders, trainers, grooms and barn staff.
      </h1>
      <h1>
        {" "}
        Create your profile today and come join us. To post a job or an opportunity please{" "}
        <b
          onClick={() => {
            user.type === "employer" && router.push("/candidate/post-position");
          }}
          className={user.type === "employer" ? style.b : style.hover}
        >
          Click here.
        </b>
      </h1>
      <h1>
        To find your dream job{" "}
        <b
          onClick={() => {
            user.type === "candidate" && router.push("/jobs");
          }}
          className={user.type === "candidate" ? style.b : style.hover}
        >
          Click here.
        </b>
      </h1>
    </div>
  );
};

export default AboutContent;
