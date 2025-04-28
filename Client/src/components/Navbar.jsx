import { Button } from '@mantine/core'
import { googleLogout } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        googleLogout();
        navigate("/")
      }

  return (
    <div>
      <header className="flex justify-between h-16 items-center border-b border-gray-300 px-10">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
      </header>
    </div>
  )
}

export default Navbar
