const regexName = /^[A-Za-z]{1,30}(\s[A-Za-z](\.|[A-Za-z]{1,30})?)*$/g;
const regexMiddleName = /^$|^[A-Za-z]{1,30}(\s[A-Za-z](\.|[A-Za-z]{1,30})?)*$/g;
const upperCase = /[A-Z]/g;
const lowerCase = /[a-z]/g;
const number = /[0-9]/g;
const specialCharacter = /[!@#\$%\^\&*\)\(+=._-]/g;
const regexEmail =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const checkName = (name) => {
  return name.match(regexName);
};

export const checkMiddleName = (middleName) => {
  return middleName.match(regexMiddleName);
};

export const checkEmail = (email) => {
  return email.match(regexEmail);
};

export const checkPassword = (pass) => {
  return (
    pass.match(lowerCase) &&
    pass.match(upperCase) &&
    pass.match(number) &&
    pass.match(specialCharacter) &&
    pass.length >= 8 &&
    pass.length <= 16
  );
};

export const checkSecurityQuestion = (questionIndex) => {
  return questionIndex !== 0;
};

export const checkAnswer = (answer) => {
  return answer.trim() !== "";
};

export const checkPasswordEquality = (pass, rpass) => {
  return pass === rpass;
};

export const toTitleCase = (input) => {
  return input.replace(/\w\S*/g, (str) => {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  });
};
