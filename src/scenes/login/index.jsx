import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import CryptoJS from 'crypto-js';
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3210/v1/user/login", {
        username: username,
        password: CryptoJS.MD5(password).toString(),
        fcm_token: null
      });
      const userData = res.data.data;
      localStorage.setItem("accessToken", res.data.data.access_token);
      dispatch(loginSuccess(userData));
      navigate("/dashboard");
    } catch (err) {
      if (err.response.data) {
        console.error(err.response.data);
        alert(err.response.data.message);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt="10%">
      <Typography variant="h4" mb={2}>Đăng nhập</Typography>
      <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <TextField
        label="Mật khẩu"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ marginTop: 12 }}
      />
      <Button
        variant="contained"
        onClick={handleLogin}
        style={{ marginTop: 24 }}
      >
        Đăng nhập
      </Button>
    </Box>
  );
};

export default Login;
