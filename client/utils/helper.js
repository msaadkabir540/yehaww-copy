import axios from "axios";
import { GET_CITIES } from "./endpoints";
import moment from "moment";

export const isWindowDefined = () => (typeof window !== "undefined" ? true : false);

export const removeKeys = (data, keysToDelete, emptyString = false) => {
  for (const key in data) {
    keysToDelete.includes(key) && delete data[key];
    emptyString && data[key] === "" && delete data[key];
  }
  return data;
};

export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const apiRequest = async ({ type, path, body, params, config, formData }) => {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await axios[type](
      path,
      formData
        ? body
        : {
            ...(body && body),
            ...(["get", "delete"].includes(type) && params && { params }),
          },
      { ...config, ...(["post", "put"].includes(type) && params && { params }) }
    );
    return res;
  } catch (err) {
    console.error(err);
    return err.response;
  }
};

export const handleFilterCity = async (country) => {
  const res = await apiRequest({ type: "get", path: GET_CITIES, params: { country } });
  if (res.status === 200) {
    return res?.data?.citiesList;
  } else return [];
};

export const addDecimal = (num) => {
  const numStr = String(num);
  if (numStr.includes(".")) {
    const beforeDecimal = numStr.split(".")[0];
    const decimalCount = +numStr.split(".")[1] + 1;
    return parseFloat([beforeDecimal, decimalCount].join("."));
  }
  return num;
};

export const getStructuredJob = (job) => {
  const { positionInfo, companyInfo, preferredCandidate } = job;
  let jobLocation = positionInfo?.location?.name?.split(", ");
  const addressLocality = jobLocation?.[0] || "";
  const addressRegion =
    jobLocation?.[jobLocation?.length - 2] || positionInfo?.currentlyLocated?.city || "";
  const addressCountry =
    jobLocation?.[jobLocation?.length - 1] || positionInfo?.currentlyLocated?.country || "";

  const handleMonthsOfExperience = (experienceString) => {
    const experienceMapping = {
      "0-6 months": 5,
      "6 months-1 year": 9,
      "1-2 years": 18,
      "2-5 years": 42,
      "5+ years": 60,
      "10+ years": 120,
    };
    return experienceMapping[experienceString] || 0;
  };

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job?.jobTitle,
    description: job?.positionInfo?.aboutThePosition,
    identifier: {
      "@type": "PropertyValue",
      name: companyInfo?.companyName,
      value: job?.jobCategory,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: companyInfo?.companyName,
      sameAs: "",
    },
    industry: companyInfo?.companyType,
    workHours: positionInfo?.salary,
    employmentType: job?.employmentType,
    datePosted: moment(job?.createdAt).format("YYYY-MM-DD"),
    validThrough: moment(job?.createdAt).add(30, "days").format("YYYY-MM-DD"),
    applicantLocationRequirements: {
      "@type": "Country",
      name: preferredCandidate?.candidateCurrentlyBased?.join(", "),
    },
    jobLocationType: "TELECOMMUTE",
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: positionInfo?.currency,
      value: {
        "@type": "QuantitativeValue",
        value: positionInfo?.salary,
        unitText: positionInfo?.salaryBasis,
      },
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          positionInfo?.location?.name ||
          `${positionInfo?.currentlyLocated?.city}, ${positionInfo?.currentlyLocated?.country}`,
        addressLocality,
        addressRegion,
        postalCode: "",
        addressCountry,
      },
    },
    responsibilities: positionInfo?.employeeExpectations?.join(", "),
    skills: preferredCandidate?.professionalExperience,
    qualifications: preferredCandidate?.visa?.visaType?.join(", "),
    educationRequirements: "",
    experienceRequirements: {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: handleMonthsOfExperience(preferredCandidate?.professionalExperience),
      description: preferredCandidate?.professionalExperience,
    },
  };
};

export const isOnlyWords = ({ str }) => {
  const numberRegex = /\d/;
  const emailRegex = /@/;
  const wordsStartRegex = /^[^a-zA-Z]*[a-zA-Z]/;
  if (numberRegex.test(str) || emailRegex.test(str)) {
    return false;
  }
  return wordsStartRegex.test(str);
};
