import Container from "components/container";
import QuestionSection from "./questions";

import style from "./privacy.module.scss";
import HeaderComponent from "components/header-compo";

const PrivacySection = () => {
  return (
    <div style={{ minHeight: "calc(100vh - 251px)" }}>
      <HeaderComponent heading={"Privacy Policy"} />
      <Container className={style.bodyWrapper}>
        <QuestionSection />
      </Container>
    </div>
  );
};

export default PrivacySection;
