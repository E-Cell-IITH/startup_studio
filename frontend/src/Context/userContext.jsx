import { createContext, useContext, useState } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { showSuccess, showError } = useToast();


  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
      });

      if (response.status !== 200) {
        showError("Login failed.", 5000);
        return null;
      }

      const data = await response.json();
      setUser({
        user_id: data.id,
        reg_status: data.is_registered,
      });

      // console.log(data)

      setIsAuthenticated(true)

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
      });

      if (response.status !== 200) {
        showError("Fetching user details failed", 5000);
        return false;
      }


      const data = response.json()



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
      console.error("Fetching user failed:", err);

      showError("Fetching user failed", 5000);

      throw err;
    }
  }


  async function startupRegistration(formData, user_id, file) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/generate-presign?filename=${file.name}&user_id=${user_id}`)
      const { upload_url, file_url } = await res.json()

      await fetch(upload_url, {
        method: "PUT",
        body: file,
      })


      const resStartUpRegister = await fetch(`${BACKEND_URL}/api/auth/startup-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startup_name: formData.startup_name,
          industry: formData.industry,
          phone: formData.phone,
          website: formData.website,
          user_id: user_id,
          profile_photo_ref: file_url
        })
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
      console.error("Login error:", e);
      showError("Login failed.", 5000);
      throw err;
    }

  }

  const logout = () => {
    setUser(null);
    showInfo("You have been logged out.", 3000);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser, startupRegistration, getStartUpOrMentorId, isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
