import { createContext, useContext, useState } from "react";

const UserContext = createContext()

export const useUser = () => {
    return useContext(UserContext);
};

// const [user, setUser] = useState({})

export const UserProvider = ({ children }) => {
    async function login(idToken) {
        try {
            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idToken,
                }),
            });

            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }

            const data = await response.json();
            console.log("Login successful:", data);
            return data;
        } catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    }



    return (
        <UserContext.Provider value={{ login }}>
            {children}
        </UserContext.Provider>
    )

}