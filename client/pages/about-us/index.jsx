import Head from "next/head";

import AboutSection from "page-sections/about-us";

const AboutUs = () => {
  return (
    <>
      <Head>
        <title>About - Yehaww</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <AboutSection />
    </>
  );
};

export default AboutUs;