/* eslint-disable @next/next/no-img-element */
import moment from "moment";
import Link from "next/link";
import Image from "next/image";

import HeadSeo from "components/head-meta";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faBars, faEnvelope, faWarning } from "@fortawesome/free-solid-svg-icons";

import Badge from "components/badge";
import Modal from "components/modal";
import Button from "components/button";
import Navbar from "components/navbar";
import Loading from "components/loading";
import Container from "components/container";
import PrintUser from "page-sections/user-profile";
import HeaderComponent from "components/header-compo";
import VideoPlayer from "page-sections/videos/video-player";

import { isWindowDefined } from "utils/helper";
import { useProfile } from "helpers/user-profile-helper";

import style from "styles/user-profile.module.scss";
import callLogo from "public/assets/call.svg";
import mailLogo from "public/assets/mail.svg";
import BreadCrumb from "components/bread-crumb";
import BorderForm from "components/border-form";
import printIcon from "public/assets/print.svg";
import whatsApp from "public/assets/whatspp.svg";
import lockIcon from "public/assets/icons/lock.svg";
import { useMemo } from "react";

const Profile = ({ profileMeta }) => {
  const {
    id,
    user,
    print,
    jobId,
    token,
    router,
    onPrint,
    profile,
    loading,
    isLoading,
    videoLink,
    nav_links,
    componentRef,
    setVideoLink,
    candidateEmail,
    handleShortlistCandidates,
  } = useProfile();
  const name = `${profile?.contactDetail?.firstName} ${profile?.contactDetail?.lastName}`;
  const metaName = `${profileMeta?.personalInfo?.contactDetail?.firstName} ${profileMeta?.personalInfo?.contactDetail?.lastName}`;
  const subscribed = useMemo(() => {
    return (
      user?.subscriptionStatus === "active" ||
      user.candidateId === id ||
      user?.profileLinkId === id ||
      (candidateEmail && token)
    );
  }, [user, candidateEmail, id, token]);

  const uploads = Boolean(profile.uploads);
  const aboutMe = Boolean(profile.aboutMe);
  const availabilityInfo = Boolean(profile.availabilityInfo);
  const experience = Boolean(profile?.experience?.generalExperience.length > 0);
  const personalInformation = Boolean(profile?.personalInformation?.length > 1);

  return (
    <>
      {metaName && (
        <HeadSeo
          altText={"A picture candidate profile"}
          title={`Yehaww - ${metaName}`}
          ogImage={`${profileMeta?.uploads?.mainPhoto || "/assets/horses-in-barn.webp"}`}
        >
          <title>Profile - Yehaww</title>
          <meta name="description" content="Here your profile will be in the spotlight" />
          <link rel="icon" href="\assets\imgs\logo.webp" />
        </HeadSeo>
      )}

      {!isLoading ? (
        <>
          {profile.profileCompletion === 100 ||
          (aboutMe && availabilityInfo && experience && uploads && personalInformation) ||
          (profile.profileCompletion === 90 && !profile.resume) ? (
            <div className={style.profile_wrapper}>
              <HeaderComponent heading="Profile" />
              <Container>
                <BreadCrumb
                  className={style.breadCrumb}
                  containerClass={style.breadCrumbContainer}
                  data={nav_links}
                />
                <BorderForm className={style.borderForm}>
                  <div className={style.parentClass}>
                    <div className={style.info_wrapper}>
                      <div className={style.user_avatar}>
                        <Image
                          width={152}
                          height={143}
                          src={profile?.uploads?.mainPhoto}
                          className={style.user_avatar}
                          alt={"user avatar"}
                        />
                      </div>
                      <div className={style.lockSec}>
                        <div className={style.btn_wrapper} style={{ marginBottom: "10px" }}>
                          <div className={style.icons}>
                            <Image
                              src={printIcon}
                              className={style.icons}
                              onClick={onPrint}
                              alt="print"
                            />
                          </div>
                          {subscribed && profile?.contactDetail?.phoneNumber ? (
                            <>
                              <a
                                className={style.icons}
                                href={`tel:+${profile?.contactDetail?.phoneNumber}`}
                              >
                                <div className={style.icons}>
                                  <Image alt="call" src={callLogo} className={style.icons} />
                                </div>
                              </a>
                              <a
                                className={style.icons}
                                href={`mailto:${profile?.contactDetail?.email}`}
                              >
                                <div className={style.icons}>
                                  <Image alt="mail" src={mailLogo} className={style.icons} />
                                </div>
                              </a>
                              {profile?.contactDetail?.phoneNumber && (
                                <a
                                  className={style.icons}
                                  href={`https://wa.me/+${profile?.contactDetail?.phoneNumber}?text=Hi,%20${name}`}
                                  target="_blank"
                                >
                                  <div className={style.icons}>
                                    <Image
                                      src={whatsApp}
                                      alt={"whatsapp-logo"}
                                      className={style.icons}
                                    />
                                  </div>
                                </a>
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                        <h3>
                          {!subscribed ? (
                            <>
                              {name?.trim()?.slice(0, 1)?.toUpperCase()}
                              <Badge title={"LOCKED"} className={style.lock_badge} />
                            </>
                          ) : (
                            name
                          )}
                        </h3>
                        <p>Member since {profile?.createdAt}</p>
                        {subscribed && (
                          <Button
                            className={style.btnDownload}
                            title={"Download CV"}
                            handleClick={onPrint}
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      {subscribed && jobId && (
                        <>
                          <div className={style.btnDownloadWrapper}>
                            <Button
                              title={profile?.shortlisted === true ? "Shortlisted" : "Shortlist"}
                              isLoading={loading === "shortlist"}
                              disabled={profile?.shortlisted === true}
                              styles={{
                                backgroundColor: profile?.shortlisted === true ? "#1dbc7b" : "",
                              }}
                              handleClick={() => {
                                handleShortlistCandidates("true");
                              }}
                            />
                          </div>
                          <div className={style.btnDownloadWrapper}>
                            <Button
                              className={style.btnDownload1}
                              title={"Not Interested"}
                              isLoading={loading === "notInterested"}
                              disabled={profile?.shortlisted === false}
                              styles={{
                                backgroundColor: profile?.shortlisted === false ? "#1dbc7b" : "",
                                color: profile?.shortlisted === false ? "#fff" : "",
                                marginTop: "10px",
                              }}
                              handleClick={() => {
                                handleShortlistCandidates("false");
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className={style.gridClass3}>
                    <div>
                      <BorderForm
                        className={style.borderForm2}
                        title="Personal Information"
                        backStyle={{ borderRight: "1px solid #EBEBEB" }}
                      >
                        <div id="personal" className={style.heightClass}>
                          {!subscribed && (
                            <div className={style.badgeBanner}>
                              <div style={{ width: "28px", height: "28px" }} className={style.img}>
                                <Image src={lockIcon} width={28} height={20} alt={"lock icon"} />
                              </div>
                              <p className={style.p}>
                                <span>Locked</span> -
                                <Link href={user?.type === "candidate" ? "/" : "/subscription"}>
                                  Click here
                                </Link>
                                for membership options
                              </p>
                            </div>
                          )}
                          {profile?.personalInformation?.map(({ key, label, value }, index) => (
                            <div className={style.row} key={index}>
                              <div className={style.key}>{label}</div>
                              <div className={`${style.key} ${style.value}`}>
                                {key === "nationality" ? value.join(", ") : value ? value : "-"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </BorderForm>
                      <BorderForm
                        className={style.borderForm2}
                        title="Team"
                        backStyle={{ borderRight: "1px solid #EBEBEB" }}
                      >
                        <div id="personal" className={style.heightClass}>
                          {profile.teamStatus
                            ?.filter(
                              (x) => x.key !== "requestedPartnerVerification" && x.value !== ""
                            )
                            ?.map(({ label, key, value }, index) => (
                              <>
                                {key === "partnerEmail" && value ? (
                                  <div className={`${style.partnerProfile} ${style.row}`}>
                                    <div className={style.img}>
                                      <Image
                                        height={150}
                                        width={150}
                                        src={
                                          value?.img ||
                                          "https://i.pinimg.com/736x/d9/56/9b/d9569bbed4393e2ceb1af7ba64fdf86a.jpg"
                                        }
                                        alt="partner-img"
                                      />
                                    </div>
                                    <div className={style.partnerDetail}>
                                      {subscribed ? (
                                        <h4>{`${value?.firstName} ${value?.lastName}`}</h4>
                                      ) : (
                                        <div style={{ display: "flex" }}>
                                          <h4>
                                            {`${value?.firstName} ${value?.lastName}`
                                              ?.trim()
                                              ?.charAt(0)
                                              ?.toUpperCase()}
                                          </h4>
                                          <Badge title={"Locked"} className={style.lock_badge} />
                                        </div>
                                      )}
                                      <p>{`${value?.firstChoice.split("(")[0]} or ${
                                        value?.secondChoice.split("(")[0]
                                      }`}</p>
                                      {value?._id && (
                                        <Button
                                          title={"View Profile"}
                                          className={style.btnPassport1}
                                          handleClick={() => {
                                            router.push(`/u/${value?._id}`);
                                          }}
                                          type={"button"}
                                        />
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className={style.row} key={index}>
                                    <div className={style.key}>{label}</div>
                                    <div className={style.value}>{value}</div>
                                  </div>
                                )}
                              </>
                            ))}
                        </div>
                      </BorderForm>
                      <BorderForm
                        className={style.borderForm2}
                        title="Passport"
                        backStyle={{ borderRight: "1px solid #EBEBEB" }}
                      >
                        {!subscribed ? (
                          <div>
                            <Badge title={"LOCKED"} className={style.lock_badge} />
                          </div>
                        ) : (
                          <>
                            {profile?.passportVisaInformation?.passports.length > 0 && (
                              <div id="visa" className={style.heightClass}>
                                {profile?.passportVisaInformation?.passports?.map(
                                  ({ expiry, issuerCountry }, index) => (
                                    <div className={style.row} key={index}>
                                      <div className={style.key}>{issuerCountry}</div>
                                      <div className={style.value}>
                                        {moment(new Date(expiry)).format("Do MMM YYYY")}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </BorderForm>
                      <BorderForm
                        className={style.borderForm2}
                        title="Visas"
                        backStyle={{ borderRight: "1px solid #EBEBEB" }}
                      >
                        {!subscribed ? (
                          <div>
                            <Badge title={"LOCKED"} className={style.lock_badge} />
                          </div>
                        ) : (
                          <>
                            {profile?.passportVisaInformation?.visa.length > 0 && (
                              <div>
                                {profile?.passportVisaInformation?.visa?.map((visa, index) => (
                                  <div className={style.row} key={index}>
                                    {visa == "Other Visa" ? (
                                      <div className={style.key}>
                                        {visa}: {profile?.passportVisaInformation?.otherVisa}
                                      </div>
                                    ) : (
                                      <div className={style.key}>{visa}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </BorderForm>
                      <BorderForm
                        className={style.borderForm2}
                        title="Qualifications"
                        backStyle={{ borderRight: "1px solid #EBEBEB" }}
                      >
                        <div className={style.heightClass}>
                          {profile?.diplomaCertifications?.education ? (
                            <div className={style.row}>
                              <p className={style.key}>
                                {profile?.diplomaCertifications?.education}
                              </p>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </BorderForm>

                      <BorderForm
                        className={style.borderForm2}
                        title="Hobbies"
                        backStyle={{ borderRight: "1px solid #EBEBEB" }}
                      >
                        <div id="hobby" className={style.heightClass}>
                          <div className={style.row}>
                            <p className={style.key}>English</p>
                            {profile?.aboutMe?.hobbiesInterests && (
                              <p className={style.value}>{profile?.aboutMe?.hobbiesInterests}</p>
                            )}
                          </div>
                          <div className={style.row} style={{ marginTop: "15px" }}>
                            {profile?.aboutMe?.hobbiesInterestsAnother?.language && (
                              <h4 className={style.key}>
                                {profile?.aboutMe?.hobbiesInterestsAnother?.language}
                              </h4>
                            )}
                            {profile?.aboutMe?.hobbiesInterestsAnother?.text && (
                              <p className={style.value}>
                                {profile?.aboutMe?.hobbiesInterestsAnother?.text}
                              </p>
                            )}
                          </div>
                        </div>
                      </BorderForm>
                    </div>
                    <div>
                      <BorderForm
                        className={style.borderForm2}
                        backStyle={{ borderRight: "1px solid #EBEBEB" }}
                        title="About"
                      >
                        <div id="about" className={style.heightClass}>
                          <div className={style.row}>
                            <p className={style.key}>English</p>
                            {profile?.aboutMe?.about && (
                              <p className={style.value}>{profile?.aboutMe?.about}</p>
                            )}
                          </div>
                          <div className={style.row} style={{ marginTop: "15px" }}>
                            {profile?.aboutMe?.aboutMeAnother?.language && (
                              <h4 className={style.key}>
                                {profile?.aboutMe?.aboutMeAnother?.language}
                              </h4>
                            )}
                            {profile?.aboutMe?.aboutMeAnother?.text && (
                              <p className={style.value}>
                                {profile?.aboutMe?.aboutMeAnother?.text}
                              </p>
                            )}
                          </div>
                        </div>
                      </BorderForm>
                      <BorderForm
                        className={style.borderForm2}
                        backStyle={{ borderRight: "1px solid #EBEBEB" }}
                        title="Languages"
                      >
                        <div id="language" className={style.heightClass}>
                          {profile.languages?.map(({ name, fluency }, index) => (
                            <div className={style.row} key={index}>
                              <div className={style.key}>{name}</div>
                              <div className={style.value}>{fluency}</div>
                            </div>
                          ))}
                        </div>
                      </BorderForm>
                      {profile?.diplomaCertifications?.certifications?.length > 0 && (
                        <BorderForm
                          className={style.borderForm2}
                          title="Certificates"
                          backStyle={{ borderRight: "1px solid #EBEBEB" }}
                        >
                          <div className={style.heightClass}>
                            {profile?.diplomaCertifications?.certifications?.map(
                              ({ _id, title, issuedBy, issueDate, url }) => (
                                <div style={{ marginBottom: "10px" }}>
                                  <div className={style.row1} key={_id}>
                                    <p className={style.value1}>Issued By</p>
                                    <div className={style.value}>{issuedBy}</div>
                                  </div>
                                  <div
                                    key={_id}
                                    className={style.row1}
                                    style={{ marginTop: "-10px" }}
                                  >
                                    <p className={style.value1}>
                                      {title} - {moment(new Date(issueDate)).format("Do MMM YYYY")}
                                    </p>
                                    <div className={style.key}>
                                      <a
                                        href={url}
                                        target="_blank"
                                        className={`${style.value} ${style.link}`}
                                      >
                                        View
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </BorderForm>
                      )}
                      {profile?.references?.length > 0 && (
                        <BorderForm
                          className={style.borderForm2}
                          title="References"
                          backStyle={{ borderRight: "1px solid #EBEBEB" }}
                        >
                          <div className={style.heightClass}>
                            {profile?.references?.map(
                              ({ _id, name, companyName, phone, email, verified, denied }) => (
                                <div className={style.row} key={_id}>
                                  <div style={{ width: "100%" }}>
                                    <p className={style.value}>{name}</p>
                                    <p className={style.value}>{companyName}</p>
                                    <a
                                      href={`tel:${phone}`}
                                      className={style.value}
                                      style={{ color: "#5D77A0", textDecoration: "underline" }}
                                    >
                                      {phone}
                                    </a>
                                    <p className={style.value}>{email}</p>
                                  </div>
                                  <div className={style.verified}>
                                    {!verified && !denied ? (
                                      <Badge
                                        title={"REFERENCE REQUEST SENT"}
                                        className={style.badgeWrapper}
                                      />
                                    ) : verified ? (
                                      <>
                                        {user.type === "employer" ? (
                                          <Button
                                            title="View Verified Reference"
                                            styles={{ width: "205px", maxWidth: "205px" }}
                                            handleClick={() => {
                                              router.push({
                                                pathname: "/verified-reference",
                                                query: {
                                                  userId: profile.userId,
                                                  email,
                                                  verified: true,
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <Badge
                                            title={"VERIFIED"}
                                            className={style.verifiedBadge}
                                          />
                                        )}
                                      </>
                                    ) : denied ? (
                                      <Badge title={"DECLINED"} className={style.deniedBadge} />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </BorderForm>
                      )}
                      {profile?.interestedJob &&
                        Object?.keys(profile?.interestedJob).length > 0 && (
                          <BorderForm
                            className={style.borderForm2}
                            title={`Cover Letter for ${
                              profile?.interestedJob?.jobTitle?.split(" (")?.[0]
                            } - ${profile?.interestedJob?.companyName}`}
                            backStyle={{ borderRight: "1px solid #EBEBEB" }}
                          >
                            {profile?.interestedJob?.coverLetter && (
                              <div className={`${style.coverLetter} ${style.heightClass}`}>
                                <p>{profile?.interestedJob?.coverLetter}</p>
                              </div>
                            )}
                          </BorderForm>
                        )}
                    </div>
                    <div>
                      {profile?.experience?.experiences.length > 0 && (
                        <BorderForm className={style.borderForm2} title="Detailed Experience">
                          <div id="about" className={style.heightClass}>
                            {profile?.experience?.experiences?.map(
                              (
                                {
                                  endDate,
                                  duration,
                                  startDate,
                                  description,
                                  positionRole,
                                  stillEmployed,
                                  nameOfCompany,
                                  numberOfHorses,
                                  levelOfOperation,
                                },
                                index
                              ) => (
                                <div key={index}>
                                  <p>
                                    {startDate} - {stillEmployed ? "Now" : endDate} {duration}
                                  </p>
                                  <p className={style.flex}>
                                    {positionRole} on a {numberOfHorses} horse{"  "}
                                    {subscribed ? (
                                      levelOfOperation
                                    ) : (
                                      <Badge
                                        title={"LOCKED"}
                                        styles={{ margin: "0 5px" }}
                                        className={style.lock_badge}
                                      />
                                    )}{" "}
                                    called{" "}
                                    {subscribed ? (
                                      nameOfCompany
                                    ) : (
                                      <Badge
                                        title={"LOCKED"}
                                        className={style.lock_badge}
                                        styles={{ margin: "0 5px" }}
                                      />
                                    )}
                                  </p>
                                  <p className={style.key}>{description}</p>
                                </div>
                              )
                            )}
                          </div>
                        </BorderForm>
                      )}
                      <BorderForm className={style.borderForm2} title="General Experience">
                        <div className={style.heightClass}>
                          <div className={style.row}>
                            <p className={style.key} style={{ fontWeight: 600 }}>
                              Title
                            </p>
                            <p className={style.value} style={{ fontWeight: "bold !important" }}>
                              Duration
                            </p>
                          </div>
                          {profile?.experience?.generalExperience?.map(
                            ({ duration, name }, index) =>
                              name && (
                                <div className={style.row} key={index}>
                                  <p className={style.key}>{name}</p>
                                  <p className={style.value}>{duration}</p>
                                </div>
                              )
                          )}
                        </div>
                      </BorderForm>
                      <BorderForm className={style.borderForm2} title="Availability">
                        {profile?.availabilityInfo?.length > 0 && (
                          <div id="available" className={style.heightClass}>
                            {profile?.availabilityInfo?.map(({ label, value }, index) => (
                              <div className={style.row} key={index}>
                                <div className={style.key}>{label}</div>
                                <div className={style.value}>{value}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </BorderForm>
                      {profile?.uploads &&
                        Object.keys(profile?.uploads).filter((x) => x !== "mainPhoto").length >
                          0 && (
                          <BorderForm className={style.borderForm2} title="Downloads">
                            {(profile?.uploads?.video ||
                              profile?.uploads?.partnerCV ||
                              profile?.uploads?.additionalFiles) && (
                              <div id="asd">
                                {!subscribed ? (
                                  <Badge title={"LOCKED"} className={style.lock_badge} />
                                ) : (
                                  // download css code here

                                  <div className={style.heightClass}>
                                    {profile?.uploads?.mainPhoto && (
                                      <div className={style.row}>
                                        <div className={style.key}>Main Photo</div>
                                        <div className={style.key}>
                                          {" "}
                                          <a
                                            className={`${style.value} ${style.link}`}
                                            href={profile?.uploads?.mainPhoto}
                                          >
                                            View
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                    {profile?.uploads?.video && (
                                      <div className={style.row}>
                                        <div className={style.key}>Video</div>
                                        <div className={style.key}>
                                          {" "}
                                          <div
                                            className={`${style.value} ${style.link}`}
                                            style={{ width: "fit-content" }}
                                            onClick={() => {
                                              setVideoLink(profile?.uploads?.video);
                                            }}
                                          >
                                            View
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {profile?.resume && (
                                      <div className={style.row}>
                                        <div className={style.key}>Curriculum Vitae</div>
                                        <div className={style.key}>
                                          {" "}
                                          <a
                                            className={`${style.value} ${style.link}`}
                                            href={profile?.resume}
                                          >
                                            View
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                    {profile?.uploads?.partnerCV && (
                                      <div className={style.row}>
                                        <div className={style.key}>Partner CV</div>
                                        <div className={style.key}>
                                          {" "}
                                          <a
                                            className={`${style.value} ${style.link}`}
                                            href={profile?.uploads?.partnerCV}
                                          >
                                            View
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                    {profile?.uploads?.additionalFiles && (
                                      <div className={style.row}>
                                        <div className={style.key}>Additional File</div>
                                        <div className={style.key}>
                                          {" "}
                                          <a
                                            className={`${style.value} ${style.link}`}
                                            href={profile?.uploads?.additionalFiles}
                                            target="_blank"
                                          >
                                            View
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </BorderForm>
                        )}
                    </div>
                  </div>
                  <div className={style.gridClass}>
                    <BorderForm
                      className={style.borderForm1}
                      title="Experience"
                      backStyle={{
                        borderRight: "1px solid #EBEBEB",
                        paddingRight: "10px !important",
                      }}
                    >
                      <div className={style.gridClass}>
                        {profile?.experience?.experienceLevel?.map(
                          ({ experienceLevel, experienceType, name, percentage, color }, index) => (
                            <div className={style.borderForm2}>
                              <p className={style.form_title}>
                                {name}{" "}
                                <span>
                                  ({experienceLevel} | {experienceType})
                                </span>
                              </p>
                              <div className={style.flex} key={index}>
                                {Array(10)
                                  .fill(1)
                                  .map((x, index) => {
                                    const count = Math.ceil(percentage / 10);
                                    return (
                                      <div
                                        style={{
                                          width: `${percentage}%`,
                                          backgroundColor:
                                            index + 1 <= count && color ? color : "#EBEBEB",
                                        }}
                                        className={style.progress}
                                      ></div>
                                    );
                                  })}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </BorderForm>
                    {profile?.skillsDriverLicense?.skills?.length > 0 && (
                      <BorderForm className={style.borderForm1} title="Skills">
                        <div className={style.gridClass}>
                          {profile?.skillsDriverLicense?.skills?.map(
                            ({ color, label, percentage, value }, index) => (
                              <div className={style.borderForm2}>
                                <p className={style.form_title}>
                                  {label} <span>({value})</span>
                                </p>
                                <div className={style.flex} key={index}>
                                  {Array(10)
                                    .fill(1)
                                    .map((x, index) => {
                                      const count = Math.ceil(percentage / 10);

                                      return (
                                        <div
                                          style={{
                                            width: `${percentage}%`,
                                            backgroundColor:
                                              index + 1 <= count && color ? color : "#EBEBEB",
                                          }}
                                          className={style.progress}
                                        ></div>
                                      );
                                    })}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </BorderForm>
                    )}
                  </div>
                </BorderForm>
              </Container>
              <Button
                handleClick={() => router.back()}
                icon={"/assets/icons/cross.svg"}
                className={style.btn_cross}
              />
            </div>
          ) : (
            <>
              <Navbar />
              <div className={style.incompleteMain}>
                <div className={style.headingDiv}>
                  <Container>
                    <BreadCrumb
                      className={style.breadCrumb}
                      containerClass={style.breadCrumbContainer}
                      data={nav_links}
                    />
                  </Container>
                </div>
                <div className={style.incomplete}>
                  <FontAwesomeIcon icon={faWarning} className={style.icons} />
                  <span>Incomplete or inactive profile, unable to view</span>
                </div>
                {/* )} */}
              </div>
            </>
          )}
          <div ref={componentRef}>{print && <PrintUser profile={profile} />}</div>
          <Modal
            children={<VideoPlayer src={videoLink} className={style.video} />}
            open={videoLink}
            title={`Video`}
            handleClose={() => setVideoLink("")}
          />
        </>
      ) : (
        <div className={style.loader}>
          <Loading />
        </div>
      )}
    </>
  );
};

export default Profile;

export async function getServerSideProps(context) {
  const { id, jobId } = context.query;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}candidate/profile/${id}${jobId ? "/" + jobId : ""}`
  );
  const data = await res.json();

  return { props: { profileMeta: data } };
}
