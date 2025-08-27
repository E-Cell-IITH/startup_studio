import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginScreen from './routes/Login/LoginScreen'
import FilterRoleScreen from './routes/FilterRoleScreen/FilterRoleScreen'
import MentorRegistration from './routes/MentorRegistration/MentorRegistration'
import StartupRegistration from './routes/StartUpRegister/StartUpRegister'
import MentorScreen from './routes/Mentor/MentorScreen'
import StartUpScreen from './routes/Startup/StartUpScreen'


function App() {

  return (
    <>
      <Routes>
        <Route path='/mentors' Component={MentorScreen} />
        <Route path='/startups' Component={StartUpScreen} />
        <Route path='/' Component={LoginScreen} />
        <Route path='/role' Component={FilterRoleScreen} />
        <Route path='/mentor-register' Component={MentorRegistration} />
        <Route path='/startup-register' Component={StartupRegistration} />
      </Routes>
    </>
  )
}

export default App
