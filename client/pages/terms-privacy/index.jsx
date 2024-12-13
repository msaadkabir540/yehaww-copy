import Head from "next/head";

import TermsPrivacy from "page-sections/terms-section";

const TermsAndConditions = () => {
  return (
    <>
      <Head>
        <title>Term and Condition - Yehaww</title>
        <meta
          name="description"
          content="Here you can go through our terms and privacy policies."
        />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <TermsPrivacy />
    </>
  );
};

export default TermsAndConditions;
