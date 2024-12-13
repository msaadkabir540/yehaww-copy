import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import Badge from "components/badge";
import Button from "components/button";
import Container from "components/container";
import BorderForm from "components/border-form";

import style from "./user.module.scss";
import logo from "public/assets/icons/logo.webp";
import call from "public/assets/icons/cv-call.svg";
import mail from "public/assets/icons/cv-mail.svg";
import lockIcon from "public/assets/icons/lock.svg";

const PrintUser = ({ profile }) => {
  const router = useRouter();
  const { id } = router.query;
  const name = `${profile?.contactDetail?.firstName} ${profile?.contactDetail?.lastName}`;
  const { token, user } = useSelector((state) => state?.app);
  const subscribed =
    user?.subscriptionStatus === "active" || user.candidateId === id || user?.profileLinkId === id;

  const checkEntryQualification =
    profile?.diplomaCertifications?.basicTraining?.STCW95?.status === "Yes" &&
    profile?.diplomaCertifications?.basicTraining?.medicalCertificate?.status === "Yes";
  const checkEducations = profile?.diplomaCertifications?.education;
  const checkQualifications = checkEntryQualification || checkEducations;

  return (
    <Container className={style.container}>
      <div className={style.divImgClass}>
        <div className={style.img}>
          <Image src={logo} height={55} width={250} alt="logo" />
        </div>
        <div className={style.border}></div>
      </div>
      <div className={style.mainWrapper}>
        <BorderForm className={style.box}>
          <div className={style.info_wrapper} style={{ marginBottom: "10px" }}>
            <div className={style.user_avatar}>
              <Image
                src={profile?.uploads?.mainPhoto}
                className={style.user_avatar}
                alt={"user avatar"}
                width={80}
                height={80}
              />
            </div>
            <div style={{ marginLeft: "20px" }}>
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
                <div className={style.call}>
                  <p>
                    <Image src={call} alt="" /> {profile?.contactDetail?.phoneNumber}
                  </p>
                  <p>
                    <Image src={mail} alt="" /> {profile?.contactDetail?.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </BorderForm>
        <div>
          <BorderForm
            titleClass={style.titleClass}
            className={style.box}
            title="Personal Information"
          >
            {!subscribed && (
              <div className={style.badgeBanner}>
                <div style={{ width: "28px", height: "28px" }} className={style.img}>
                  <Image src={lockIcon} width={28} height={20} alt={"lock icon"} />
                </div>
                <p className={style.p}>
                  <span>Locked</span>
                </p>
              </div>
            )}
            {token ? (
              <>
                {profile?.personalInformation
                  ?.filter((x) => x?.key !== "lookingForLiveInPosition")
                  ?.map(({ label, value }, index) => (
                    <div className={style.row} key={index}>
                      <div className={style.key}>{label}</div>
                      <div className={style.value}>{value ? value : "-"}</div>
                    </div>
                  ))}
              </>
            ) : (
              <>
                {profile?.personalInformation
                  ?.filter((x) => !["dateOfBirth"].includes(x.key))
                  .map(({ label, value }, index) => (
                    <div className={style.row} key={index}>
                      <div className={style.key}>{label}</div>
                      <div className={`${style.key} ${style.value}`}>{value}</div>
                    </div>
                  ))}
              </>
            )}
            {profile?.teamStatus
              ?.filter((x) => x?.key !== "partnerEmail")
              ?.map(({ label, value }, index) => (
                <div className={style.row} key={index}>
                  <div className={style.key}>{label}</div>
                  <div className={style.value}>{value}</div>
                </div>
              ))}
            {profile?.teamStatus
              ?.filter((x) => x.key === "partnerEmail")
              ?.map(({ value }, index) => (
                <div className={`${style.row}`} key={index}>
                  {value?.img && (
                    <Image width={30} height={30} src={value?.img} alt="partner-img" />
                  )}
                  {token ? (
                    <>
                      <div className={style.key}>Partner’s Email</div>
                      <div className={style.value}>{value?.email}</div>
                    </>
                  ) : (
                    <div style={{ display: "flex" }}>
                      <h4>{`${value?.firstName} ${value?.lastName}`.charAt(0).toUpperCase()}</h4>
                    </div>
                  )}
                  <div className={style.partnerDetail}>
                    {value?.firstChoice && value?.secondChoice && (
                      <p>{`${value?.firstChoice?.split("(")[0]} or ${
                        value?.secondChoice?.split("(")[0]
                      }`}</p>
                    )}
                  </div>
                </div>
              ))}
            {profile?.languages?.map(({ name, fluency }, index) => (
              <div className={style.row} key={index}>
                <div className={style.key}>Language</div>
                <div style={{ display: "flex", gap: "5px", width: "100%" }}>
                  <div className={style.outlineText}>{`${name} (${fluency})`}</div>
                </div>
              </div>
            ))}
          </BorderForm>
          <BorderForm titleClass={style.titleClass} className={style.box} title="Passport & Visas">
            {!subscribed ? (
              <div>
                <Badge title={"LOCKED"} className={style.lock_badge} />
              </div>
            ) : (
              <>
                {profile?.passportVisaInformation?.passports.length > 0 && (
                  <div id="visa">
                    <p style={{ fontSize: "14px", fontWeight: "600", paddingBottom: "8px" }}>
                      Passport
                    </p>
                    {profile?.passportVisaInformation?.passports?.map(
                      ({ expiry, issuerCountry }, index) => (
                        <div className={style.row} key={index}>
                          <div className={style.key}>{issuerCountry}</div>
                          <div className={style.value}>
                            Expire on {moment(new Date(expiry)).format("Do MMM YYYY")}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
                {profile?.passportVisaInformation?.visa.length > 0 && (
                  <>
                    <p style={{ fontSize: "14px", fontWeight: "600", paddingBottom: "8px" }}>
                      Visa
                    </p>
                    <div
                      style={{ display: "flex", alignItems: "flex-end", width: "100%", gap: "5px" }}
                    >
                      {profile?.passportVisaInformation?.visa?.map((visa, index) => (
                        <div className={style.row} key={index}>
                          <div className={style.outlineText}>{visa}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </BorderForm>
          <BorderForm titleClass={style.titleClass} className={style.box} title="About Me">
            <div className={style.row1}>
              <p className={style.key}>English</p>
              {profile?.aboutMe?.about && <p className={style.value}>{profile?.aboutMe?.about}</p>}
            </div>
            <div className={style.row1} style={{ marginTop: "20px" }}>
              {profile?.aboutMe?.aboutMeAnother?.language && (
                <h4 className={style.key}>{profile?.aboutMe?.aboutMeAnother?.language}</h4>
              )}
              {profile?.aboutMe?.aboutMeAnother?.text && (
                <p className={style.value}>{profile?.aboutMe?.aboutMeAnother?.text}</p>
              )}
            </div>
          </BorderForm>
          <BorderForm
            titleClass={style.titleClass}
            className={style.box}
            title="Hobbies / Interest"
          >
            <div className={style.row1}>
              <p className={style.key}>English</p>
              {profile?.aboutMe?.hobbiesInterests && (
                <p className={style.value}>{profile?.aboutMe?.hobbiesInterests}</p>
              )}
            </div>
            <div className={style.row1} style={{ marginTop: "20px" }}>
              {profile?.aboutMe?.hobbiesInterestsAnother?.language && (
                <h4 className={style.key}>{profile?.aboutMe?.hobbiesInterestsAnother?.language}</h4>
              )}
              {profile?.aboutMe?.hobbiesInterestsAnother?.text && (
                <p className={style.value}>{profile?.aboutMe?.hobbiesInterestsAnother?.text}</p>
              )}
            </div>
          </BorderForm>
        </div>
        <div>
          {profile?.experience?.experiences.length > 0 && (
            <BorderForm titleClass={style.titleClass} className={style.box} title="Experience">
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
                      sizeOfCompany,
                      nameOfCompany,
                      numberOfHorses,
                      levelOfOperation,
                    },
                    index
                  ) => (
                    <div key={index}>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "#252552",
                          paddingBottom: "5px",
                        }}
                      >
                        {positionRole}
                      </p>
                      <p
                        style={{
                          color: "#B29E85",
                          fontSize: "16px",
                          fontWeight: "500",
                          paddingBottom: "5px",
                        }}
                      >
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
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          paddingBottom: "5px",
                          color: "#252525",
                        }}
                      >
                        {sizeOfCompany || 0} Employees | {numberOfHorses || 0} Horses |{" "}
                        {subscribed ? (
                          levelOfOperation
                        ) : (
                          <Badge
                            title={"LOCKED"}
                            styles={{ margin: "0 5px" }}
                            className={style.lock_badge}
                          />
                        )}
                      </p>
                      <p style={{ fontStyle: "italic", paddingBottom: "5px", fontSize: "15px" }}>
                        {startDate} - {stillEmployed ? "Present" : endDate} {duration}
                      </p>
                      <p className={style.value}>{description}</p>
                    </div>
                  )
                )}
              </div>
            </BorderForm>
          )}
          {profile?.experience?.generalExperience.length > 0 && (
            <BorderForm
              titleClass={style.titleClass}
              className={style.box}
              title="General Experience"
            >
              <div className={style.row}>
                <p className={style.key}>Title</p>
                <p className={style.value}>Experience</p>
              </div>
              {profile?.experience?.generalExperience?.map(({ duration, name }, index) => (
                <div className={style.row} key={index}>
                  <p className={style.key}>{name}</p>
                  <p className={style.value}>{duration}</p>
                </div>
              ))}
            </BorderForm>
          )}
        </div>
        <div>
          {true &&
          profile?.diplomaCertifications?.education?.length < 1 &&
          profile?.diplomaCertifications?.certifications?.length < 1 ? (
            ""
          ) : (
            <BorderForm
              titleClass={style.titleClass}
              className={style.box}
              title="Degree & Certificates"
            >
              {profile?.diplomaCertifications?.education?.length > 0 && (
                <>
                  <p className={style.key}>
                    <b>Degree</b>
                  </p>
                  <div className={style.heightClass}>
                    <div className={style.verifyDiv}>
                      <p className={style.key}>{profile?.diplomaCertifications?.education}</p>
                    </div>
                  </div>
                </>
              )}
              {profile?.diplomaCertifications?.certifications?.length > 0 && (
                <>
                  <p className={style.key}>
                    <b>Certificates</b>
                  </p>
                  <div className={style.heightClass}>
                    {profile?.diplomaCertifications?.certifications?.map(
                      ({ _id, title, issueDate, issuedBy, url }) => (
                        <div className={style.row} key={_id}>
                          <div style={{ width: "100%" }}>
                            <p
                              style={{
                                fontSize: "15px",
                                color: "#b29e85",
                                paddingBottom: "5px",
                              }}
                            >
                              {title}
                            </p>
                            <p className={style.value}>{issuedBy}</p>
                            <p className={style.value}>
                              Issued on {moment(new Date(issueDate)).format("DD MMM, YYYY")}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </BorderForm>
          )}
          {profile?.availabilityInfo?.length > 0 && (
            <BorderForm titleClass={style.titleClass} className={style.box} title="Availability">
              {profile?.availabilityInfo?.map(({ label, value }, index) => (
                <div className={style.row} key={index}>
                  <div className={style.key}>{label}</div>
                  <div className={style.value}>{value}</div>
                </div>
              ))}
            </BorderForm>
          )}
          {profile?.references?.length > 0 && (
            <BorderForm className={style.box} titleClass={style.titleClass} title="References">
              <div className={style.heightClass}>
                {profile?.references?.map(
                  ({ _id, name, companyName, phone, email, verified, denied, relationship }) => (
                    <div
                      className={style.row}
                      style={{ borderBottom: "1px solid #e2e2ea", marginTop: "5px" }}
                      key={_id}
                    >
                      <div style={{ width: "100%" }}>
                        <p className={style.value}>{`${name} (${relationship})`}</p>
                        <p
                          style={{
                            fontSize: "17px",
                            fontWeight: "500",
                            color: "#b29e85",
                            paddingBottom: "5px",
                          }}
                        >
                          {companyName}
                        </p>
                        <p className={style.value}>
                          {email} |{" "}
                          <a
                            href={`tel:${phone}`}
                            className={style.value}
                            style={{ color: "#5D77A0", textDecoration: "underline" }}
                          >
                            +{phone}
                          </a>
                        </p>
                      </div>
                      <div className={style.verified}>
                        {!verified && !denied ? (
                          <Badge title={"REQUEST SENT"} className={style.badgeWrapper} />
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
                              <Badge title={"VERIFIED"} className={style.verifiedBadge} />
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
          {profile?.interestedJob && Object?.keys(profile?.interestedJob).length > 0 && (
            <BorderForm
              className={style.box}
              title={`Cover Letter for ${profile?.interestedJob?.jobTitle?.split(" (")?.[0]} - ${
                profile?.interestedJob?.companyName
                  ? profile?.interestedJob?.companyName
                  : "Anonymous"
              }`}
            >
              {profile?.interestedJob?.coverLetter && (
                <div className={`${style.coverLetter} ${style.heightClass}`}>
                  <p>{profile?.interestedJob?.coverLetter}</p>
                </div>
              )}
            </BorderForm>
          )}
          {profile?.skillsDriverLicense?.licenses?.length > 0 && (
            <BorderForm className={style.box} title="Driving Licence" titleClass={style.titleClass}>
              <div style={{ display: "flex", gap: "5px" }}>
                {profile?.skillsDriverLicense?.licenses
                  ?.filter(({ value }) => value === "Yes")
                  ?.map(({ key }, index) => (
                    <div className={style.outlineText} key={index}>
                      {key}
                    </div>
                  ))}
              </div>
            </BorderForm>
          )}
        </div>
        <div>
          {profile?.experience?.experienceLevel?.length > 0 && (
            <BorderForm className={style.box} title=" Experience" titleClass={style.titleClass}>
              <div className={style.gridClass}>
                {profile?.experience?.experienceLevel?.map(
                  ({ experienceLevel, experienceType, name, percentage, color }, index) => (
                    <div className={style.box2}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p className={style.form_title}>{name}</p>
                        <span className={style.form_title2}>
                          ( {experienceLevel} | {experienceType})
                        </span>
                      </div>
                      <div className={style.flex} key={index}>
                        {Array(10)
                          .fill(1)
                          .map((x, index) => {
                            const count = Math.ceil(percentage / 10);

                            return (
                              <div
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: index + 1 <= count && color ? color : "#EBEBEB",
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
          {profile?.skillsDriverLicense?.skills?.length > 0 && (
            <BorderForm className={style.box} title="Skills" titleClass={style.titleClass}>
              <div className={style.gridClass}>
                {profile?.skillsDriverLicense?.skills?.map(
                  ({ color, label, percentage, value }, index) => (
                    <div className={style.box2}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p className={style.form_title}>{label}</p>
                        <span className={style.form_title2}>({value})</span>
                      </div>
                      <div className={style.flex} key={index}>
                        {Array(10)
                          .fill(1)
                          .map((x, index) => {
                            const count = Math.ceil(percentage / 10);
                            return (
                              <div
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: index + 1 <= count && color ? color : "#EBEBEB",
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
      </div>
    </Container>
  );
};

export default PrintUser;
