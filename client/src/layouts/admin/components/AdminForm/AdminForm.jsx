import { Fragment, useCallback, useState } from "react";
import "./Form.scss";
import Select from "../../../../components/select/Select";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import ImagesInput from "../../../../components/imagesInput/ImagesInput";

const AdminForm = ({
  formInputs,
  data,
  title,
  handleCreate,
  validationMethod,
  btnTitle = "Create",
}) => {
  const [formData, setFormData] = useState(data);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validationMethod(formData);
    if (validationErrors) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    handleCreate(formData, e);
  };

  const renderInput = useCallback(
    (input, index) => {
      const error = formErrors[input.name];
      const getValue = () => {
        if (Array.isArray(formData[input.name])) {
          return formData[input.name];
        } else if (typeof formData[input.name] === "boolean") {
          return formData[input.name] ? "true" : "false";
        } else {
          return formData[input.name] || "";
        }
      };

      if (input.type === "select") {
        return (
          <Select
            key={index}
            label={input.label}
            name={input.name}
            options={input.options}
            value={getValue()}
            onChange={handleChange}
            isMulti={input.isMulti}
            creatable={input.creatable}
            error={error}
          />
        );
      } else if (input.type === "file") {
        return (
          <ImagesInput
            key={index}
            label={input.label}
            name={input.name}
            onChange={handleChange}
            error={error}
            imagesValue={formData[input.name]}
          />
        );
      } else {
        return (
          <Input
            key={index}
            label={input.label}
            name={input.name}
            placeholder={input.placeholder}
            type={input.type}
            value={formData[input.name] || ""}
            onChange={handleChange}
            error={error}
          />
        );
      }
    },
    [formData, formErrors]
  );

  const renderFormInputs = () => {
    return formInputs.map((input, index) => {
      const renderedInput = renderInput(input, index);

      if (input.children) {
        const shouldShowChildren = formData[input.name] === "true";
        return (
          <Fragment key={index}>
            {renderedInput}
            {shouldShowChildren &&
              input.children.map((childInput, childIndex) =>
                renderInput(childInput, `${index}-${childIndex}`)
              )}
          </Fragment>
        );
      }

      return renderedInput;
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-title">{title}</div>
      <div className="inputs">{renderFormInputs()}</div>
      <Button text={btnTitle} type="submit" />
    </form>
  );
};

export default AdminForm;
