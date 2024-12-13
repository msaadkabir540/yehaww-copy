import Image from "next/image";
import Link from "next/link";

import Input from "components/input";
import Switch from "components/switch";
import Button from "components/button";
import Loading from "components/loading";
import BorderForm from "components/border-form";

import { useProfile } from "../helper";

import editInfo from "public/assets/edit-info.svg";
import infoIcon from "public/assets/icons/info.png";

import style from "./setting.module.scss";

const SettingsProfile = () => {
  const {
    user,
    watch,
    errors,
    editUrl,
    setValue,
    settings,
    setEditUrl,
    btnLoading,
    setSettings,
    settingsLoader,
    handleUpdateSettings,
    handleUpdateProfileLink,
  } = useProfile();

  return (
    <>
      <BorderForm title={"Settings"} className={style.form}>
        {settingsArrList?.map(({ path, title, name }) =>
          name === "profileLinkId" ? (
            <div
              style={{
                alignItems: "flex-end",
              }}
              className={editUrl ? style.gridClass : style.borderClass}
              key={title}
            >
              <div style={{ height: "Hug (81px)px", gap: "15px", opacity: "0px" }}>
                <div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <p>{title}</p>
                    <div className={style.iconInfo}>
                      <Image src={infoIcon} alt="info-icon" />
                      <div className={style.hoverDiv}>
                        This is your customized url you can share with someone
                      </div>
                    </div>
                  </div>
                  {editUrl ? (
                    <div className={style.inputType}>
                      <p
                        style={{
                          color: "#C0C0C0",
                        }}
                      >
                        {initalLink}
                      </p>

                      <Input
                        className={style.input}
                        star="*"
                        placeholder=""
                        type="text"
                        name={name}
                        value={watch(name)}
                        label=""
                        onChange={({ target }) => setValue("profileLinkId", target.value)}
                        errorMessage={errors?.[name]?.message}
                      />
                    </div>
                  ) : (
                    <p style={{ marginTop: "15px" }}>
                      <span style={{ color: "#C0C0C0" }}>{initalLink}</span>
                      {settings?.profileLinkId}
                    </p>
                  )}
                </div>
              </div>
              <div>
                {editUrl ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "Hug (170px)px",
                      height: "Hug (41px)px",
                      gap: "10px",
                      opacity: "0px",
                      marginRight: "10px",
                    }}
                  >
                    <Button
                      title="Cancel"
                      className={style.cancelBtn}
                      handleClick={() => setEditUrl(false)}
                    />
                    <Button
                      title="Save"
                      isLoading={btnLoading}
                      handleClick={() => {
                        handleUpdateProfileLink({
                          data: { profileLinkId: watch("profileLinkId") },
                        });
                      }}
                      styles={{ width: "100px", height: "47px" }}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setEditUrl(true);
                      setValue("profileLinkId", settings?.profileLinkId);
                    }}
                  >
                    <Image src={editInfo} alt="editInfo" />
                  </div>
                )}
              </div>
            </div>
          ) : path ? (
            <div className={style.borderClass} key={title}>
              <Link href={path === "#" ? `/u/${settings?.profileLinkId}` : path}>
                <a>
                  <p>{title}</p>
                </a>
              </Link>
              <div style={{ cursor: "pointer", width: "19px", height: "23px" }}>
                <Link href={path === "#" ? `/u/${settings?.profileLinkId}` : path}>
                  <Image src={editInfo} alt="editInfo" />
                </Link>
              </div>
            </div>
          ) : (
            <div className={style.borderClass} key={title}>
              <p>{title}</p>
              {settingsLoader === name ? (
                <Loading />
              ) : (
                <Switch
                  name={name}
                  setSettings={setSettings}
                  checked={settings?.[name]}
                  handleUpdateSettings={handleUpdateSettings}
                />
              )}
            </div>
          )
        )}
      </BorderForm>
    </>
  );
};

export default SettingsProfile;

const initalLink = `${process.env.NEXT_PUBLIC_BASE_URL}/u/`;

const settingsArrList = [
  {
    title: "Profile Custom URL",
    path: "#",
    name: "profileLinkId",
  },
  {
    title: "Job/Course Email Alerts",
    name: "emailAlerts",
  },
  {
    title: "Make Profile Visible to Employers",
    name: "profilePublicView",
  },
  {
    title: "Change Password",
    path: "/profile-overview/change-password",
  },
  {
    title: "Preview Profile",
    path: "#",
  },
  {
    title: "Share Profile",
    path: "/profile-overview/share-profile",
  },
  {
    title: "Delete Profile",
    path: "/profile-overview/delete-profile",
  },
];
