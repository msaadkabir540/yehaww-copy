import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import useWindowDimensions from "utils/useDimension-hook";

export const useNavbar = () => {
  const router = useRouter();
  const { pathname } = useRouter();
  const { width } = useWindowDimensions();
  const { token, user, appLoader } = useSelector((state) => state?.app);

  const [popUp, setPopUp] = useState(false);
  const [popUpJob, setPopUpJob] = useState(false);
  const [browse, setBrowse] = useState(false);

  const [popUpMore, setPopUpMore] = useState(false);
  const [popUpCandidate, setPopUpCandidate] = useState(false);
  const [mobilePopUpJob, setMobilePopUpJob] = useState(false);
  const [mobileBrowse, setMobileBrowse] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  const [mobilePopUpMore, setMobilePopUpMore] = useState(false);
  const [mobilePopUpCandidate, setMobilePopUpCandidate] = useState(false);

  const handleClick = (type) => {
    const mobile = width < 1188;
    type === "job" ? (mobile ? setMobilePopUpJob(true) : setPopUpJob(true)) : "";
    type === "find" ? (mobile ? setMobilePopUpCandidate(true) : setPopUpCandidate(true)) : "";
    type === "positions" ? (mobile ? setMobileBrowse(true) : setBrowse(true)) : "";
    type === "more" ? (mobile ? setMobilePopUpMore(true) : setPopUpMore(true)) : "";
  };

  const handleClickBlackFriday = () => {
    router.push("/subscription?couponCode=BLACKFRIDAY");
  };

  const navLink = [
    {
      name: "Find Candidates",
      pathMatch: "find",
      path: "/find-candidate",
      click: () => {
        handleClick("find");
        setOpenSidebar(false);
      },
    },
    {
      name: "Jobs",
      path: "/jobs",
      pathMatch: "job",
      click: () => {
        handleClick("job");
        setOpenSidebar(false);
      },
    },
    { name: "Videos", path: "/videos", pathMatch: "video" },
    // {
    //   name: "Positions",
    //   path: "/position",
    //   pathMatch: "positions",
    //   click: () => {
    //     handleClick("positions");
    //     setOpenSidebar(false);
    //   },
    // },
    {
      name: "News",
      path: "/news",
      pathMatch: "news",
      click: () => {
        router.push("/news");
      },
    },
    {
      name: "More",
      path: "/more",
      pathMatch: "subscription",
      click: () => {
        handleClick("more");
        setOpenSidebar(false);
      },
    },
  ];

  return {
    user,
    popUp,
    token,
    browse,
    navLink,
    pathname,
    popUpJob,
    setPopUp,
    appLoader,
    popUpMore,
    setBrowse,
    openSidebar,
    setPopUpJob,
    handleClick,
    mobileBrowse,
    setPopUpMore,
    popUpCandidate,
    mobilePopUpJob,
    setOpenSidebar,
    setMobileBrowse,
    mobilePopUpMore,
    setPopUpCandidate,
    setMobilePopUpJob,
    setMobilePopUpMore,
    mobilePopUpCandidate,
    handleClickBlackFriday,
    setMobilePopUpCandidate,
  };
};
