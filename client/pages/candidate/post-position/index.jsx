import Head from "next/head";

import FindCandidateWrapper from "page-sections/find-crew";
import PostPage from "page-sections/find-crew/post-position";

const PostPosition = () => {
  return (
    <div>
      <Head>
        <title>Post Position - Yehaww</title>
        <meta
          name="description"
          content="Post the position and find the right candidates for the job."
        />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <FindCandidateWrapper>
        <PostPage />
      </FindCandidateWrapper>
    </div>
  );
};

export default PostPosition;
