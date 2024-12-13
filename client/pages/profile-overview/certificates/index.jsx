import Head from "next/head";

import OverviewSection from "page-sections/overview-section";
import CertificationSection from "page-sections/overview-section/certificates-section";

const Overview = () => {
  return (
    <>
      <Head>
        <title>Profile - Yehaww</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <OverviewSection>
        <CertificationSection />
      </OverviewSection>
    </>
  );
};

export default Overview;