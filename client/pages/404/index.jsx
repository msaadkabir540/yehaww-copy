import { useRouter } from "next/router";
import Head from "next/head";

import Button from "components/button";

import style from "./notFound.module.scss";

const PageNotFound = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>404 - Yehaww</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
        <meta name="robots" CONTENT="noindex,nofollow" />
      </Head>
      <div className={style.main}>
        <p className={style.p}>404</p>
        <div className={style.inner}>
          <p className={style.found}>Page not found</p>
          <p className={style.sorryText}>Sorry, the page you are looking for does not exists!</p>
          <div className={style.btnDiv}>
            <Button title={"Back to homepage"} handleClick={() => router.push("/")} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
