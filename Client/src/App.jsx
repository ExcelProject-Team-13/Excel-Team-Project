import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/userDashboard';
// import ProtectedRoute from './routes/ProtectedRoute';
import LandingPage from './pages/LandingPage';

const theme = createTheme({
  primaryColor: 'sherwood-green', //primaryColor: #0f4736
  colors: {
    'sherwood-green': ['#d6f5e4', '#b0eacd', '#7dd8b0', '#47c08f', '#24a575', '#16855e', '#126a4e', '#11543e', '#0f4736', '#07271e'],
  },
});

function App() {

  // const isLoggedIn = localStorage.getItem('token');
  // const userType = localStorage.getItem('role');

  return (
    <MantineProvider theme={theme}>
      <Notifications position='top-center' />

      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/user' element={<UserDashboard />} />
        <Route path='/' element={<LandingPage />} />
      </Routes>

    </MantineProvider>

  )
}

export default App