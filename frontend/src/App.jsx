import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './routes/LandingPage/landingpage'
import LoginScreen from './routes/Login/LoginScreen'
import FilterRoleScreen from './routes/FilterRoleScreen/FilterRoleScreen'
import MentorRegistration from './routes/MentorRegistration/MentorRegistration'
import StartupRegistration from './routes/StartUpRegister/StartUpRegister'
import MentorScreen from './routes/Mentor/MentorScreen'
import StartUpScreen from './routes/Startup/StartUpScreen'
import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute'
import ProfileScreen from './routes/ProfileScreen/ProfileScreen'
import MentorApproval from './routes/MentorApproval/MentorApproval'
import MainLayout from './Layout/Layout'
import StartupApproval from './routes/StartupApproval/StartupApproval'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/role' element={<FilterRoleScreen />} />
      <Route path='/mentor-register' element={<MentorRegistration />} />
      <Route path='/startup-register' element={<StartupRegistration />} />

      <Route element={<MainLayout />}>
        <Route path='/mentors' element={
          <ProtectedRoute>
            <MentorScreen />
          </ProtectedRoute>
        } />
        <Route path='/startups' element={
          <ProtectedRoute>
            <StartUpScreen />
          </ProtectedRoute>
        } />
        <Route path='/profile' element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        } />
        <Route path='/mentor-approval' element={
          <ProtectedRoute>
            <MentorApproval />
          </ProtectedRoute>
        } />
        <Route path='/startup-approval' element={
          <ProtectedRoute>
            <StartupApproval />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App
