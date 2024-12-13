import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { about_me, profileSectionData } from "api-services/profile";

export const useAbout = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state?.app);

  const [resData, setResData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    reset,
    watch,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ aboutMe }) => {
    const body = {
      route: "aboutMe",
      aboutMe,
    };
    about_me({ data: body, router, setIsLoading, setError });
  };

  useEffect(() => {
    user?.candidateId &&
      profileSectionData({
        properties: "aboutMe",
        setResData,
        id: user?.candidateId,
      });
  }, [user?.candidateId]);

  useEffect(() => {
    if (resData) {
      reset(resData);
    }
  }, [resData]);

  return { router, isLoading, setIsLoading, register, handleSubmit, errors, watch, onSubmit };
};
