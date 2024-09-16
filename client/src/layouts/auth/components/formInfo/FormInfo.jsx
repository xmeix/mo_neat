import "./FormInfo.scss";
const FormInfo = ({ text1, text2, text3 }) => {
  return (
    <div className="form-info">
      <div className="auth-title">{text1}</div>
      <div className="auth-description-hero">{text2}</div>
      <div className="auth-description">{text3}</div>
    </div>
  );
};

export default FormInfo;
