import React from 'react';

const FilterRoleScreen = () => {
  const handleStartupClick = () => {
    console.log('Selected: Startup');
    // Add your navigation/logic here
  };

  const handleMentorClick = () => {
    console.log('Selected: Mentor');
    // Add your navigation/logic here
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Large/Medium devices */}
      <div className="hidden md:flex w-full">
        {/* Left Section */}
        <div className="w-1/2 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-8 relative">
          <div className="text-center max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Join Our
              <span className="block bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-blue-50 text-lg lg:text-xl leading-relaxed">
              Connect startups with experienced mentors to accelerate growth
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Role</h2>
            <p className="text-gray-600 mb-8">How would you like to participate?</p>
            
            {/* Role Selection Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleStartupClick}
                className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Are you a Startup?
              </button>
              
              <button
                onClick={handleMentorClick}
                className="cursor-pointer w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Are you a Mentor?
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile layout */}
      <div className="md:hidden w-full flex flex-col">
        <div className="flex-1 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-6 relative">
          <div className="text-center max-w-sm">
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              Join Our
              <span className="block bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-blue-50 text-base leading-relaxed">
              Connect startups with experienced mentors to accelerate growth
            </p>
          </div>
          <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="bg-white p-6 pb-8">
          <div className="max-w-sm mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose Your Role</h2>
            <p className="text-gray-600 text-sm mb-6">How would you like to participate?</p>
            
            {/* Role Selection Buttons for mobile */}
            <div className="space-y-3">
              <button
                onClick={handleStartupClick}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg"
              >
                Are you a Startup?
              </button>
              
              <button
                onClick={handleMentorClick}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg"
              >
                Are you a Mentor?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterRoleScreen;