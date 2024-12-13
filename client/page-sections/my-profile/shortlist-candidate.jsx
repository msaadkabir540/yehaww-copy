import { updateEmployerSettings } from "api-services/employer";
import BorderForm from "components/border-form";
import Button from "components/button";
import Container from "components/container";
import Radio from "components/radio";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import style from "./my-profile.module.scss";

const ShortListCandidate = ({ shortList, setShortList }) => {
  const { register, handleSubmit } = useForm({
    // defaultValues: { skype: user.employer?.personalDetails?.skype },
  });

  const onSubmitUpdateShortListed = async (data) => {
    if (data) {
      data.shortListedCandidates = data?.shortListedCandidates === "true" ? true : false;
      updateEmployerSettings({ data });
    }
  };

  return (
    <>
      <BorderForm title={"Shortlist Candidates"} className={style.borderForm}>
        <form
          {...register("shortListedCandidates")}
          onSubmit={handleSubmit(onSubmitUpdateShortListed)}
        >
          <div style={{ marginTop: "20px" }}>
            <Radio
              radioValue="true"
              name="shortListedCandidates"
              checked={shortList ? true : false}
              handleChange={() => setShortList(!shortList)}
              label="Always inform candidates when they are shortlisted for positions"
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <Radio
              radioValue="false"
              name="shortListedCandidates"
              label="Never inform candidates"
              checked={!shortList ? true : false}
              handleChange={() => setShortList(!shortList)}
            />
          </div>
          <Button title="Save Shortlist Setting" className={style.btn2} type={"submit"} />
        </form>
      </BorderForm>
    </>
  );
};

export default ShortListCandidate;
