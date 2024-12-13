/* eslint-disable @next/next/no-img-element */
import moment from "moment";
import { memo } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import List from "components/list";
import Select from "components/select";
import Button from "components/button";
import Loading from "components/loading";
import Container from "components/container";
import Pagination from "components/pagination";
import InterestedModal from "./job-apply-modal";
import HeaderComponent from "components/header-compo";
import GoogleMapsMarker from "components/map-markers";
import MultiSelectGrouped from "components/multi-select-grouped";

import { setLogout } from "store";
import { useJob } from "helpers/job-helper";
import { jobTypeKeys } from "utils/arrayHelper";
import { useProfile } from "../../page-sections/overview-section/profile/helper";

import style from "styles/job.module.scss";
import createNotification from "common/create-notification";

const FindJobsPage = () => {
  const {
    jobs,
    page,
    user,
    sorts,
    reset,
    watch,
    router,
    setPage,
    loading,
    mapView,
    setValue,
    dispatch,
    register,
    onSubmit,
    pageSize,
    openModal,
    btnLoader,
    setMapView,
    handleClear,
    setOpenModal,
    handleSubmit,
    filterListArr,
    groupedOptions,
    scrollPosition,
    handleInterested,
    verifyReferenceBanner,
  } = useJob();

  return (
    <>
      <Head>
        <title>Jobs - Yehaww</title>
        <meta
          name="description"
          content="Find your dream job in equestrian industry that suites you"
        />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <HeaderComponent heading={"Jobs"} />
      <Container>
        <div className={style.headingDiv}>
          <h1>
            <Link href="/sign-up">
              <span>Jobs</span>
            </Link>
            <div className={style.arrow_icon}>
              <Image
                width={12}
                height={12}
                alt={"arrow icon"}
                className={style.arrow_icon}
                src="/assets/icons/arrow.svg"
              />
            </div>
            Search
          </h1>
          <div className={style.sort_wrapper}>
            <p>Sort by</p>
            <Select name={"sortBy"} register={register}>
              {sorts.map(({ label, value }, index) => (
                <option value={value} key={index}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          id="hook-form-jobs-search"
          className={style.filter_wrapper}
        >
          {filterListArr?.map((ele, index) => (
            <>
              {ele.component ? (
                <div className={style.borderClass}>
                  <MultiSelectGrouped
                    watch={watch}
                    name="position"
                    isMulti={false}
                    label="Position"
                    placeholder={"Any"}
                    options={groupedOptions}
                    onChange={(e) => {
                      setValue("jobTitle", e.value);
                      router.push({
                        query: {
                          ...router.query,
                          position: e.value?.split(" (")?.[0]?.replace("/", "-"),
                          category: e.value?.split(" (")?.[1]?.replace("(", "")?.replace(")", ""),
                        },
                      });
                    }}
                    customStyle={{
                      "&:hover": { borderColor: "none", cursor: "pointer" },
                      border: "none !important",
                      boxShadow: "none",
                      borderWidth: "0px",
                      padding: "0px 5px",
                    }}
                  />
                </div>
              ) : (
                <div key={index} className={style.borderClass}>
                  <Select label={ele.label} name={ele?.name} register={register}>
                    {ele?.option?.map((innerEle, index) => (
                      <>
                        {ele?.name === "salary" ? (
                          <option value={innerEle.value} key={index}>
                            {innerEle.label}
                          </option>
                        ) : (
                          <option value={innerEle === "Any" ? "" : innerEle} key={index}>
                            {innerEle}
                          </option>
                        )}
                      </>
                    ))}
                  </Select>
                </div>
              )}
            </>
          ))}
        </form>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <Button
            type={"reset"}
            handleClick={handleClear}
            title={"Clear all filter"}
            className={style.btn_clear}
          />
          <Button
            type="submit"
            title={"Filter Results"}
            className={style.btnSearch}
            form="hook-form-jobs-search"
          />
        </div>

        {loading || !jobs ? (
          <div className={style.list_wrapper}>
            <Loading pageLoader={true} diffHeight={350} />
          </div>
        ) : (
          <div className={style.list_wrapper}>
            <div className={style.header_wrapper}>
              {user.type === "employer" && (
                <Button
                  title={"Post a Job"}
                  className={style.btnSearch}
                  handleClick={() => {
                    user.type === "candidate" && dispatch(setLogout());
                    router.push(
                      user.type === "employer" ? "/candidate/post-position" : "/sign-up/employer"
                    );
                  }}
                />
              )}
              <p className={style.header_title}>{`${
                jobs?.jobsCount > 0 ? jobs?.jobsCount : 0
              } Positions`}</p>
            </div>
            {mapView ? (
              <>
                <GoogleMapsMarker
                  markers={jobs?.jobs}
                  styles={{ width: "100%", height: "800px" }}
                />
              </>
            ) : (
              <div style={{ margin: "10px 0px 50px 0px" }}>
                {verifyReferenceBanner && (
                  <div className={style.verifyReferenceBanner}>
                    <span>
                      <FontAwesomeIcon icon={faCheck} className={style.icon} />
                    </span>
                    Application Submitted. Did you know you can improve your chances of finding work
                    when you click
                    <Link href="/profile-overview/references">
                      <span> 'Verify My Reference' </span>
                    </Link>
                    ?
                  </div>
                )}

                {jobs?.jobs?.length > 0 ? (
                  <div className={style.myGrid}>
                    {jobs?.jobs?.map(
                      (
                        {
                          img,
                          list,
                          jobId,
                          jobTitle,
                          createdAt,
                          interested,
                          companyType,
                          jobFilledStatus,
                        },
                        index
                      ) => {
                        const startDate = moment().format("DD-MM-YYYY");
                        const difference = moment
                          .duration(
                            moment(startDate, "DD-MM-YYYY").startOf("day").diff(moment(createdAt))
                          )
                          .asDays();
                        return (
                          <div key={index} className={style.classInnerWrapper}>
                            <List
                              title={jobTitle}
                              className={style.listWrapper}
                              titleLink={`/jobs/details/${jobId}`}
                              badgeClass={jobFilledStatus && style.tag}
                              list_img={img || `/assets/imgs/${jobTypeKeys[companyType]}.webp`}
                              listArr={list?.map((x) => (x === "Any" ? "Employment Type: Any" : x))}
                              badgeTitle={
                                jobFilledStatus ? "Position Filled" : difference < 3 ? "New" : ""
                              }
                              buttons={[
                                user.type === "candidate" &&
                                  !jobFilledStatus && {
                                    title: interested ? "Interest Confirmed" : "I'm Interested",
                                    btnClass: `${style.interestedBtn} ${
                                      interested ? style.interestedConfirmed : ""
                                    }`,
                                    handleClick: () => {
                                      !interested && setOpenModal(jobId);
                                    },
                                  },
                                {
                                  title: "View Job",
                                  link: `/jobs/details/${jobId}`,
                                },
                              ]}
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className={style.noResult}>
                    <Image src="/assets/icons/warning.svg" alt="warning" width={30} height={30} />
                    <span>
                      Sorry, there are no jobs matching your search criteria. Please try again with
                      different search criteria
                    </span>
                  </div>
                )}
              </div>
            )}
            {jobs?.jobs?.length > 0 && (
              <div style={{ margin: "30px 0px 80px" }}>
                <Pagination
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  count={jobs?.jobsCount}
                />
              </div>
            )}
          </div>
        )}

        {jobs?.jobs?.length > 0 && (
          <div
            className={style.showMap}
            style={{
              bottom: scrollPosition > 90 ? "-75px" : "",
              position: scrollPosition > 90 ? "absolute" : "",
              right: `calc(55% - ${mapView ? 185 : 140}px)`,
            }}
            onClick={() => {
              setMapView((prev) => !prev);
            }}
          >
            <Image height={30} width={30} src="/assets/imgs/map-80.png" alt="map_icon" />
            <p>{mapView ? "Show Table View" : "Show Map"}</p>
          </div>
        )}
      </Container>
      <InterestedModal
        open={openModal}
        loader={btnLoader}
        setOpen={setOpenModal}
        handleInterested={handleInterested}
      />
    </>
  );
};

export default memo(FindJobsPage);
