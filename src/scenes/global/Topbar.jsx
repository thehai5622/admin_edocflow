import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import {
  LightModeOutlined as LightModeOutlinedIcon,
  DarkModeOutlined as DarkModeOutlinedIcon,
  NotificationsOutlined as NotificationsOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
} from "@mui/icons-material";
import { Formik } from "formik";
import api from "../../service/apiService";
import * as yup from "yup";
import { ColorModeContext, tokens } from "../../theme";
import { toast, ToastContainer } from "react-toastify";
import CryptoJS from "crypto-js";

const Topbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const hangleChangePasswordClick = () => {
    handleMenuClose();
    setChangePasswordDialogOpen(true);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleChangePasswordSubmit = (values) => {
    if (values.new_password !== values.confirm_password) {
      toast.error("Xác nhận mật khẩu không khớp", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    api
      .put(`/v1/user/change-password`, {
        current_password: CryptoJS.MD5(values.current_password).toString(),
        password: CryptoJS.MD5(values.new_password).toString(),
      })
      .then((response) => {
        setChangePasswordDialogOpen(false);
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" p={2}>
        <Typography
          variant="h3"
          component="h3"
          aria-readonly
          sx={{
            fontWeight: "bold",
            userSelect: "none",
          }}
        >
          Quản lý văn bản hành chính
        </Typography>

        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>

          <IconButton onClick={handleMenuClick}>
            <PersonOutlinedIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Thông tin cá nhân</MenuItem>
            <MenuItem onClick={hangleChangePasswordClick}>
              Đổi mật khẩu
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>Đăng xuất</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Xác nhận đăng xuất</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn đăng xuất không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleLogoutCancel}
          >
            Hủy
          </Button>
          <Button
            sx={{
              backgroundColor: colors.redAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleLogoutConfirm}
            color="error"
          >
            Đăng xuất
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={changePasswordDialogOpen}
        onClose={() => {
          setChangePasswordDialogOpen(false);
        }}
      >
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <Formik
          enableReinitialize
          onSubmit={handleChangePasswordSubmit}
          initialValues={{
            current_password: "",
            new_password: "",
            confirm_password: "",
          }}
          validationSchema={checkoutSchemaU}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Mật khẩu hiện tại"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.current_password}
                  name="current_password"
                  error={!!touched.current_password && !!errors.current_password}
                  helperText={touched.current_password && errors.current_password}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                    mb: 1,
                  }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Mật khẩu mới"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.new_password}
                  name="new_password"
                  error={!!touched.new_password && !!errors.new_password}
                  helperText={touched.new_password && errors.new_password}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                    mb: 1,
                  }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Xác nhận mật khẩu"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirm_password}
                  name="confirm_password"
                  error={!!touched.confirm_password && !!errors.confirm_password}
                  helperText={touched.confirm_password && errors.confirm_password}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                    mb: 1,
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                  }}
                  onClick={() => setChangePasswordDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                  }}
                  color="primary"
                >
                  Lưu lại
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

// Update schema
const checkoutSchemaU = yup.object().shape({
  current_password: yup.string().required("required"),
  new_password: yup.string().required("required"),
  confirm_password: yup.string().required("required"),
});

export default Topbar;
