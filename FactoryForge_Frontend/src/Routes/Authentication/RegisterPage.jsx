import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../../api/API.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmPassword, setConfirmPassword] = useState();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    type_of_user: "A",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const triggerRegister = async (e) => {
    e.preventDefault();
    if (confirmPassword != formData.password) {
      setErrorMessage("Passwords do not match.");
      console.log("Passwords do not match.");
    } else {
      try {
        const res = await API.post("auth/register/, formData");
        navigate("/login");
      } catch (error) {
        setErrorMessage("An error occurred during registration.");
        console.log("Error during login:", error);
      }
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="login-container">
        <form className="registration-form" onSubmit={triggerRegister}>
          <div className="input-container">
            <i className="fi fi-rr-user" />
            <input
              type="text"
              placeholder="Username"
              autoComplete="off"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="input-container">
            <i className="fi fi-rr-envelope" />
            <input
              type="text"
              placeholder="Email"
              autoComplete="off"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="input-container">
            <i className="fi fi-rr-lock"></i>
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className="input-container">
            <i className="fi fi-rr-lock"></i>
            <input
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div>
            <button>Submit</button>
            <button className="backButtonSettings" onClick={redirectToLogin}>
              Back
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
