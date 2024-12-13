import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { profileSectionData, qualificationSkills } from "api-services/profile";

export const useQualificationSkills = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state?.app);

  const [isLoading, setIsLoading] = useState(false);
  const [resData, setResData] = useState({});

  const { register, handleSubmit, reset } = useForm();

  const submit = (data) => {
    const licenses = {};
    const skills = {};
    for (const [key, value] of Object.entries(data)) {
      if (
        key === "driverLicense" ||
        key === "BLicense" ||
        key === "BELicense" ||
        key === "HGV" ||
        key === "code95" ||
        key === "HGVAndTrailer"
      ) {
        licenses[key] = value;
      } else {
        skills[key] = value;
      }
    }
    const body = {
      route: "skillsDriverLicense",
      skillsDriverLicense: {
        licenses,
        skills,
      },
    };
    qualificationSkills({ data: body, setIsLoading, router });
  };

  useEffect(() => {
    user?.candidateId &&
      profileSectionData({ properties: "skillsDriverLicense", setResData, id: user?.candidateId });
  }, [user?.candidateId]);

  useEffect(() => {
    const resetForm = {};
    resData
      ? (resetForm = {
          ...resData?.skillsDriverLicense?.licenses,
          ...resData?.skillsDriverLicense?.skills,
        })
      : (resetForm = {});
    reset(resetForm);
  }, [resData]);

  return { register, handleSubmit, submit, isLoading };
};

export const qualificationSkillForm = [
  {
    title: "Driver License",
    field: [
      {
        label: "B License ( Car License )",
        name: "BLicense",
        option: ["No", "Yes"],
      },
      {
        label: "BE License ( Car + Trailer )",
        name: "BELicense",
        option: ["No", "Yes"],
      },
      {
        label: "HGV (Truck)",
        name: "HGV",
        option: ["No", "Yes"],
      },
      {
        label: "HGV and Trailer",
        name: "HGVAndTrailer",
        option: ["No", "Yes"],
      },
      {
        label: "code95",
        name: "code95",
        option: ["No", "Yes"],
      },
    ],
  },
  {
    title: "Skills",
    field: [
      {
        label: "Clipping",
        name: "clipping",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Longing",
        name: "longing",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Long Reining",
        name: "longReining",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Handling Stallion",
        name: "handlingStallion",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Handling Young Horses",
        name: "handlingYoungHorses",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Exercise Riding",
        name: "exerciseRiding",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Hacking",
        name: "hacking",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Breaking In",
        name: "breakingIn",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "FEI Experience",
        name: "FEIExperience",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Teaching",
        name: "teaching",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Braiding",
        name: "braiding",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Bandaging",
        name: "bandaging",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Carriage Driving",
        name: "carriageDriving",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Jump School",
        name: "jumpSchool",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Course Building",
        name: "courseBuilding",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Barn Management",
        name: "barnManagement",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Event Management",
        name: "eventManagement",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Equine FirstAid",
        name: "equineFirstAid",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Travel With Horses",
        name: "travelWithHorses",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Logistics Planning",
        name: "logisticsPlanning",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Transporting Horses",
        name: "transportingHorses",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Entries",
        name: "entries",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "EquinePaperwork",
        name: "equinePaperwork",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Championship",
        name: "championship",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Sales",
        name: "sales",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "ComputerSkills",
        name: "computerSkills",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "Marketing",
        name: "marketing",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
      {
        label: "SocialMedia",
        name: "socialMedia",
        option: ["None", "Novice", "Experienced", "Very Good", "Proficient"],
      },
    ],
  },
];
