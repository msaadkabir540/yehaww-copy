import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import React, { useEffect, useMemo, useState } from "react";

import Radio from "components/radio";
import Table from "components/table";
import Modal from "components/modal";
import Button from "components/button";
import MenuPopUp from "components/menu";
import CancelModal from "./cancelModal";
import Loading from "components/loading";
import SuccessModal from "./success-modal";
import Container from "components/container";
import BorderForm from "components/border-form";

import { apiRequest } from "utils/helper";

import HeaderSection from "./header-section";
import { getHistory, getInvoice } from "api-services/subscription";
import SubscriptionContent, { columns } from "./subscription-content";

import doc from "public/assets/success-doc.svg";
import option from "public/assets/icons/option.svg";

import style from "./about.module.scss";

export default function App() {
  const [plan, setPlan] = useState();
  const [invoice, setInvoice] = useState();
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [menuPopUp, setMenuPopUp] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [cancelSuccessModal, setCancelSuccessModal] = useState(false);
  const router = useRouter();
  const state = useSelector((state) => state.app);

  const submit = async (lookup_key) => {
    setLoading(true);
    const res = await apiRequest({
      type: "post",
      path: "/subscription/create-checkout-session",
      body: {
        lookup_key,
      },
    });
    if (res.status === 200) {
      res?.data?.redirect && window?.location?.assign(res?.data?.redirect);
    }
    setLoading(false);
  };

  const downloadInvoice = () => {
    window.open(invoice, "");
    setMenuPopUp(false);
  };

  const currentSubscription = useMemo(() => {
    return plansData?.find((p) => p?.type === state?.user?.subscriptionType);
  }, [state.user]);

  const signUpReferralDiscount = useMemo(() => {
    return (
      state?.user?.employer?.signUpReferral?.user && !state?.user?.employer?.signUpReferral?.availed
    );
  }, [state.user]);

  const referalUserDiscount = useMemo(() => {
    return state?.user?.employer?.referralUsers?.some((referral) => referral?.availed === false);
  }, [state.user]);

  const { subscriber, subscriptionStatus } = useMemo(() => {
    //even the user has a cenceled subscription he's still a subscriber
    return {
      subscriber: state?.user?.subscriptionStatus === "active" || subscriptionData?.length,
      subscriptionStatus: state?.user?.subscriptionStatus,
    };
  }, [state.user, subscriptionData]);

  const options = [
    {
      text: "Download Last Invoice",
      click: () => downloadInvoice(),
    },
    {
      text: "Cancel Subscription",
      click: () => {
        setCancelModal(true);
        setMenuPopUp(false);
      },
    },
  ];

  const getSubsData = async () => {
    setLoader(true);
    const { email } = state.user;
    if (email) {
      const historyRes = await getHistory({ params: { email } });
      historyRes && setSubscriptionData(historyRes?.subscriptions);

      const invoiceRes = await getInvoice({ params: { email } });
      invoiceRes && setInvoice(invoiceRes?.invoice);
    }
    setLoader(false);
  };

  useEffect(() => {
    getSubsData();
  }, [state]);

  return (
    <>
      <Head>
        <title>Subscription - Yehaww</title>
        <meta name="description" content="You can subscribe to our awesome offers!" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <HeaderSection />
      {(signUpReferralDiscount || referalUserDiscount) && (
        <div className={style.discountBanner}>
          <div className={style.bannerInner}>
            <p className={style.bannerText}>
              <span>Congratulations!</span> You have got{" "}
              <span style={{ color: "#D40C18" }}> 20% discount</span> because{" "}
              {signUpReferralDiscount
                ? "you have signed up via referral code"
                : "You have a referral to avail"}
            </p>
          </div>
        </div>
      )}
      <Container className={style.container}>
        <BorderForm>
          {loader ? (
            <Loading pageLoader={true} />
          ) : (
            <>
              <div className={!subscriber ? style.grid : style.grid1}>
                {!subscriber && (
                  <div className={subscriber ? null : style.width2}>
                    <SubscriptionContent subscriptionData={subscriptionData} />
                  </div>
                )}
                <div className={style.payment}>
                  <form className={subscriber ? style.subscribed : null}>
                    {plansData?.map((ele) => {
                      const { title, duration, lookup_key, price, oldPrice, type, description } =
                        ele;
                      return (
                        <div
                          key={price}
                          className={`${style.card} ${subscriber ? style.cardSubscribed : null} `}
                        >
                          <div
                            className={`${style.product} ${
                              subscriber ? style.cardSubscribedPadding : null
                            } `}
                          >
                            {!subscriber && (
                              <Radio
                                name="radio"
                                radioValue={lookup_key}
                                handleChange={(e) => setPlan(e.target.value)}
                              />
                            )}
                            <div style={{ marginTop: "-5px" }}>
                              <h3>
                                {title}
                                <span className={style.span1}>${price}.00</span>
                                <span className={style.span2}> ${oldPrice}.00</span>
                                <span className={style.span3}>/ {duration}</span>
                              </h3>
                              <p>{description}</p>
                            </div>
                          </div>
                          {Boolean(!(price < currentSubscription?.price) && subscriber) && (
                            <Button
                              className={style.btnSubscribed}
                              disabled={type === state?.user?.subscriptionType}
                              title={
                                ["canceled", "inActive"].includes(subscriptionStatus)
                                  ? "Select Plan"
                                  : price < currentSubscription?.price
                                  ? ""
                                  : type === state?.user?.subscriptionType
                                  ? "Currently Subscribed"
                                  : `Upgrade to ${type}`
                              }
                              handleClick={(e) => {
                                e.preventDefault();
                                if (state?.user?.type === "employer") {
                                  submit(lookup_key);
                                } else {
                                  router.push("/sign-up/employer");
                                }
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                    {!subscriber && (
                      <Button
                        isLoading={loading}
                        className={style.btn}
                        title={
                          state?.token ? "Continue" : "Login or create a free account to purchase"
                        }
                        handleClick={(e) => {
                          e.preventDefault();
                          if (state?.user?.type === "employer") {
                            submit(plan);
                          } else {
                            router.push("/sign-up/employer");
                          }
                        }}
                      />
                    )}
                  </form>
                </div>
              </div>
              {Boolean(subscriber && subscriptionData?.length) && (
                <div className={style.historySection}>
                  <div className={style.flexSub}>
                    <p className={style.heading}>Payment History</p>
                    <div onClick={() => setMenuPopUp(!menuPopUp)} style={{ cursor: "pointer" }}>
                      <Image src={option} />
                    </div>
                    {menuPopUp && (
                      <div className={style.popup}>
                        <MenuPopUp {...{ setMenuPopUp, options }} />
                      </div>
                    )}
                  </div>
                  <Table
                    tr={style.tr}
                    minWidth="820px"
                    columns={columns}
                    thead={style.thead}
                    rows={subscriptionData}
                    classBody={style.mainBody}
                    heading={style.tableHeading}
                    tableHeight={style.tableHeight}
                    headingTitle={style.headingTitle}
                  />
                </div>
              )}

              {cancelModal && (
                <CancelModal {...{ cancelModal, setCancelModal, setCancelSuccessModal }} />
              )}

              {cancelSuccessModal && (
                <Modal
                  className={style.succesModal}
                  open={cancelSuccessModal}
                  handleClose={() => setCancelSuccessModal(false)}
                >
                  <div style={{ textAlign: "center" }}>
                    <Image src={doc} width={80} height={80} />
                    <div style={{ padding: "20px 0px" }}>
                      <h3>Your request to cancel your subscription has been received</h3>
                      <p>You will be contacted shortly on your email!</p>
                    </div>
                    <p>We are sorry to see you go</p>
                  </div>
                </Modal>
              )}
            </>
          )}
        </BorderForm>
      </Container>
      <SuccessModal />
    </>
  );
}

export const plansData = [
  {
    price: 29,
    oldPrice: 69,
    type: "Starter",
    duration: "3mo.",
    title: "Starter Plan",
    lookup_key: process.env.NEXT_PUBLIC_STARTER_PLAN_ID,
    description: "Our goal is to have a database that will make the equestrian community stronger!",
  },
  {
    price: 49,
    oldPrice: 99,
    type: "Standard",
    duration: "6mo.",
    title: "Standard Plan",
    lookup_key: process.env.NEXT_PUBLIC_STANDARD_PLAN_ID,
    description: "Choose our Standard plan and have full access for 6 months",
  },
  {
    price: 89,
    oldPrice: 199,
    type: "Premium",
    duration: "Annually",
    title: "Premium Plan",
    lookup_key: process.env.NEXT_PUBLIC_PREMIUM_PLAN_ID,
    description: "Post Job and find candidates all year around.",
  },
];
