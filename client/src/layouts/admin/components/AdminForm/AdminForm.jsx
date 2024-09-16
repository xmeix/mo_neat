import { useEffect, useState } from "react";
import "./Form.scss";
import Select from "../../../../components/select/Select";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import ImagesInput from "../../../../components/imagesInput/ImagesInput";

const AdminForm = ({ formInputs, data, title }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="admin-form">
      <div className="admin-form-title">{title}</div>
      <div className="inputs">
        {formInputs.map((e, i) => {
          return e.type === "select" ? (
            <Select
              key={i}
              label={e.label}
              name={e.name}
              options={e.options}
              value={formData[e.name] || []}
              onChange={handleChange}
              isMulti={e.isMulti}
              creatable={e.creatable}
            />
          ) : e.type === "file" ? (
            <ImagesInput
              key={i}
              label={e.label}
              name={e.name}
              onChange={handleChange}
            />
          ) : (
            <Input
              key={i}
              label={e.label}
              name={e.name}
              placeholder={e.placeholder}
              type={e.type}
              value={formData[e.name] || ""}
              onChange={handleChange}
            />
          );
        })}
      </div>
      <Button text={"create"} />
    </div>
  );
};

export default AdminForm;
