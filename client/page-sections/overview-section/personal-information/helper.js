import { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";

import {
  clearPartnerEmail,
  profileSectionData,
  personalInformation,
  requestPartnerVerification,
} from "api-services/profile";
import { newPositionArr1 } from "utils/arrayHelper";
import { getUserByToken } from "api-services/auth";

export const usePersonalInfo = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state?.app);

  const [resData, setResData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAddPassport, setIsAddPassport] = useState(true);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [groupedOptions, setGroupedOptions] = useState([]);
  const customHeight = {
    height: "max-content",
    minHeight: "43px",
    marginTop: "5px",
    border: "1px solid #c0c0c0",
  };

  const {
    reset,
    watch,
    control,
    setValue,
    setError,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      personalInfo: {
        passportVisaInformation: { passports: [{ issuerCountry: "", expiry: "" }] },
        languages: [{ name: "", fluency: "" }],
        teamStatus: { requestedPartnerVerification: false },
      },
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "personalInfo.passportVisaInformation.passports",
  });

  const {
    fields: languageFields,
    append: languageAppend,
    remove: languageRemove,
  } = useFieldArray({
    control,
    name: "personalInfo.languages",
  });

  const submit = async (data) => {
    data.route = "personalInfo";

    const dateOfBirth = moment(data?.personalInfo?.personalInformation?.dateOfBirth).format(
      "YYYY-MM-DD"
    );
    dateOfBirth && (data.personalInfo.personalInformation.dateOfBirth = dateOfBirth);

    const passports = data?.personalInfo?.passportVisaInformation?.passports;
    if (passports) {
      passports.forEach((passport) => {
        const expiryDate = moment(passport.expiry).format("YYYY-MM-DD");
        expiryDate && (passport.expiry = expiryDate);
      });
    }

    delete data?.personalInfo?.teamStatus?.partnerEmailVerified;
    await personalInformation({ data, router, setIsLoading, setError });
    await getUserByToken({ dispatch, router });
  };

  const handleAddPassport = () => {
    if (isAddPassport) {
      append({ issuerCountry: "", expiry: "" });
      setIsAddPassport(false);
    } else {
      remove(1);
      setIsAddPassport(true);
    }
  };

  const handleAddLanguage = () => {
    languageAppend({ name: "", fluency: "" });
  };
  const handleRemoveLanguage = () => {
    languageFields.length > 1 && languageRemove(languageFields.length - 1);
  };

  const handleVerifyPartnerEmail = async () => {
    setVerifyLoading(true);
    clearErrors("personalInfo.teamStatus.partnerEmail");
    const partnerEmail = watch("personalInfo.teamStatus.partnerEmail");
    await requestPartnerVerification({
      params: {
        partnerEmail,
      },
      setValue,
      setError,
    });
    setVerifyLoading(false);
  };

  const handleCancelVerification = async () => {
    await clearPartnerEmail();
    user?.candidateId &&
      (await profileSectionData({ properties: "personalInfo", setResData, id: user?.candidateId }));
  };

  useEffect(() => {
    user?.candidateId &&
      profileSectionData({ properties: "personalInfo", setResData, id: user?.candidateId });
  }, [user?.candidateId]);

  useEffect(() => {
    if (resData) {
      if (resData.personalInfo) {
        resData.personalInfo.languages.length
          ? resData.personalInfo.languages.map((ele) => {
              delete ele._id;
            })
          : (resData.personalInfo.languages = [{ name: "", fluency: "" }]);
        resData.personalInfo.personalInformation.dateOfBirth &&
          (resData.personalInfo.personalInformation.dateOfBirth = resData.personalInfo
            .personalInformation.dateOfBirth
            ? new Date(resData?.personalInfo?.personalInformation?.dateOfBirth)
            : null);
        resData.personalInfo.passportVisaInformation.passports.length
          ? (resData.personalInfo.passportVisaInformation.passports =
              resData?.personalInfo?.passportVisaInformation?.passports?.map((ele) => {
                delete ele._id;
                return {
                  issuerCountry: ele.issuerCountry,
                  expiry: ele.expiry ? new Date(ele.expiry) : null,
                };
              }))
          : (resData.personalInfo.passportVisaInformation.passports = [
              {
                issuerCountry: "",
                expiry: "",
              },
            ]);
        if (resData?.personalInfo?.teamStatus?.partnerEmail) {
          resData.personalInfo.teamStatus.partnerEmailVerified = true;
        }
      }

      delete resData?._id;
      reset(resData);
    }
    const categories = newPositionArr1.filter((x) => x.includes("+"));
    const positions = newPositionArr1.filter((x) => !x.includes("+"));
    const groupedOptionsArr = categories.map((category) => {
      const currentCategory = category.replace("+", "");
      return {
        label: currentCategory,
        options: positions
          .filter((position) => position.includes(currentCategory))
          .map((x) => {
            const value = `${x.split("-")[0]} (${x.split("-")[1]})`;
            return { label: x.split("-")[0], value, value };
          }),
      };
    });
    setGroupedOptions(groupedOptionsArr);
  }, [resData]);

  useEffect(() => {
    !watch(`personalInfo.passportVisaInformation.visa`)?.includes?.("Other Visa") &&
      setValue("personalInfo.passportVisaInformation.otherVisa", undefined);
  }, [watch(`personalInfo.passportVisaInformation.visa`)?.includes?.("Other Visa")]);

  return {
    fields,
    watch,
    errors,
    submit,
    control,
    resData,
    register,
    setValue,
    isLoading,
    clearErrors,
    customHeight,
    handleSubmit,
    isAddPassport,
    verifyLoading,
    languageFields,
    groupedOptions,
    handleAddPassport,
    handleAddLanguage,
    handleRemoveLanguage,
    handleVerifyPartnerEmail,
    handleCancelVerification,
  };
};
