import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { myUpload, profileSectionData } from "api-services/profile";
import { getUserByToken } from "api-services/auth";

export const useMyUpload = () => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const imageWatch = watch("mainPhoto");
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.app);

  const [preview, setPreview] = useState();
  const [resData, setResData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (data) => {
    let totalLength = 0;
    ["additionalFiles", "mainPhoto", "partnerCV", "video"].forEach((x) => {
      totalLength += data[x].length;
    });
    // if (totalLength) {
    const formData = new FormData();
    delete data["mainPhotoUrl"];
    formData.append("route", "uploads");
    for (const key in data) {
      data[key][0] && formData.append(key, data[key][0]);
      // }
    }
    await myUpload({ data: formData, router, setIsLoading });
    await getUserByToken({ dispatch, router });
  };

  const deleteUpload = async (url) => {
    const body = {
      route: "uploads",
      uploads: {
        filesToDelete: [url],
      },
    };
    await myUpload({ data: body, setIsLoading });
    await getUserByToken({ dispatch, router });
    window.location.reload();
  };

  useEffect(() => {
    const file = watch("mainPhoto")[0];
    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreview(reader.result);
      };
    }
  }, [watch("mainPhoto")]);

  useEffect(() => {
    user?.candidateId &&
      profileSectionData({
        setResData,
        properties: "uploads",
        id: user?.candidateId,
      });
  }, [user?.candidateId]);

  useEffect(() => {
    if (resData)
      reset({
        mainPhotoUrl: resData?.uploads?.mainPhoto || "",
      });
  }, [resData]);

  return {
    handleSubmit,
    resData,
    isLoading,
    register,
    setValue,
    setPreview,
    deleteUpload,
    errors,
    submit,
    preview,
    imageWatch,
  };
};

const schema = yup.object().shape({
  mainPhoto: yup
    .mixed()
    .when("mainPhotoUrl", {
      is: true,
      then: yup.mixed().test("required", "please select a file", (value) => {
        return value && value.length;
      }),
    })
    .test("fileSize", "The file is too large, should not be greater than 3MB", (file) => {
      return file[0] ? file[0]?.size <= 3000000 : true;
    }),
  video: yup.mixed().test("fileSize", "The file is too large", (file) => {
    return file[0] ? file[0]?.size <= 10000000 : true;
  }),
  partnerCV: yup.mixed().test("fileSize", "The file is too large", (file) => {
    return file[0] ? file[0]?.size <= 3000000 : true;
  }),
  additionalFiles: yup.mixed().test("fileSize", "The file is too large", (file) => {
    return file[0] ? file[0]?.size <= 3000000 : true;
  }),
});

export const uploadFileInput = [
  {
    title: "Profile picture",
    inputName: "mainPhoto",
    accept: "image/png, image/jpeg, image/jpg",
    label: "Upload File (mandatory)",
    infoText: "File size limit is 3MB. File must be in png, jpeg or jpg formats.",
  },
  {
    title: "Video",
    inputName: "video",
    accept: "video/mp4,video/x-m4v,video/*",
    label: "Upload File (optional)",
    infoText: "File size limit is 3MB. File must be in any video format.",
  },
  {
    title: "Team/Partner CV",
    inputName: "partnerCV",
    accept: "application/pdf",
    label: "Upload File (optional)",
    infoText: "File size limit is 3MB. File must be in PDF format.",
  },
  {
    title: "Additional Files",
    inputName: "additionalFiles",
    label: "Upload File (optional)",
    infoText: "File size limit is 3MB.",
  },
];
