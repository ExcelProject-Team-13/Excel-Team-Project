import { ChartBarStacked, ChartPie, FolderUp, LayoutDashboard, User } from "lucide-react";
import { useEffect, useState } from "react";

const Sidebar = ({ role }) => {

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
                { name: "Dashboard", icon: <LayoutDashboard size={24} /> },
                { name: "Users", icon: <User size={24} /> },
                { name: "Uploads", icon: <FolderUp size={24} /> },
            ]
            : [
                { name: "Dashboard", icon: <LayoutDashboard size={24} /> },
                { name: "My Uploads", icon: <FolderUp size={24} /> },
                { name: "New Analysis", icon: <ChartPie size={22} /> },
            ];

    return (
        <aside className={`w-2xs h-screen py-5 border-r border-gray-300 ${isCollapsed ? "w-[70px] px-2" : "w-2xs px-6"}`}>
            <div className={`flex ${isCollapsed ? " justify-center" : " space-x-2"}`}>
                <ChartBarStacked color="#0f4736" size={32} />
                {!isCollapsed && <h1 className="text-xl font-bold">Excel Analyzer</h1>}
            </div>

            <button
                onClick={() => setIsCollapsed(!isCollapsed) }
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

            <ul className="space-y-3 mt-6">
                {menuItems.map((item) => (
                    <li key={item.name}>
                        <div title={isCollapsed ? item.name : ""} className={`flex items-center text-lg px-3 py-2 rounded-md text-gray-700 hover:bg-[#d6f5e4] cursor-pointer transition ${isCollapsed ? " justify-center" : " gap-3"}`}>
                            {item.icon}
                            <span className={`${isCollapsed ? " hidden" : " "}`}>{item.name}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
