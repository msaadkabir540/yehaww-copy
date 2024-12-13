/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import style from "./modal.module.scss";

const Modal = ({ open, children, className, handleClose, title, cancelImg, titleClass }) => {
  const handleClickWrapper = (event) => {
    handleClose?.();
  };

  return (
    <>
      {open && (
        <div className={style.modalWrapper} onMouseDown={(e) => handleClickWrapper(e)}>
          <div
            className={`${style.modalContentWrapper} ${className}`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {title && (
              <div className={style.header}>
                <p className={titleClass}>{title}</p>
                {cancelImg && <Image src={cancelImg} onClick={(e) => handleClickWrapper(e)} />}
              </div>
            )}
            <div className={style.body}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
