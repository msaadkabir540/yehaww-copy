export const validatePass = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!-%&*?]{8,20}$/
);

export const validatePassMsg = "One uppercase, one lowercase, one letter, min 8 and max 20 length";
