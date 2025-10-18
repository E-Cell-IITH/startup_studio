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
        setLoading(true)
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 200) {
          const data = await res.json();
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
        setLoading(false)
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, BACKEND_URL]);

  const PulsingDots = () => (
    <div className="flex space-x-2 justify-center items-center">
      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
      <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-spin mx-auto" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center border border-gray-200 backdrop-blur-sm">
          <LoadingSpinner />
          <div className="mb-6">
            {/* <h3 className="text-xl font-semibold text-gray-800 mb-3">Loading Your Dashboard</h3> */}
            <p className="text-gray-600 mb-4">Authenticating and preparing your data</p>
            <PulsingDots />
          </div>
          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            This may take a few moments...
          </div>
        </div>
      </div>
    );
  }

  if (!user?.user_id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;