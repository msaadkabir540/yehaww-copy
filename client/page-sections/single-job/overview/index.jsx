import BorderForm from "components/border-form";
import style from "./overview.module.scss";

const OverviewSection = ({ jobData }) => {
  return (
    <BorderForm title="Overview">
      {jobData?.overview
        ?.filter((x) => x?.value)
        ?.map(({ key, value }, index) => (
          <div key={index} className={style.row}>
            <h6 className={style.key}>{key}</h6>
            <p className={style.value}>{value}</p>
          </div>
        ))}
    </BorderForm>
  );
};

export default OverviewSection;
