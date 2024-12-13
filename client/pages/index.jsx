import Head from "next/head";

import Navbar from "components/navbar";
import Container from "components/container";
import JobsSection from "page-sections/home/jobs-section";
import LogosSection from "page-sections/home/logos-section";
import MemberSection from "page-sections/home/become-member";
import HeaderSection from "page-sections/home/header-section";
import LookingRecruit from "page-sections/home/looking-recruit";
import LookingSection from "page-sections/home/looking-section";
import RecruitCarousel from "page-sections/home/recruit-carousel";

import style from "styles/home.module.scss";

const Home = () => {
  return (
    <>
      <Head>
        <title>Home - Yehaww</title>
        <meta
          name="description"
          content="Yehaww was created as a way to connect equestrians all over the world. The site is a first of its kind in the industry and the idea is to have a database with all the members of the equine community in one place. Looking for a job ? We can find you the perfect position for you, based on your skill set and preferences. Looking to hire ? Yehaww can help you find the candidate you have been searching for in just a moment."
        />
        <link rel="icon" href="\assets\imgs\logo.webp" />
        <meta property="og:title" content="Yehaww - Connecting Talent" />
        <meta property="og:image" content="/assets/horses-in-barn.webp" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="280" />
        <meta property="og:image:alt" content="A picture of horses barn" />
      </Head>
      <div className={style.home}>
        <Navbar />
        <Container>
          <HeaderSection />
        </Container>
      </div>
      <Container>
        <JobsSection />
        <LookingSection />
        <LookingRecruit />
      </Container>
      <div style={{ overflow: "hidden" }}>
        <LogosSection />
      </div>
      <RecruitCarousel />
      <MemberSection />
    </>
  );
};

export default Home;
