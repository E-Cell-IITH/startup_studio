import './App.css'
import { Routes,Route } from 'react-router-dom'
import LoginScreen from './routes/Login/LoginScreen'
import FilterRoleScreen from './routes/FilterRoleScreen/FilterRoleScreen'
import MentorRegistration from './routes/MentorRegistration/MentorRegistration'
import StartupRegistration from './routes/StartUpRegister/StartUpRegister'
import Home from './routes/Home/Home'


function App() {

  return (
    <>
        <Routes>
            <Route path='/' Component={Home}/>
            <Route path='/login' Component={LoginScreen}/>
            <Route path='/role' Component={FilterRoleScreen}/>
            <Route path='/mentor-register' Component={MentorRegistration} />
            <Route path='/startup-register' Component={StartupRegistration} />
        </Routes>
    </>
  )
}

export default App
