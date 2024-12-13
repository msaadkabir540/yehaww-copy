import Modal from "components/modal";
import * as yup from "yup";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Input from "components/input";
import Button from "components/button";
import TextArea from "components/textarea";
import { cancelSubscription } from "api-services/subscription";

import fb from "public/assets/icons/fb.svg";
import sad from "public/assets/sad-emoji.svg";
import cross from "public/assets/icons/close.svg";
import insta from "public/assets/icons/insta.svg";
import linkdln from "public/assets/icons/linkedin.svg";

import style from "./cancel.module.scss";

const CancelModal = ({ cancelModal, setCancelModal, setCancelSuccessModal }) => {
  const { user } = useSelector((state) => state.app);
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    let { reason, otherReason } = data;
    reason = reason?.includes("Other") ? otherReason : reason;

    const name = `${user?.forename} ${user?.surname}`;

    const formData = {
      name,
      ...data,
      reason,
      email: user?.email,
    };

    const res = await cancelSubscription({ formData });
    if (res) {
      setCancelModal(false);
      setCancelSuccessModal(true);
    }
  };

  return (
    <Modal
      cancelImg={cross}
      open={cancelModal}
      titleClass={style.titleClass}
      className={style.cancelModal}
      handleClose={() => setCancelModal(false)}
      title={"Subscription Cancellation Request"}
    >
      <div className={style.emojiFlex}>
        <p>We are sorry to see you go</p>
        <Image src={sad} />
      </div>
      <div className={style.restrictions}>
        <p className={style.li}>You will not be able to</p>
        <p className={style.li}>• View candidate's contact details</p>
        <p className={style.li}>• View or download their CV</p>
        <p className={style.li}>• View or download their documents</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <h4 className={style.label}>
            Can you tell us why you decided to cancel your subscription?
          </h4>

          <div className={style.btnFlex}>
            {buttonOptions?.map((btn) => {
              const activeOption = watch("reason") === btn;
              return (
                <Button
                  title={btn}
                  type="button"
                  handleClick={() => setValue("reason", btn)}
                  className={activeOption ? style.activeBtn : style.optionButton}
                />
              );
            })}
          </div>
          {errors?.reason?.message && (
            <span className={style.errorMessage}>{errors?.reason?.message}</span>
          )}

          {watch("reason")?.includes("Other") && (
            <Input
              label={""}
              register={register}
              name={"otherReason"}
              placeholder={"Please Specify the Reason"}
              errorMessage={errors?.otherReason?.message}
            />
          )}
          <TextArea
            name={"feedback"}
            register={register}
            className={style.input}
            displayCharCount={false}
            errorMessage={errors?.feedback?.message}
            placeholder={"Please give your suggestion"}
            label={"What could we improve to make our service better?"}
          />
          <p className={style.label}>
            Are you switching to a competing service? If yes, can you specify which one?
          </p>
          <Input
            register={register}
            name={"alternative"}
            className={style.input}
            errorMessage={errors?.alternative?.message}
            placeholder={"Please provide service name "}
          />
          <div className={style.footer}>
            <div className={style.contactDiv}>
              <p>Contact us on</p>
              <div style={{ gap: "10px", marginTop: "8px" }}>
                <a
                  target="_blank"
                  style={{ paddingRight: "10px" }}
                  href={"https://www.facebook.com/Yehaww-100714195979410"}
                >
                  <Image src={fb} width={20} height={20} />
                </a>
                <a
                  target="_blank"
                  style={{ paddingRight: "10px" }}
                  href={"https://www.instagram.com/yehaww_com/"}
                >
                  <Image src={insta} width={20} height={20} />
                </a>
                <a
                  target="_blank"
                  style={{ paddingRight: "10px" }}
                  href={"https://www.linkedin.com/company/yehaww/"}
                >
                  <Image src={linkdln} width={20} height={20} />
                </a>
              </div>
            </div>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className={style.activeBtn}
              loaderClass={style.loaderClass}
              title={"Submit Cancellation Request"}
            />
          </div>
        </>
      </form>
    </Modal>
  );
};

export default CancelModal;

const schema = yup.object().shape({
  reason: yup.string().required("Reason is required"),
  feedback: yup.string().required("Feedback is required"),
  alternative: yup.string().required("Alternative service name is required"),
  otherReason: yup.string().when("reason", {
    is: (val) => val?.includes("Other"),
    then: yup.string().required("Reason is required"),
    otherwise: yup.string().notRequired(),
  }),
});

const buttonOptions = [
  "Found a better alternative",
  "Too Expensive",
  "Difficult to use",
  "Features don't meet my needs",
  "Other (please specify)",
];
