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
        throw new Error(`Login failed: ${response.status}`);
      }


      const data = await response.json();
      setUser({
        user_id: data.id
      });

      showSuccess("Login successful! Welcome back.", 4000);


      return data;
    } catch (err) {
      console.error("Login error:", err);

      showError("Login failed.", 5000);

      throw err;
    }
  }


  async function startupRegistration(formData, user_id, file) {




    const res = await fetch(`${BACKEND_URL}/generate-presign?filename=${file.name}&user_id=${user_id}`)
    const { upload_url, file_url } = await res.json()

    await fetch(upload_url, {
      method: "PUT",
      body: file,
    })

    console.log(response.data)


    await fetch(`${BACKEND_URL}/api/auth/startup-registration`, {
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



  }

  const logout = () => {
    setUser(null);
    showInfo("You have been logged out.", 3000);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser, startupRegistration }}>
      {children}
    </UserContext.Provider>
  );
};
