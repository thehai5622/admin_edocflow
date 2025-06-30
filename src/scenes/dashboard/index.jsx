import { Box } from "@mui/material";
import Header from "../../components/Header";

const Dashboard = () => {
  return (
    <Box m="0px 20px" height="100%" display="flex" flexDirection="column">
      <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      
      <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center">
        <img
          alt="profile-user"
          src={"/assets/comming-soon.png"}
          style={{ width: "100%", height: "70%", objectFit: "fill" }}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
