/* eslint-disable @next/next/no-img-element */
import Container from "components/container";
import BreadCrumb from "components/bread-crumb";
import HeaderComponent from "components/header-compo";

import style from "./inner-blog.module.scss";

const InnerBlog = ({ children }) => {
  return (
    <div>
      <HeaderComponent heading={"News"} />

      <div className={style.headingDiv}>
        <Container>
          <BreadCrumb
            className={style.breadCrumb}
            containerClass={style.breadCrumbContainer}
            data={navLinks}
          />
          {children}
        </Container>
      </div>
    </div>
  );
};

export default InnerBlog;

export const navLinks = [
  { title: "News", path: "/news", show: false },
  { title: "Inner News", path: "/news/inner-news", show: false },
];
