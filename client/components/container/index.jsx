import style from "./container.module.scss";

const Container = ({ children, className }) => {
  return <div className={`${style.container} ${className}`}>{children}</div>;
};

export default Container;
