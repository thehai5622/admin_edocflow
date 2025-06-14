import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      alert("Đăng nhập thất bại");
      console.error(err);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt="10%">
      <Typography variant="h4" mb={2}>Đăng nhập</Typography>
      <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} />
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
