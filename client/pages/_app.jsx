import axios from "axios";
import { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import Layout from "components/layouts";

import { wrapper } from "store";
import { getUserByToken } from "api-services/auth";
import { candidateRoutes, employerRoutes, publicRoutes } from "../helpers/home-helper";

import "styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-circular-progressbar/dist/styles.css";
import ErrorBoundary from "components/error-boundaries";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pathname, push } = router;

  const { role, token, user } = useSelector((state) => state.app);

  useEffect(() => {
    axios.defaults.headers.Authorization = localStorage.getItem("token") || token;
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    sideEffect();
  }, [role, pathname]);

  useEffect(async () => {
    if (router.isReady) {
      !user.type && token && (await getUserByToken({ router, dispatch }));
    }
  }, [router, token]);

  const sideEffect = async () => {
    if (!role) {
      !publicRoutes.includes(pathname) && push("/");
    } else if (role === "candidate") {
      !candidateRoutes.includes(pathname) && push("/");
    } else if (role === "employer") {
      !employerRoutes.includes(pathname) && push("/");
    }
  };

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-6P34VW9R6Z"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-6P34VW9R6Z');
        `}
      </Script>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
      ></Script>

      <ErrorBoundary>
        <ToastContainer />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ErrorBoundary>
    </>
  );
};

export default wrapper.withRedux(MyApp);
