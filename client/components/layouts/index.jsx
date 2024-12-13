import React from "react";
import { useRouter } from "next/router";

import Navbar from "components/navbar";
import Footer from "components/footer";

import style from "./layout.module.scss";

const Layout = ({ children }) => {
  const { pathname } = useRouter();
  return (
    <>
      <div className={style.layoutWrapper}>
        <main>
          {pathname !== "/" && pathname !== "/u/[id]" && <Navbar />}
          <>{children}</>
          {pathname !== "/u/[id]" && <Footer displayPartners={pathname === "/"} />}
        </main>
      </div>
    </>
  );
};

export default Layout;
