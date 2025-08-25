import React, { useEffect, useState } from 'react';
import { useUser } from '../../Context/userContext';
import { useNavigate } from 'react-router-dom';


const StartupRegistration = () => {


  const { user, startupRegistration } = useUser()

  const navigate = useNavigate()


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

    const data = await startupRegistration(formData, user.user_id, file)

    



  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Large/Medium devices */}
      <div className="hidden md:flex w-full">
        {/* Left Section */}
        <div className=" w-1/2 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-8 relative">
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
          {/* Decorative */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-16 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                    className="cursor-pointer w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {formData.profile_photo_ref && (
                    <div className="mt-2 text-sm text-gray-600">
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
                className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Complete Registration
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
          <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700"
                />
                {formData.profile_photo_ref && (
                  <div className="mt-1 text-xs text-gray-600">
                    Selected: {formData.profile_photo_ref.name}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Upload your startup logo or representative image
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Complete Registration
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupRegistration;