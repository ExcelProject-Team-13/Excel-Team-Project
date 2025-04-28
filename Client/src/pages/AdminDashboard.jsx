import Navbar from "../components/Navbar";
import DashboardLayout from "../layout/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <Navbar />
      
      <div className="flex flex-col m-10">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Here you can manage users and view uploads.</p>
      </div>

    </DashboardLayout>
  );
};

export default AdminDashboard;
