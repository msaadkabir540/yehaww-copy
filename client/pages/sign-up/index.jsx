import Head from "next/head";

import Container from "components/container";
import CandidateCard from "./candidate-card";

import style from "styles/signup.module.scss";

const SignUp = () => {
  return (
    <>
      <Head>
        <title>Sign Up - Yehaww</title>
        <meta name="description" content="You can Sign Up as a candidate and employer." />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <div className={style.loginMain}>
        <div className={style.bgImage}>
          <Container>
            <h1>Sign Up Option</h1>
            <p className={style.loginPara}>
              Yehaww have different options of account depending who you are. Choose what specific
              membership matches what you are looking for, sign up today and find out what we have
              available on the website.
            </p>
          </Container>
        </div>
        <Container>
          <CandidateCard />
        </Container>
      </div>
    </>
  );
};

export default SignUp;
