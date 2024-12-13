import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

import { getUserProfile } from "api-services/profile";
import { updateShortlistCandidates } from "api-services/employer";

export const useProfile = () => {
  const router = useRouter();
  const { id, jobId, email: candidateEmail } = router.query;

  const componentRef = useRef();
  const { token, user } = useSelector((state) => state?.app);

  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [print, setPrint] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoLink, setVideoLink] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const onPrint = () => {
    setPrint(true);
    setTimeout(() => {
      handlePrint();
    }, 100);
    setTimeout(() => {
      setPrint(false);
    }, 1000);
  };

  const handleShortlistCandidates = async (status) => {
    status === "true" ? setLoading("shortlist") : setLoading("notInterested");
    await updateShortlistCandidates({
      data: {
        jobId: router.query.jobId,
        userId: profile.userId,
        interestedStatus: status,
      },
    });
    setLoading(false);
    id !== undefined &&
      getUserProfile({ id, jobId, email: candidateEmail, setIsLoading, setProfile });
  };

  useEffect(() => {
    id !== undefined &&
      getUserProfile({ id, jobId, email: candidateEmail, setIsLoading, setProfile });
  }, [id]);

  const nav_links = [
    { title: "Profile", path: "/profile-overview/profile", show: false },
    {
      title: "Personal & Team",
      path: "personal",
      show: true,
    },
    {
      title: "Languages",
      path: "language",
      show: true,
    },
    {
      title: "Availability",
      path: "available",
      show: true,
    },
    {
      title: "About & Hobbies",
      path: "about",
      show: true,
    },
    {
      title: "Experience & Qualification",
      path: "experience",
      show: true,
    },
    {
      title: "Skills",
      path: "skill",
      show: true,
    },
    {
      title: "Passport & Visas",
      path: "visa",
      show: true,
    },
    {
      title: "Downloads",
      path: "download",
      show: true,
    },
  ];

  return {
    id,
    open,
    user,
    token,
    print,
    jobId,
    hover,
    router,
    onPrint,
    setOpen,
    profile,
    loading,
    setHover,
    isLoading,
    videoLink,
    nav_links,
    componentRef,
    setVideoLink,
    candidateEmail,
    handleShortlistCandidates,
  };
};
