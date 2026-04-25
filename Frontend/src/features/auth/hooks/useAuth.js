import { register,login,logout  } from "../services/auth.api";
import { useContext, useEffect } from "react";
import { authContext } from "../auth.context";


export const useAuth=()=>{
    const context = useContext(authContext);
    const {isLoading, setIsLoading, userData, setUserData}=context;

    const handleLogin = async (userData) => {
    setIsLoading(true);

    try {
        const data = await login(userData);
        console.log("Login successful:", data);
        setUserData(data.user);
        
    } catch (err) {
        if (err.response) {
            console.error("Server Error Payload:", err.response.data); 
        } else {
            console.error("Network/Client Error:", err.message);
        }
        console.log("login failed");
        throw err;
        
    } finally {
        setIsLoading(false);
    }
}
    const  handleRegister = async (userData) => {
        setIsLoading(true);

        try {
            const data =await register(userData);
            setUserData(data.user)
            
        } catch (err) {
            console.log(err);
            
        }
        finally{
            setIsLoading(false)
        }
    }

    const handleLogout = async ()=>{
        setIsLoading(true);
        try {
            await logout();
            setUserData(null);
        } catch (err) {
            console.log(err);
        }finally{
            setIsLoading(false)
        }
    }
       
    // useEffect(() => {
    //     const fetchSession = async () => {
    //         try {
    //             const data = await getMe();
    //             if (data && data.user) {
    //                 setUserData(data.user);
    //             }
    //         } catch (error) {
    //             console.error("Session check failed:", error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchSession();
    // }, []);
    
  return {handleLogin, handleRegister, handleLogout, userData, isLoading}
}
