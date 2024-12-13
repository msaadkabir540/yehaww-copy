import { useState } from "react";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { changePassword } from "api-services/auth";

export const useChangePassword = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(availabilitySchema),
  });

  const onSubmit = (data) => {
    changePassword({ data, setLoading, router, route: "/profile-overview/profile" });
  };

  return { handleSubmit, onSubmit, loading, errors, register };
};

const availabilitySchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("Please enter the new Password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!-%&*?]{8,20}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number"
    ),
  confirmNewPassword: yup
    .string()
    .required("Please enter the confirm Password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});
