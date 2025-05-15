import { ChartBarStacked, Database, FileUp, History, LayoutDashboard, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
    const navigate = useNavigate();

    const [isCollapsed, setIsCollapsed] = useState(false)

    useEffect(() => {
        const checkScreenSize = () => {
            setIsCollapsed(window.innerWidth < 1024)
        }

        checkScreenSize()

        window.addEventListener("resize", checkScreenSize)

        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    const menuItems =
        role === "admin"
            ? [
                { name: "Dashboard", icon: <LayoutDashboard size={24} />, path: "/admin" },
                { name: "User Management", icon: <Users size={24} />, path: "/admin/users" },
                { name: "Data Usage", icon: <Database size={24} />, path: "/admin/data-usage" },
            ]
            : [
                { name: "Dashboard", icon: <LayoutDashboard size={24} />, path: "/dashboard" },
                { name: "Upload & Analyze", icon: <FileUp size={24} />, path: "/dashboard/upload" },
                { name: "History", icon: <History size={24} />, path: "/dashboard/history" },
                { name: "Settings", icon: <Settings size={24} />, path: "/dashboard/settings" },
            ];

    return (
        <aside className={`w-2xs h-screen py-5 border-r border-gray-300 ${isCollapsed ? "w-[70px] px-2" : "w-2xs px-6"}`}>
            <div className={`flex ${isCollapsed ? " justify-center" : " space-x-2"}`}>
                <ChartBarStacked color="#0f4736" size={32} />
                {!isCollapsed && <h1 className="text-xl font-bold">Excel Analyzer</h1>}
            </div>

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`hidden md:flex absolute bg-white border border-gray-300 rounded-full p-1 shadow-md ${isCollapsed ? "left-14 top-20" : "left-69 top-20"}`}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-300 ${isCollapsed ? " rotate-180" : " "}`}
                >
                    <path d="M10 12L6 8L10 4" stroke="#126a4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <ul className="space-y-3 mt-8">
            {menuItems.map((item) => (
                <li key={item.name} onClick={() => navigate(item.path)}>
                    <div title={isCollapsed ? item.name : ""} 
                         className={`flex items-center text-lg px-3 py-2 rounded-md hover:bg-[#d6f5e4] cursor-pointer transition ${isCollapsed ? "justify-center" : "gap-3"}`}>
                        {item.icon}
                        <span className={`${isCollapsed ? "hidden" : ""}`}>{item.name}</span>
                    </div>
                </li>
            ))}
        </ul>
        </aside>
    );
};

export default Sidebar;
