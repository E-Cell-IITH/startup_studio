import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import { useUser } from '../../Context/userContext'

const StartUpScreen = () => {


  const { user } = useUser()

  // console.log(user)


  return (

    <>  
      <Navbar/>
      {
        user?.mentor_detail?.approval_status || user?.is_admin ? <div>StartUpScreen</div> : <div>Not an approved mentor</div>
      }
      <Footer/>

    </>
  )
}

export default StartUpScreen