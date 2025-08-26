import React, { useEffect, useState } from 'react';
import { useUser } from '../../Context/userContext';
import { useNavigate } from 'react-router-dom';

const StartupRegistration = () => {
  const { user, startupRegistration } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [formData, setFormData] = useState({
    startup_name: '',
    industry: '',
    website: '',
    phone: '',
    profile_photo_ref: null
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        user_id: user.user_id,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      profile_photo_ref: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = formData.profile_photo_ref;
    if (!file) {
      alert("Please upload a profile photo");
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Uploading your startup profile...');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload time
      setLoadingMessage('Processing your information...');

      const data = await startupRegistration(formData, user.user_id, file);

      if (data) {
        setLoadingMessage('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error('Registration error:', error);
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

  // Progress bar component
  const ProgressBar = () => (
    <div className="w-full bg-blue-100 rounded-full h-2 mb-4">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
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
              <ProgressBar />
              <PulsingDots />
            </div>
            <div className="text-sm text-gray-500">Setting up your startup profile...</div>
          </div>
        </div>
      )}

      {/* Large/Medium devices */}
      <div className="hidden md:flex w-full">
        {/* Left Section */}
        <div className="w-1/2 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-8 relative">
          <div className="text-center max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Launch Your
              <span className="block bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Startup Journey
              </span>
            </h1>
            <p className="text-blue-50 text-lg lg:text-xl leading-relaxed">
              Connect with mentors and accelerate your startup's growth
            </p>
          </div>
          {/* Decorative with animation */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-16 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

        {/* Right Section */}
        <div className="overflow-y-auto w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Startup Registration</h2>
            <p className="text-gray-600 mb-8">Tell us about your startup</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Name *
                </label>
                <input
                  type="text"
                  name="startup_name"
                  value={formData.startup_name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter your startup name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  required
                  value={formData.industry}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="e.g., Technology, Healthcare, E-commerce"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter your contact number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  required
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="https://your-startup.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Logo / Profile Photo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    required
                    disabled={isLoading}
                    className={`cursor-pointer w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${isLoading ? 'bg-gray-100 cursor-not-allowed file:bg-gray-100 file:text-gray-500' : ''}`}
                  />
                  {formData.profile_photo_ref && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Selected: {formData.profile_photo_ref.name}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload your startup logo or a representative image
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 cursor-pointer'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden w-full flex flex-col">
        <div className="flex-1 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-6 relative">
          <div className="text-center max-w-sm">
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              Launch Your
              <span className="block bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Startup Journey
              </span>
            </h1>
            <p className="text-blue-50 text-base leading-relaxed">
              Connect with mentors and accelerate growth
            </p>
          </div>
          {/* Decorative with animation */}
          <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="bg-white p-6 pb-8">
          <div className="max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Startup Registration</h2>
            <p className="text-gray-600 text-sm mb-6">Tell us about your startup</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Startup Name *
                </label>
                <input
                  type="text"
                  name="startup_name"
                  value={formData.startup_name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter your startup name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Your industry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter Contact Number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  required
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="https://your-startup.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Startup Logo / Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 ${isLoading ? 'bg-gray-100 cursor-not-allowed file:bg-gray-100 file:text-gray-500' : ''}`}
                />
                {formData.profile_photo_ref && (
                  <div className="mt-1 text-xs text-gray-600 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Selected: {formData.profile_photo_ref.name}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Upload your startup logo or representative image
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupRegistration;