import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../../Context/userContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginScreen = () => {
  const { login, getStartUpOrMentorId } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setLoadingMessage('Signing you in...');

    try {
      const idToken = credentialResponse.credential;
      const data = await login(idToken);

      if (data.is_registered) {
        setLoadingMessage('Getting your profile...');
        const idData = await getStartUpOrMentorId(data.user_id);

        if (idData.startup_id) {
          setLoadingMessage('Redirecting to mentors...');
          setTimeout(() => navigate("/mentors"), 500);
        } else if (idData.mentor_id) {
          setLoadingMessage('Redirecting to startups...');
          setTimeout(() => navigate("/startups"), 500);
        }
      } else {
        setLoadingMessage('Setting up your account...');
        setTimeout(() => navigate("/role"), 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
      <span className="text-blue-600 font-medium">{loadingMessage}</span>
    </div>
  );

  // Pulsing dots animation
  const PulsingDots = () => (
    <div className="flex space-x-1 justify-center items-center">
      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center border border-blue-100">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{loadingMessage}</h3>
              <PulsingDots />
            </div>
            <div className="text-sm text-gray-500">Please wait a moment...</div>
          </div>
        </div>
      )}

      {/* Large/Medium devices */}
      <div className="hidden md:flex w-full">
        {/* Left Section */}
        <div className="w-1/2 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-8 relative">
          <div className="text-center max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Startup Studio
              </span>
            </h1>
            <p className="text-blue-50 text-lg lg:text-xl leading-relaxed">
              Find mentors in the areas your startup lacks
            </p>
          </div>
          {/* Decorative - now with subtle animation */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-16 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

        {/* Right Section */}
        <div className="w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-sm text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600 mb-8">Continue your startup journey</p>

            {/* Google Login Button with loading state */}
            <div className="relative">
              {isLoading ? (
                <div className="bg-gray-100 rounded-full py-3 px-6 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => console.log('Login Failed')}
                  useOneTap
                  auto_select
                  theme="filled_white"
                  shape="circle"
                  size="large"
                  width={500}
                  text="signin_with"
                  logo_alignment="center"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden w-full flex flex-col">
        <div className="flex-1 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-6 relative">
          <div className="text-center max-w-sm">
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Startup Studio
              </span>
            </h1>
            <p className="text-blue-50 text-base leading-relaxed">
              Find mentors in the areas your startup lacks
            </p>
          </div>
          {/* Decorative with animation */}
          <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="bg-white p-6 pb-8">
          <div className="max-w-sm mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
            <p className="text-gray-600 text-sm mb-6">Continue your startup journey</p>

            {/* Google Login Button for mobile with loading state */}
            <div className="relative">
              {isLoading ? (
                <div className="bg-gray-100 rounded-md py-3 px-6 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => console.log('Login Failed')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;