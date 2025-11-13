/* eslint-disable react-refresh/only-export-components */
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

    async function getAllNonApprovedStartups(userId) {

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/startups/approval/${userId}`, {
                method: "GET",
                credentials: "include",
            })

            if (response.status != 200) {
                showError("Error fetching non approved startups", 3000)
                return
            }

            const data = await response.json()
            // console.log(data)

            showSuccess("Found all non approved startups", 4000)

            return data


        } catch (e) {
            console.log("error fetching non approved startups", e)
        }
    }

    async function approveStartup(adminUserId, startupUserId) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/startup/approve/${adminUserId}/${startupUserId}`, {
                method: "PATCH",
                credentials: "include"
            })


            if (response.status != 200) {
                showError("Startup Approval Failed")
                return false;
            }

            showSuccess("Starup Approved")
            return true;

        } catch (e) {
            console.error(e)
            showError("Startup Approval Failed")
            return false;
        }
    }

    async function rejectStartup(adminUserId, startupUserId) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/startup/reject/${adminUserId}/${startupUserId}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.status != 200) {
                showError("Startup rejection failed")
                return false;
            }


            showSuccess("Startup Rejected")
            return true;

        } catch (e) {
            console.error(e)
            showError("Startup Rejection Failed")
            return false;
        }



    }



    return <StartupContext.Provider value={{ getAllStartups, getAllNonApprovedStartups, approveStartup, rejectStartup }}>
        {children}
    </StartupContext.Provider>

}