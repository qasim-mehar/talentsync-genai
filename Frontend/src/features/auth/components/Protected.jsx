import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Protected({ children }) {
    const { userData, isLoading } = useAuth();

    // While checking the session, show a loading state instead of redirecting
    if (isLoading) {
        return (
            <div
                className="flex items-center justify-center h-screen w-full"
                style={{ backgroundColor: "#0a0a0a" }}
            >
                <div
                    className="animate-spin rounded-full h-10 w-10 border-b-2"
                    style={{ borderColor: "#27272a" }}
                />
            </div>
        );
    }

    if (!userData) {
       return <Navigate to="/login" />;
    }
    
    return children;
}

export default Protected;