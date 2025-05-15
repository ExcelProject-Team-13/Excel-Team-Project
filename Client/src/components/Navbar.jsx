import { Avatar, Button, Indicator, Menu, Tooltip } from '@mantine/core'
import { googleLogout } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Settings, User } from 'lucide-react'

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        googleLogout();
        navigate("/")
    }

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
            <div className="flex justify-end items-center h-16 border-b border-gray-300 px-4 sm:px-6 md:px-10">

                {/* Right Section */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Notifications */}
                    <Tooltip label="Notifications">
                      <Indicator color='red'>
                            <Bell size={20} />
                      </Indicator>
                    </Tooltip>

                    {/* User Menu */}
                    <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                            <Button variant="transparent">
                                <Avatar 
                                    radius="sm" 
                                    src="https://avatars.githubusercontent.com/u/123456789"
                                    alt="User avatar"
                                />
                                <div className="text-left ml-2">
                                    <div className="font-medium">John Doe</div>
                                    <div className="text-xs text-gray-500">john@example.com</div>
                                </div>
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Account</Menu.Label>
                            <Menu.Item 
                                leftSection={<User size={16} />}
                                onClick={() => navigate('/profile')}
                            >
                                Profile
                            </Menu.Item>
                            <Menu.Item 
                                leftSection={<Settings size={16} />} 
                                onClick={() => navigate('/dashboard/settings')}
                            >
                                Settings
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item 
                                leftSection={<LogOut size={16} />} 
                                color="red" 
                                onClick={handleLogout}
                            >
                                Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                </div>
            </div>
        </header>
    )
}

export default Navbar