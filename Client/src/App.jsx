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
import ProtectedRoute from './routes/ProtectedRoute';

const theme = createTheme({
  primaryColor: 'sherwood-green', //primaryColor: #0f4736
  colors: {
    'sherwood-green': ['#d6f5e4', '#b0eacd', '#7dd8b0', '#47c08f', '#24a575', '#16855e', '#126a4e', '#11543e', '#0f4736', '#07271e'],
  },
});

function App() {

  const isLoggedIn = localStorage.getItem('token');
  const userType = localStorage.getItem('role');

  return (
    <MantineProvider theme={theme}>
      <Notifications position='top-center' />

      <Routes>

        {/* Unauthorised Routes */}
        {!isLoggedIn &&
          (
            <>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )
        }

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>

          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/signup" element={<Navigate to="/" />} />

          {userType === "admin" ? (
            <>
              <Route path="/" element={<Navigate to="/admin" />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/user" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/user" />} />
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/admin" element={<Navigate to="/" />} />
            </>
          )}

          <Route path='*' element={<Navigate to="/" />} />
        </Route>

      </Routes>
    </MantineProvider>

  )
}

export default App