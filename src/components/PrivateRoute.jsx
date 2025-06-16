import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess, logout } from "../features/auth/authSlice";

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

    axios
      .get("http://localhost:3210/v1/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        dispatch(loginSuccess(res.data.data));
        setIsAuthenticated(true);
      })
      .catch((err) => {
        console.warn("Token không hợp lệ hoặc hết hạn:", err);
        localStorage.removeItem("accessToken");
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
