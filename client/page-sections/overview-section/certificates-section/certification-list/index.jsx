import React, { useState } from "react";
import Image from "next/image";
import moment from "moment";

import BorderForm from "components/border-form";
import eye from "public/assets/eye.svg";
import editIcon from "public/assets/table-edit.svg";
import delIcon from "public/assets/table-del.svg";

import style from "./list.module.scss";
import DeleteActivePost from "page-sections/find-crew/active-post-form/delete-active-post";

const CertificationList = ({ listArr, setListArr, handleEdit }) => {
  const [loading, setLoading] = useState(false);
  const [delModalIndex, setDelModalIndex] = useState(null);

  const handleDeleteRecord = (i) => {
    setLoading(true);
    setListArr(listArr?.filter((x, index) => index !== i));
    setLoading(false);
    setDelModalIndex(null);
  };

  return (
    <BorderForm title={"Uploaded Certificates"} className={style.borderForm}>
      <div className={style.tableWidth}>
        <div className={style.widthClass}>
          <div className={style.tableHead}>
            <p style={{ flexBasis: "200px" }}>Certificate Title</p>
            <p style={{ flexBasis: "200px" }}>Issued by</p>
            <p style={{ flexBasis: "200px" }}>Date Issued</p>
            <p style={{ flexBasis: "200px" }}>File</p>
            <p style={{ flexBasis: "200px" }}>Action</p>
          </div>
          <div className={style.tableBody}>
            {listArr?.map(({ issueDate, issuedBy, title, file, url }, index) => (
              <div className={style.tableRow} key={index}>
                <p style={{ flexBasis: "200px" }}>{title}</p>
                <p style={{ flexBasis: "200px" }}>{issuedBy}</p>
                <p style={{ flexBasis: "200px" }}>{moment(issueDate).format("Do MMM YYYY")}</p>
                <p style={{ flexBasis: "200px" }}>
                  {url ? (
                    <a href={url} target="_blank">
                      {url?.split(".com/")?.[1]}
                    </a>
                  ) : (
                    <p style={{ flexBasis: "200px" }}>No File Provided</p>
                  )}
                </p>
                <p style={{ flexBasis: "200px" }}>
                  {" "}
                  <div className={style.btnWrapper}>
                    {url ? (
                      <a href={url} target="_blank">
                        <div className={style.img}>
                          <Image src={eye} alt="eye-icon" />
                        </div>
                      </a>
                    ) : (
                      ""
                    )}
                    <div className={style.img}>
                      <Image src={editIcon} alt="editIcon" onClick={() => handleEdit(index)} />
                    </div>

                    <div className={style.img}>
                      <Image src={delIcon} alt="delIcon" onClick={() => setDelModalIndex(index)} />
                    </div>
                  </div>
                </p>
              </div>
            ))}
          </div>
        </div>
        {delModalIndex !== null && (
          <DeleteActivePost
            loading={loading}
            delModal={true}
            setDelModal={() => setDelModalIndex(null)}
            handleDelete={() => handleDeleteRecord(delModalIndex)}
          />
        )}
      </div>
    </BorderForm>
  );
};

export default CertificationList;
