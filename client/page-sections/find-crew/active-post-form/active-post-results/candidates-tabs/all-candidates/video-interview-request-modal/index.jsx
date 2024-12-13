import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Input from "components/input";
import Modal from "components/modal";
import Button from "components/button";
import Select from "components/select";
import BorderForm from "components/border-form";

import { requestInterview } from "api-services/employer";
import { getMyVideoInterviews } from "api-services/candidate";

import style from "./view-modal.module.scss";
import moment from "moment";

const VideoInterviewRequestModal = ({
  open,
  data,
  setOpen,
  getCandidates,
  setVideoRequest,
  requestingInterview,
}) => {
  const {
    watch,
    register,
    setValue,
    setError,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState({});
  const [interviewQuestions, setInterviewQuestions] = useState([]);

  const userFirstName = interview?.userData?.[0]?.personalInfo?.contactDetail?.firstName;
  const userLastName = interview?.userData?.[0]?.personalInfo?.contactDetail?.lastName;

  const name = `${userFirstName} ${userLastName}`;

  const addQuestion = (question, custom) => {
    if (question) {
      setInterviewQuestions((prev) => [...prev, question]);
      custom && setValue("custom", "");
    } else if (custom) {
      setError("custom", { message: "Enter valid Question" });
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    await requestInterview({
      data: {
        ...data,
        videoInterviewRequest: true,
        interviewQuestions: interviewQuestions,
      },
    });
    await getCandidates();
    setLoading(false);
    setOpen(false);
    setVideoRequest(false);
  };
  const removeQuestion = (index) => {
    setInterviewQuestions((prev) => [...prev].filter((x, qIndex) => qIndex !== index));
  };

  useEffect(async () => {
    !requestingInterview &&
      (await getMyVideoInterviews({ setInterviews: setInterview, data, setInterviewQuestions }));
  }, []);

  useEffect(async () => {
    const question = getValues("questions");
    addQuestion(question);
  }, [watch("questions")]);

  return (
    <div className={style.modal}>
      <Modal open={open} handleClose={() => setOpen(false)} title="Video Interview Request">
        {interview?.interviewRequestDate ? (
          <>
            <p>
              You sent the following questions to {name} on{" "}
              {moment(interview?.interviewRequestDate).format("Do MMM YYYY")}.You will be notified
              when their video interview has been successfully uploaded.
            </p>
            <p>
              Note: In some instances this request may be marked as spam by the candidates email
              provider,as such, it is advisable to also reach out by email or phone if you don't
              receive a reply within 48 hours.
            </p>
          </>
        ) : (
          <p>
            Simply select or write your own questions and these will be sent to candidate.You will
            be notified when their video interview has been updated.
          </p>
        )}
        {interviewQuestions?.length > 0 && (
          <>
            <h6 className={style.heading}>Questions Added</h6>
            <BorderForm className={style.borderWrapper}>
              {interviewQuestions?.map((ele, index) => (
                <div className={style.innerFlex} key={index}>
                  <p style={{ flex: 1 }}>{ele}</p>
                  {!interview?.interviewRequestDate && (
                    <div
                      style={{
                        width: 30,
                      }}
                      onClick={() => {
                        removeQuestion(index);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} className={style.icon1} />
                    </div>
                  )}
                </div>
              ))}
            </BorderForm>
          </>
        )}
        {!interview?.interviewRequestDate && (
          <>
            <h6 className={style.heading}>Add a question</h6>

            <BorderForm className={style.borderWrapper}>
              <Select register={register} name={`questions`}>
                <option value="">Select a question</option>
                {questions
                  .filter((x) => !interviewQuestions?.includes(x))
                  ?.map((ele) => (
                    <option key={ele} value={ele}>
                      {ele}
                    </option>
                  ))}
              </Select>
              <p style={{ fontWeight: "500" }}>OR</p>
              <div className={style.flex1}>
                <Input
                  star="*"
                  type="text"
                  name="custom"
                  placeholder="Write your own question"
                  register={register}
                  className={style.input}
                  errorMessage={errors?.custom?.message}
                />
                <Button
                  title={"Add Question"}
                  handleClick={() => {
                    clearErrors();
                    const question = getValues("custom");
                    addQuestion(question, true);
                  }}
                  className={style.addBtn}
                />
              </div>
            </BorderForm>
            <div className={style.btnFlex}>
              <Button title={"Send Interview Request"} handleClick={onSubmit} isLoading={loading} />
              <Button title={"Cancel"} handleClick={() => setOpen(false)} className={style.btn} />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default VideoInterviewRequestModal;

const questions = [
  "What are your greatest strengths?",
  "What are your greatest weaknesses?",
  "What makes you suitable for the role?",
  "Why did you leave your last position?",
  "Please tell me about your yehaww experience.",
  "What career accomplishment makes you most proud?",
  "How would you handle a personality clash in the workplace?",
  "Tell me something about yourself that isn't on your CV/resume.",
];
