import React, { useEffect, useState, useCallback } from "react";
import { Box, TextField, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import api from "../../service/apiService";
import { useSearchParams } from "react-router-dom";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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

  const fetchUsers = useCallback(async () => {
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
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const params = {
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    };
    if (keyword) params.keyword = keyword;
    setSearchParams(params);
  }, [pagination.page, pagination.limit, keyword, setSearchParams]);

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
    },
    { field: "username", headerName: "Tên đăng nhập", flex: 1 },
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
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      renderCell: (params) => {
        const isActive = params.row.status === 1;
        return (
          <>
            <button
              // onClick={() => handleActionClick(params.row)}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                color: "white",
                backgroundColor: isActive ? "#d32f2f" : "#2e7d32",
              }}
            >
              {isActive ? "Khóa" : "Cấp tài khoản"}
            </button>
            {!params.row.username && (
              <button
                // onClick={() => handleActionClick(params.row)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  backgroundColor: colors.greenAccent[500],
                }}
              >
                Cấp tài khoản
              </button>
            )}
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
      <TextField
        label="Tìm kiếm"
        variant="outlined"
        fullWidth
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        sx={{ mb: 2 }}
      />
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
    </Box>
  );
};

export default Users;
