import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../../Context/userContext';
import { useNavigate } from 'react-router-dom';


const LoginScreen = () => {


  const { login, getStartUpOrMentorId } = useUser();



  const navigate = useNavigate()

  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;

    const data = await login(idToken)



    if (data.is_registered) {
      const idData = await getStartUpOrMentorId(data.user_id)
      if (idData.startup_id) {
        navigate("/mentors")
      }
      else if (idData.mentor_id) {
        navigate("/startups")
      }
    }

    else {
      navigate("/role")
    }


  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex">
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
          {/* Decorative */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-16 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

        {/* Right Section */}
        <div className="w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-sm text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-graye-600 mb-8">Continue your startup journey</p>

            {/* Google Login Button */}
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
          <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-white p-6 pb-8">
          <div className="max-w-sm mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
            <p className="text-gray-600 text-sm mb-6">Continue your startup journey</p>

            {/* Google Login Button for mobile */}
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log('Login Failed')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
