/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Image from "next/image";
import Select from "react-select";

import Card from "components/card";
import Button from "components/button";
import Checkbox from "components/checkbox";
import MultiSelect from "components/multi-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import filterIcon from "public/assets/filter-icon.svg";

import style from "styles/find-result.module.scss";

const ActivePostFilter = ({
  reset,
  router,
  review,
  setValue,
  onSubmit,
  register,
  setReview,
  getValues,
  checkBoxArr,
  handleSubmit,
  initialFilters,
  multiSelectFilters,
  watch,
  clearErrors,
  errors,
}) => {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <>
      <div className={style.filterWrapper}>
        <Card className={style.filterCard}>
          <div className={style.header}>
            <div>
              <h4>Filter Candidates</h4>
              <p>
                All candidates that have applied for this position are (%) ranked in order of
                suitability based upon your requirements. If you only want to see candidates which
                meet your specific criteria then please select from the filters below...
              </p>
            </div>
            <Image
              src={filterIcon}
              alt="filter_icon"
              style={{ cursor: "pointer" }}
              onClick={() => setOpenFilter(!openFilter)}
            />
          </div>
          <form className={style.formWrapper} onSubmit={handleSubmit(onSubmit)}>
            {openFilter && (
              <div className={style.filterSection} onClick={() => setOpenFilter(false)}></div>
            )}
            {openFilter ? (
              <div className={style.checkboxWrapper}>
                {checkBoxArr?.map(({ name, label, value }, index) => (
                  <div key={index} style={{ marginTop: "15px" }}>
                    <Checkbox
                      label={label}
                      htmlFor={label}
                      id={label}
                      name={name}
                      register={register}
                      checked={
                        name === "visas"
                          ? getValues(name)?.includes?.(value)
                          : name === "gender"
                          ? "asd"
                          : getValues(name)
                      }
                      value={value}
                    />
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
            <div className={style.formInputWrapper}>
              {multiSelectFilters.map(({ name, label, options }, index) => (
                <div>
                  <MultiSelect
                    key={index}
                    label={label}
                    name={name}
                    options={options}
                    setValue={setValue}
                    watch={watch}
                    clearErrors={clearErrors}
                    errorMessage={errors?.[name]?.message}
                  />
                </div>
              ))}
            </div>
            <div className={style.footerWrapper}>
              <div className={style.btnWrapper}>
                <Button className={style.btnSubmit} title={"Find Results"} type="submit" />
                <span
                  className={style.btnClear}
                  onClick={() => {
                    reset(initialFilters);
                  }}
                >
                  Clear all
                </span>
              </div>
            </div>
            {review && (
              <div className={style.searchCriteria}>
                <div className={style.searchCriteriaContent}>
                  <h3>Job Search Criteria</h3>
                  <ul>
                    <li
                      onClick={() => {
                        router.push("/find-candidate");
                      }}
                    >
                      New
                    </li>
                    <li>|</li>
                    <li
                      onClick={() => {
                        router.push({
                          pathname: "/find-candidate",
                          query: router.query,
                        });
                      }}
                    >
                      Edit
                    </li>
                  </ul>
                  <div className={style.query}>
                    {Object.keys(router.query).map((x) => (
                      <>
                        {router.query[x] && (
                          <div>
                            <h5>{search[x]}</h5>
                            <p>{router.query[x]}</p>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </div>
                <span
                  onClick={() => {
                    setReview(false);
                  }}
                >
                  <FontAwesomeIcon icon={faClose} className={style.icon} />
                </span>
              </div>
            )}
          </form>
        </Card>
      </div>
    </>
  );
};

export default ActivePostFilter;

const search = {
  position: "Position",
  availability: "Availability",
  currentlyBased: "Currently Based",
  professionalExperience: "Professional Experience",
};
