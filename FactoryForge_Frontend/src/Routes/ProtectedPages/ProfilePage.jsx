import { useEffect, useState } from "react";
import API from "../../api/API";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [updateUserProfile, setUpdateUserProfile] = useState({
    username: userProfile.username || "",
    first_name: userProfile.first_name || "",
    last_name: userProfile.last_name || "",
    email: userProfile.email || "",
    address: userProfile.address || "",
  });
  const accessToken = localStorage.getItem("access_token");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    fetchUserProfile();
  }, [accessToken]);

  const fetchUserProfile = async () => {
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      const response = await API.get("users/me/", config);
      setUserProfile(response.data);
      setUpdateUserProfile({
        username: response.data.username || "",
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        email: response.data.email || "",
        address: response.data.address || "",
      });
    } catch (error) {
      console.error("Error fetching client orders: ", error);
    }
  };

  const toggleShowEdit = () => {
    setShowEditProfile((prevData) => !prevData);
  };

  const handleFormData = (fieldName, value) => {
    setUpdateUserProfile({
      ...updateUserProfile,
      [fieldName]: value,
    });
    if (fieldName === "avatar") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewAvatar(event.target.result);
      };
      reader.readAsDataURL(value);
      console.log(value);
    }
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      throw new Error("Access Token not found.");
    }
    try {
      await API.patch("users/me/update/", updateUserProfile, config);
      toggleShowEdit();
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  if (!userProfile && !updateUserProfile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="profilePage-container">
        <div className="profilePage-frame">
          {!showEditProfile && updateUserProfile ? (
            <div className="profileBox">
              <div className="avatar-container" title="Avatar">
                <img src={userProfile.avatar} />
              </div>
              <div className="profile-info-container">
                <div title="Username">
                  <i className="fi fi-rr-user" />
                  <span>{userProfile.username}</span>
                </div>
                <div title="Full Name">
                  <i className="fi fi-rr-id-badge"></i>
                  <span>
                    {userProfile.first_name || "N/A"}{" "}
                    {userProfile.last_name || "N/A"}
                  </span>
                </div>
                <div title="Email">
                  <i className="fi fi-rr-at"></i>
                  <span>{userProfile.email || "N/A"}</span>
                </div>
                <div title="Address">
                  <i className="fi fi-rr-marker"></i>
                  <span>{userProfile.address || "N/A"}</span>
                </div>
                <div style={{ gap: "15px" }}>
                  <div title="Type of User">
                    <i className="fi fi-rr-text"></i>
                    <span>{userProfile.type_of_user || "N/A"}</span>
                  </div>
                  <div title="ID">
                    <i className="fi fi-rr-hastag"></i>
                    <span>{userProfile.id || "N/A"}</span>
                  </div>
                </div>
                <div className="editButtonProfile">
                  <button onClick={toggleShowEdit}>EDIT</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="profileBox">
                <label htmlFor="avatar-input">
                  <div className="avatar-container-update" title="Avatar">
                    {newAvatar ? (
                      <>
                        <img src={newAvatar} alt="Avatar Preview" />
                      </>
                    ) : (
                      <>
                        <img src={userProfile.avatar} />
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    id="avatar-input"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      handleFormData("avatar", e.target.files[0])
                    }
                  />
                </label>
                <div className="profile-info-container-update">
                  <div className="input-container">
                    <i className="fi fi-rr-user" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={updateUserProfile.username}
                      onChange={(e) =>
                        handleFormData("username", e.target.value)
                      }
                    />
                  </div>
                  <div className="fullNameDiv">
                    <div className="input-container">
                      <i className="fi fi-rr-first"></i>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={updateUserProfile.first_name}
                        onChange={(e) =>
                          handleFormData("first_name", e.target.value)
                        }
                      />
                    </div>
                    <div className="input-container">
                      <i className="fi fi-rr-second"></i>
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={updateUserProfile.last_name}
                        onChange={(e) =>
                          handleFormData("last_name", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="input-container">
                    <i className="fi fi-rr-at"></i>
                    <input
                      type="email"
                      placeholder="Email"
                      value={updateUserProfile.email}
                      onChange={(e) => handleFormData("email", e.target.value)}
                    />
                  </div>
                  <div className="input-container">
                    <i className="fi fi-rr-marker"></i>
                    <input
                      type="text"
                      placeholder="Address"
                      value={updateUserProfile.address}
                      onChange={(e) =>
                        handleFormData("address", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="editButtonProfile save">
                  <button onClick={(e) => submitUpdate(e)}>SAVE</button>
                </div>
                <button className="backButton" onClick={toggleShowEdit}>
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
