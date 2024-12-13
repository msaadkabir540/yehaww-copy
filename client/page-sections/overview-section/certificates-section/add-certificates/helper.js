import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { convertBase64 } from "utils/helper";

export const useAddCertification = ({
  submitRef,
  setListArr,
  setIsLoading,
  setDisableSave,
  watchCertificates,
  updateCertification,
  onSubmitCertificates,
  setUpdateCertification,
}) => {
  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addCertificationSchema),
  });

  const submit = async (data) => {
    const file = watch("file");

    setIsLoading(true);
    if (file && file[0]) {
      const img64 = await convertBase64(file[0]);
      data.file = img64;
      data.url = "";
    } else {
      data.file = "";
    }
    delete data._id;
    let certifications = [];
    setListArr((prev) => {
      certifications = [...prev, data];
      return certifications;
    });
    reset(initialFormValues);
    setUpdateCertification(false);
    await onSubmitCertificates({ ...watchCertificates(), certifications });
    setIsLoading(false);
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  //Usage example:

  useEffect(() => {
    if (Object.keys(updateCertification).length) {
      const dataTransfer = new DataTransfer();
      const file = updateCertification?.file
        ? dataURLtoFile(updateCertification?.file, "hello.pdf")
        : "";
      file && dataTransfer.items.add(file);
      updateCertification.issueDate = updateCertification?.issueDate
        ? new Date(updateCertification?.issueDate)
        : null;
      updateCertification.file = file ? dataTransfer.files : null;
      updateCertification && reset({ ...updateCertification });
    }
  }, [updateCertification]);

  const handleCancel = () => {
    setUpdateCertification(false);
    reset(initialFormValues);
  };

  useEffect(() => {
    let dataExists = false;
    submitRef.current = handleSubmit(submit);
    Object.keys(watch()).forEach((x) => {
      const key = watch(x);
      if (x === "file" ? key?.length : key ? key !== null : false) {
        dataExists = true;
      }
    });
    dataExists ? setDisableSave(true) : setDisableSave(false);
  }, [watch()]);

  return {
    watch,
    submit,
    errors,
    control,
    register,
    handleCancel,
    handleSubmit,
  };
};

const addCertificationSchema = yup.object().shape({
  title: yup.string().required("Availability is required"),
  issuedBy: yup.string().required("Issue by is required"),
  issueDate: yup.string().nullable().required("end date is required"),
  url: yup.string(),
  file: yup.mixed().when("url", {
    is: (val) => {
      return val ? false : true;
    },
    then: yup
      .mixed()
      .test("fileSize", "File is required.", (file) => {
        return file[0]?.size;
      })
      .test("fileSize", "The file size is too large.", (file) => {
        if (file && file[0]) {
          return file[0]?.size <= 2000000;
        } else {
          return false;
        }
      })
      .test("is-big-file", "Only PDF document allowed.", (files) => {
        let valid = true;
        if (files[0]?.type && !["application/pdf"].includes(files[0]?.type)) {
          valid = false;
        }
        return valid;
      }),
    otherwise: yup.string().nullable().optional(),
  }),
});

const initialFormValues = {
  file: "",
  title: "",
  issuedBy: "",
  issueDate: "",
};
