import Image from "next/image";

import Modal from "components/modal";

import cross from "public/assets/icons/close.svg";

import style from "./salary-modal.module.scss";

const SalaryInfoModal = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);

  return (
    <div className={style.modal}>
      <Modal open={open} cancelImg={cross} handleClose={handleClose} className={style.noticeModal}>
        <>
          <div className={style.crossIcon} onClick={handleClose}>
            <Image src={cross} alt="warning" width={24} height={24} />
          </div>

          <div className={style.noticeDiv}>
            <Image src="/assets/icons/red-warning.svg" alt="warning" width={60} height={60} />
          </div>
          <div className={style.noticeDiv}>
            <span>Important Notice</span>
          </div>
          <p>
            Certain states and countries have legal requirements mandating the disclosure of salary
            ranges in job postings, while others do not. It is advisable for employers to
            familiarize themselves with the specific regulations in the relevant jurisdictions
            before posting jobs. Providing salary information is not only a best practice for
            transparency but also helps attract suitable candidates.
          </p>
          <h6 className={style.heading}>States with salary disclosure requirements include:</h6>
          <div className={style.list}>
            <ul>• California</ul>
            <ul>• Colorado</ul>
            <ul>• Connecticut</ul>
            <ul>• Delaware</ul>
            <ul>• Hawaii</ul>
            <ul>• Illinois</ul>
            <ul>• Maine</ul>
            <ul>• Maryland</ul>
            <ul>• Massachusetts</ul>
            <ul>• Michigan</ul>
            <ul>• Minnesota</ul>
            <ul>• Nevada</ul>
            <ul>• New Jersey</ul>
            <ul>• New York</ul>
            <ul>• Oregon</ul>
            <ul>• Rhode Island</ul>
            <ul>• Vermont</ul>
            <ul>• Washington</ul>
          </div>
          <h6 className={style.heading}>Countries with pay transparency laws include:</h6>
          <div className={style.list}>
            <ul>• Iceland</ul>
            <ul>• United Kingdom</ul>
            <ul>• Germany</ul>
            <ul>• Australia</ul>
            <ul>• Canada</ul>
          </div>
        </>
        <p>
          Please note that this information may change, and it's advisable to check for the most
          up-to-date laws and regulations. <br />
          Yehaww is not responsible for job postings that do not comply with this law.
        </p>
        <p>Thank you for your attention to this matter.</p>
      </Modal>
    </div>
  );
};

export default SalaryInfoModal;
