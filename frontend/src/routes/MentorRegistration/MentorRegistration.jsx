import React, { useState } from 'react';
import { useUser } from '../../Context/userContext';
import { useNavigate } from "react-router-dom"

const MentorRegistration = () => {
  const { user, mentorRegistration } = useUser();
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [formData, setFormData] = useState({
    profile_photo_ref: null,
    linked_in_url: '',
    phone_number: '',
    about: '',
    experience: [''],
    expertise: ['']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index, field) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
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

    if (!user || !user.user_id) {
      alert("User is not logged in.");
      return;
    }

    const file = formData.profile_photo_ref;
    if (!file) {
      alert("Please upload a profile photo");
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Creating your mentor profile...');

    try {
      const data = await mentorRegistration(formData, user.user_id, file)

      if (data) {
        setLoadingMessage('Registration successful! Redirecting...');
        setTimeout(() => navigate("/startups"), 1000);
      }

    } catch (err) {
      console.error("Registration error:", err);
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

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
            <div className="text-sm text-gray-500">Setting up your mentor profile...</div>
          </div>
        </div>
      )}

      {/* Large/Medium devices */}
      <div className="hidden md:flex w-full">
        {/* Left Section */}
        <div className="w-1/2 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-8 relative">
          <div className="text-center max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Become a
              <span className="block bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Mentor
              </span>
            </h1>
            <p className="text-blue-50 text-lg lg:text-xl leading-relaxed">
              Share your expertise and guide the next generation of entrepreneurs
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
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Mentor Registration</h2>
            <p className="text-gray-600 mb-8">Complete your mentor profile</p>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  name="linked_in_url"
                  value={formData.linked_in_url}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter linkedin url"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About
                </label>
                <textarea
                  type="textarea"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="About you"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
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
                  Upload your profile photo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={exp}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'experience')}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Describe your experience"
                    />
                    {formData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'experience')}
                        disabled={isLoading}
                        className={`px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('experience')}
                  disabled={isLoading}
                  className={`text-blue-600 text-sm hover:text-blue-700 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  + Add another experience
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expertise
                </label>
                {formData.expertise.map((exp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={exp}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'expertise')}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Your area of expertise"
                    />
                    {formData.expertise.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'expertise')}
                        disabled={isLoading}
                        className={`px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('expertise')}
                  disabled={isLoading}
                  className={`text-blue-600 text-sm hover:text-blue-700 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  + Add another expertise
                </button>
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
        <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-6 relative">
          <div className="text-center max-w-sm mx-auto">
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              Become a
              <span className="block bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Mentor
              </span>
            </h1>
            <p className="text-blue-50 text-base leading-relaxed">
              Share your expertise and guide entrepreneurs
            </p>
          </div>
          {/* Decorative with animation */}
          <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-4 left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="bg-white p-6 pb-8 flex-1 overflow-y-auto">
          <div className="max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Mentor Registration</h2>
            <p className="text-gray-600 text-sm mb-6">Complete your profile</p>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  name="linked_in_url"
                  value={formData.linked_in_url}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter linkedin url"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About
                </label>
                <textarea
                  type="textarea"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="About you"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 ${isLoading ? 'bg-gray-100 cursor-not-allowed file:bg-gray-100 file:text-gray-500' : ''}`}
                />
                {formData.profile_photo_ref && (
                  <div className="mt-1 text-xs text-gray-600 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Selected: {formData.profile_photo_ref.name}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Upload your profile photo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={exp}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'experience')}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Your experience"
                    />
                    {formData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'experience')}
                        disabled={isLoading}
                        className={`px-2 py-2 text-red-600 hover:bg-red-50 rounded ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('experience')}
                  disabled={isLoading}
                  className={`text-blue-600 text-sm ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  + Add experience
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
                {formData.expertise.map((exp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={exp}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'expertise')}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Your expertise"
                    />
                    {formData.expertise.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'expertise')}
                        disabled={isLoading}
                        className={`px-2 py-2 text-red-600 hover:bg-red-50 rounded ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('expertise')}
                  disabled={isLoading}
                  className={`text-blue-600 text-sm ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  + Add expertise
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg mt-6 ${isLoading
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

export default MentorRegistration;