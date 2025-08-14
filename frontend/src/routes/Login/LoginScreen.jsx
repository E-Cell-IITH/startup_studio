import React from 'react';

const LoginScreen = () => {
  const handleGoogleSignIn = () => {
    // Handle Google sign in logic here
    console.log('Sign in with Google clicked');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Large/Medium devices - Split layout */}
      <div className="hidden md:flex w-full">
        {/* Left half - Welcome section */}
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
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-16 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Border/Divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

        {/* Right half - Sign in section */}
        <div className="w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Continue your startup journey</p>
            </div>
            
            <button
              onClick={handleGoogleSignIn}
              className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              {/* Google Icon */}
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-base">Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>

      {/* Small devices - Vertical layout */}
      <div className="md:hidden w-full flex flex-col">
        {/* Top section - Welcome */}
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
          {/* Decorative elements */}
          <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Bottom section - Sign in */}
        <div className="bg-white p-6 pb-8">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
              <p className="text-gray-600 text-sm">Continue your startup journey</p>
            </div>
            
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group active:scale-95"
            >
              {/* Google Icon */}
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-base">Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;