import NewYehaww from "components/new-yehaww";
import AboutContent from "./about-content";
import HeaderSection from "./header-section";
import Container from "components/container";

import { useSelector } from "react-redux";

import style from "./about.module.scss";

const AboutSection = () => {
  const { token } = useSelector((state) => state.app);

  return (
    <>
      <div>
        <HeaderSection />
        <Container className={style.headerParent}>
          <AboutContent />
          {!token && <NewYehaww />}
        </Container>
      </div>
    </>
  );
};

export default AboutSection;
