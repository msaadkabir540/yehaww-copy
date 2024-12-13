import style from "./badge.module.scss";

const Badge = ({ title, className, styles }) => {
  return (
    <span className={`${style.tag} ${className}`} style={{ ...styles }}>
      {title}
    </span>
  );
};

export default Badge;
