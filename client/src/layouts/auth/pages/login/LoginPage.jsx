import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./AuthPage.scss";
import { useEffect } from "react";
import useToast from "../../../../utils/hooks/toast/useToast";
import { login } from "../../../../store/apiCalls/auth";
import { resetError } from "../../../../store/slices/authSlice";
import Button from "../../../../components/button/Button";
import Input from "../../../../components/input/Input";
import FormInfo from "../../components/formInfo/FormInfo";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Toast, showErrorToast } = useToast();
  const { loading, error } = useSelector((state) => state.auth);
  const loginInputs = [
    {
      label: "Email",
      type: "email",
      name: "email",
      placeholder: "john.doe@gmail.com",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "@password123",
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const dataToSubmit = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      await dispatch(login(dataToSubmit)).unwrap();
      navigate("/admin");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    if (error) showErrorToast(error);

    return () => {
      dispatch(resetError());
    };
  }, [error, dispatch, showErrorToast]);

  return (
    <div className="auth-container">
      <div className="form-wrapper">
        <FormInfo
          text1="Sign In"
          text2="Make it make sense."
          text3="Discover our amazing offers and enjoy life"
        />
        <form className="form login-page" method="post" onSubmit={handleSubmit}>
          {loginInputs.map((input, i) => (
            <Input
              key={i}
              label={input.label}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
            />
          ))}
          <Button
            disabled={loading}
            type="submit"
            name="login-button"
            text="Login"
            label={"New here?"}
            labelink={"/auth/register"}
            labelText="register"
          />
        </form>
        <Toast />
      </div>
    </div>
  );
};

export default LoginPage;
