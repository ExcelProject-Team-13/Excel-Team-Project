import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import DashboardLayout from "../layout/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <Navbar />
      
      <div className="flex flex-col m-10">
        <Outlet />
      </div>

    </DashboardLayout>
  );
};

export default AdminDashboard;
