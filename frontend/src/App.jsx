import './App.css'
import { Routes,Route } from 'react-router-dom'
import LoginScreen from './routes/Login/LoginScreen'


function App() {

  return (
    <>
        <Routes>
            <Route path='/login' Component={LoginScreen}/>
        </Routes>
    </>
  )
}

export default App
