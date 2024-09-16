import "./AuthPage.scss";
import { Form, useNavigate } from "react-router-dom";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";
import AuthPanel from "./AuthPanel";
import FormInfo from "../../../sections/formInfo/FormInfo";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../../utils/useToast";
import { resetError, setError } from "../../../store/slices/authSlice";
import { register } from "../../../store/apiCalls/auth";
import { useEffect } from "react";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Toast, showErrorToast, showSuccessToast } = useToast();
  const { loading, error, success } = useSelector((state) => state.auth);

  const registerInputs = [
    {
      label: "Full name",
      type: "text",
      name: "name",
      placeholder: "John Doe",
    },
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
      name: formData.get("name"),
    };

    try {
      await dispatch(register(dataToSubmit)).unwrap();
      navigate("/auth/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    if (error) showErrorToast(error);
    if (success) showSuccessToast(success);

    return () => {
      dispatch(resetError());
    };
  }, [error, dispatch, showErrorToast, success, showSuccessToast]);

  return (
    <div className="auth-container">
      <AuthPanel />
      <div className="form-wrapper">
        <FormInfo
          text1="Sign Up"
          text2="your life will make more sense."
          text3="Discover our amazing offers and enjoy life"
        />
        <Form
          className="form register-page"
          method="POST"
          onSubmit={handleSubmit}
        >
          {registerInputs?.map((e, i) => (
            <Input
              key={i}
              label={e.label}
              type={e.type}
              name={e.name}
              placeholder={e.placeholder}
            />
          ))}
          <Button
            type="submit"
            name="register-button"
            text="Create account"
            label={"you have an account?"}
            labelink={"/auth/"}
            labelText={"login"}
          />
        </Form>
        <Toast />
      </div>
    </div>
  );
};

export default RegisterPage;
