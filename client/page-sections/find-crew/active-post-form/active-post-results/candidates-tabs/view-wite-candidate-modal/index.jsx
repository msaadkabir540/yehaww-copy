import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "components/button";
import Modal from "components/modal";
import TextArea from "components/textarea";

import style from "./view-modal.module.scss";

const ViewCandidateModal = ({
  open,
  setOpen,
  handleShortlistCandidates,
  data: { jobId, userId, notes },
}) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await handleShortlistCandidates({ ...data, jobId, userId });
    reset();
    setOpen(false);
  };

  useEffect(() => {
    notes && reset({ notes });
  }, [notes]);

  return (
    <div className={style.modal}>
      <Modal open={open} handleClose={() => setOpen(false)} title="View/Write Candidate Notes">
        <p>
          Please type your own notes on candidate here.This section must contain factual information
          only any other information is strictly prohibited.Although these notes are not public,a
          candidate can under GDPR request to see this data.These notes will be deleted once the job
          post ends.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextArea
            name="notes"
            register={register}
            className={style.field}
            placeholder="asdadsssfa"
            displayCharCount={false}
          />
          <div className={style.btnFlex}>
            <Button title={"Save Notes"} type={"submit"} isLoading={isSubmitting} />
            <Button title={"Cancel"} className={style.btn} handleClick={() => setOpen(false)} />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ViewCandidateModal;
