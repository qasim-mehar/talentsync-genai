import { Provider } from "@base-ui/react/direction-provider/index.parts";
import { createContext, useState , } from "react";

export const authContext=createContext();

export const authProvider =({children})=>{
    const [isLoading, setIsLoading]=useState(flase);
    const [userData,setUserData]= useState(null);
    return <authContext.Provider value={{isLoading, setIsLoading, userData, setUserData}}>
        {children}
    </authContext.Provider>
}