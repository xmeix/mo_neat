import "./Select.scss";

const Select = ({ label, name, options, value, onChange }) => {
  return (
    <div className="select-container">
      {label && <label htmlFor={name}>{label}</label>}
      <select name={name} id={name} value={value} onChange={onChange}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
