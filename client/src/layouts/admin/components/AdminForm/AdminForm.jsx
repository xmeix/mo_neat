import { useEffect, useState } from "react";
import Input from "./../../../../components/input/Input";
import Select from "./../../../../components/select/Select";
import "./Form.scss";

const AdminForm = ({ formInputs, data, title }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    e.preventDefault();
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
      {formInputs.map(
        (e, i) =>
          i % 2 === 0 && (
            <div key={i} className="input-pair">
              {e.type === "select" ? (
                <Select
                  label={e.label}
                  name={e.name}
                  options={e.options}
                  value={formData[e.name] || ""}
                  onChange={handleChange}
                />
              ) : (
                <Input
                  label={e.label}
                  name={e.name}
                  placeholder={e.placeholder}
                  type={e.type}
                  value={formData[e.name] || ""}
                  onChange={handleChange}
                />
              )}

              {i + 1 < formInputs.length &&
                (formInputs[i + 1].type === "select" ? (
                  <Select
                    label={formInputs[i + 1].label}
                    name={formInputs[i + 1].name}
                    options={formInputs[i + 1].options}
                    value={formData[formInputs[i + 1].name] || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <Input
                    label={formInputs[i + 1].label}
                    name={formInputs[i + 1].name}
                    placeholder={formInputs[i + 1].placeholder}
                    type={formInputs[i + 1].type}
                    value={formData[formInputs[i + 1].name] || ""}
                    onChange={handleChange}
                  />
                ))}
            </div>
          )
      )}
      <Button text={"create"} />
    </div>
  );
};

export default AdminForm;
