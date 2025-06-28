import { useEffect, useState } from "react";
import api from "../../service/apiService";
import {
  Box,
  Button,
  TextField,
  useTheme,
  Autocomplete,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { phoneRegExp } from "../../utils/utils";

const CreateUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionOptions, setPermissionOptions] = useState([]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await api.get("v1/permission/dropdown?keyword=");
      const result = res.data?.data || [];
      setPermissionOptions(result);
    } catch (error) {
      console.error("Lỗi tải danh sách quyền:", error);
    }
  };

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <Box m="0px 20px" height="100%" display="flex" flexDirection="column">
      {/* PHẦN HEADER CỐ ĐỊNH */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2, mt: 2 }}
        flexShrink={0}
      >
        <Header title="THÊM MỚI CÁN BỘ" subtitle="Thông tin cán bộ" />
        <Button
          onClick={() => {
            document.getElementById("create-user-form")?.requestSubmit();
          }}
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "700",
            padding: "10px 40px",
            ":hover": {
              backgroundColor: colors.blueAccent[300],
            },
          }}
          color="primary"
          variant="contained"
        >
          Lưu lại
        </Button>
      </Box>

      {/* PHẦN FORM CUỘN */}
      <Box flex="1" overflow="auto" pb={4}>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form id="create-user-form" onSubmit={handleSubmit}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    overflow: "hidden",
                    flexShrink: 0,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <img
                    src={selectedImage || "/assets/user.png"}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Box flex="1">
                  <Button
                    component="label"
                    variant="contained"
                    sx={{
                      backgroundColor: colors.blueAccent[700],
                      color: colors.grey[100],
                      fontWeight: "700",
                      fontSize: "14px",
                      mr: 2,
                      ":hover": { backgroundColor: colors.blueAccent[300] },
                    }}
                  >
                    Chọn file
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setSelectedImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mr: 2, fontWeight: "700", fontSize: "14px" }}
                    onClick={() => {
                      setSelectedFile(null);
                      setSelectedImage(null);
                    }}
                    startIcon={<i className="fa fa-trash" />}
                  >
                    Xóa ảnh đại diện
                  </Button>
                  <Typography
                    sx={{
                      maxWidth: "250px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {selectedFile?.name || "Tên file"}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    mt={1}
                    fontSize={13}
                  >
                    Hình ảnh được dùng làm ảnh đại diện
                  </Typography>
                </Box>
              </Box>

              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": {
                    gridColumn: isNonMobile ? undefined : "span 4",
                  },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={!!touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={!!touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <Autocomplete
                  fullWidth
                  options={permissionOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  onChange={(_, value) =>
                    setFieldValue("permission", value)
                  }
                  value={values.permission}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value?.uuid
                  }
                  sx={{ gridColumn: "span 4" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Quyền"
                      variant="filled"
                      onBlur={handleBlur}
                      error={!!touched.permission && !!errors.permission}
                      helperText={
                        touched.permission && errors.permission
                          ? errors.permission
                          : ""
                      }
                    />
                  )}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Contact Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contact}
                  name="contact"
                  error={!!touched.contact && !!errors.contact}
                  helperText={touched.contact && errors.contact}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Address 1"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address1}
                  name="address1"
                  error={!!touched.address1 && !!errors.address1}
                  helperText={touched.address1 && errors.address1}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Address 2"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address2}
                  name="address2"
                  error={!!touched.address2 && !!errors.address2}
                  helperText={touched.address2 && errors.address2}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
  permission: yup.object().nullable().required("required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
  permission: null,
};

export default CreateUser;
