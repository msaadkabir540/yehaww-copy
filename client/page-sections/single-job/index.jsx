import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/router";

import SummarySection from "./summary";
import OverviewSection from "./overview";
import Loading from "components/loading";
import LanguageSection from "./language";
import HeadSeo from "components/head-meta";
import Container from "components/container";
import HeaderSection from "./header-section";
import PrintMyProfile from "./print-profile";
import { getJob } from "api-services/employer";
import { jobTypeKeys } from "utils/arrayHelper";
import DeckEngineerSection from "./deck-enginner";
import InterestedDetails from "./interested-details";
import HeaderComponent from "components/header-compo";
import GoogleMapsMarker from "components/map-markers";

import style from "./single-job.module.scss";

const SingleJobPage = ({ data }) => {
  const router = useRouter();
  const componentRef = useRef();

  const [active, setActive] = useState(0);
  const [print, setPrint] = useState(false);
  const [jobData, setJobData] = useState({});
  const [loading, setLoading] = useState(true);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => setPrint(false),
  });

  const onPrint = () => {
    setPrint(true);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };
  const effect = async () => {
    setLoading(true);
    await getJob({ id: router?.query?.id, coordinates: true, setJobData, router });
    setLoading(false);
  };
  useEffect(() => {
    router?.query?.id && effect();
  }, [router?.query?.id]);

  return (
    <>
      {data && (
        <HeadSeo
          title={`Yehaww - ${data?.jobTitle}`}
          ogImage={
            data?.positionInfo?.image ||
            `/assets/imgs/${jobTypeKeys[data?.companyInfo?.companyType]}.webp`
          }
          altText="A picture job post"
        />
      )}
      {loading ? (
        <div className={style.loader}>
          <Loading />
        </div>
      ) : (
        <>
          <HeaderComponent heading={"Job Details"} />
          <HeaderSection onPrint={onPrint} jobData={jobData} />
          <Container>
            <div className={style.gridSection}>
              <div className={style.left}>
                <DeckEngineerSection jobData={jobData} />
              </div>
              <div className={style.right}>
                <InterestedDetails jobData={jobData} setJobData={setJobData} />
              </div>
            </div>
            <div className={style.mainJob}>
              <div className={style.tabDiv}>
                <div className={style.pBig}>
                  <div onClick={() => setActive(0)}>
                    <p
                      style={{
                        border: active === 0 ? "1px solid #B29E85" : "1px solid transparent",
                        color: active === 0 ? "#B29E85" : "",
                      }}
                    >
                      Summary
                    </p>
                  </div>
                  <div onClick={() => setActive(1)}>
                    <p
                      style={{
                        border: active === 1 ? "1px solid #B29E85" : "1px solid transparent",
                        color: active === 1 ? "#B29E85" : "",
                      }}
                    >
                      Overview
                    </p>
                  </div>
                </div>
                <div onClick={() => setActive(0)}>
                  <p
                    className={style.pSmall}
                    style={{
                      border: active === 0 ? "1px solid #B29E85" : "1px solid transparent",
                      color: active === 0 ? "#B29E85" : "",
                    }}
                  >
                    Summary & Overview
                  </p>
                </div>
                <div onClick={() => setActive(2)}>
                  <p
                    style={{
                      border: active === 2 ? "1px solid #B29E85" : "1px solid transparent",
                      color: active === 2 ? "#B29E85" : "",
                    }}
                  >
                    Language & Visas
                  </p>
                </div>
              </div>
              <div className={style.grid}>
                <div className={style.leftGrid}>
                  <div className={style.pBigDiv}>
                    {active === 0 && <SummarySection jobData={jobData} />}
                    {active === 1 && <OverviewSection jobData={jobData} />}
                  </div>
                  <div className={style.pSmall}>
                    {active === 0 && (
                      <div>
                        <SummarySection jobData={jobData} />
                        <OverviewSection jobData={jobData} />
                      </div>
                    )}
                  </div>

                  {active === 2 && <LanguageSection jobData={jobData} />}
                </div>

                <div>
                  {jobData?.position && (
                    <GoogleMapsMarker
                      markers={[
                        {
                          id: jobData?._id,
                          jobTitle: jobData?.jobTitle,
                          position: jobData?.position,
                          img: jobData?.positionInfo?.image,
                          jobId: jobData?.positionInfo?.jobId,
                          salary: jobData?.positionInfo?.salary,
                          employmentType: jobData?.employmentType,
                          currency: jobData?.positionInfo?.currency,
                          companyType: jobData?.companyInfo?.companyType,
                          companyName: jobData?.companyInfo?.companyName,
                          currentlyLocated: jobData.positionInfo?.currentlyLocated,
                        },
                      ]}
                      styles={{ width: "100%", height: "400px" }}
                    />
                  )}
                </div>
              </div>
            </div>
          </Container>
        </>
      )}
      <div style={{ position: "fixed", top: "100vh" }}>
        <div ref={componentRef}>
          <div>{<PrintMyProfile jobData={jobData} />}</div>
        </div>
      </div>
    </>
  );
};

export default SingleJobPage;
