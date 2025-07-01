import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  TextField,
  useTheme,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import api from "../../service/apiService";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PasswordIcon from "@mui/icons-material/Password";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import { toast, ToastContainer } from "react-toastify";
import CryptoJS from "crypto-js";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();

  const [permissionOptions, setPermissionOptions] = useState([]);
  const [issuingAuthorityOptions, setIssuingAuthorityOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [provideAccountDialogOpen, setProvideAccountDialogOpen] =
    useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialLimit = parseInt(searchParams.get("limit") || "25", 10);
  const initialKeyword = searchParams.get("keyword") || "";

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    totalCount: 0,
  });
  const [keyword, setKeyword] = useState(initialKeyword);

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

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get(`/v1/user`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          keyword: keyword,
        },
      });
      setUsers(res.data.data);
      setPagination((prev) => ({
        ...prev,
        totalCount: res.data.pagination.totalCount,
      }));
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng", error);
    }
  }, [pagination.page, pagination.limit, keyword]);

  useEffect(() => {
    if (location.state?.type === "success") {
      toast.success(location.state?.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [location, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const params = {
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    };
    if (keyword) params.keyword = keyword;
    setSearchParams(params);
  }, [pagination.page, pagination.limit, keyword, setSearchParams]);

  const handleSetStatusConfirm = () => {
    api
      .put(
        `/v1/user/${selectedRow.status === 0 ? "unlock" : "lock"}/${
          selectedRow.uuid
        }`
      )
      .then((response) => {
        fetchData();
        setStatusDialogOpen(false);
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

  const handleResetPasswordConfirm = () => {
    api
      .put(`/v1/user/reset-password/${selectedRow.uuid}`, {
        password: CryptoJS.MD5("123456").toString(),
      })
      .then((response) => {
        fetchData();
        setResetPasswordDialogOpen(false);
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

  const handleProvideAccountSubmit = (values) => {
    api
      .put(`/v1/user/provide-account/${values.id}`, {
        username: values.username,
        password: CryptoJS.MD5(values.password).toString(),
      })
      .then((response) => {
        fetchData();
        setProvideAccountDialogOpen(false);
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

  const handleUpdateSubmit = (values) => {
    api
      .put(`/v1/issuingauthority/${values.id}`, {
        name: values.name,
        administrativelevel_id: values.administrative_level.uuid,
      })
      .then((response) => {
        fetchData();
        setUpdateDialogOpen(false);
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

  const columns = [
    {
      field: "stt",
      headerName: "STT",
      width: 80,
      valueGetter: (params) =>
        (pagination.page - 1) * pagination.limit +
        params.api.getRowIndex(params.id) +
        1,
    },
    {
      field: "name",
      headerName: "Tên",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <div>
          <Typography
            color={colors.blueAccent[500]}
            sx={{ cursor: "pointer", fontWeight: "600" }}
          >
            {params.row.name}
          </Typography>
        </div>
      ),
    },
    {
      field: "username",
      headerName: "Tên đăng nhập",
      flex: 1,
      valueGetter: (params) => params.row.username || "--",
    },
    { field: "phone", headerName: "Số điện thoại", flex: 1 },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      valueGetter: (params) => params.row.email || "--",
    },
    {
      field: "permission",
      headerName: "Quyền",
      flex: 1,
      valueGetter: (params) => params.row.permission?.name || "--",
    },
    {
      field: "issuing_authority",
      headerName: "Cơ quan cấp",
      flex: 1,
      valueGetter: (params) => params.row.issuing_authority?.name || "--",
    },
    {
      field: "department",
      headerName: "Phòng ban",
      flex: 1,
      valueGetter: (params) => params.row.department?.name || "--",
    },
    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      renderCell: (params) => {
        const isActive = params.row.status === 1;
        return (
          <>
            <Tooltip
              title={
                isActive ? "Khóa hoạt động cán bộ" : "Mở khóa hoạt động cán bộ"
              }
              sx={{ userSelect: "none" }}
            >
              <IconButton
                onClick={() => {
                  setSelectedRow(params.row);
                  setStatusDialogOpen(true);
                }}
              >
                {isActive ? <LockIcon /> : <LockOpenIcon />}
              </IconButton>
            </Tooltip>
            {!params.row.username ? (
              <Tooltip title="Cấp tài khoản cho cán bộ">
                <IconButton
                  onClick={() => {
                    setSelectedRow(params.row);
                    setProvideAccountDialogOpen(true);
                  }}
                >
                  <AccountBoxIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Đặt lại mật khẩu mặc định cho cán bộ">
                <IconButton
                  onClick={() => {
                    setSelectedRow(params.row);
                    setResetPasswordDialogOpen(true);
                  }}
                >
                  <PasswordIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Điều chỉnh đơn vị công tác của cán bộ">
              <IconButton
                onClick={() => {
                  setSelectedRow(params.row);
                  fetchDepartment(params.row.issuing_authority.uuid);
                  setUpdateDialogOpen(true);
                }}
              >
                <EmojiTransportationIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="DANH SÁCH CÁN BỘ"
        subtitle="Quản lý thông tin cán bộ trong hệ thống"
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }} // optional: margin bottom cho khoảng cách
      >
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{
            width: "30%",
            mr: 2,
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
        />

        <Button
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
          onClick={() => navigate("/users/create")}
        >
          Thêm mới
        </Button>
      </Box>
      <Box
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.uuid}
          rowCount={pagination.totalCount}
          paginationMode="server"
          paginationModel={{
            page: pagination.page - 1,
            pageSize: pagination.limit,
          }}
          onPageChange={(newPage) =>
            setPagination((prev) => ({ ...prev, page: newPage + 1 }))
          }
          onPageSizeChange={(newLimit) =>
            setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }))
          }
          pageSizeOptions={[5, 10, 12, 25, 50]}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      >
        <DialogTitle>
          {selectedRow?.status === 1 ? "Khóa" : "Mở khóa"} cán bộ
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn
            {selectedRow?.status === 1 ? " khóa" : " mở khóa"} cán bộ '
            {
              <span
                style={{ fontWeight: "bold", color: colors.blueAccent[400] }}
              >
                {selectedRow?.name}
              </span>
            }
            ' không?
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
            onClick={() => setStatusDialogOpen(false)}
          >
            Hủy
          </Button>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleSetStatusConfirm}
            color="primary"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={resetPasswordDialogOpen}
        onClose={() => setResetPasswordDialogOpen(false)}
      >
        <DialogTitle>Đặt lại mật khẩu mặc định cán bộ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Mật khẩu của cán bộ '
            {
              <span
                style={{ fontWeight: "bold", color: colors.blueAccent[400] }}
              >
                {selectedRow?.name}
              </span>
            }
            ' sẽ là '123456'. Bạn có chắc chắn muốn đặt lại không?
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
            onClick={() => setResetPasswordDialogOpen(false)}
          >
            Hủy
          </Button>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleResetPasswordConfirm}
            color="primary"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={provideAccountDialogOpen}
        onClose={() => {
          setProvideAccountDialogOpen(false);
        }}
      >
        <DialogTitle>Cấp tài khoản cho cán bộ</DialogTitle>
        <Formik
          enableReinitialize
          onSubmit={handleProvideAccountSubmit}
          initialValues={{
            id: selectedRow?.uuid || "",
            username: "",
            password: "",
          }}
          validationSchema={checkoutSchemaP}
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
                  type="text"
                  label="Tài khoản"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={!!touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
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
                  label="Mật khẩu"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
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
                  onClick={() => setProvideAccountDialogOpen(false)}
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

      <Dialog
        open={updateDialogOpen}
        onClose={() => {
          setUpdateDialogOpen(false);
        }}
      >
        <DialogTitle>Điều chỉnh công tác của cán bộ</DialogTitle>
        <Formik
          enableReinitialize
          onSubmit={handleUpdateSubmit}
          initialValues={{
            id: selectedRow?.uuid || "",
            permission: selectedRow?.permission || null,
            issuing_authority: selectedRow?.issuing_authority || null,
            department: selectedRow?.department || null,
          }}
          validationSchema={checkoutSchemaU}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
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
                    mb: 1,
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
                    mb: 1,
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
                  onClick={() => setUpdateDialogOpen(false)}
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
  id: yup.string().required("required"),
  permission: yup.object().nullable().required("required"),
  issuing_authority: yup.object().nullable().required("required"),
  department: yup.object().nullable().required("required"),
});

// Provide schema
const checkoutSchemaP = yup.object().shape({
  id: yup.string().required("required"),
  username: yup.string().required("required"),
  password: yup.string().required("required"),
});

export default Users;
