import './App.css'
import { Routes,Route } from 'react-router-dom'
import LoginScreen from './routes/Login/LoginScreen'
import FilterRoleScreen from './routes/FilterRoleScreen/FilterRoleScreen'
import MentorRegistration from './routes/MentorRegistration/MentorRegistration'
import StartupRegistration from './routes/StartUpRegister/StartUpRegister'


function App() {

  return (
    <>
        <Routes >
            <Route path='/login' Component={LoginScreen}/>
            <Route path='/role' Component={FilterRoleScreen}/>
            <Route path='/mentor-register' Component={MentorRegistration} />
            <Route path='/startup-register' Component={StartupRegistration} />
        </Routes>
    </>
  )
}

export default App
