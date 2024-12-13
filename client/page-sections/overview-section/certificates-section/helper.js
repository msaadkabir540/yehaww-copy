import { useEffect, useState } from "react";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import { certifications, profileSectionData } from "api-services/profile";

export const useCertification = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state?.app);

  const [listArr, setListArr] = useState([]);
  const [resData, setResData] = useState({});
  const [isSave, setIsSave] = useState(false);
  const [resetData, setResetData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [disableSave, setDisableSave] = useState(false);
  const [editedElement, setEditedElement] = useState(null);
  const [updateCertification, setUpdateCertification] = useState({});

  const {
    reset,
    watch,
    control,
    setValue,
    register,
    getValues,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addCertificationSchema),
  });

  const submit = async ({ education, certifications: certificates = "" }) => {
    setIsLoading(true);
    const prevUrls = resData.diplomaCertifications.certifications.map((x) => x.url);
    const newUrls = listArr.map((x) => x.url);
    const newList = [...(certificates || listArr)].map((x) => {
      delete x?._id;
      return { ...x, ...(!x.file && { file: "" }) };
    });
    const data = {
      route: "diplomaCertifications",
      diplomaCertifications: {
        education,
        certifications: newList || [],
        filesToDelete: prevUrls.filter((x) => !newUrls.includes(x)),
      },
    };
    setEditedElement(null);
    await certifications({ data, setIsLoading, router });
    profileSectionData({
      properties: "diplomaCertifications",
      setResData,
      id: user?.candidateId,
    });
    if (isSave) {
      router.push("/profile-overview/profile");
      setIsSave(false);
    }
  };

  const handleEdit = (index) => {
    if (editedElement !== null) {
      listArr.push(editedElement);
    }
    setEditedElement(listArr[index]);
    setListArr(listArr.filter((x, i) => i !== index));
    setUpdateCertification(listArr?.filter((x, i) => i === index)[0]);
  };

  useEffect(() => {
    user?.candidateId &&
      profileSectionData({
        properties: "diplomaCertifications",
        setResData,
        id: user?.candidateId,
      });
  }, [user?.candidateId]);

  useEffect(() => {
    if (Object.keys(resData).length) {
      const { education, certifications } = resData?.diplomaCertifications;
      certifications.length && setListArr(certifications);
      education &&
        reset({
          education,
        });
    }
  }, [resData]);

  return {
    watch,
    submit,
    errors,
    listArr,
    control,
    setValue,
    register,
    setIsSave,
    getValues,
    resetData,
    isLoading,
    setListArr,
    handleEdit,
    clearErrors,
    disableSave,
    handleSubmit,
    setIsLoading,
    isSubmitting,
    setResetData,
    setDisableSave,
    updateCertification,
    setUpdateCertification,
  };
};

const addCertificationSchema = yup.object().shape({
  education: yup.string().required(),
});

export const educationList = [
  "Less than high school diploma",
  "High school diploma or GED",
  "Some college, but no degree",
  "Associates Degree (for example: AA, AS)",
  "Bachelor's Degree (for example: BA, BBA, and BS)",
  "Master's Degree (for example: MA, MS, and MEng)",
  "Professional Degree (for example: MD, DDS, JD)",
  "Doctorate (for example: PhD, EdD)",
];
