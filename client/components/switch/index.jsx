import style from "./switch.module.scss";

const Switch = ({ checked, name, setSettings, handleUpdateSettings }) => {
  return (
    <div>
      <label className={style.switch}>
        <input
          type="checkbox"
          defaultChecked={checked}
          onChange={(e) => {
            handleUpdateSettings({ body: { [name]: e.target.checked }, name });
            setSettings((prev) => {
              return { ...prev, [name]: e.target.checked };
            });
          }}
        />
        <span className={`${style.slider} ${style.round}`}></span>
      </label>
    </div>
  );
};

export default Switch;
