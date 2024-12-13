import QuestionSection from "./questions";
import Container from "components/container";

import { useSelector } from "react-redux";

import style from "./faq.module.scss";
import NewYehaww from "components/new-yehaww";
import HeaderComponent from "components/header-compo";

const FaqSection = () => {
  const { token } = useSelector((state) => state.app);

  return (
    <div>
      <HeaderComponent heading={"Frequently Asked Questions"} />
      <Container className={style.headerParent}>
        <QuestionSection />
        {!token && (
          <div style={{ margin: "15px 0px" }}>
            <NewYehaww
              para1=" New in the Equestrian industry, but already trusted Being members of the community
              ourselves already, we are only striving for improvement."
              para2="Yehaww is there to build a stronger, more trusted and more safe industry."
              para3="We are all working towards the same goal!"
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export default FaqSection;
