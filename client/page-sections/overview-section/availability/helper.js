import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { availability, profileSectionData } from "api-services/profile";

export const useAvailability = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state?.app);

  const [isLoading, setIsLoading] = useState(false);
  const [resData, setResData] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const body = {
      route: "availabilityInfo",
      ...data,
    };
    setIsLoading(true);
    availability({ data: body, router, setIsLoading, setError });
  };

  useEffect(() => {
    user?.candidateId &&
      profileSectionData({ properties: "availabilityInfo", setResData, id: user?.candidateId });
  }, [user?.candidateId]);

  useEffect(() => {
    resData && reset(resData);
  }, [resData]);

  return { register, handleSubmit, errors, isLoading, onSubmit };
};
