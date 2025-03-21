import "./Select.scss";
import CreatableSelect from "react-select/creatable";
import SelectComponent from "react-select";
import { useState } from "react";
import { isValidHex } from "../../utils/functions";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#333333",
    border: `1px solid ${
      state.selectProps.error
        ? "#ff4d4f"
        : state.isFocused
        ? "#3550a1"
        : "#cccccc"
    }`, // Changes border color if error exists
    borderRadius: "4px",
    fontFamily: "inherit",
    fontSize: "14px",
    transition: "border-color 0.3s ease",
    boxShadow: "none",
    "&:hover": {
      borderColor: state.selectProps.error
        ? "#ff4d4f"
        : state.isFocused
        ? "#3550a1"
        : "#cccccc",
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
  multiValue: (provided, { data }) => {
    const baseStyles = {
      ...provided,
      display: "flex",
      alignItems: "center",
      borderRadius: "5px",
      position: "relative",
    };

    const conditionalStyles =
      data.value && data.value.startsWith("#")
        ? {
            "&:before": {
              content: '""',
              display: "block",
              width: "13px",
              height: "13px",
              backgroundColor: data.value,
              marginLeft: "0.5em",
              borderRadius: "30px",
            },
          }
        : {};

    return {
      ...baseStyles,
      ...conditionalStyles,
    };
  },
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
  isColor = false,
  error,
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
    if (isColor && !isValidHex(inputValue)) {
      alert("Please enter a valid hex color code (e.g., #ff0000).");
      return;
    }

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
          error={error}
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
          error={error}
        />
      )}

      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Select;
