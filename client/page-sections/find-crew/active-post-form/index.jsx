import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import List from "components/list";
import Select from "components/select";
import Pagination from "components/pagination";
import DeleteActivePost from "./delete-active-post";
import ActivePostResult from "./active-post-results";

import { jobTypeKeys } from "utils/arrayHelper";
import { deleteJob, getActivePosts, updatePositionFilled } from "api-services/employer";

import style from "./active-post.module.scss";

const ActivePostForm = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.app);

  const [page, setPage] = useState(router?.query?.page || 0);
  const [delModal, setDelModal] = useState(false);
  const [sortBy, setSortBy] = useState("jobTitle");
  const [jobs, setJobs] = useState({
    jobs: [],
    jobsCount: 0,
  });

  const onClickMarkAsFilled = async (id) => {
    const res = await updatePositionFilled(id);
    if (res) {
      let tempJobs = [...jobs.jobs];
      tempJobs.forEach((j) => {
        if (j._id === id) j.jobFilledStatus = !j.jobFilledStatus;
      });
      setJobs((j) => ({ ...j, jobs: [...tempJobs] }));
    }
  };

  const getActivePost = async () => {
    let jobResponse = await getActivePosts({
      params: {
        pageSize: 10,
        page,
        sortBy,
      },
    });
    setJobs(jobResponse);
  };

  useEffect(async () => {
    await getActivePost();
  }, [user, page, sortBy]);

  return (
    <div>
      <Head>
        <title>Active Posts - Yehaww</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      {router?.query?.jobId ? (
        <ActivePostResult />
      ) : (
        <div className={style.gridSection}>
          <div className={style.right}>
            <p>Sort by</p>
            <Select
              name={"sortBy"}
              onChange={(e) => setSortBy(e.target.value)}
              className={style.select}
            >
              {sorts.map(({ label, value }, index) => (
                <option value={value} key={index}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className={style.left}>
            {jobs?.jobs?.map((ele, index) => {
              const isExpired = ele.list[ele.list.length - 1] === "Expired";

              const btnList = [
                {
                  text: "Duplicate",
                  onClick: (id) =>
                    router.push({
                      pathname: "/candidate/post-position",
                      query: {
                        id,
                        duplicate: true,
                      },
                    }),
                },
                { text: "Delete", onClick: () => setDelModal(ele._id) },
              ];

              !isExpired &&
                btnList.unshift(
                  {
                    text: "Edit",
                    onClick: (id) => {
                      router.push({
                        pathname: "/candidate/post-position",
                        query: {
                          id,
                          edit: true,
                        },
                      });
                    },
                  },
                  {
                    text: ele.jobFilledStatus === false ? "Mark as filled" : "Mark as unfilled",
                    onClick: (id) => {
                      onClickMarkAsFilled(id);
                    },
                  }
                );

              return (
                <div className={style.videoMain} key={index}>
                  <List
                    id={ele?._id}
                    btnList={btnList}
                    listId={ele?._id}
                    listArr={ele.list}
                    btnFlex={style.btn}
                    title={ele.jobTitle}
                    tagClass={style.tag}
                    className={style.card}
                    list_img={ele.image || `/assets/imgs/${jobTypeKeys[ele?.companyType]}.webp`}
                    buttons={[
                      {
                        title: `View Candidates ${`(${ele?.appliedCandidates || 0})`}`,
                        btnClass: style.viewCandidate,
                        handleClick: (id) => {
                          router.push({
                            pathname: "/candidate/active-post",
                            query: {
                              jobId: ele?._id,
                            },
                          });
                        },
                      },
                    ]}
                  />
                  {delModal == ele._id && (
                    <DeleteActivePost
                      setDelModal={setDelModal}
                      delModal={delModal}
                      handleDelete={async () => {
                        const res = await deleteJob({ id: ele?._id });
                        if (res) {
                          setJobs((j) => ({
                            ...j,
                            jobs: j.jobs.filter((job) => job._id !== ele._id),
                          }));
                        }
                        setDelModal(false);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", margin: "30px 0px" }}>
            {jobs?.jobs?.length > 0 && (
              <Pagination count={jobs?.jobsCount} page={page} pageSize={10} setPage={setPage} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivePostForm;

const sorts = [
  {
    value: "jobTitle",
    label: "Name",
  },
  {
    value: "createdAt",
    label: "Date Added",
  },
  {
    value: "jobId",
    label: "Job ID",
  },
  {
    value: "daysRemaining",
    label: "Days Remaining",
  },
];
