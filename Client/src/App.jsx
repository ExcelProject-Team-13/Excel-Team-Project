import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboardLayout from './pages/AdminDashboard';
import UserDashboardLayout from './pages/UserDashboard';
// import ProtectedRoute from './routes/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/dashboard/Dashboard';
import Upload from './pages/dashboard/Upload';
import History from './pages/dashboard/History';
import Settings from './pages/dashboard/Settings';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import DataUsage from './pages/admin/DataUsage';
import Profile from './pages/Profile';
import SystemSettings from './pages/admin/Settings';
import Charts from './pages/dashboard/Charts';
import BarChart from './Charts/2dCharts/HorizontalBarChart';

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
        <Route path='/profile' element={<Profile />} />

        <Route path='/admin' element={<AdminDashboardLayout />} >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="data-usage" element={<DataUsage />} />
          <Route path="system-setting" element={<SystemSettings />} />
        </Route>

        <Route path='/dashboard' element={<UserDashboardLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="charts" element={<Charts />} >
            <Route path="barchart" element={<BarChart />} />

          </Route>
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path='/' element={<LandingPage />} />
      </Routes>

    </MantineProvider>

  )
}

export default App