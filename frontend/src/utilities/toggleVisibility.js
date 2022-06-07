export const toggleVisibility = (passwordRef, togglerRef) => {
  if (passwordRef.current.type == "text") {
    passwordRef.current.type = "password";
    togglerRef.current.className = "bi bi-eye";
  } else {
    passwordRef.current.type = "text";
    togglerRef.current.className = "bi bi-eye-slash";
  }
};
