import { useEffect, useState } from "react";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import { convertBase64 } from "utils/helper";
import { profileSectionData, references } from "api-services/profile";
import createNotification from "common/create-notification";

export const useReference = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state?.app);

  const [resData, setResData] = useState({});
  const [isSave, setIsSave] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disableSave, setDisableSave] = useState(false);
  const [referencesArr, setReferencesArr] = useState([]);
  const [editedElement, setEditedElement] = useState(null);

  const {
    watch,
    reset,
    control,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(referenceSchema),
  });

  const onSubmit = async (data) => {
    if (!data?.file?.includes?.("data:") && data.file[0]) {
      const img64 = await convertBase64(data.file[0]);
      data.file = img64;
    } else {
      data.file = "";
    }
    isUpdate && setIsUpdate(false);
    let newReferences = [];
    if (
      referencesArr.length > 0 &&
      referencesArr?.some((reference) => reference.email === data?.email)
    ) {
      createNotification("error", "References Emails should not be Same");
    } else {
      setReferencesArr((oldArr) => {
        newReferences = [...oldArr, data];
        return newReferences;
      });
    }

    handleAddReference({ newReferences });
    setDisableSave(false);
    reset(initialFormValues);
  };

  const handleSubmitForm = async () => {
    const newRef = [...referencesArr]?.map((ele) => {
      delete ele._id;
      return ele;
    });
    const prevUrls = resData.references.map((x) => x.url);
    const newUrls = newRef.map((x) => x.url);
    const data = {
      route: "references",
      references: newRef,
      filesToDelete: prevUrls.filter((x) => !newUrls.includes(x) && x !== "" && x !== undefined),
    };
    if (referencesArr.length > 0) {
      references({ setIsLoading, router, data });
      setReferencesArr(referencesArr?.filter((reference) => reference?.email !== user?.email));
      setIsSave(false);
    } else if (referencesArr.length === 0) {
      createNotification("error", "Add One Reference Atleast");
    }
    setIsSave(false);
  };

  const handleUpdate = (index) => {
    const data = referencesArr.find((i, rIndex) => index === rIndex);
    setEditedElement(referencesArr[index]);
    setReferencesArr((prev) => prev.filter((i, rIndex) => index !== rIndex));
    setIsUpdate(true);
    reset(data);
  };

  const handleCancelUpdate = () => {
    setIsUpdate(false);
    if (editedElement !== null) {
      referencesArr.push(editedElement);
    }
    reset(initialFormValues);
    setReferencesArr(resData?.references);
  };

  const handleDeleteRecord = (index) => {
    setReferencesArr(referencesArr.filter((i, rIndex) => index !== rIndex));
  };

  useEffect(() => {
    user?.candidateId &&
      profileSectionData({ properties: "references", setResData, id: user?.candidateId });
  }, [user?.candidateId]);

  useEffect(() => {
    setReferencesArr(resData?.references);
  }, [resData]);

  useEffect(() => {
    let dataExists = false;
    Object.keys(watch()).forEach((x) => {
      const key = watch(x);
      if (x === "phone" ? key !== "93" : x === "file" ? key.length : key ? key !== null : false) {
        dataExists = true;
      }
    });
    dataExists ? setDisableSave(true) : setDisableSave(false);
  }, [watch()]);

  const handleAddReference = ({ newReferences = "" }) => {
    const newRef = [...(newReferences || referencesArr)]?.map((ele) => {
      delete ele._id;
      return ele;
    });
    const prevUrls = resData.references.map((x) => x.url);
    const newUrls = newRef.map((x) => x.url);
    const data = {
      route: "references",
      references: newRef,
      filesToDelete: prevUrls.filter((x) => !newUrls.includes(x) && x !== "" && x !== undefined),
    };
    if (referencesArr.length > 0 && isSave) {
      references({ setIsLoading, router, data });
      setReferencesArr(referencesArr?.filter((reference) => reference?.email !== user?.email));
      setIsSave(false);
    } else if (referencesArr.length === 0 && isSave) {
      createNotification("error", "Add One Reference Atleast");
    }
    setIsSave(false);
  };

  return {
    watch,
    errors,
    control,
    register,
    isUpdate,
    onSubmit,
    setIsSave,
    isLoading,
    disableSave,
    clearErrors,
    handleSubmit,
    handleUpdate,
    referencesArr,
    handleSubmitForm,
    handleDeleteRecord,
    handleCancelUpdate,
    handleAddReference,
  };
};

const referenceSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  relationship: yup.string().required("Relationship is required"),
  companyName: yup.string().required("Company name is required"),
  phone: yup.string().required("Phone is required"),
  email: yup.string().required("Email is required").email(),
  file: yup.mixed().test("fileSize", "The file is too large", (file) => {
    if (file && file[0]?.size) {
      return file && file[0]?.size <= 2000000;
    } else {
      return true;
    }
  }),
  type: yup.string().required("Type is required"),
});

export const typeArr = [
  "Barn",
  "Rider",
  "Stable manager",
  "Recruitment agency",
  "Equestrian business",
  "Other",
];

const initialFormValues = {
  name: "",
  email: "",
  relationship: "",
  // phone: "",
  companyName: "",
  file: "",
  type: "",
};
