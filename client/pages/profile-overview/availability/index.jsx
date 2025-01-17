import Head from "next/head";

import OverviewSection from "page-sections/overview-section";
import AvailabilitySection from "page-sections/overview-section/availability";

const About = () => {
  return (
    <>
      <Head>
        <title>Profile - Yehaww</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <OverviewSection>
        <AvailabilitySection />
      </OverviewSection>
    </>
  );
};

export default About;
