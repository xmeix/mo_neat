import "./TextArea.scss";

const TextArea = ({
  value,
  label,
  name,
  placeholder,
  type,
  onChange,
  error,
}) => {
  return (
    <div className={`input-group ${error ? "error" : ""}`}>
      {label && (
        <label className="group-label" htmlFor={name}>
          {label}
        </label>
      )}
      <textarea
        type={type}
        value={value}
        name={name}
        className={error ? "input-field error-border" : "input-field"}
        placeholder={placeholder}
        onChange={onChange}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default TextArea;
