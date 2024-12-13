import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Image from "next/image";

import Card from "components/card";
import Select from "components/select";
import Button from "components/button";
import SearchSelect from "components/search-select";

import {
  country_list,
  employmentTypes,
  newPositionArr1,
  newPositionArr1Categorized,
} from "utils/arrayHelper";
import { level_of_operation } from "page-sections/overview-section/experience-section/add-experience/helper";

import trueLogo from "public/assets/availability.svg";
import staff from "public/assets/position.png";
import experience from "public/assets/experience.svg";
import location from "public/assets/location.svg";
import categories from "public/assets/icons/categories.svg";

import style from "./header.module.scss";

const JobSelectionTab = () => {
  const router = useRouter();
  const dropDownRef = useRef();

  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, register, setValue, watch } = useForm({
    defaultValues: {
      position: "",
      employmentType: "",
      currentLocation: "",
      levelOfOperation: "",
    },
  });

  const onSubmit = (query) => {
    setIsLoading(true);
    const { position, category } = query;
    delete query?.category;
    delete query?.position;
    router.push({
      pathname: `/jobs${category ? `/${category?.replace("+", "")}` : ""}${
        position ? `/${position?.replace("/", "-")}` : ""
      }`,
      query,
    });
    setIsLoading(false);
  };

  // useEffect(() => {
  //   setPositions(newPositionArr1Categorized?.[watch("category")?.replace("+", "")]);
  // }, [watch("category")]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
      <Card className={style.card}>
        <div className={`${style.mainCard} `}>
          {/* <div className={`${style.searchDivSelect} ${style.selectDiv}`}>
            <div className={style.img}>
              <Image src={categories} width={"100%"} height={"100%"} alt="staff" />
            </div>
            <SearchSelect
              className={style.inputMainClass}
              register={register}
              defaultValue={watch("category")}
              setValue={setValue}
              placeholder="Category"
              options={newPositionArr1.filter((x) => x.includes("+"))}
              name="category"
            />
          </div>
          <div className={`${style.searchDivSelect1} ${style.selectDiv}`}>
            <div className={style.img}>
              <Image src={staff} width={"100%"} height={"100%"} alt="staff" />
            </div>
            <SearchSelect
              name="position"
              register={register}
              setValue={setValue}
              placeholder="Position"
              className={style.inputMainClass}
              options={positions}
            />
          </div> */}
          <div className={`${style.searchDivSelect1} ${style.selectDiv}`}>
            <div className={style.img}>
              <Image src={staff} width={"100%"} height={"100%"} alt="staff" />
            </div>
            <ul>
              <li class="dropdown">
                <a href="#">
                  {watch("position")
                    ? `${watch("position")} (${watch("category")})`
                    : "Select a Position"}
                </a>
                <ul ref={dropDownRef}>
                  {newPositionArr1
                    .filter((x) => x.includes("+"))
                    .map((x) => (
                      <li class="dropdown">
                        <a href="#">{x?.replace("+", "")}</a>
                        <ul>
                          {newPositionArr1Categorized?.[x?.replace("+", "")].map((y) => (
                            <li class="dropdown">
                              <button
                                type="button"
                                onClick={() => {
                                  setValue("position", y.split("-")[0]);
                                  setValue("category", x?.replace("+", ""));
                                  dropDownRef.current.style.display = "none";
                                  setTimeout(() => {
                                    dropDownRef.current.style.display = "";
                                  }, 100);
                                }}
                              >
                                {y.split("-")[0]}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                </ul>
              </li>
            </ul>
          </div>
          <div className={`${style.selectDiv} ${style.experience}`}>
            <div className={style.img}>
              <Image src={trueLogo} width={"100%"} height={"100%"} alt="mobile" />
            </div>
            <Select name="employmentType" register={register} className={style.select}>
              {["Select Contract Type", ...employmentTypes].map((contract, index) => (
                <option key={index} value={contract === "Select Contract Type" ? "" : contract}>
                  {contract}
                </option>
              ))}
            </Select>
          </div>

          <div className={`${style.selectDiv} ${style.avail}`}>
            <div className={style.img}>
              <Image src={experience} width={"100%"} height={"100%"} alt="staff" />
            </div>
            <Select className={style.select} name="levelOfOperation" register={register}>
              {["Level Of Operation", ...level_of_operation].map((level, index) => (
                <option key={index} value={level === "Level Of Operation" ? "" : level}>
                  {level}
                </option>
              ))}
            </Select>
          </div>
          <div className={`${style.selectDiv} ${style.experience}`}>
            <div className={style.img1}>
              <Image src={location} width={"100%"} height={"100%"} alt="staff" />
            </div>
            <Select className={style.select} name="currentLocation" register={register}>
              {["Add Location", ...country_list].map((country, index) => (
                <option key={index} value={country === "Add Location" ? "" : country}>
                  {country}
                </option>
              ))}
            </Select>
            <Button
              title="Search"
              className={style.searchBtn}
              type="submit"
              isLoading={isLoading}
            />
          </div>
        </div>
        <Button title="Search" className={style.searchBtn1} type="submit" isLoading={isLoading} />
      </Card>
    </form>
  );
};

export default JobSelectionTab;
