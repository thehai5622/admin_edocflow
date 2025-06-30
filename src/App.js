import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Users from "./scenes/user";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Login from "./scenes/login";
import PrivateRoute from "./components/PrivateRoute";
import CreateUser from "./scenes/user/CreateUser";
import IssuingAuthority from "./scenes/issuingauthority";
import Field from "./scenes/field";
import TypeFile from "./scenes/typefile";
import Department from "./scenes/department";
import AdministrativeLevel from "./scenes/administrativelevel";
import Page404 from "./scenes/page404";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const MainLayout = () => {
  const [isSidebar, setIsSidebar] = useState(true);
  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <div className="main-area">
        <Topbar setIsSidebar={setIsSidebar} />
        <main className="content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Cán bộ */}
            <Route path="/users" element={<Users />} />
            <Route path="/users/create" element={<CreateUser />} />

            {/* Cơ quan ban hành */}
            <Route path="/issuingauthority" element={<IssuingAuthority />} />

            {/* Lĩnh vực */}
            <Route path="/field" element={<Field />} />

            {/* Loại file */}
            <Route path="/typefile" element={<TypeFile />} />

            {/* Phòng ban */}
            <Route path="/department" element={<Department />} />

            {/* Cấp hành chính */}
            <Route path="/administrativelevel" element={<AdministrativeLevel />} />

            <Route path="*" element={<Page404 />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
