import Head from "next/head";

import OverviewSection from "page-sections/overview-section";
import SettingsProfile from "page-sections/overview-section/profile/settings-profile";

const Settings = () => {
  return (
    <>
      <Head>
        <title>Profile - Yehaww</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <OverviewSection>
        <SettingsProfile />
      </OverviewSection>
    </>
  );
};

export default Settings;