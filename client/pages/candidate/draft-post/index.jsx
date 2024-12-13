import Head from "next/head";

import FindCandidateWrapper from "page-sections/find-crew";
import DraftPostForm from "page-sections/find-crew/draft-post-form";

const DraftPosts = () => {
  return (
    <div>
      <Head>
        <title>Draft Post - Yehaww</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <FindCandidateWrapper>
        <DraftPostForm />
      </FindCandidateWrapper>
    </div>
  );
};

export default DraftPosts;
