import { Link } from "react-router-dom";
import "./Button.scss";

const Button = ({
  type,
  name,
  text,
  labelText,
  labelink,
  label,
  disabled,
  onClick = () => {},
}) => {
  return (
    <>
      {label && (
        <label className="button-label">
          {label} <Link to={labelink}>{labelText}</Link>
        </label>
      )}
      <button type={type} name={name} className="btn" onClick={onClick}>
        {text}
      </button>
    </>
  );
};

export default Button;
