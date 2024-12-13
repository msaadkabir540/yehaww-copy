import style from "./loading.module.scss";

const Loading = ({ loaderClass, pageLoader, diffHeight }) => {
  return (
    <>
      {pageLoader ? (
        <div
          className={style.flex}
          style={{ height: `calc(100vh - ${diffHeight ? diffHeight : 210}px)` }}
        >
          <div className={`${style.loader} ${loaderClass}`}></div>
        </div>
      ) : (
        <div className={`${style.loader} ${loaderClass}`}></div>
      )}
    </>
  );
};
export default Loading;
