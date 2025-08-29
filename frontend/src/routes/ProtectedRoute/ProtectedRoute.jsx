import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../../Context/userContext';

const ProtectedRoute = ({ children }) => {
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(true);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
                    method: "GET",
                    credentials: "include",
                });

                if (res.status === 200) {
                    const data = await res.json();

                    console.log(data)
                    setUser({
                        user_id: data?.user?.user_id,
                        full_name: data?.user?.username,
                        email: data?.user?.email,
                        startup_detail: data?.startup_detail,
                        mentor_detail: data?.mentor_detail,
                        is_admin: data?.user?.is_admin
                    });




                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [setUser, BACKEND_URL]);

    const PulsingDots = () => (
        <div className="flex space-x-1 justify-center items-center">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
    );

    if (loading) {
        return (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center border border-blue-100">
                    <div className="mb-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">"Loading Your Details"</h3>
                        <PulsingDots />
                    </div>
                    <div className="text-sm text-gray-500">Please wait a moment...</div>
                </div>
            </div>
        );
    }

    if (!user?.user_id) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
