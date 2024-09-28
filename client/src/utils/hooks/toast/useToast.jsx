import { useState, useEffect } from "react";
import "./Toast.scss";

const useToast = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    const errorTimer = setTimeout(() => {
      setErrorMessage("");
    }, 3000);

    const successTimer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    const infoTimer = setTimeout(() => {
      setInfoMessage("");
    }, 3000);

    return () => {
      clearTimeout(errorTimer);
      clearTimeout(successTimer);
      clearTimeout(infoTimer);
    };
  }, [errorMessage, successMessage, infoMessage]);

  const showErrorToast = (error) => {
    setErrorMessage(error);
  };

  const showSuccessToast = (success) => {
    setSuccessMessage(success);
  };
  const showInfoToast = (success) => {
    setInfoMessage(success);
  };

  const Toast = () => {
    return (
      <>
        {errorMessage && (
          <div className="toast-error">
            {errorMessage ? errorMessage : "Error!"}
          </div>
        )}
        {successMessage && (
          <div className="toast-success">
            {successMessage ? successMessage : "Success!"}
          </div>
        )}{" "}
        {infoMessage && (
          <div className="toast-info">
            {infoMessage ? infoMessage : "Info!"}
          </div>
        )}
      </>
    );
  };
  return { Toast, showErrorToast, showSuccessToast, showInfoToast };
};

export default useToast;
