import { useState } from "react";
import "./InputRow.scss";
import Input from "../input/Input";

const InputRow = ({ value, name, onChange, error, kids }) => {
  const [rows, setRows] = useState(
    value || [{ postalCode: "", commune: "", wilaya: "" }]
  );

  const handleInputChange = (index, field, fieldValue) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: fieldValue } : row
    );
    setRows(updatedRows);
    onChange({ target: { name, value: updatedRows } });
  };
  const addRow = () => {
    setRows([...rows, { postalCode: "", commune: "", wilaya: "" }]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
      onChange({ target: { name, value: updatedRows } });
    }
  };

  return (
    <div className="inputRows">
      {rows.map((region, index) => (
        <div key={index} className="">
          <div className="input-row">
            {kids.map((field) => (
              <Input
                key={field.name}
                value={region[field.name]}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
                onChange={(e) =>
                  handleInputChange(index, field.name, e.target.value)
                }
                error={error?.[index]?.[field.key]}
              />
            ))}

            <button
              className="button-remove"
              onClick={() => removeRow(index)}
              style={{
                width: "fit-content",
              }}
              disabled={rows.length === 1}
            >
              Remove Region
            </button>
          </div>
          {rows.length - 1 === index && (
            <button
              className="button-add"
              onClick={addRow}
              style={{
                width: "fit-content",
              }}
            >
              Add Region
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default InputRow;
