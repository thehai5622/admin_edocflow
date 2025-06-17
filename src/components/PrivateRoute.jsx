import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../features/auth/authSlice";
import api from "../service/apiService";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    api
      .get("v1/user/me")
      .then((res) => {
        dispatch(loginSuccess(res.data.data));
        setIsAuthenticated(true);
      })
      .catch((err) => {
        console.warn(err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(logout());
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) return <div>Đang xác thực...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
