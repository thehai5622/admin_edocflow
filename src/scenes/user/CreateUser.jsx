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
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const CreateUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  let avatarFileUuid = null;

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionOptions, setPermissionOptions] = useState([]);
  const [issuingAuthorityOptions, setIssuingAuthorityOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    fetchPermissions();
    fetchIssuingAuthority();
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

  const fetchIssuingAuthority = async () => {
    try {
      const res = await api.get("v1/issuingauthority/dropdown?keyword=");
      const result = res.data?.data || [];
      setIssuingAuthorityOptions(result);
    } catch (error) {
      console.error("Lỗi tải danh sách quyền:", error);
    }
  };

  const fetchDepartment = async (uuid) => {
    setDepartmentOptions([]);
    try {
      const res = await api.get(
        `v1/department/dropdown?issuing_authority=${uuid}`
      );
      const result = res.data?.data || [];
      setDepartmentOptions(result);
    } catch (error) {
      console.error("Lỗi tải danh sách quyền:", error);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      avatarFileUuid = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const resUpload = await api.post("v1/file/single-upload", formData);
        avatarFileUuid = resUpload.data?.file;
      }

      const createBody = {
        name: values.name.trim(),
        gender: values.gender ?? null,
        birth_day: values.birth_day || null,
        phone: values.phone.trim(),
        email: values.email.trim() === "" ? null : values.email.trim(),
        permission: values.permission?.uuid || null,
        issuing_authority: values.issuing_authority?.uuid || null,
        department: values.department?.uuid || null,
        avatar: avatarFileUuid,
      };

      api
        .post("/v1/user/create", createBody)
        .then((response) => {
          navigate("/users", {
            state: {
              type: "success",
              message: response.data.message,
            },
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
    } catch (error) {
      console.error("Lỗi tạo user:", error);
      if (avatarFileUuid) {
        try {
          await api.delete(`/v1/file/${avatarFileUuid}`);
          console.log("Đã rollback file avatar");
        } catch (err) {
          console.error("Lỗi khi xóa file rollback:", err);
        }
      }
    }
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
        <Box>
          <Button
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "700",
              padding: "10px 40px",
              ":hover": {
                backgroundColor: colors.blueAccent[300],
              },
              mr: 2,
            }}
            color="primary"
            variant="contained"
          >
            Hủy bỏ
          </Button>
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
                    Chọn ảnh
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
                  label="Tên cán bộ"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{
                    gridColumn: "span 4",
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                  }}
                />
                <Box
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ mr: 2 }}>Giới tính</Typography>
                  <Box>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value={1}
                        checked={values.gender === 1}
                        onChange={(e) =>
                          setFieldValue("gender", Number(e.target.value))
                        }
                      />
                      Nam
                    </label>
                    <label style={{ marginLeft: 16 }}>
                      <input
                        type="radio"
                        name="gender"
                        value={0}
                        checked={values.gender === 0}
                        onChange={(e) =>
                          setFieldValue("gender", Number(e.target.value))
                        }
                      />
                      Nữ
                    </label>
                  </Box>
                </Box>
                <Autocomplete
                  fullWidth
                  options={issuingAuthorityOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  onChange={(_, value) => {
                    setFieldValue("issuing_authority", value);
                    fetchDepartment(value?.uuid);
                  }}
                  value={values.issuing_authority}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value?.uuid
                  }
                  sx={{
                    gridColumn: "span 2",
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cơ quan ban hành"
                      variant="filled"
                      onBlur={handleBlur}
                      error={
                        !!touched.issuing_authority &&
                        !!errors.issuing_authority
                      }
                      helperText={
                        touched.issuing_authority && errors.issuing_authority
                          ? errors.issuing_authority
                          : ""
                      }
                    />
                  )}
                />
                <Autocomplete
                  fullWidth
                  options={departmentOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  onChange={(_, value) => setFieldValue("department", value)}
                  value={values.department}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value?.uuid
                  }
                  sx={{
                    gridColumn: "span 2",
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Phòng ban"
                      variant="filled"
                      onBlur={handleBlur}
                      error={!!touched.department && !!errors.department}
                      helperText={
                        touched.department && errors.department
                          ? errors.department
                          : ""
                      }
                    />
                  )}
                />
                <Autocomplete
                  fullWidth
                  options={permissionOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  onChange={(_, value) => setFieldValue("permission", value)}
                  value={values.permission}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value?.uuid
                  }
                  sx={{
                    gridColumn: "span 4",
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                  }}
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
                  type="text"
                  label="SĐT liên hệ"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone}
                  name="phone"
                  error={!!touched.phone && !!errors.phone}
                  helperText={touched.phone && errors.phone}
                  sx={{
                    gridColumn: "span 4",
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                  }}
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
                  sx={{
                    gridColumn: "span 4",
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                  }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Ngày sinh"
                  InputLabelProps={{ shrink: true }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.birth_day}
                  name="birth_day"
                  error={!!touched.birth_day && !!errors.birth_day}
                  helperText={touched.birth_day && errors.birth_day}
                  sx={{
                    gridColumn: "span 4",
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      <ToastContainer />
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  permission: yup.object().nullable().required("required"),
  issuing_authority: yup.object().nullable().required("required"),
  department: yup.object().nullable().required("required"),
  name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  gender: yup.number().oneOf([0, 1], "Invalid gender").required("required"),
  birth_day: yup.date().required("required"),
});

const initialValues = {
  name: "",
  email: "",
  phone: "",
  permission: null,
  issuing_authority: null,
  department: null,
  gender: 1,
  birth_day: "",
};

export default CreateUser;
