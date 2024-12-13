import moment from "moment";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import createNotification from "common/create-notification";
import { experience, profileSectionData } from "api-services/profile";

export const useExperience = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state?.app);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitBtn, setSubmitBtn] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [experienceData, setExperienceData] = useState({});
  const [experienceWatch, setExperienceWatch] = useState({});
  const [updateExperienceData, setUpdateExperienceData] = useState(false);

  const {
    reset,
    watch,
    control,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(experienceSchema),
    defaultValues: {
      experience: {
        professionalEquineExperience: {
          name: "Professional Equine Experience",
          duration: "",
        },
        generalExperience: General_Experience.map((name) => {
          return {
            name,
            duration: "",
          };
        }),
        experienceLevel: experienceLevels.map((name) => {
          return {
            name,
            experienceLevel: "None",
            experienceType: "Professional",
          };
        }),
      },
    },
  });

  const { fields: generalExperienceFields } = useFieldArray({
    control,
    name: "experience.generalExperience",
  });

  const { fields: experienceLevelFields } = useFieldArray({
    control,
    name: "experience.experienceLevel",
  });

  const {
    fields: experiencesFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "experience.experiences",
  });

  const onSubmit = async (data) => {
    const generalExperience = data.experience.generalExperience.filter((x) => x.duration !== "");
    if (data?.experience?.professionalEquineExperience?.duration) {
      const firstEle = {
        name: "Professional Equine Experience",
        duration: data?.experience?.professionalEquineExperience?.duration,
      };
      generalExperience?.unshift(firstEle);
    }
    const experienceLevel = data.experience.experienceLevel.filter(
      (x) => x.experienceLevel !== "None"
    );
    const noPreviousExperience = data.experience.noPreviousExperience || false;
    delete data.experience.noPreviousExperience;

    const experiences =
      data.experience.experiences.map((exp) => {
        const formattedExp = { ...exp };
        if (exp.startDate) {
          formattedExp.startDate = moment(exp.startDate).format("YYYY-MM-DD");
        }
        if (exp.endDate) {
          formattedExp.endDate = moment(exp.endDate).format("YYYY-MM-DD");
        }
        delete formattedExp.id;
        return formattedExp;
      }) || [];

    const body = {
      route: "experience",
      experience: {
        professionalEquineExperience: {
          duration: data?.experience?.professionalEquineExperience?.duration,
        },
        generalExperience,
        noPreviousExperience,
        experienceLevel,
        experiences,
      },
    };
    if (data.experience.experiences.length > 0 && submitBtn) {
      await experience({ body, router, setLoading, setError });
      setSubmitBtn(false);
    } else if (data.experience.experiences.length === 0) {
      createNotification("error", "Add one Experience Atleast");
    }
  };

  // const handleBtnSelect = (text, title) => {
  //   const updatedGeneralExperience = [...watch().experience.generalExperience];
  //   const experienceIndex = updatedGeneralExperience.findIndex((exp) => exp.name === title);

  //   if (experienceIndex !== -1) {
  //     updatedGeneralExperience[experienceIndex].duration = text;
  //     setValue("experience.generalExperience", updatedGeneralExperience);
  //   }
  // };

  useEffect(() => {
    user?.candidateId &&
      profileSectionData({
        properties: "experience",
        setResData: (experienceData) => {
          setExperiences(experienceData.experience.experiences);
          reset({
            experience: {
              noPreviousExperience: experienceData?.experience.noPreviousExperience,
              professionalEquineExperience: {
                name: experienceData?.experience?.generalExperience[0]?.name,
                duration: experienceData?.experience?.generalExperience[0]?.duration,
              },
              generalExperience: General_Experience.map((name) => {
                const currentGeneralExperience = experienceData.experience.generalExperience
                  .slice(1)
                  .filter((x) => x.name === name);
                return {
                  name,
                  duration: currentGeneralExperience.length
                    ? currentGeneralExperience[0].duration
                    : "",
                };
              }),
              experienceLevel: experienceLevels.map((name) => {
                const currentExperienceLevel = experienceData.experience.experienceLevel.filter(
                  (x) => x.name === name
                );
                return {
                  name,
                  experienceLevel: currentExperienceLevel.length
                    ? currentExperienceLevel[0].experienceLevel
                    : "None",
                  experienceType: currentExperienceLevel.length
                    ? currentExperienceLevel[0].experienceType
                    : "Professional",
                };
              }),
              experiences: experienceData?.experience?.experiences.map((x) => {
                delete x?._id;
                return x;
              }),
            },
          });
          setExperienceData(experienceData);
        },
        id: user?.candidateId,
      });
  }, [user?.candidateId]);

  return {
    watch,
    errors,
    append,
    remove,
    control,
    loading,
    register,
    setValue,
    onSubmit,
    modalOpen,
    durations,
    clearErrors,
    experiences,
    isSubmitting,
    setModalOpen,
    handleSubmit,
    setSubmitBtn,
    setExperiences,
    experienceData,
    // handleBtnSelect,
    experienceWatch,
    experienceTypes,
    experienceLevels,
    calculateDuration,
    experiencesFields,
    setExperienceWatch,
    updateExperienceData,
    experienceLevelFields,
    experienceLevelOptions,
    setUpdateExperienceData,
    generalExperienceFields,
  };
};

const experienceSchema = yup.object().shape({
  experience: yup.object().shape({
    professionalEquineExperience: yup
      .object()
      .shape({
        duration: yup.string().required("Professional Equine Experience is required"),
      })
      .required(),
  }),
});

const durations = [
  "0 - 6 months",
  "0.5 - 1 year",
  "1 - 2 years",
  "2 - 5 years",
  "5+ years",
  "10+ years",
];

export const General_Experience = [
  "Sale & Marketing",
  "Financial Accounting",
  "Equine Consulting",
  "Project Management",
  "Technology (IT)",
  "Human resources & Payroll (HR)",
  "Legal",
  "Staff Training",
  "Insurance",
  "Investigation",
  "Administrative",
  "Horse Broker",
  "Equine Real Estate Agent",
  "Technical & Compliance",
];

const experienceLevelOptions = ["None", "Little", "Some", "Considerable", "Extensive"];

const experienceTypes = ["Professional", "Amateur", "Hobby"];

const experienceLevels = [
  "Dressage",
  "Endurance",
  "Eventing",
  "Jumping",
  "Para-Equestrian",
  "Reining",
  "Vaulting",
  "English pleasure",
  "Carriage Driving",
  "Hunter",
  "Hunter/Jumping seat Equitation",
  "Parade Horse",
  "Polo",
  "Racing",
  "Western",
  "Western Dressage",
  "Western/Reining Seat Equitation",
  "Barn & facility Manager",
  "Equine Therapist",
  "Equine Dental Technician",
  "Equine Nutritionist",
  "Equine Rehabilitation Therapist",
  "Equine Veterinarian",
  "Equine Veterinarian Technician",
  "Broodmare Manager",
  "Riding Instructor",
  "Judge",
  "Show Jumping Course Designer",
  "Blacksmith/Farrier",
  "Exercise Rider",
  "Show Preparation",
  "Farm or Ranch Manager",
  "Equine Association Staff Member",
  "Equine Insurance Agent",
  "Equine Product Sales Representative",
  "Show Manager",
  "Event/Competition Promoter",
  "Clipping",
  "Children's Camp",
  "Foal Weaning",
  "Horse Transport",
  "Riding School",
  "Saddlery / Tack Store",
  "Stallion Service",
  "Trail Riding / Trekking Center",
  "Training Film / Movie",
  "Photography",
];

const calculateDuration = (data) => {
  const { startDate, endDate } = data;
  const formatDate = (date) => moment(new Date(date)).format("Do MMMM YYYY");
  const a = moment(endDate ? new Date(endDate) : new Date());
  const b = moment(new Date(startDate));
  const years = a.diff(b, "year");
  b.add(years, "years");
  const months = a.diff(b, "months");
  b.add(months, "months");
  const days = a.diff(b, "days");
  // creates duration is this format (8 years 5 months 2 days)
  const duration = `(${years ? `${years} year${years > 1 ? "s" : ""}` : ""}${
    months ? `${months} month${months > 1 ? "s" : ""}` : ""
  }${years ? "" : days ? " " : ""}${years ? "" : days ? `${days} day${days > 1 ? "s" : ""}` : ""})`;
  return {
    ...data,
    startDate: formatDate(startDate),
    endDate: endDate ? formatDate(endDate) : false,
    duration,
  };
};
