import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";

import { newPositionArr1 } from "utils/arrayHelper";
import { convertBase64, handleFilterCity } from "utils/helper";
import { addDraft, addJob, getDraft, getJob, updateDraft, updateJob } from "api-services/employer";

let cityUpdateBlocked = false;
export const usePostPosition = () => {
  const router = useRouter();
  const {
    reset,
    watch,
    control,
    setValue,
    register,
    setError,
    getValues,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      job: {
        preferredCandidate: { languages: [{ name: "", fluency: "" }] },
      },
    },
  });

  const imageWatch = watch("job.positionInfo.image");
  const { user } = useSelector((state) => state?.app);

  const [preview, setPreview] = useState();
  const [jobLoader, setJobLoader] = useState(false);
  const [resetCities, setResetCities] = useState({});
  const [homeBaseCity, setHomeBaseCity] = useState([]);
  const [draftLoader, setDraftLoader] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [groupedOptions, setGroupedOptions] = useState([]);
  const [salaryInfoModal, setSalaryInfoModal] = useState(false);
  const [currentlyLocatedCity, setCurrentlyLocatedCity] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "job.preferredCandidate.languages",
  });

  const handleLanguage = (type, index) => {
    if (type === "add") {
      append({ name: "", fluency: "" });
    } else {
      remove(index);
    }
  };

  const onSubmit = async (data, e) => {
    e.preventDefault(); // Prevent the default form submission

    if (data.job) {
      if (!data.job.positionInfo.startDate) {
        data.job.positionInfo.startDate = undefined;
      }

      if (data.job.preferredCandidate.visa.visaType.length < 1) {
        data.job.preferredCandidate.visa.visaType = false;
      }
      delete data?.job?.appliedCandidates;
      data.job.jobCategory = data.job.jobTitle?.split("(")?.[1].replace(")", "");
      data.job.jobTitle = data.job.jobTitle;
      !data.job.positionInfo.competition.name && delete data.job.positionInfo.competition.name;
      !data.job.positionInfo.aboutThePositionOtherLanguage &&
        delete data.job.positionInfo.aboutThePositionOtherLanguage;
      !data.job.positionInfo.aboutThePositionOtherLanguageText &&
        delete data.job.positionInfo.aboutThePositionOtherLanguageText;
      !data?.job?.positionInfo?.homeBase?.address &&
        delete data?.job?.positionInfo?.homeBase?.address;
    }
    if (!data.job.positionInfo.image?.includes?.("https") && data.job.positionInfo.image?.[0]) {
      const fileData = await convertBase64(data.job.positionInfo.image[0]);
      data.job.positionInfo.image = fileData;
    }

    data.job.positionInfo.image =
      data.job.positionInfo.image.length === 0 ? "" : data.job.positionInfo.image;

    const isUpdate = router?.query?.edit;
    const isDraftButton = e.nativeEvent.submitter?.getAttribute("name") === "draftButton";

    if (isDraftButton) {
      data.job.positionInfo.aboutThePosition === "" &&
        delete data.job.positionInfo.aboutThePosition;
      data.job.preferredCandidate.bringOwnDog === "" &&
        delete data.job.preferredCandidate.bringOwnDog;
      data.job.preferredCandidate.availability === "" &&
        delete data.job.preferredCandidate.availability;
      data.job.preferredCandidate.bringOwnHorse === "" &&
        delete data.job.preferredCandidate.bringOwnHorse;
      data.job.preferredCandidate.visa.visaType === false &&
        delete data.job.preferredCandidate.visa.visaType;
      data.job.preferredCandidate.professionalExperience === "" &&
        delete data.job.preferredCandidate.professionalExperience;
      data.job.employmentType === "" && delete data.job.employmentType;
      data.job.positionInfo.liveIn === "" && delete data.job.positionInfo.liveIn;
      data.job.companyInfo.companySize === "" && delete data.job.companyInfo.companySize;
      data.job.companyInfo.numOfHorses === "" && delete data.job.companyInfo.numOfHorses;
      data.job.preferredCandidate.team === "" && delete data.job.preferredCandidate.team;
      data.job.preferredCandidate.team === "" && delete data.job.preferredCandidate.team;
      data.job.preferredCandidate.gender === "" && delete data.job.preferredCandidate.gender;
      data.job.companyInfo.levelOfOperation === "" && delete data.job.companyInfo.levelOfOperation;
      if (
        Array.isArray(data.job.preferredCandidate.nationality) &&
        data.job.preferredCandidate.nationality.length === 0
      ) {
        delete data.job.preferredCandidate.nationality;
      }
      if (
        Array.isArray(data.job.preferredCandidate.candidateCurrentlyBased) &&
        data.job.preferredCandidate.candidateCurrentlyBased.length === 0
      ) {
        delete data.job.preferredCandidate.candidateCurrentlyBased;
      }
    }

    if (isUpdate) {
      if (isDraftButton) {
        if (router?.query?.draft) {
          setDraftLoader(true);
          await updateDraft({ id: router?.query?.id, data, setError, router });
          setDraftLoader(false);
        } else {
          setDraftLoader(true);
          await addDraft({ data, setError, router });
          setDraftLoader(false);
        }
      } else if (router?.query?.draft) {
        setJobLoader(true);
        await addJob({ data, setError, router });
        setJobLoader(false);
      } else {
        setJobLoader(true);
        await updateJob({ id: router?.query?.id, data, setError, router });
        setJobLoader(false);
      }
    } else {
      if (isDraftButton) {
        setDraftLoader(true);
        await addDraft({ data, setError, router });
        setDraftLoader(false);
      } else {
        setJobLoader(true);
        await addJob({ data, setError, router });
        setJobLoader(false);
      }
    }
  };

  const handleDuplicateAddress = async () => {
    cityUpdateBlocked = true;
    const currentlyLocatedCountry = getValues("job.positionInfo.homeBase.country");
    const filteredCities = currentlyLocatedCountry
      ? await handleFilterCity(currentlyLocatedCountry)
      : [];
    setCurrentlyLocatedCity(filteredCities);
    const currentlyLocatedCity = getValues("job.positionInfo.homeBase.city");
    setTimeout(() => {
      currentlyLocatedCountry &&
        setValue("job.positionInfo.currentlyLocated.country", currentlyLocatedCountry);
      currentlyLocatedCity &&
        setValue(
          "job.positionInfo.currentlyLocated.city",
          filteredCities.includes(currentlyLocatedCity) ? currentlyLocatedCity : ""
        );
    }, 20);
  };

  const effect1 = async () => {
    const homeBaseCountry = getValues("job.positionInfo.homeBase.country");
    const filteredCities = homeBaseCountry
      ? await handleFilterCity(homeBaseCountry, setHomeBaseCity)
      : [];
    setHomeBaseCity(filteredCities);
    const homeBaseCity = resetCities.homeBase;
    setTimeout(() => {
      setValue(
        "job.positionInfo.homeBase.city",
        filteredCities.includes(homeBaseCity) ? homeBaseCity : ""
      );
      setResetCities((prev) => {
        return { ...prev, homeBase: "" };
      });
    }, 20);
  };
  const effect2 = async () => {
    const currentlyLocatedCountry = getValues("job.positionInfo.currentlyLocated.country");
    const filteredCities = currentlyLocatedCountry
      ? await handleFilterCity(currentlyLocatedCountry)
      : [];
    setCurrentlyLocatedCity(filteredCities);
    const currentlyLocatedCity = resetCities.currentlyLocated;
    setTimeout(() => {
      !cityUpdateBlocked &&
        setValue(
          "job.positionInfo.currentlyLocated.city",
          filteredCities.includes(currentlyLocatedCity) ? currentlyLocatedCity : ""
        );
      setResetCities((prev) => {
        return { ...prev, currentlyLocated: "" };
      });
      cityUpdateBlocked = false;
    }, 20);
  };

  useEffect(() => {
    const file = watch("job.positionInfo.image")[0];
    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreview(reader.result);
      };
    }
  }, [watch("job.positionInfo.image")]);

  useEffect(() => {
    const companyName = user?.employer?.personalDetails?.companyName;
    if (companyName) setValue("job.companyInfo.companyName", companyName);
  }, [user]);

  useEffect(() => {
    effect1();
  }, [watch("job.positionInfo.homeBase.country")]);

  useEffect(() => {
    effect2();
  }, [watch("job.positionInfo.currentlyLocated.country")]);

  useEffect(() => {
    if (router.isReady && router?.query?.id && (router?.query?.edit || router?.query?.duplicate)) {
      const props = { reset, setResetCities, id: router?.query?.id, setLoading: setPageLoading };
      if (router?.query?.draft) {
        getDraft(props);
      } else {
        getJob(props);
      }
    }
  }, [router]);

  useEffect(() => {
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
  }, []);

  return {
    watch,
    errors,
    fields,
    router,
    control,
    preview,
    setValue,
    onSubmit,
    register,
    jobLoader,
    imageWatch,
    draftLoader,
    pageLoading,
    clearErrors,
    handleSubmit,
    homeBaseCity,
    groupedOptions,
    handleLanguage,
    salaryInfoModal,
    setSalaryInfoModal,
    currentlyLocatedCity,
    handleDuplicateAddress,
  };
};
