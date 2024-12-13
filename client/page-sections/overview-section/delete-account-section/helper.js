import { useState } from "react";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import { deleteAccount } from "api-services/auth";

export const useDeleteAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [success, setSuccess] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(deleteAccountSchema) });

  const onSubmit = () => {
    setDeleteModal(true);
  };
  const handleDelete = async () => {
    setLoading(true);
    await deleteAccount({
      data: { password: getValues("password") },
      setSuccess,
      router,
      dispatch,
    });
    setLoading(false);
  };

  return {
    errors,
    success,
    loading,
    register,
    onSubmit,
    deleteModal,
    handleDelete,
    handleSubmit,
    setDeleteModal,
    passwordVisible,
    setPasswordVisible,
  };
};

const deleteAccountSchema = yup.object().shape({
  password: yup.string().required("Please enter the password."),
});
