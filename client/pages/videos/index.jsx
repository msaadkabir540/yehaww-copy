/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import Card from "components/card";
import Modal from "components/modal";
import Button from "components/button";
import Select from "components/select";
import Loading from "components/loading";
import Container from "components/container";
import Pagination from "components/pagination";
import VideoPlayer from "page-sections/videos/video-player";
import MultiSelectGrouped from "components/multi-select-grouped";

import useVideo from "helpers/video-helper";

import style from "styles/video.module.scss";
import arrow from "public/assets/icons/arrow.svg";
import lockIcon from "public/assets/lock.svg";
import play from "public/assets/play.svg";
import loc from "public/assets/white-loc.svg";

const Video = () => {
  const {
    page,
    count,
    token,
    watch,
    router,
    videos,
    setPage,
    onClear,
    pageSize,
    userType,
    setValue,
    onSearch,
    setParams,
    isLoading,
    videoLink,
    setVideoLink,
    groupedOptions,
  } = useVideo();

  return (
    <>
      <Head>
        <title>Videos - Yehaww</title>
        <meta
          name="description"
          content="You can add videos's for your profile to get noticed more."
        />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      {isLoading ? (
        <>
          <div className={style.loaderWrapper}>
            <Loading loaderClass={style.loader} />
          </div>
        </>
      ) : (
        <div style={{ minHeight: "calc(100vh - 198px)" }}>
          <div className={style.mainHeader}>
            <h6>Browse Candidate Videos</h6>
            <p>
              Below is a small selection of latest video introductions from candidates looking for
              work. Alternatively, you can{" "}
              <Link href="/sign-up">
                <span> search our full list of candidates</span>
              </Link>
              .{" "}
              {userType !== "employer" && (
                <>
                  To be seen by employers here, please{" "}
                  <Link href={token ? "/profile-overview/my-upload" : "/sign-up/candidate"}>
                    <span>add a video introduction to your</span>
                  </Link>{" "}
                  profile.
                </>
              )}
            </p>
          </div>
          <Container>
            <div className={style.headingDiv}>
              <h1>
                <span>Videos</span>
                <div className={style.arrow_icon}>
                  <Image
                    src={arrow}
                    height={12}
                    width={12}
                    alt={"arrow icon"}
                    className={style.arrow_icon}
                  />
                </div>
                Search
              </h1>
            </div>
            <form className={style.filter_wrapper}>
              <div className={style.border}>
                <MultiSelectGrouped
                  name="position"
                  options={groupedOptions}
                  onChange={(e) => {
                    setValue("position", e.value);
                    setParams((prev) => {
                      return { ...prev, position: e.value };
                    });
                  }}
                  watch={watch}
                  isMulti={false}
                  customStyle={{
                    "&:hover": { borderColor: "none", cursor: "pointer" },
                    border: "none !important",
                    boxShadow: "none",
                    borderWidth: "0px",
                    padding: "0px",
                  }}
                />
              </div>
              <div className={style.border}>
                <Select
                  name={"sort"}
                  className={style.selectClass}
                  value={watch("sort") ? watch("sort") : ""}
                  onChange={(e) => {
                    setValue("sort", e.target.value);
                    setParams((prev) => {
                      return { ...prev, sort: e.target.value };
                    });
                  }}
                >
                  <option value="Newest">Newest Members</option>
                  <option value="Oldest">Oldest Members</option>
                </Select>
              </div>
              <div className={style.btnClass}>
                <p onClick={onClear}>Clear</p>
                <Button title={"Search"} type={"button"} handleClick={onSearch} />
              </div>
            </form>
            <div className={style.candidate_wrapper}>
              {videos?.map(
                ({
                  id,
                  firstName,
                  lastName,
                  image,
                  video,
                  availability,
                  profileLinkId,
                  currentCountry,
                  currentLocation,
                }) => {
                  const name = `${firstName} ${lastName}`;
                  const userName = token
                    ? name
                    : !name.includes("undefined")
                    ? name.substring(0, 1) + "*".repeat(name.length - 1)
                    : "Name";

                  return (
                    <div
                      className={style.card_wrapper}
                      style={{ backgroundImage: `url(${image})` }}
                      key={id}
                      onClick={(e) => {
                        e.stopPropagation();
                        token && video
                          ? setVideoLink(video)
                          : router.push(`/u/${profileLinkId}?page=${page}`);
                      }}
                    >
                      <div className={style.upperDiv}>
                        <div className={style.nameDiv}>
                          <div className={style.imgDiv}>
                            <Image
                              height={35}
                              width={35}
                              src={image}
                              alt={firstName + "profile img"}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/u/${profileLinkId}?page=${page}`);
                              }}
                            />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <p>{userName}</p>
                            <span className={style.value}>{`${availability}`}</span>
                          </div>
                        </div>
                        {!token ? (
                          <div className={style.lockDiv}>
                            <p>Locked</p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className={style.absoluteClass}>
                        {!token || !video ? (
                          <>
                            <Image alt="lock_icon" src={lockIcon} />
                            <Link href="/sign-up">
                              <p>{!video ? "Subscribe to unlock" : "Sign up for unlock"}</p>
                            </Link>
                          </>
                        ) : (
                          <Image src={play} alt="play" />
                        )}
                      </div>
                      <div className={style.locationClass}>
                        <Image alt="location" src={loc} />
                        <p>{`${currentLocation}, ${currentCountry}`}</p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            {count > pageSize ? (
              <div>
                <Pagination count={count} page={page} setPage={setPage} pageSize={pageSize} />
              </div>
            ) : (
              ""
            )}
          </Container>
        </div>
      )}
      <Modal
        children={<VideoPlayer src={videoLink} className={style.video} />}
        open={videoLink}
        title={`Video`}
        handleClose={() => setVideoLink("")}
      />
    </>
  );
};

export default Video;
