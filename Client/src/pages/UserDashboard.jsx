import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import DashboardLayout from "../layout/DashboardLayout";

const UserDashboard = () => {
  return (
    <DashboardLayout role="user">
      <Navbar />

      <div className="flex flex-col m-10">
        <Outlet />
      </div>

    </DashboardLayout>
  );
};

export default UserDashboard;
