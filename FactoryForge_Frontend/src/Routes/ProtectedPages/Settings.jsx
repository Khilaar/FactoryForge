import { useState } from "react";
import API from "../../api/API";

const Settings = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const accessToken = localStorage.getItem("access_token");
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const toggleShowPassword = () => {
    setShowChangePassword((prevData) => !prevData);
    setSuccessMessage(null)
  };

  const submitChangePassword = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      setErrorMessage("Access Token not found.");
      return;
    }
    if (!validatePassword()) {
      return;
    }
    try {
      const response = await API.patch(
        "users/me/change-password/",
        { current_password: currentPassword, new_password: password },
        config,
      );
      console.log(response.data);
      toggleShowPassword();
      clearInputFields();
      setSuccessMessage("Password successfully changed.");
    } catch (error) {
      console.error("Error updating password: ", error);
      setErrorMessage("An error occurred while updating password.");
    }
  };

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return false;
    }
    if (password.length < 8 || confirmPassword.length < 8) {
      setErrorMessage("Password needs to be at least 8 characters long.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleFormData = (fieldName, value) => {
    if (fieldName === "currentPassword") {
      setCurrentPassword(value);
    } else if (fieldName === "password") {
      setPassword(value);
    } else {
      setConfirmPassword(value);
    }
  };

  const clearInputFields = () => {
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <div className="profilePage-container">
        <div className="profilePage-frame-settings">
          {showChangePassword ? (
            <>
              <div className="profile-info-container-update">
                <div className="input-container">
                  <i className="fi fi-rr-lock"></i>
                  <input
                    type="password"
                    placeholder="Current Password"
                    autoComplete="false"
                    value={currentPassword}
                    onChange={(e) =>
                      handleFormData("currentPassword", e.target.value)
                    }
                  />
                </div>
                <div className="input-container">
                  <i className="fi fi-rr-lock"></i>
                  <input
                    type="password"
                    placeholder="New Password"
                    autoComplete="false"
                    value={password}
                    onChange={(e) => handleFormData("password", e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <i className="fi fi-rr-lock"></i>
                  <input
                    type="password"
                    autoComplete="false"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) =>
                      handleFormData("confirmPassword", e.target.value)
                    }
                  />
                </div>
              </div>
              {errorMessage && (
                <p className="error-message-settings">{errorMessage}</p>
              )}
              <button onClick={(e) => submitChangePassword(e)}>Submit</button>
              <button
                className="backButtonSettings"
                onClick={toggleShowPassword}
              >
                Back
              </button>
            </>
          ) : (
            <div className="changePassword">
              <button onClick={toggleShowPassword}>Change Password</button>
              {successMessage && (
                <p className="success-message-settings">{successMessage}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
