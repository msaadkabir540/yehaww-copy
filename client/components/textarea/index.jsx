import { useEffect, useState } from "react";
import style from "./textarea.module.scss";

const TextArea = ({
  star,
  name,
  watch,
  label,
  register,
  disabled,
  className,
  labelCount,
  placeholder,
  errorMessage,
  displayCharCount = true,
}) => {
  const maxChars = displayCharCount ? 250 : Infinity;
  const [charCount, setCharCount] = useState(maxChars);

  const handleChange = (value) => {
    const wordArray = value?.trim()?.split(/\s+/);
    const remainingWords = !value ? 250 : 250 - wordArray?.length;

    if (remainingWords >= 0) {
      setCharCount(remainingWords);
    }
  };

  useEffect(() => {
    watch && handleChange(watch);
  }, [watch]);

  return (
    <>
      <div className={`${style.note} ${className}`}>
        {label && (
          <label>
            {label} {star && star}
          </label>
        )}
        <textarea
          style={{
            border: errorMessage ? "1px solid #ff5050" : "1px solid #c0c0c0",
          }}
          placeholder={placeholder}
          name={name}
          rows={6}
          {...(register && register(name))}
          disabled={disabled || false}
          onChange={(e) => handleChange(e.target.value)}
        ></textarea>
        {errorMessage ? (
          <span className={style.errorMessage}>{errorMessage || labelCount}</span>
        ) : displayCharCount ? (
          <span className={style.textCount}>
            {charCount === maxChars ? `Maximum ${maxChars} words` : `Remaining words: ${charCount}`}
          </span>
        ) : (
          <span className={style.textCount}>{labelCount}</span>
        )}
      </div>
    </>
  );
};

export default TextArea;
