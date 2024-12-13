import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Image from "next/image";

import Card from "components/card";
import Select from "components/select";
import Button from "components/button";
import SearchSelect from "components/search-select";

import {
  availability,
  country_list,
  experience,
  newPositionArr1,
  newPositionArr1Categorized,
} from "utils/arrayHelper";

import staff from "public/assets/position.png";
import location from "public/assets/location.svg";
import trueLogo from "public/assets/availability.svg";
import experienceImg from "public/assets/experience.svg";
import categories from "public/assets/icons/categories.svg";
import style from "./header.module.scss";

const ProfessionalTab = () => {
  const router = useRouter();

  const [positions, setPositions] = useState([]);
  const dropDownRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, register, setValue, watch } = useForm({
    defaultValues: {
      position: "",
      category: "",
      availability: "",
      currentlyBased: "",
      professionalExperience: "",
    },
  });

  const onSubmit = (query) => {
    setIsLoading(true);
    const { position, category } = query;
    delete query?.category;
    delete query?.position;
    router.push({
      pathname: `/find-candidate/results${category ? `/${category?.replace("+", "")}` : ""}${
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
        <div className={style.mainCard}>
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
            <Select name="availability" register={register} className={style.select}>
              <option value="">Availability</option>
              {availability?.map((ele) => (
                <option key={ele} value={ele}>
                  {ele}
                </option>
              ))}
            </Select>
          </div>
          <div className={`${style.selectDiv} ${style.avail}`}>
            <div className={style.img}>
              <Image src={experienceImg} width={"100%"} height={"100%"} alt="staff" />
            </div>
            <Select className={style.select} name="professionalExperience" register={register}>
              <option value="">Experience</option>
              {experience?.map((ele) => (
                <option key={ele} value={ele}>
                  {ele}
                </option>
              ))}
            </Select>
          </div>
          <div className={`${style.selectDiv} ${style.experience}`}>
            <div className={style.img1}>
              <Image src={location} width={"100%"} height={"100%"} alt="staff" />
            </div>
            <Select className={style.select} name="currentlyBased" register={register}>
              <option value="">Add Location</option>
              {country_list?.map((ele) => (
                <option key={ele} value={ele}>
                  {ele}
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

export default ProfessionalTab;
