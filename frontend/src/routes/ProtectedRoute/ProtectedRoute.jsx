import { Navigate } from 'react-router-dom';
import { useUser } from '../../Context/userContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useUser();

    if (!user?.user_id) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
