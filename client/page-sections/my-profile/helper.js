import * as yup from "yup";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { deleteAccount } from "api-services/auth";

export const useDeleteAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [delModal, setDelModal] = useState(false);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(deleteSchema) });

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
    visible,
    register,
    delModal,
    setVisible,
    setDelModal,
    handleSubmit,
    handleDelete,
  };
};

const deleteSchema = yup.object().shape({
  password: yup.string().required("Please enter the password."),
});
