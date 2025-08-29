import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginScreen from './routes/Login/LoginScreen'
import FilterRoleScreen from './routes/FilterRoleScreen/FilterRoleScreen'
import MentorRegistration from './routes/MentorRegistration/MentorRegistration'
import StartupRegistration from './routes/StartUpRegister/StartUpRegister'
import MentorScreen from './routes/Mentor/MentorScreen'
import StartUpScreen from './routes/Startup/StartUpScreen'
import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute'
import ProfileScreen from './routes/ProfileScreen/ProfileScreen'

function App() {
  return (
    <>
      <Routes>
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
        <Route path='/' element={<LoginScreen />} />
        <Route path='/role' element={<FilterRoleScreen />} />
        <Route path='/mentor-register' element={<MentorRegistration />} />
        <Route path='/startup-register' element={<StartupRegistration />} />
      </Routes>
    </>
  )
}

export default App
