import BorderForm from "components/border-form";
import style from "./language.module.scss";

const LanguageSection = ({ jobData }) => {
  return (
    <div className={style.summary}>
      <BorderForm title="Languages">
        {jobData?.preferredCandidate?.languages?.map(({ name, fluency }, index) => (
          <div key={index} className={style.row}>
            <h6 className={style.key}>{name}</h6>
            <p className={style.value}>{fluency}</p>
          </div>
        ))}
      </BorderForm>
      <BorderForm title="Visa">
        {jobData?.preferredCandidate?.visa.visaType?.map((type, index) => (
          <div key={index} className={style.row}>
            <p className={style.value}>{type}</p>
          </div>
        ))}
      </BorderForm>
    </div>
  );
};

export default LanguageSection;
