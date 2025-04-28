import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children, role }) => {
  return (
    <div className="flex h-screen">
      <Sidebar role={role} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
