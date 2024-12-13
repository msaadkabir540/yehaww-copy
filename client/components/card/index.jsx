import style from "./card.module.scss";

const Card = ({ children, className, onClick }) => {
  return (
    <>
      <div className={`${style.card_container} ${className}`} onClick={onClick}>
        {children}
      </div>
    </>
  );
};

export default Card;
