import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { profileSectionData, resume } from "api-services/profile";
import { convertBase64 } from "utils/helper";

export const useResume = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user } = useSelector((state) => state?.app);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [resData, setResData] = useState("");

  const submit = async (data) => {
    if (data.file.length > 0) {
      const fileData = await convertBase64(data.file[0]);
      const body = {
        route: "resume",
        resume: fileData,
      };
      resume({ data: body, router, setIsLoading });
    } else {
      router.push("/profile-overview/profile");
    }
  };

  const deleteResume = async () => {
    const body = {
      route: "resume",
      resume: "",
    };
    await resume({ data: body, router, setIsLoading });
    setResData("");
  };

  useEffect(() => {
    user?.candidateId &&
      profileSectionData({ properties: "resume", setResData, id: user?.candidateId });
  }, [user?.candidateId]);

  return { handleSubmit, deleteResume, resData, isLoading, register, errors, submit };
};

const schema = yup.object().shape({
  file: yup
    .mixed()
    .test("required", "Please select a file.", (value) => {
      return value && value.length;
    })
    .test("fileSize", "The file size is too large.", (file) => {
      return file && file?.[0]?.size <= 2000000;
    })
    .test("is-big-file", "Only PDF document allowed.", (files) => {
      let valid = true;
      if (!["application/pdf"].includes(files?.[0]?.type)) {
        valid = false;
      }
      return valid;
    }),
});
