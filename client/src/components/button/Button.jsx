import "./Button.scss";

const Button = ({ type, name, text, disabled, onClick = () => {} }) => {
  return (
    <button type={type} name={name} className="btn" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
