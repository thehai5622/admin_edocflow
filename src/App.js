import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Users from "./scenes/user";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Login from "./scenes/login";
import PrivateRoute from "./components/PrivateRoute";
import CreateUser from "./scenes/user/CreateUser";
import IssuingAuthority from "./scenes/issuingauthority";
import Field from "./scenes/field";
import TypeFile from "./scenes/typefile";

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


            <Route path="/team" element={<Team />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/form" element={<Form />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/line" element={<Line />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/geography" element={<Geography />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
