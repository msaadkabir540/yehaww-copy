import Container from "components/container";
import HeaderComponent from "components/header-compo";
import QuestionSection from "./questions";

import style from "./terms.module.scss";

const TermsSection = () => {
  return (
    <div className={style.parentDiv}>
      <HeaderComponent heading={"Terms & Conditions"} />
      <Container>
        <QuestionSection />
      </Container>
    </div>
  );
};

export default TermsSection;
