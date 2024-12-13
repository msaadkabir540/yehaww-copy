import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as yup from "yup";
import { useForm } from "react-hook-form";

import { getReferenceData, verifyReferences } from "api-services/profile";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

export const useReferenceHelper = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { query, pathname } = router;
  const verified = pathname === "/verified-reference";
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verificationSchema),
  });

  const [loading, setLoading] = useState(true);
  const [referenceData, setReferenceData] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const onSubmit = async (data) => {
    setLoadingSubmit("Confirm");
    await verifyReferences({
      body: { ratings: data, verified: true },
      params: query,
      router,
    });
    setLoadingSubmit(false);
  };

  const handleNotVerified = async () => {
    setLoadingSubmit("Decline");
    await verifyReferences({
      body: { verified: false },
      params: query,
      router,
    });
    setLoadingSubmit(false);
  };

  useEffect(() => {
    router.isReady && query.userId
      ? getReferenceData({ params: query, setReferenceData, router, dispatch, setLoading, reset })
      : setLoading(false);
  }, [router]);

  return {
    errors,
    control,
    loading,
    register,
    verified,
    onSubmit,
    handleSubmit,
    referenceData,
    loadingSubmit,
    handleNotVerified,
  };
};

const verificationSchema = yup.object().shape({
  comment: yup.string().required("Comments are required"),
});
