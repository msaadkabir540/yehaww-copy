import Head from "next/head";

import ReferenceSection from "page-sections/reference-section";

const Reference = () => {
  return (
    <>
      <Head>
        <title>Reference Confirmation - Yehaww</title>
        <meta name="description" content="Here your reference get verified." />
        <link rel="icon" href="\assets\imgs\logo.webp" />
        <meta name="robots" CONTENT="noindex,nofollow" />
      </Head>
      <ReferenceSection />
    </>
  );
};

export default Reference;
