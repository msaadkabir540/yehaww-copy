import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import Input from "components/input";
import Badge from "components/badge";
import Button from "components/button";
import Select from "components/select";
import BorderForm from "components/border-form";
import PhonePicker from "components/phone-input";

import { typeArr, useReference } from "./helper";

import eye from "public/assets/eye.svg";
import editIcon from "public/assets/table-edit.svg";
import delIcon from "public/assets/table-del.svg";
import doc from "public/assets/imgs/document-preview.webp";
import style from "./reference.module.scss";

const ReferenceSection = () => {
  const {
    watch,
    errors,
    control,
    register,
    isUpdate,
    onSubmit,
    setIsSave,
    isLoading,
    clearErrors,
    disableSave,
    handleSubmit,
    handleUpdate,
    referencesArr,
    handleSubmitForm,
    handleDeleteRecord,
    handleCancelUpdate,
    handleAddReference,
  } = useReference();

  const submitRef = useRef();

  const handleSaveReference = (e) => {
    e.preventDefault();
    clearErrors();
    handleSubmit(onSubmit)(e);
    handleAddReference({});
  };

  const handleSave = () => {
    setIsSave(true);
    clearErrors();
    handleSubmitForm();
  };
  return (
    <div className={style.form_container}>
      <form onSubmit={handleSaveReference} id="references-form">
        <BorderForm
          title={isUpdate ? "Update Reference" : "Add New Reference"}
          className={style.borderForm}
        >
          <p className={style.referenceNote}>
            Upload your reference below by clicking “Add new reference” The reference can be from
            any previous employment, even if not in the Equestrian industry.
            <span className={style.boldText}>
              We highly suggest to “Verify Your Reference” when adding a new reference. This will
              increase your chances to get the position you are looking for.
            </span>
            By adding a reference an email will be sent to your former employer with a request to
            confirm your previous employment. If your request is left unanswered for whatever
            reason, (email ended up in spam folder, etc.) delete your current reference and simply
            re-submit a new “Verify Reference” request.
          </p>
          <div className={style.gridTwo}>
            <Input
              star="*"
              label={"Name"}
              name={"name"}
              register={register}
              errorMessage={errors?.name?.message}
            />
            <Input
              star="*"
              label={"Relationship"}
              name={"relationship"}
              register={register}
              errorMessage={errors?.relationship?.message}
            />
            <Input
              star="*"
              label={"Company Name"}
              name={"companyName"}
              register={register}
              errorMessage={errors?.companyName?.message}
            />
            <PhonePicker
              name={"phone"}
              label={"Phone"}
              errorMessage={errors?.phone?.message}
              control={control}
            />
            <Input
              star="*"
              label={"Email"}
              name={"email"}
              register={register}
              errorMessage={errors?.email?.message}
            />
            <Select
              star="*"
              label={"Type"}
              name={"type"}
              register={register}
              errorMessage={errors?.type?.message}
            >
              <option value={""}> - - Select option - - </option>
              {typeArr?.map((ele, index) => (
                <option value={ele} key={index}>
                  {ele}
                </option>
              ))}
            </Select>
          </div>
          <Input
            type={"file"}
            name={"file"}
            register={register}
            errorMessage={errors?.file?.message}
            label={"Upload a Reference Letter (Optional)"}
            className={style.uploadInput}
            accept="application/pdf"
          />
          {watch("url") && (
            <div className={style.docPreview}>
              <a href={watch("url")} target={"_blank"}>
                <div className={style.img}>
                  <Image src={doc} width={85} height={85} alt="file icon" />
                </div>
              </a>
            </div>
          )}
          <Button
            className={style.btnAdd}
            title={isUpdate ? "Update Reference" : "Add New Reference"}
            type={"submit"}
          />
          {isUpdate && (
            <Button
              title={"cancel"}
              type={"button"}
              handleClick={handleCancelUpdate}
              className={style.btnAdd}
            />
          )}
        </BorderForm>
      </form>

      {referencesArr?.length > 0 && (
        <BorderForm title={"Uploaded References"} className={style.borderForm}>
          <p className={style.referenceNote}>
            If you've been waiting longer than 48 hours for a response, it's possible this request
            has ended up in a Spam folder. In this instance, we would recommend you contact the
            employer directly to see if they've received the reference request. If they haven't,
            please delete this reference and try re-submitting it by clicking 'Verify Reference'.
          </p>
          <div className={style.tableWidth}>
            <div className={style.widthClass}>
              <div className={style.tableHead}>
                <p style={{ flexBasis: "200px" }}>Name</p>
                <p style={{ flexBasis: "150px" }}>Relationship</p>
                <p style={{ flexBasis: "200px" }}>Company Name</p>
                <p style={{ flexBasis: "200px" }}>Email</p>
                <p style={{ flexBasis: "150px" }}>Phone</p>
                <p style={{ flexBasis: "100px" }}>Type</p>
                <p style={{ flexBasis: "200px" }}>Status</p>
                <p style={{ flexBasis: "200px" }}>Action</p>
              </div>
              <div className={style.tableBody}>
                {referencesArr?.map(
                  (
                    { name, email, phone, relationship, companyName, verified, denied, url, type },
                    index
                  ) => (
                    <div className={style.tableRow} key={index}>
                      <p style={{ flexBasis: "200px" }}>{name}</p>
                      <p style={{ flexBasis: "150px" }}>{relationship}</p>
                      <p style={{ flexBasis: "200px" }}>{companyName}</p>
                      <p style={{ flexBasis: "200px" }}>{email}</p>
                      <p style={{ flexBasis: "150px" }}>{phone}</p>
                      <p style={{ flexBasis: "100px" }}>{type}</p>
                      <p style={{ flexBasis: "200px" }}>
                        {" "}
                        {!verified && !denied ? (
                          <Badge title={"REFERENCE REQUEST SENT"} className={style.badgeWrapper} />
                        ) : verified ? (
                          <Badge title={"Verified"} className={style.verifiedBadge} />
                        ) : denied ? (
                          <Badge title={"Declined"} className={style.deniedBadge} />
                        ) : (
                          ""
                        )}
                      </p>
                      <p style={{ flexBasis: "200px" }}>
                        {" "}
                        <div className={style.btnWrapper}>
                          {url && (
                            <a className={style.btnView} href={url} target={"_blank"}>
                              <div className={style.img}>
                                <Image src={eye} alt="eye-icon" />
                              </div>
                            </a>
                          )}

                          <div className={style.img}>
                            <Image
                              src={editIcon}
                              alt="editIcon"
                              onClick={() => {
                                handleUpdate(index);
                              }}
                            />
                          </div>

                          <div className={style.img}>
                            <Image
                              src={delIcon}
                              alt="delIcon"
                              onClick={() => {
                                handleDeleteRecord(index);
                              }}
                            />
                          </div>
                        </div>
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </BorderForm>
      )}
      <div className={style.buttonWrapper}>
        <Button
          title={"Save"}
          type={"button"}
          isLoading={isLoading}
          form="references-form"
          className={style.btnSave}
          loaderClass={style.loaderClass}
          handleClick={handleSave}
        />
        <Link href={"/profile-overview/profile"}>
          <a>
            <Button className={style.btnCancel} title="Cancel" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ReferenceSection;
