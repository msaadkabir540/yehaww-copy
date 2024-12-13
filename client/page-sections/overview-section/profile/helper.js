import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { profileMetaData, updateProfileLink, updateSettings } from "api-services/profile";

export const useProfile = () => {
  const { user, token } = useSelector((state) => state.app);

  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [settings, setSettings] = useState({});
  const [editUrl, setEditUrl] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState();
  const [settingsLoader, setSettingsLoader] = useState(false);

  const profileStatuses = useMemo(
    () =>
      userData
        ? DEFAULT_PROFILE_STATUSES.map((x, i) => {
            return {
              ...x,
              status: userData.profileStatuses[i] ? "Completed" : "Incomplete",
            };
          })
        : DEFAULT_PROFILE_STATUSES,
    [userData]
  );

  useEffect(() => {
    if (user?.type === "candidate") {
      profileMetaData({ setIsLoading, setUserData, setSettings });
    }
    setUpdatedUserData(user);
  }, [user]);

  const handleUpdateSettings = ({ name, body }) => {
    updateSettings({
      body,
      setSettingsLoader,
      setIsLoading,
      setUserData,
      name,
      setSettings,
      token,
    });
  };

  const handleUpdateProfileLink = ({ data }) => {
    updateProfileLink({
      token,
      body: data,
      setEditUrl,
      setSettings,
      setUserData,
      setIsLoading,
      setBtnLoading,
    });
  };

  return {
    user,
    watch,
    errors,
    editUrl,
    setValue,
    userData,
    settings,
    isLoading,
    setEditUrl,
    btnLoading,
    setSettings,
    settingsLoader,
    profileStatuses,
    updatedUserData,
    handleUpdateSettings,
    handleUpdateProfileLink,
  };
};

const DEFAULT_PROFILE_STATUSES = [
  {
    title: "Personal Information",
    path: "/profile-overview/personal-information",
  },
  {
    title: "About Me",
    path: "/profile-overview/about",
  },
  {
    title: "Availability",
    path: "/profile-overview/availability",
  },
  {
    title: "Experience",
    path: "/profile-overview/experience",
  },
  {
    title: "Skills & Driver Licenses",
    path: "/profile-overview/skills-driver-license",
  },
  {
    title: "My CV / Resume",
    path: "/profile-overview/my-resume",
  },
  {
    title: "Diploma & Certification",
    path: "/profile-overview/certificates",
  },
  {
    title: "References",
    path: "/profile-overview/references",
  },
  {
    title: "My Uploads",
    path: "/profile-overview/my-upload",
  },
];
