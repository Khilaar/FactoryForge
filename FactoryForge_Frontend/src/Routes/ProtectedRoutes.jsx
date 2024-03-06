import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { login_user, logout_user } from "../store/slices/userSlice.js";
import API from "../api/API.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoutes() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const retrieveUser = async () => {
      const localAccessToken = localStorage.getItem("access_token");
      if (localAccessToken) {
        try {
          await API.post("token/verify/", {
            token: localAccessToken,
          });
          dispatch(login_user(localAccessToken));
          setIsAuthenticated(true);
        } catch (error) {
          console.log("Error during login:", error);
        }
      } else {
        dispatch(logout_user());
      }
      setIsLoading(false);
    };
    retrieveUser();
  }, [dispatch, navigate]);

  if (isLoading) {
    return <div className='loadingSpinner'>
      <div className="loading">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{origin: location}}/>;
  } else {
    return <Outlet/>;
  }
}
