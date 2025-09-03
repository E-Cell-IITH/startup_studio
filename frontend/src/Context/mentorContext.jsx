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

    async function approveMentor(adminUserId, mentorUserId) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/mentor/approve/${adminUserId}/${mentorUserId}`, {
                method: "PATCH",
                credentials: "include"
            })


            if (response.status != 200) {
                showError("Mentor Approval Failed")
                return false;
            }

            showSuccess("Mentor Approved")
            return true;

        } catch (e) {
            console.error(e)
            showError("Mentor Approval Failed")
            return false;
        }
    }

    async function rejectMentor(adminUserId, mentorUserId) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/mentor/reject/${adminUserId}/${mentorUserId}`, {
                method : "DELETE",
                credentials : "include"
            })

            if (response.status != 200) {
                showError("Mentor rejection failed")
                return false;
            }


            showSuccess("Mentor Rejected")
            return true;

        } catch (e) {
            console.error(e)
            showError("Mentor Rejection Failed")
            return false;
        }



    }

    async function getAllMentors(){
        try{    
            const response = await fetch(`${BACKEND_URL}/api/mentors/`, {
                credentials : "include"
            })

            if(response.status != 200){
                showError("Fetching Mentors Failed")
                return 
            }

            const data = await response.json()

            // console.log(data)

            showSuccess("Fetched all mentors")

            return data


        }catch(e){
            console.error(e)
            showError("Error fetching All Mentors")
            return
        }
    }



    return <MentorContext.Provider value={{ getAllNonApprovedMentors, approveMentor, rejectMentor, getAllMentors }}>
        {children}

    </MentorContext.Provider>

}