export const PasswordReqs = ({ password }) => {
  const upperCase = /[A-Z]/g;
  const lowerCase = /[a-z]/g;
  const number = /[0-9]/g;
  const specialCharacter = /[!@#\$%\^\&*\)\(+=._-]/g;

  return (
    <ul className="small list-unstyled text-black">
      <li
        className={
          password.length >= 8 && password.length <= 16
            ? "text-success"
            : "text-danger"
        }
      >
        <i
          className={
            "bi " +
            (password.length >= 8 && password.length <= 16
              ? "bi-check"
              : "bi-dot")
          }
        ></i>
        Must be 8 to 16 characters
      </li>
      <li
        className={password.match(lowerCase) ? "text-success" : "text-danger"}
      >
        <i
          className={
            "bi " + (password.match(lowerCase) ? "bi-check" : "bi-dot")
          }
        ></i>
        Must contain at least one lowercase character
      </li>
      <li
        className={password.match(upperCase) ? "text-success" : "text-danger"}
      >
        <i
          className={
            "bi " + (password.match(upperCase) ? "bi-check" : "bi-dot")
          }
        ></i>
        Must contain at least one uppercase letter
      </li>
      <li className={password.match(number) ? "text-success" : "text-danger"}>
        <i
          className={"bi " + (password.match(number) ? "bi-check" : "bi-dot")}
        ></i>
        Must contain at least one digit
      </li>
      <li
        className={
          password.match(specialCharacter) ? "text-success" : "text-danger"
        }
      >
        <i
          className={
            "bi " + (password.match(specialCharacter) ? "bi-check" : "bi-dot")
          }
        ></i>
        Must contain at least one special character
      </li>
    </ul>
  );
};
