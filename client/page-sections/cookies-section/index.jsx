import Container from "components/container";
import QuestionSection from "./questions";

import HeaderComponent from "components/header-compo";

const CookiesSection = () => {
  return (
    <div>
      <HeaderComponent heading={"Cookie Policy"} />
      <Container>
        <QuestionSection />
      </Container>
    </div>
  );
};

export default CookiesSection;
