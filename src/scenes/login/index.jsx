import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:3210/v1/user/login", {
        username: username,
        password: CryptoJS.MD5(password).toString(),
        fcm_token: null,
      });
      const userData = res.data.data;
      localStorage.setItem("accessToken", res.data.data.access_token);
      localStorage.setItem("refreshToken", res.data.data.refresh_token);
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" mb={2}>
          Đăng nhập
        </Typography>
        <TextField
          label="Username"
          value={username}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: colors.grey[100],
              },
              "&:hover fieldset": {
                borderColor: colors.blueAccent[500],
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.grey[100],
              },
            },
            "& .MuiInputLabel-root": {
              color: colors.grey[100],
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: colors.grey[100],
            },
            "& .MuiInputBase-input": {
              color: colors.grey[100],
            },
          }}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          value={password}
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: colors.grey[100],
              },
              "&:hover fieldset": {
                borderColor: colors.blueAccent[500],
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.grey[100],
              },
            },
            "& .MuiInputLabel-root": {
              color: colors.grey[100],
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: colors.grey[100],
            },
            "& .MuiInputBase-input": {
              color: colors.grey[100],
            },
          }}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "700",
            padding: "10px 20px",
            ":hover": {
              backgroundColor: colors.blueAccent[300],
            },
          }}
          color="primary"
          type="submit"
          onClick={handleLogin}
          style={{ marginTop: 24 }}
        >
          Đăng nhập
        </Button>
      </form>
    </Box>
  );
};

export default Login;
