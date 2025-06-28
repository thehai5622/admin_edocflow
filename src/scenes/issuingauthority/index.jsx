import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  TextField,
  useTheme,
  IconButton,
  Tooltip,
  Button,
  Typography,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Formik } from "formik";
import * as yup from "yup";
import api from "../../service/apiService";
import { useSearchParams } from "react-router-dom";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { convertDateTime } from "../../utils/utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IssuingAuthority = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [administrativeLevelOptions, setAdministrativeLevelOptions] = useState(
    []
  );

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    fetchAdministrativeLevel();
  }, []);

  const fetchAdministrativeLevel = async () => {
    try {
      const res = await api.get("v1/administrativelevel");
      const result = res.data?.data || [];
      setAdministrativeLevelOptions(result);
    } catch (error) {
      console.error("Lỗi tải danh sách quyền:", error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get(`/v1/issuingauthority`, {
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
      console.error("Lỗi khi tải danh sách cơ quan ban hành", error);
    }
  }, [pagination.page, pagination.limit, keyword]);

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

  const handleCreateSubmit = (values) => {
    api
      .post("/v1/issuingauthority", {
        name: values.name,
        administrativelevel_id: values.administrative_level.uuid,
      })
      .then((response) => {
        fetchData();
        setCreateDialogOpen(false);
        console.log(response.data);
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
        console.log(response.data);
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

  const handleDeleteConfirm = () => {
    api
      .delete(`/v1/issuingauthority/${selectedRow.uuid}`)
      .then((response) => {
        fetchData();
        setDeleteDialogOpen(false);
        console.log(response.data);
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
        <div
          onClick={() => {
            setSelectedRow(params.row);
            setUpdateDialogOpen(true);
          }}
        >
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
      field: "administrative_level",
      headerName: "Thuộc cấp",
      flex: 1,
      valueGetter: (params) => params.row.administrative_level?.name || "--",
    },
    {
      field: "created_at",
      headerName: "Thời gian tạo",
      flex: 1,
      valueGetter: (params) => convertDateTime(params.row.created_at),
    },
    {
      field: "updated_at",
      headerName: "Cập nhật lần cuối",
      flex: 1,
      valueGetter: (params) => convertDateTime(params.row.updated_at),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title={"Xóa loại file"} sx={{ userSelect: "none" }}>
              <IconButton
                onClick={() => {
                  setSelectedRow(params.row);
                  setDeleteDialogOpen(true);
                }}
              >
                <DeleteIcon />
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
        title="DANH SÁCH CƠ QUAN BAN HÀNH"
        subtitle="Quản lý thông tin cơ quan ban hành trong hệ thống"
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
          onClick={() => {
            setCreateDialogOpen(true);
          }}
        >
          Thêm mới
        </Button>
      </Box>
      <Box
        height="75vh"
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
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
        }}
      >
        <DialogTitle>Thêm mới cơ quan ban hành</DialogTitle>
        <Formik
          onSubmit={handleCreateSubmit}
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
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Tên cơ quan ban hành"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                    mb: 1,
                  }}
                />
                <Autocomplete
                  fullWidth
                  options={administrativeLevelOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  onChange={(_, value) =>
                    setFieldValue("administrative_level", value)
                  }
                  value={values.administrative_level}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value?.uuid
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Thuộc cấp"
                      variant="filled"
                      onBlur={handleBlur}
                      error={
                        !!touched.administrative_level &&
                        !!errors.administrative_level
                      }
                      helperText={
                        touched.administrative_level &&
                        errors.administrative_level
                          ? errors.administrative_level
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
                  onClick={() => setCreateDialogOpen(false)}
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
        <DialogTitle>Chỉnh sửa cơ quan ban hành</DialogTitle>
        <Formik
          enableReinitialize
          onSubmit={handleUpdateSubmit}
          initialValues={{
            id: selectedRow?.uuid || "",
            name: selectedRow?.name || "",
            administrative_level: selectedRow?.administrative_level || null,
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
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Tên cơ quan ban hành"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: colors.grey[100],
                    },
                    mb: 1,
                  }}
                />
                <Autocomplete
                  fullWidth
                  options={administrativeLevelOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  onChange={(_, value) =>
                    setFieldValue("administrative_level", value)
                  }
                  value={values.administrative_level}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value?.uuid
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Thuộc cấp"
                      variant="filled"
                      onBlur={handleBlur}
                      error={
                        !!touched.administrative_level &&
                        !!errors.administrative_level
                      }
                      helperText={
                        touched.administrative_level &&
                        errors.administrative_level
                          ? errors.administrative_level
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xóa lĩnh vực</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa cơ quan ban hành '
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
            onClick={() => setDeleteDialogOpen(false)}
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
            onClick={handleDeleteConfirm}
            color="primary"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

// Create schema
const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  administrative_level: yup.object().nullable().required("required"),
});
const initialValues = {
  name: "",
  administrative_level: null,
};

// Update schema
const checkoutSchemaU = yup.object().shape({
  id: yup.string().required("required"),
  name: yup.string().required("required"),
  administrative_level: yup.object().nullable().required("required"),
});

export default IssuingAuthority;
