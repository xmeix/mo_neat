import { Fragment, useState } from "react";
import "./Form.scss";
import Select from "../../../../components/select/Select";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import ImagesInput from "../../../../components/imagesInput/ImagesInput";

const AdminForm = ({ formInputs, data, title, handleCreate }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? Array.from(files) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate(formData);
  };

  const renderInput = (input, index) => {
    if (input.type === "select") {
      return (
        <Select
          key={index}
          label={input.label}
          name={input.name}
          options={input.options}
          value={formData[input.name] || ""}
          onChange={handleChange}
          isMulti={input.isMulti}
          creatable={input.creatable}
        />
      );
    } else if (input.type === "file") {
      return (
        <ImagesInput
          key={index}
          label={input.label}
          name={input.name}
          onChange={handleChange}
          value={formData[input.name] || []}
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
        />
      );
    }
  };

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
    <div className="admin-form">
      <div className="admin-form-title">{title}</div>
      <div className="inputs">{renderFormInputs()}</div>
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
};

export default AdminForm;
