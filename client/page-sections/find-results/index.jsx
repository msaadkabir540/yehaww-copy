/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
// import Select from "react-select";

import Card from "components/card";
import Button from "components/button";
import Checkbox from "components/checkbox";
import Container from "components/container";
import Pagination from "components/pagination";

import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Select from "components/select";
import Badge from "components/badge";
import MultiSelect from "components/multi-select";
import HeaderComponent from "components/header-compo";

import useFindResult from "helpers/find-candidate-helper";
import createNotification from "common/create-notification";

import listGray from "public/assets/list-gray.svg";
import gridGray from "public/assets/grid-gray.svg";
import gridWhite from "public/assets/grid-white.svg";
import listWhite from "public/assets/list-white.svg";
import arrowIcon from "public/assets/icons/arrow.svg";
import filterIcon from "public/assets/filter-icon.svg";
import style from "styles/find-result.module.scss";

const FindResult = () => {
  const [openFilter, setOpenFilter] = useState(false);

  const {
    page,
    user,
    reset,
    token,
    count,
    watch,
    router,
    review,
    active,
    errors,
    setPage,
    pageSize,
    setValue,
    onSubmit,
    register,
    disabled,
    onChange,
    setReview,
    getValues,
    setActive,
    candidates,
    subscribed,
    setDisabled,
    clearErrors,
    checkBoxArr,
    handleSubmit,
    getCandidates,
    initialFilters,
    multiSelectFilters,
  } = useFindResult({ appliedCandidates: false });

  return (
    <>
      <Head>
        <title>Candidates - Yehaww</title>
        <meta
          name="description"
          content="Find the right candidates for your job, we have best equestrian professionals that are expert in their work"
        />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <HeaderComponent heading={"Find Candidate"} />

      <Container>
        <div className={style.headingDiv}>
          <h1>
            <span>Find Candidate</span>
            <div className={style.arrow_icon}>
              <Image
                src={arrowIcon}
                alt={"arrow icon"}
                className={style.arrow_icon}
                height={12}
                width={12}
              />
            </div>
            Search
          </h1>
        </div>
        <div className={style.mainWrapper}>
          {user?.subscriptionStatus && user?.subscriptionStatus !== "active" && (
            <div className={style.infoWrapper}>
              <p className={style.form_title}> Subscribe to the Yehaww Connect account.</p>
              <p className={style.sub_title}>
                Get your subscription today and get access to unlimited contact details of all the
                talented people in our data base.
                <br />
                For more details about our subscription options{" "}
                <Link href="/sign-up">Click Here</Link>
              </p>
            </div>
          )}
          <div className={style.filterWrapper}>
            <Card className={style.filterCard}>
              <div className={style.header}>
                <div>
                  <h4>Filter Candidates</h4>
                  <p>
                    All candidates that have applied for this position are (%) ranked in order of
                    suitability based upon your requirements. If you only want to see candidates
                    which meet your specific criteria then please select from the filters below...
                  </p>
                </div>
                <div className={style.filterIcon}>
                  <Image
                    src={filterIcon}
                    height={30}
                    width={20}
                    alt="filterIcon"
                    style={{ cursor: "pointer" }}
                    onClick={() => setOpenFilter(!openFilter)}
                  />
                </div>
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
                    <div key={index}>
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
                    <Button
                      type="submit"
                      disabled={disabled}
                      title={"Find Results"}
                      className={style.btnSubmit}
                    />
                    <span
                      disabled={disabled}
                      aria-disabled={disabled}
                      className={!disabled ? style.btnClear : style.btnClearDisabled}
                      onClick={() => {
                        if (!disabled) {
                          reset(initialFilters);
                          setDisabled(true);
                          getCandidates();
                        }
                      }}
                    >
                      Clear all
                    </span>
                  </div>
                  <div className={style.btnLinkWrapper}>
                    <span>Job Details</span>
                    <Select
                      name="jobDetail"
                      className={style.formLink}
                      onChange={(e) => {
                        const value = e.target.value;
                        value === "Review"
                          ? setReview(true)
                          : value === "Edit"
                          ? router.push({
                              pathname: "/find-candidate",
                              query: router.query,
                            })
                          : router.push(value);
                      }}
                    >
                      <option value="">Job Detail</option>
                      <option value="Review">Review Search Criteria</option>
                      <option key="New" value={"/find-candidate"}>
                        New
                      </option>
                      <option key="Edit" value="Edit">
                        Edit
                      </option>
                    </Select>
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
                        {Object.keys(router.query).map(
                          (x, index) =>
                            router.query[x] && (
                              <div key={index}>
                                <h5>{search[x]}</h5>
                                <p>{router.query[x]}</p>
                              </div>
                            )
                        )}
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
              <div className={style.contentWrapper}>
                <div className={style.header_wrapper}>
                  <p className={style.header_title}> Candidates ({count || 0})</p>
                  <div className={style.toggleWrapper}>
                    <div
                      className={`${style.firstIcon} ${active ? style.active : ""}`}
                      onClick={() => setActive(true)}
                    >
                      <Image
                        src={active ? gridWhite : gridGray}
                        alt={"grid icon"}
                        width={18}
                        height={12}
                      />
                    </div>
                    <div
                      className={`${style.firstIcon} ${active ? "" : style.active}`}
                      onClick={() => setActive(false)}
                    >
                      <Image
                        src={!active ? listWhite : listGray}
                        alt={"list icon"}
                        width={18}
                        height={12}
                      />
                    </div>
                  </div>
                </div>
                {candidates.length ? (
                  <>
                    {active ? (
                      <>
                        <div className={style.listWrapper}>
                          {candidates?.map(
                            (
                              { mainPhoto, name, availability, currentCountry, id, profileLinkId },
                              index
                            ) => {
                              const userName = !name.includes("undefined")
                                ? name?.toUpperCase()?.trim()?.substring(0, 1) + "*".repeat(5)
                                : "Name";

                              return (
                                <Card className={style.card_wrapper} key={index}>
                                  <Link href={`/u/${profileLinkId}`}>
                                    <div className={style.avatar_img}>
                                      <Image
                                        src={
                                          mainPhoto ||
                                          "https://i.pinimg.com/736x/d9/56/9b/d9569bbed4393e2ceb1af7ba64fdf86a.jpg"
                                        }
                                        alt="profile img"
                                        height={195}
                                        width="200%"
                                        className={style.profile_img}
                                      />
                                    </div>
                                  </Link>
                                  <div className={style.name_wrapper}>
                                    <Link href={`/u/${profileLinkId}`}>
                                      <p>
                                        {!token || !subscribed(id) ? (
                                          <>
                                            {userName}
                                            <Badge title={"LOCKED"} className={style.locked} />
                                          </>
                                        ) : (
                                          name
                                        )}
                                      </p>
                                    </Link>
                                  </div>
                                  <ul className={style.detail_wrapper}>
                                    <li>
                                      <span className={style.key}>Availability</span>
                                      <span className={style.value}>{availability}</span>
                                    </li>
                                    <li>
                                      <span className={style.key}>Location</span>
                                      <span className={style.value}>{currentCountry}</span>
                                    </li>
                                  </ul>
                                  <div className={style.btn_wrapper}>
                                    <Button
                                      title={"View Profile"}
                                      className={style.btn}
                                      handleClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/u/${profileLinkId}`);
                                      }}
                                    />
                                    {!token && (
                                      <Link href="/sign-up">
                                        <Button
                                          title={"Sign Up"}
                                          className={`${style.signUp} ${style.btn}`}
                                        />
                                      </Link>
                                    )}
                                  </div>
                                </Card>
                              );
                            }
                          )}
                        </div>
                        <div style={{ margin: "30px 0px" }}>
                          <Pagination
                            count={count}
                            page={page}
                            pageSize={pageSize}
                            setPage={setPage}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={style.listViewHeader}>
                          <div style={{ minWidth: "350px" }}></div>
                          <div style={{ minWidth: "150px" }} className={style.listHeaderTitle}>
                            Match Criteria
                          </div>
                          <div
                            style={{ minWidth: "150px", textAlign: "center" }}
                            className={style.listHeaderTitle}
                          >
                            Availability
                          </div>
                          <div
                            style={{ minWidth: "150px", textAlign: "center" }}
                            className={style.listHeaderTitle}
                          >
                            Location
                          </div>
                          <div
                            style={{ minWidth: "270px", textAlign: "center" }}
                            className={style.listHeaderTitle}
                          >
                            Actions
                          </div>
                        </div>
                        {candidates?.map(
                          (
                            {
                              mainPhoto,
                              name,
                              match,
                              profileCompletion,
                              availability,
                              currentCountry,
                              profileLinkId,
                              id,
                            },
                            index
                          ) => {
                            const userName = !name.includes("undefined")
                              ? name?.toUpperCase()?.trim()?.substring(0, 1) + "*".repeat(5)
                              : "Name";

                            return (
                              <div className={style.listViewWrapper} key={index}>
                                <div
                                  className={style.listInfoWrapper}
                                  style={{ minWidth: "350px" }}
                                >
                                  <div className={style.img}>
                                    <Image
                                      width={61}
                                      height={57}
                                      src={
                                        mainPhoto ||
                                        "https://i.pinimg.com/736x/d9/56/9b/d9569bbed4393e2ceb1af7ba64fdf86a.jpg"
                                      }
                                      alt="profile avatar"
                                    />
                                  </div>
                                  <div className={style.nameAuto}>
                                    <Link href={`/u/${profileLinkId}`}>
                                      <p>
                                        {!token || !subscribed(id) ? (
                                          <>
                                            {userName}
                                            <Badge title={"LOCKED"} className={style.locked} />
                                          </>
                                        ) : (
                                          name
                                        )}
                                      </p>
                                    </Link>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    minWidth: "150px",
                                    fontWeight: "500",
                                    fontSize: "12px",
                                  }}
                                >
                                  <p style={{ textAlign: "right" }}>{match}%</p>
                                  <div className={style.progressBar}></div>
                                </div>
                                <div
                                  style={{
                                    minWidth: "150px",
                                    textAlign: "center",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                  }}
                                >
                                  {availability}
                                </div>
                                <div
                                  style={{
                                    minWidth: "150px",
                                    textAlign: "center",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                  }}
                                >
                                  {currentCountry}
                                </div>
                                <div
                                  className={style.buttonWrapper}
                                  style={{ minWidth: "270px", justifyContent: "center" }}
                                >
                                  {!token && (
                                    <Button
                                      title={"Sign Up"}
                                      className={style.btnSignUp}
                                      handleClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/sign-up`);
                                      }}
                                    />
                                  )}
                                  <Button
                                    title={"View Profile"}
                                    className={style.btnViewProfile}
                                    handleClick={(e) => {
                                      if (profileCompletion <= 80) {
                                        createNotification(
                                          "error",
                                          "Incomplete or inactive profile, unable to view"
                                        );
                                      } else {
                                        e.stopPropagation();
                                        router.push(`/u/${profileLinkId}`);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                        <div style={{ margin: "30px 0px" }}>
                          <Pagination
                            page={page}
                            count={count}
                            setPage={setPage}
                            onChange={onChange}
                            pageSize={pageSize}
                          />
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className={style.no_results}>
                    <h1>No Results found</h1>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
};

export default FindResult;

const search = {
  position: "Position",
  availability: "Availability",
  currentlyBased: "Currently Based",
  professionalExperience: "Professional Experience",
};
