/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import Button from "components/button";
import Select from "components/select";
import Container from "components/container";
import MultiSelectGrouped from "components/multi-select-grouped";
import HeaderComponent from "components/header-compo";

import { availability, country_list, experience, newPositionArr1 } from "utils/arrayHelper";

import arrowIcon from "public/assets/icons/arrow.svg";
import style from "styles/find-candidate.module.scss";
import Image from "next/image";

const FindCandidate = () => {
  const router = useRouter();

  const [groupedOptions, setGroupedOptions] = useState([]);

  const { handleSubmit, register, reset, setValue, watch } = useForm({
    defaultValues: {
      position: "",
      availability: "",
      currentlyBased: "",
      professionalExperience: "",
    },
  });

  const onSubmit = (query) => {
    let { position } = query;
    delete query?.position;
    const category = position?.split(" (")?.[1]?.replace(")", "");
    position = position?.split(" (")?.[0];
    router.push({
      pathname: `/find-candidate/results${category ? `/${category?.replace("+", "")}` : ""}${
        position ? `/${position?.replace("/", "-")}` : ""
      }`,
      query,
    });
  };

  useEffect(() => {
    Object.keys(router.query).length && reset(router.query);
  }, [router.query]);

  useEffect(() => {
    const categories = newPositionArr1.filter((x) => x.includes("+"));
    const positions = newPositionArr1.filter((x) => !x.includes("+"));
    const groupedOptionsArr = categories.map((category) => {
      const currentCategory = category.replace("+", "");
      return {
        label: currentCategory,
        options: positions
          .filter((position) => position.includes(currentCategory))
          .map((x) => {
            const value = `${x.split("-")[0]} (${x.split("-")[1]})`;
            return { label: x.split("-")[0], value, value };
          }),
      };
    });
    setGroupedOptions(groupedOptionsArr);
  }, []);

  return (
    <>
      <Head>
        <title>Candidates - Yehaww</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <HeaderComponent heading={"Find Candidate"} />

      <div style={{ minHeight: "calc(100vh - 458px)" }}>
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
          <div className={style.form_container}>
            <p className={style.form_title}>About the Position</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={style.name_field}>
                <div>
                  <MultiSelectGrouped
                    label="Position"
                    name="position"
                    placeholder="Position"
                    options={groupedOptions}
                    onChange={(e) => {
                      setValue("position", e.value);
                    }}
                    watch={watch}
                    isMulti={false}
                    customStyle={{
                      "&:hover": { border: "1px solid #C0C0C0", cursor: "pointer" },
                      border: "1px solid #C0C0C0",
                      marginTop: "5px",
                    }}
                  />
                </div>
                <div className={style.password_field}>
                  <Select
                    label={"Availability"}
                    name="availability"
                    register={register}
                    className={style.field}
                  >
                    <option value="" style={{ color: "red" }}>
                      Please select
                    </option>
                    {availability?.map((ele) => (
                      <option key={ele} value={ele}>
                        {ele}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className={style.password_field}>
                  <Select
                    star="*"
                    label={"Professional Equine Experience"}
                    name="professionalExperience"
                    register={register}
                    className={style.field}
                  >
                    <option value="">Please select</option>
                    {experience?.map((ele) => (
                      <option key={ele} value={ele}>
                        {ele}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className={style.password_field}>
                  <Select
                    label={"People Currently Based"}
                    name="currentlyBased"
                    register={register}
                    className={style.field}
                  >
                    <option value="">Please select</option>
                    {country_list?.map((ele) => (
                      <option key={ele} value={ele}>
                        {ele}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <Button title="Search" type="submit" className={style.btnSearch} />
            </form>
          </div>
        </Container>
      </div>
    </>
  );
};

export default FindCandidate;

export const navLinksArr = [
  { title: "Profile" },
  { title: "Personal Information", path: "/profile-overview/personal-information" },
];
