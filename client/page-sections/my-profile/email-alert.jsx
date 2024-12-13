import { updateEmployerSettings } from "api-services/employer";
import BorderForm from "components/border-form";
import Button from "components/button";
import Container from "components/container";
import Radio from "components/radio";
import { useForm } from "react-hook-form";

import style from "./my-profile.module.scss";

const EmailAlert = ({ alert, setAlert }) => {
  const { register, handleSubmit } = useForm();

  const onSubmitUpdateEmailAlerts = async (data) => {
    if (data) {
      data.emailAlerts = data?.emailAlerts === "false" ? false : true;
      updateEmployerSettings({ data });
    }
  };

  return (
    <>
      <BorderForm title={"Email Alerts"} className={style.borderForm}>
        <form {...register("emailAlerts")} onSubmit={handleSubmit(onSubmitUpdateEmailAlerts)}>
          <div style={{ marginTop: "20px" }}>
            <Radio
              name="emailAlerts"
              radioValue="false"
              label="No email alerts"
              checked={!alert ? true : false}
              handleChange={() => setAlert(!alert)}
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <Radio
              radioValue="true"
              name="emailAlerts"
              checked={alert ? true : false}
              handleChange={() => setAlert(!alert)}
              label="Send me an email every time I receive an applicant for my job posts"
            />
          </div>
          <Button title="Save Alert Setting" className={style.btn1} type={"submit"} />
        </form>
      </BorderForm>
    </>
  );
};

export default EmailAlert;
