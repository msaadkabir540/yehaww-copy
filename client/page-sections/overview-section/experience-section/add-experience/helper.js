import moment from "moment";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { experience } from "api-services/profile";

export const useAddExperience = ({
  append,
  handleClose,
  watchExperience,
  onSubmitExperience,
  updateExperienceData,
  setUpdateExperienceData,
}) => {
  const {
    watch,
    reset,
    control,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addExperienceSchema),
  });

  const onSubmit = async (data) => {
    if (!data.stillEmployed && !moment(data.startDate).isBefore(data.endDate)) {
      setError("endDate", { message: "End Date must be greater than Start Date" });
    } else {
      data?.stillEmployed && delete data?.endDate;
      append(data);
      setUpdateExperienceData(false);
      reset(experienceInitial);
      handleClose(false);
    }
  };

  useEffect(() => {
    const tempUpdateExperienceData = updateExperienceData;
    if (tempUpdateExperienceData !== false && tempUpdateExperienceData) {
      tempUpdateExperienceData.startDate = tempUpdateExperienceData?.startDate
        ? new Date(tempUpdateExperienceData?.startDate)
        : null;
      tempUpdateExperienceData.endDate = tempUpdateExperienceData?.endDate
        ? new Date(tempUpdateExperienceData?.endDate)
        : null;
      reset(tempUpdateExperienceData);
    }
  }, [updateExperienceData]);

  return {
    watch,
    reset,
    errors,
    control,
    onSubmit,
    onSubmit,
    register,
    handleSubmit,
    experienceInitial,
  };
};

export const level_of_operation = [
  "Hobby Barn",
  "Young Horse Barn",
  "Amateur Barn",
  "Professional Barn",
];

const addExperienceSchema = yup.object().shape({
  startDate: yup.string().required("start date is required").nullable(),
  endDate: yup
    .string()
    .when("stillEmployed", (stillEmployed, schema) => {
      return stillEmployed
        ? yup.string().nullable()
        : yup.string().nullable().required("end date is required");
    })
    .nullable(),
  stillEmployed: yup.boolean(),
  nameOfCompany: yup.string().required("Company name is required"),
  sizeOfCompany: yup
    .number()
    .typeError("Size of company must be a number")
    .min(1, "Size of company must be greater than zero")
    .required("Company size is required"),
  numberOfHorses: yup
    .number()
    .typeError("Number of horses must be a number")
    .min(0, "Number of horses must be a positive number")
    .required("Number of horses is required"),
  levelOfOperation: yup.string().required("Level of operation is required"),
  positionRole: yup.string().min(5).max(100).required("Role is required"),
  description: yup
    .string()
    .test("Maximum 300 words", "Maximum 300 words", (value) => {
      if (value.split(" ").length < 301) {
        return true;
      } else {
        return false;
      }
    })
    .min(5)
    .required("Description is required"),
});

const experienceInitial = {
  startDate: "",
  endDate: "",
  stillEmployed: false,
  nameOfCompany: "",
  sizeOfCompany: "",
  numberOfHorses: "",
  levelOfOperation: "",
  positionRole: "",
  description: "",
};
