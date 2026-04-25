import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    // CRITICAL: Initialize isLoading as TRUE so the app waits on reload
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await getMe();
                if (data && data.user) {
                    setUserData(data.user);
                }
            } catch (error) {
                console.error("Session check failed:", error);
                setUserData(null);
            } finally {
                // Only set to false after we definitely know if they are logged in or not
                setIsLoading(false); 
            }
        };

        fetchSession();
    }, []); // This now only runs ONCE when the app starts

    return (
        <authContext.Provider value={{ userData, setUserData, isLoading, setIsLoading }}>
            {children}
        </authContext.Provider>
    );
};