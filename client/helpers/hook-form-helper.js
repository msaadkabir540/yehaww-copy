export const setFormError = (res, setError) => {
  if (res.status === 422) {
    const errorMessages = res.data.errors;
    if (errorMessages)
      for (const msg of errorMessages) {
        setError &&
          setError(msg?.path?.join("."), {
            message: prepareMessage(msg),
          });
      }
  }
};

const prepareMessage = (error) => {
  const {
    context: { key, value },
  } = error;

  let newErrorMessage = error.message;
  if (newErrorMessage.includes("must be an array")) {
    newErrorMessage = newErrorMessage.replace("must be an array", "is not allowed to be empty");
  }
  if (newErrorMessage.includes("must be one of [string]")) {
    newErrorMessage = newErrorMessage.replace(
      "must be one of [string]",
      "is not allowed to be empty"
    );
  }
  if (error?.context?.valids && error?.context.valids?.length) {
    if (value) {
      newErrorMessage = `Invalid value for ${key}`;
    }
  }
  newErrorMessage = newErrorMessage.replaceAll('"', "");
  newErrorMessage = newErrorMessage.charAt(0).toUpperCase() + newErrorMessage.slice(1);
  return newErrorMessage;
};
