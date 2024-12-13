import BorderForm from "components/border-form";
import style from "./summary.module.scss";

const SummarySection = ({ jobData }) => {
  return (
    <div className={style.summary}>
      <BorderForm title="About The Position">
        <p>{jobData?.positionInfo?.aboutThePosition}</p>
      </BorderForm>
      {jobData?.positionInfo?.aboutThePositionOtherLanguage &&
        jobData?.positionInfo?.aboutThePositionOtherLanguageText && (
          <div className={style.border}>
            <h4>{jobData?.positionInfo?.aboutThePositionOtherLanguage} Description:</h4>
            <p>{`${jobData?.positionInfo?.aboutThePositionOtherLanguageText}`}</p>
          </div>
        )}
    </div>
  );
};

export default SummarySection;
