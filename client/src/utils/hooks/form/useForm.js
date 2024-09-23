import { useState, useCallback } from "react";
 
const useForm = (initialData) => {
  const [formData, setFormData] = useState(initialData);
  const [formError, setFormError] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files : value,
    }));
  };

  const setFieldError = (field, message) => {
    setFormError((prev) => ({ ...prev, [field]: message }));
  };

  const resetError = () => setFormError({});

  return {
    formData,
    handleChange,
    formError,
    setFieldError,
    resetError,
    setFormData,
  };
};

export default useForm;
