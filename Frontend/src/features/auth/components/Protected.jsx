import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Protected({ children }) {
    const { userData, isLoading } = useAuth();

    // While checking the session, show a loading state instead of redirecting
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!userData) {
       return <Navigate to="/login" />;
    }
    
    return children;
}

export default Protected;