import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Input from "components/input";
import Select from "components/select";
import Button from "components/button";
import TextArea from "components/textarea";

import { contactUs } from "api-services/dashboard";

import style from "./question.module.scss";
import Link from "next/link";

const FormSection = () => {
  const [loading, setLoading] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (body) => {
    await contactUs({ body, setLoading });
    reset();
  };

  return (
    <div className={style.main}>
      {/* <h6>
        First time on Yehaww.com?
        <Link href={"/sign-up"}>
          <span> Sign Up</span>
        </Link>
      </h6>
      <p className={style.p}>
        {`Do you have a suggestion, an idea, or a question that is not answered in our FAQ? Contact us
        below and we'll get back to you as soon as possible!`}
      </p> */}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.grid}>
          <Input
            star="*"
            type="text"
            label="Name"
            name="name"
            register={register}
            errorMessage={errors?.name?.message}
          />
          <Input
            star="*"
            type="text"
            label="Email"
            name="email"
            register={register}
            errorMessage={errors?.email?.message}
          />
        </div>

        <Select
          star="*"
          label={"Subject"}
          placeholder={"subject"}
          name="subject"
          className={style.field}
          register={register}
          errorMessage={errors?.subject?.message}
        >
          <option value="">Subject</option>
          {subjectOption?.map((ele) => (
            <option key={ele} value={ele}>
              {ele}
            </option>
          ))}
        </Select>
        <TextArea
          star="*"
          label="Message"
          name="message"
          className={style.field}
          register={register}
          errorMessage={errors?.message?.message}
          displayCharCount={false}
        />
        <div className={style.flex}>
          <Button
            title={"Submit"}
            type={"submit"}
            isLoading={loading}
            loaderClass={style.loaderClass}
          />
          <p>
            Prefer email?
            <a
              href="mailto:info@yehaww.com"
              style={{
                marginLeft: "4px",
              }}
            >
              info@yehaww.com
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default FormSection;

const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[a-zA-Z]{1,15} {0,1}[a-zA-Z]{0,15}$/i, "Please enter a valid Name")
    .required("name is required"),
  email: yup.string().required("Email is required").email("Please enter valid email"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().min(5).required("Subject is required"),
});

export const subjectOption = [
  "General information",
  "Yehaww connect account",
  "My subscription",
  "Technical",
  "Feedback",
  "Data privacy",
  "Advertise with us",
  "Delete my account",
];
