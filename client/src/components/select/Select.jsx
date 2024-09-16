import "./Select.scss";
import CreatableSelect from "react-select/creatable";
import SelectComponent from "react-select";
import { useState } from "react";
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#333333",
    border: `1px solid ${state.isFocused ? "#3550a1" : "#cccccc"}`,
    borderRadius: "4px",
    fontFamily: "inherit",
    fontSize: "14px",
    transition: "border-color 0.3s ease",
    boxShadow: "none", 
    "&:hover": {
      borderColor: state.isFocused ? "#3550a1" : "#cccccc",
    },
    "&::placeholder": {
      fontSize: "14px",
      color: "#aaaaaa",
      textTransform: "lowercase",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#aaaaaa",
    fontSize: "14px",
    textTransform: "lowercase",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#3550a1" : "#fff",
    color: state.isSelected ? "#fff" : "#333",
    "&:hover": {
      backgroundColor: "#f1f1f1",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e6f7f5",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#333333",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 2,
  }),
};
const Select = ({
  label,
  name,
  options,
  value,
  onChange,
  isMulti = false,
  creatable = false,
}) => {
  const [selectOptions, setSelectOptions] = useState(options);

  const handleSelectChange = (selectedOption) => {
    if (isMulti) {
      onChange({
        target: {
          name,
          value: selectedOption ? selectedOption.map((opt) => opt.value) : [],
        },
      });
    } else {
      onChange({
        target: {
          name,
          value: selectedOption ? selectedOption.value : "",
        },
      });
    }
  };

  const handleCreateOption = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };

    setSelectOptions((prevOptions) => [...prevOptions, newOption]);

    if (isMulti) {
      const updatedValue = [
        ...selectOptions.filter((opt) => value.includes(opt.value)),
        newOption,
      ];
      handleSelectChange(updatedValue);
    } else {
      handleSelectChange(newOption);
    }
  };

  return (
    <div className="select-container">
      {label && <label htmlFor={name}>{label}</label>}
      {creatable ? (
        <CreatableSelect
          isMulti={isMulti}
          name={name}
          value={
            isMulti
              ? selectOptions.filter((opt) => value.includes(opt.value))
              : selectOptions.find((opt) => opt.value === value) || null
          }
          onChange={handleSelectChange}
          onCreateOption={handleCreateOption}
          options={selectOptions}
          styles={customStyles}
        />
      ) : (
        <SelectComponent
          isMulti={isMulti}
          name={name}
          value={
            isMulti
              ? selectOptions.filter((opt) => value.includes(opt.value))
              : selectOptions.find((opt) => opt.value === value) || null
          }
          onChange={handleSelectChange}
          options={selectOptions}
          styles={customStyles}
        />
      )}
    </div>
  );
};

export default Select;
