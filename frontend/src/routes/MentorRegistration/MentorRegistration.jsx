import React, { useState } from 'react';
import { useUser } from '../../Context/userContext';

const MentorRegistration = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    mentor_name: '',
    industry: '',
    profile_photo_ref: null,
    phone_number: '',
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
    // Handle form submission logic here
    console.log('Mentor registration data:', formData);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex">
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
          {/* Decorative */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-16 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
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
                  Name *
                </label>
                <input
                  type="text"
                  name="mentor_name"
                  value={formData.mentor_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Describe your experience"
                    />
                    {formData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'experience')}
                        className="cursor-pointer px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('experience')}
                  className="cursor-pointer text-blue-600 text-sm hover:text-blue-700"
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your area of expertise"
                    />
                    {formData.expertise.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'expertise')}
                        className="cursor-pointer px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('expertise')}
                  className="cursor-pointer text-blue-600 text-sm hover:text-blue-700"
                >
                  + Add another expertise
                </button>
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
          <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-white p-6 pb-8 flex-1 overflow-y-auto">
          <div className="max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Mentor Registration</h2>
            <p className="text-gray-600 text-sm mb-6">Complete your profile</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="mentor_name"
                  value={formData.mentor_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Your industry"
                />
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="blockProfile Photo text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={exp}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'experience')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Your experience"
                    />
                    {formData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'experience')}
                        className="px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('experience')}
                  className="text-blue-600 text-sm"
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
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Your expertise"
                    />
                    {formData.expertise.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'expertise')}
                        className=" px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('expertise')}
                  className="cursor-pointer text-blue-600 text-sm"
                >
                  + Add expertise
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg mt-6"
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

export default MentorRegistration;