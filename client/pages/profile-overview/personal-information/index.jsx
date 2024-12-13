import Head from "next/head";

import OverviewSection from "page-sections/overview-section";
import PersonalInformationSection from "page-sections/overview-section/personal-information";

const PersonalInformation = () => {
  return (
    <>
      <Head>
        <title>Profile - Yehaww</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <OverviewSection>
        <PersonalInformationSection />
      </OverviewSection>
    </>
  );
};

export default PersonalInformation;
