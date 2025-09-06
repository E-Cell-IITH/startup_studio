import { createContext, useContext } from "react";
import { useToast } from "./toastContext";


const StartupContext = createContext()



export const useStartUp = () => {
    const context = useContext(StartupContext);

    if (!context) {
        throw new Error('useMentor must be used within a MentorProvider');
    }
    return context;
};

export const StartupProvider = ({ children }) => {


    const { showSuccess, showError } = useToast();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    async function getAllStartups() {
        try {
            const response = await fetch(`${BACKEND_URL}/api/startups/`, {
                credentials: "include"
            });

            if (response.status !== 200) {
                showError("Fetching Startups Failed");
                return;
            }

            const data = await response.json();

            // console.log(data)

            showSuccess("Fetched all startups");

            return data;

        } catch (e) {
            console.error(e);
            showError("Error fetching All Startups");
            return;
        }
    }



    return <StartupContext.Provider value={{ getAllStartups }}>
        {children}
    </StartupContext.Provider>

}