import Navbar from "../components/Navbar";
import DashboardLayout from "../layout/DashboardLayout";

const UserDashboard = () => {
  return (
    <DashboardLayout role="user">
      <Navbar />

      <div className="flex flex-col m-10">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <p>View your upload history and start new analyses.</p>
      </div>

    </DashboardLayout>
  );
};

export default UserDashboard;
