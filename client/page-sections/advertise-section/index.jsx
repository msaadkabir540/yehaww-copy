import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Input from "components/input";
import Select from "components/select";
import Button from "components/button";
import TextArea from "components/textarea";
import Checkbox from "components/checkbox";
import Container from "components/container";
import BorderForm from "components/border-form";
import BreadCrumb from "components/bread-crumb";

import { handleFilterCity } from "utils/helper";
import { countryAndCodes } from "utils/arrayHelper";
import { addAdvertiser } from "api-services/employer";
import { CountrySelect } from "components/country-select/Country-Select";

import style from "./advertise.module.scss";
import PhonePicker from "components/phone-input";
import HeaderComponent from "components/header-compo";

const AdvertiseForm = () => {
  const {
    reset,
    watch,
    control,
    setValue,
    register,
    setError,
    getValues,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [city, setCity] = useState([]);

  const onSubmit = async (data) => {
    await addAdvertiser({ data, reset, setError });
  };
  const effect1 = async () => {
    const currentlyCountry = getValues("country");
    const filteredCities = currentlyCountry ? await handleFilterCity(currentlyCountry) : [];
    setCity(filteredCities);
    const currentlyCity = getValues("city");
    setTimeout(() => {
      currentlyCity &&
        setValue("city", filteredCities.includes(currentlyCity) ? currentlyCity : "");
    }, 20);
  };

  useEffect(() => {
    effect1();
  }, [watch("country")]);

  return (
    <>
      <HeaderComponent heading={"Advertise with us"} />
      <Container>
        <form className={style.formWrapper} onSubmit={handleSubmit(onSubmit)}>
          <BorderForm className={style.borderWrapper} title={"Advertising Request"}>
            <p className={style.para}>
              If you're interested in advertising with us. Please fill out the form below. Thankyou!
            </p>
            <div className={style.gridClass}>
              <Input
                star="*"
                label="First Name"
                name={"firstName"}
                register={register}
                errorMessage={errors?.firstName?.message}
              />
              <Input
                star="*"
                label="Last Name"
                name={"lastName"}
                register={register}
                errorMessage={errors?.lastName?.message}
              />
              <Input
                star="*"
                label="Organization"
                name={"organization"}
                register={register}
                errorMessage={errors?.organization?.message}
              />
              <div style={{ marginTop: "5px" }}>
                <PhonePicker
                  label="Business Phone"
                  name={"businessPhone"}
                  errorMessage={errors?.businessPhone?.message}
                  control={control}
                />
              </div>
              <Input
                star="*"
                label="Street Address"
                name={"streetAddress"}
                register={register}
                errorMessage={errors?.streetAddress?.message}
              />
              <Input
                star="*"
                label="Address Line 2"
                name={"addressLine2"}
                register={register}
                errorMessage={errors?.addressLine2?.message}
              />
              <div>
                <CountrySelect
                  star="*"
                  watch={watch}
                  name={"country"}
                  label={"Country"}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  options={countryAndCodes.map(({ name, iso2 }) => {
                    return {
                      value: name,
                      label: name,
                      image: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${iso2}.svg`,
                    };
                  })}
                  errorMessage={errors?.country?.message}
                />
              </div>
              <div>
                <Select
                  star="*"
                  name={"city"}
                  label={"City"}
                  register={register}
                  errorMessage={errors?.city?.message}
                >
                  {city.length ? (
                    <>
                      <option value="">Please select an option</option>
                      {[...new Set(city)]?.map((ele, index) => (
                        <option key={index} value={ele}>
                          {ele}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value={""}>{"Please Select Valid Country First!"}</option>
                  )}
                </Select>
              </div>
              <Input
                star="*"
                label="Postal Code"
                name={"postalCode"}
                type="number"
                register={register}
                errorMessage={errors?.postalCode?.message}
              />
              <Input
                star="*"
                label={"Email"}
                register={register}
                name={"email"}
                type="email"
                errorMessage={errors?.email?.message}
              />
              <div className={style.phoneWrapper}>
                <PhonePicker
                  label="Cell Phone"
                  name={"cellPhone"}
                  errorMessage={errors?.cellPhone?.message}
                  control={control}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label className={style.label}>Types of Advertising *</label>
                <label className={style.errorMessage}>{errors?.typesOfAdvertising?.message}</label>
                <div className={style.visa_sec}>
                  {visaArr.map((ele, index) => (
                    <div className={style.margin} key={index} style={{ marginRight: "12px" }}>
                      <Checkbox
                        label={ele}
                        register={register}
                        value={ele}
                        name={`typesOfAdvertising`}
                        errorMessage={errors?.typesOfAdvertising?.message}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={style.minInput}>
              <Select
                star="*"
                label={"Equestrian Related?"}
                name={`equestrian`}
                register={register}
                errorMessage={errors?.equestrian?.message}
              >
                <option value={""}>Please Select an Option</option>
                {team?.map((ele) => (
                  <option value={ele} key={ele}>
                    {ele}
                  </option>
                ))}
              </Select>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <TextArea
                star="*"
                label={"Please describe your business "}
                placeholder={"----Please Give Details----"}
                register={register}
                name="description"
                errorMessage={errors?.description?.message}
                displayCharCount={false}
              />
            </div>
            <Button title={"Submit"} type="submit" isLoading={isSubmitting} className={style.btn} />
          </BorderForm>
        </form>
      </Container>
    </>
  );
};

export default AdvertiseForm;

const navLinksArr = [{ title: "Advertise with us", path: "/advertise", show: false }];
const visaArr = ["Web or Social Media", "Email", "Online Directories"];
const team = ["Yes", "No"];
