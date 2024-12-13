import Modal from "components/modal";
import Input from "components/input";
import Button from "components/button";
import BorderForm from "components/border-form";

import { useDeleteAccount } from "./helper";

import style from "./my-profile.module.scss";

const DeleteAccount = () => {
  const {
    errors,
    loading,
    visible,
    delModal,
    register,
    setVisible,
    setDelModal,
    handleDelete,
    handleSubmit,
  } = useDeleteAccount();

  return (
    <>
      <BorderForm title={"Delete Account"} className={style.borderForm}>
        <Button
          title="Delete Account"
          className={style.btn1}
          handleClick={() => setDelModal(true)}
        />
        <Modal open={delModal} handleClose={() => setDelModal(false)} className={style.modal}>
          <p className={style.bold}>Are you sure you wish to Delete your Profile?</p>
          <div className={style.bodyDiv}>
            <p className={style.p}>This process cannot be undone.</p>
            <form onSubmit={handleSubmit(handleDelete)}>
              <Input
                star="*"
                name="password"
                register={register}
                placeholder="password"
                className={style.newPassword}
                errorMessage={errors?.password?.message}
                type={visible ? "text" : "password"}
                onClick={() => setVisible(!visible)}
                icon={`/assets/icons/eye-${visible ? "show" : "hide"}.svg`}
              />
              <div className={style.btnDiv}>
                <Button
                  title="Cancel"
                  className={style.cancel}
                  handleClick={() => setDelModal(false)}
                />
                <Button title={"Yes,Delete"} type="submit" isLoading={loading} />
              </div>
            </form>
          </div>
        </Modal>
      </BorderForm>
    </>
  );
};

export default DeleteAccount;
