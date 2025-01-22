import { Fragment, useCallback, useState } from "react";
import "./Form.scss";
import Select from "../../../../components/select/Select";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import ImagesInput from "../../../../components/imagesInput/ImagesInput";
import TextArea from "../../../../components/textArea/TextArea";

const AdminForm = ({
  inputs,
  data,
  title,
  handleAction,
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
    handleAction(formData, e);
  };

  const renderInput = useCallback(
    (input, index) => {
      const error = formErrors[input.name];
      const getValue = () => {
        if (Array.isArray(formData[input.name])) {
          return formData[input.name];
        } else if (typeof formData[input.name] === "boolean") {
          return formData[input.name] ? "true" : "false";
        } else if (input.type === "date") {
          const dateValue = new Date(formData[input.name]);
          if (!isNaN(dateValue)) {
            return dateValue.toISOString().split("T")[0];
          } else {
            return formData[input.name];
          }
        } else {
          return formData[input.name] || "";
        }
      };

      if (input.type === "select") {
        const selectedValues = Array.isArray(formData[input.name])
          ? formData[input.name]
          : [];
        const allOptions = [
          ...input.options,
          ...selectedValues
            .filter(
              (value) => !input.options.find((option) => option.value === value)
            )
            .map((value) => ({ value, label: value })),
        ];
        return (
          <Select
            key={index}
            label={input.label}
            name={input.name}
            options={allOptions}
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
      } else if (input.type === "textarea") {
        return (
          <TextArea
            key={index}
            label={input.label}
            name={input.name}
            placeholder={input.placeholder}
            type={input.type}
            value={getValue()}
            onChange={handleChange}
            error={error}
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
            value={getValue()}
            onChange={handleChange}
            error={error}
          />
        );
      }
    },
    [formData, formErrors]
  );

  const renderFormInputs = (formInputs) => {
    return formInputs?.map((input, index) => {
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
      <div className="inputs-container">
        {inputs?.map((input, i) => (
          <div key={i} className="inputs-section">
            <div className="inputs-sectionTitle">{input.title}</div>
            <div className="inputs">{renderFormInputs(input.children)}</div>
          </div>
        ))}
      </div>
      <Button text={btnTitle} type="submit" />
    </form>
  );
};

export default AdminForm;
