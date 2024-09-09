import "./Input.scss";

const Input = ({ value, label, name, placeholder, type, onChange }) => {
  return (
    <div className="input-group">
      {label && (
        <label className="group-label" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        name={name}
        className="input-field"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
