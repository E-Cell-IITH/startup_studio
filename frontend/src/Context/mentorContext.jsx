import { createContext, useContext } from "react";
import { useToast } from "./toastContext";

const MentorContext = createContext()

export const useMentor = () => {
    const context = useContext(MentorContext);

    if (!context) {
        throw new Error('useMentor must be used within a MentorProvider');
    }
    return context;
};

export const MentorProvider = ({ children }) => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const { showSuccess, showError } = useToast();

    async function getAllNonApprovedMentors(userId) {

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/mentors/approval/${userId}`, {
                method: "GET",
                credentials: "include",
            })

            if (response.status != 200) {
                showError("Error fetching non approved mentors", 3000)
                return
            }

            const data = await response.json()

            showSuccess("Found all non approved mentors", 4000)

            return data


        } catch (e) {
            console.log("error fetching non approved mentors", e)
        }
    }





    return <MentorContext.Provider value={{ getAllNonApprovedMentors }}>
        {children}

    </MentorContext.Provider>

}