import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { Route, Routes } from "react-router-dom"
import "./index.css"

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/userDashboard';

const theme = createTheme({
  primaryColor: 'sherwood-green', //primaryColor: #0f4736
  colors: {
    'sherwood-green': ['#d6f5e4', '#b0eacd', '#7dd8b0', '#47c08f', '#24a575', '#16855e', '#126a4e', '#11543e', '#0f4736', '#07271e'],
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
      </Routes>
    </MantineProvider>

  )
}

export default App