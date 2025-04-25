import { ChartPie, FolderUp, LayoutDashboard, User } from "lucide-react";
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
                <svg id="logo-15" width="35px" height="35px" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M24.5 12.75C24.5 18.9632 19.4632 24 13.25 24H2V12.75C2 6.53679 7.03679 1.5 13.25 1.5C19.4632 1.5 24.5 6.53679 24.5 12.75Z" className="ccustom" fill="#126a4e"></path> <path d="M24.5 35.25C24.5 29.0368 29.5368 24 35.75 24H47V35.25C47 41.4632 41.9632 46.5 35.75 46.5C29.5368 46.5 24.5 41.4632 24.5 35.25Z" className="ccustom" fill="#126a4e"></path> <path d="M2 35.25C2 41.4632 7.03679 46.5 13.25 46.5H24.5V35.25C24.5 29.0368 19.4632 24 13.25 24C7.03679 24 2 29.0368 2 35.25Z" className="ccustom" fill="#0f4736"></path> <path d="M47 12.75C47 6.53679 41.9632 1.5 35.75 1.5H24.5V12.75C24.5 18.9632 29.5368 24 35.75 24C41.9632 24 47 18.9632 47 12.75Z" className="ccustom" fill="#0f4736"></path> </svg>
                {!isCollapsed && <h1 className="text-xl font-bold">Excel Analytics</h1>}
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
