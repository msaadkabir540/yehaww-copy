import React from "react";

import Modal from "components/modal";
import Button from "components/button";

import style from "./del.module.scss";

const DeleteActivePost = ({ loading, setDelModal, delModal, handleDelete }) => {
  return (
    <div style={{ position: "relative", zIndex: "10000" }}>
      <Modal open={delModal} handleClose={() => setDelModal(false)} className={style.modal}>
        <p className={style.bold}>Are You Sure?</p>
        <div className={style.bodyDiv}>
          <p className={style.p}>Do you really want to delete? This process cannot be undone.</p>
          <div className={style.btnDiv}>
            <Button
              handleClick={() => setDelModal(false)}
              title="Cancel"
              className={style.cancel}
            />
            <Button title={"Yes,Delete"} handleClick={handleDelete} isLoading={loading} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteActivePost;
