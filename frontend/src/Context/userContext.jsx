import { createContext, useContext, useState} from "react";
import { useToast } from "./toastContext";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const { showSuccess, showError } = useToast();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const INVESTOR_BASE_API_KEY = import.meta.env.VITE_INVESTOR_BASE_API_KEY



  async function login(idToken) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
        }),
        credentials: "include",
      });

      if (response.status !== 200) {
        showError("Login failed.", 5000);
        return null;
      }

      const data = await response.json();

      // console.log(data)

      setUser({
        user_id: data.user_id,
        email: data.email,
      });

      // console.log(data)



      showSuccess("Login successful! Welcome", 4000);
      return data;
    } catch (err) {
      console.error("Login error:", err);

      showError("Login failed.", 5000);

      throw err;
    }
  }


  async function getStartUpOrMentorId(userId) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/getId/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (response.status !== 200) {
        showError("Fetching user details failed", 5000);
        return false;
      }


      const data = await response.json()



      if (data.startup_id) {
        setUser(prev => ({
          ...prev,
          startup_id: data.startup_id
        }))

      } else if (data.mentor_id) {
        setUser(prev => ({
          ...prev,
          mentor_id: data.mentor_id
        }))

      }


      return data;



    } catch (e) {
      console.error("Fetching user failed:", e);

      showError("Fetching user failed", 5000);

      throw err;
    }
  }


  async function startupRegistration(formData, user_id) {
    try {

      // const investorBaseAPICall = await fetch(
      //   `
      //   https://jhtnruktmtjqrfoiyrep.supabase.co/functions/v1/submit-and-evaluate-startup
      //   `
      //   , {
      //     method: 'POST',
      //     headers: { "Content-Type": "application/json" },
      //     apiKey: INVESTOR_BASE_API_KEY,
      //     Authorization: `Bearer ${INVESTOR_BASE_API_KEY}`,
      //     body: JSON.stringify({
      //       startup_name: formData.startup_name,
      //       founder_email: user.email,
      //       linkedin_profile_url: formData.linkedin_profile_url,
      //       problem_statement: formData.problem_statement,
      //       solution: formData.solution,
      //       market_understanding: formData.market_understanding,
      //       customer_understanding: formData.customer_understanding,
      //       competitive_understanding: formData.competitive_understanding,
      //       unique_selling_proposition: formData.usp,
      //       technical_understanding: formData.tech_understanding,
      //       vision: formData.vision,
      //       campus_affiliation: formData.campus_startup,
      //     })
      //   })

      // if (investorBaseAPICall.status != 201) {
      //   showError('Startup Registration Failed')
      //   return null
      // }

      const resStartUpRegister = await fetch(`${BACKEND_URL}/api/auth/startup-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startup_name: formData.startup_name,
          website: formData.website,
          phone: formData.phone,
          about: formData.about,
          problem_statement: formData.problem_statement,
          solution: formData.solution,
          market_understanding: formData.market_understanding,
          customer_understanding: formData.customer_understanding,
          competitive_understanding: formData.competitive_understanding,
          usp: formData.usp,
          tech_understanding: formData.tech_understanding,
          vision: formData.vision,
          campus_startup: formData.campus_startup,
          user_id: user_id,
          linkedin_profile_url: formData.linkedin_profile_url,
        }),
        credentials: "include"
      })

      if (resStartUpRegister.status != 200) {
        showError("StartUp Registration Failed.", 4000);
        return null;
      }

      const data = await resStartUpRegister.json();

      setUser(prev => ({
        ...prev,
        startup_id: data.startup_id
      }))


      showSuccess("Registration Successful", 4000);

      return data;
    }
    catch (e) {
      console.error("Startup reg error:", e);
      showError("Startup Registration Failed.", 5000);
      throw e;
    }

  }

  async function logout() {

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        credentials: "include"
      })

      if (response.status != 200) {
        showError("Logout failed.", 5000);
        return false;
      }

      setUser(null);
      showSuccess("You have been logged out.", 3000);
      return true;
    }
    catch (e) {
      console.error("Logout error:", e);

      showError("Logout Failed.", 5000);

      throw e;
    }
  }


  async function mentorRegistration(formData, user_id) {

    try {
      // const res = await fetch(
      //   `${BACKEND_URL}/api/auth/generate-presign?filename=${file.name}&user_id=${user_id}`, {
      //   credentials: "include"
      // })
      // const { upload_url, file_url } = await res.json()

      // await fetch(upload_url, {
      //   method: "PUT",
      //   body: file,
      // })

      const mentorRegRes = await fetch(`${BACKEND_URL}/api/auth/mentor-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone: formData.phone_number,
          experience: formData.experience,
          expertise: formData.expertise,
          linked_in_url: formData.linked_in_url,
          about: formData.about,
          user_id: user_id,
        })
      })

      if (mentorRegRes.status != 200) {
        showError("Error registering mentor", 3000)
      }


      const data = mentorRegRes.json()


      setUser(prev => ({
        ...prev,
        mentor_id: data.mentor_id
      }))

      showSuccess("Registration Successful", 4000);

      return data;




    } catch (e) {
      console.error("Login error:", e);

      showError("Mentor Registration Failed.", 5000);

      throw e;
    }

  }

  return (
    <UserContext.Provider value={{ user, login, logout, setUser, startupRegistration, getStartUpOrMentorId, mentorRegistration }}>
      {children}
    </UserContext.Provider>
  );
};
