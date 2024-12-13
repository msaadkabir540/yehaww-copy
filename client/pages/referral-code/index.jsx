import React, { useCallback, useMemo, useRef, useState } from "react";
import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";

import Loading from "components/loading";
import Table from "components/table";
import Button from "components/button";
import HeaderSection from "./header-section";
import Container from "components/container";
import BorderForm from "components/border-form";
import SharePopUp from "page-sections/referral-code/share-popup";

import createNotification from "common/create-notification";
import { useOutsideClickHook } from "utils/useOutsideClickHook";

import copy from "public/assets/icons/copy.svg";
import share from "public/assets/icons/share.svg";
import blackShare from "public/assets/icons/black-share.svg";

import style from "./referral.module.scss";

const ReferralCode = () => {
  const wrapperRef = useRef(null);
  const state = useSelector((state) => state.app);

  const [loading, setLoading] = useState(true);
  const [openShareByBtn, setOpenShareByBtn] = useState(false);
  const [openShareByIcon, setOpenShareByIcon] = useState(false);

  const referralData = useMemo(() => {
    const data = state.user.employer;
    if (data) {
      setLoading(false);
    }
    return data;
  }, [state]);

  const handleShareModalByBtn = useCallback(() => {
    setOpenShareByBtn(!openShareByBtn);

    setOpenShareByIcon(false);
  }, [openShareByBtn]);

  const handleShareModalByIcon = useCallback(() => {
    setOpenShareByIcon(!openShareByIcon);
    setOpenShareByBtn(false);
  }, [openShareByIcon]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(referralData?.referral);
    createNotification("success", "Code Copied");
  };

  useOutsideClickHook(wrapperRef, () => {
    setTimeout(() => {
      setOpenShareByBtn(false);
      setOpenShareByIcon(false);
    }, 100);
  });

  return (
    <>
      <Head>
        <title>Referral Code - Yehaww</title>
        <meta name="description" content="You can Avail Discounts on the Subscription Plans!" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <HeaderSection />
      <Container className={style.container}>
        <BorderForm>
          <>
            <div className={style.flex}>
              <h2>Referral Code</h2>
              <div className={style.codeClass}>
                {loading ? <Loading /> : referralData?.referral || "No referral code available."}
                <div className={style.iconsClass}>
                  <Image
                    alt=""
                    width={30}
                    height={20}
                    src={blackShare}
                    className={style.blkShare}
                    onClick={handleShareModalByIcon}
                  />
                  <Image alt="" src={copy} width={30} height={20} onClick={handleCopyToClipboard} />
                </div>
              </div>

              <div className={style.discount}>
                <p>
                  If anyone who comes through your referral code will receive a <b>20%</b> discount
                  on their next transaction, and you will also receive the same discount.
                </p>
                <h2>20%</h2>
                <h2 style={{ marginBottom: "20px" }}>Discount</h2>
                <div className={style.shareClass}>
                  <Button
                    title="Share"
                    iconStart={share}
                    className={style.shareBtn}
                    handleClick={handleShareModalByBtn}
                  />
                  {(openShareByBtn || openShareByIcon) && (
                    <div
                      className={`${style.popup} ${
                        openShareByIcon ? style.mobPopUp : openShareByBtn ? style.webPopUp : ""
                      }`}
                    >
                      <SharePopUp
                        {...{
                          handleCopyToClipboard,
                          referral: referralData?.referral,
                          setMenuPopUp: openShareByBtn
                            ? setOpenShareByBtn
                            : openShareByIcon
                            ? setOpenShareByIcon
                            : () => {},
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {!!referralData?.referralUsers?.length && (
                <Table
                  tr={style.tr}
                  // minWidth="1200px"
                  columns={columns}
                  thead={style.thead}
                  classBody={style.mainBody}
                  heading={style.tableHeading}
                  tableHeight={style.tableHeight}
                  headingTitle={style.headingTitle}
                  rows={referralData?.referralUsers.map(({ user, signedUpAt, availed }) => {
                    return {
                      discount: "20%",
                      company: user?.companyName,
                      name: `${user?.forename} ${user?.surname}`,
                      signUpAt: moment(signedUpAt).format("DD/MM/YYYY"),
                      status: availed ? (
                        <div className={style.availed}>
                          <p>Availed</p>
                        </div>
                      ) : (
                        <div className={style.toAvail}>
                          <p>To Avail</p>
                        </div>
                      ),
                    };
                  })}
                />
              )}
            </div>
          </>
        </BorderForm>
      </Container>
    </>
  );
};

export default ReferralCode;

const columns = [
  {
    key: "name",
    name: "Name",
    width: "300px",
    alignText: "left",
  },
  {
    width: "350px",
    key: "company",
    name: "Company",
    alignText: "left",
  },
  {
    width: "200px",
    key: "signUpAt",
    alignText: "left",
    name: "Sign Up Date",
  },
  {
    width: "150px",
    key: "discount",
    name: "Discount",
    alignText: "left",
  },
  {
    key: "status",
    width: "150px",
    name: "Status",
    alignText: "center",
  },
];
