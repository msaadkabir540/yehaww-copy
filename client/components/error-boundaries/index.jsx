import React from "react";
import { withRouter } from "next/router";
import Head from "next/head";

import Button from "components/button";

import style from "./errorPage.module.scss";

export default withRouter(
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);

      // Define a state variable to track whether is an error or not
      this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI
      return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
      // You can use your own error logging service here
      console.error({ error, errorInfo });
    }
    render() {
      // const router = useRouter();
      // Check if the error is thrown
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
          <>
            <Head>
              <title>Error - Yehaww</title>
              <meta name="description" content="Oops! Something went wrong" />
              <link rel="icon" href="\assets\imgs\logo.webp" />
            </Head>
            <div className={style.main}>
              <p className={style.p}>ERROR</p>
              <div className={style.inner}>
                <p className={style.found}>Something went wrong</p>
                <div className={style.mainDiv}>
                  <p className={style.sorryText}>
                    Oops, Something broken!! Devs have been notified.
                  </p>
                </div>
                <div className={style.btnDiv}>
                  <Button
                    title={"Back to homepage"}
                    handleClick={() => this.props.router.push("/")}
                  />
                </div>
              </div>
            </div>
          </>
        );
      }

      // Return children components in case of no error

      return this.props.children;
    }
  }
);
