import { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  Phone,
  Target,
  Lightbulb,
  TrendingUp,
  Users,
  Zap,
  Award,
  Code,
  Eye,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useUser } from "../../Context/userContext";
import { useNavigate } from "react-router-dom";

const FormField = ({
  icon: Icon,
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  rows = 4,
  helpText,
  formData,
  handleInputChange,
  isLoading,
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-semibold text-gray-700">
        {Icon ? <Icon className="w-4 h-4 mr-2 text-blue-600" /> : <p></p>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={formData[name] || ""}
          onChange={handleInputChange}
          required={required}
          rows={rows}
          disabled={isLoading}
          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
            isLoading ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          placeholder={placeholder}
        />
      ) : type === "select" ? (
        <select
          name={name}
          value={formData[name] || "no"}
          onChange={handleInputChange}
          required={required}
          disabled={isLoading}
          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            isLoading ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name] || ""}
          onChange={handleInputChange}
          required={required}
          disabled={isLoading}
          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            isLoading ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          placeholder={placeholder}
        />
      )}
      {helpText && <p className="text-xs text-gray-500 ml-1">{helpText}</p>}
    </div>
  );
};

const StartupRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { startupRegistration } = useUser();
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    about: "",
    startup_name: "",
    website: "",
    phone: "",
    problem_statement: "",
    solution: "",
    market_understanding: "",
    customer_understanding: "",
    competitive_understanding: "",
    usp: "",
    tech_understanding: "",
    vision: "",
    campus_startup: "no",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMessage("Uploading your startup profile...");
    if (!user || !user.user_id) {
      console.error("User is not logegd in");
      alert("Please log in to register your startup");
      return;
    }
    try {
      const result = await startupRegistration(formData, user.user_id);
      if (result != null) {
        setLoadingMessage("Registration successful! Redirecting...");
        setTimeout(() => navigate("/mentors"), 1000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const PulsingDots = () => (
    <div className="flex space-x-1 justify-center items-center">
      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
      <div
        className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  );

  const ProgressBar = () => (
    <div className="w-full bg-blue-100 rounded-full h-2 mb-4">
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse"
        style={{ width: "70%" }}
      ></div>
    </div>
  );

  const steps = [
    {
      id: 1,
      title: "Basic Info",
      fields: [
        "startup_name",
        "phone",
        "website",
        "linkedin_profile_url",
        "campus_startup",
        "about",
      ],
    },
    {
      id: 2,
      title: "Problem & Solution",
      fields: ["problem_statement", "solution"],
    },
    {
      id: 3,
      title: "Market & Customers",
      fields: ["market_understanding", "customer_understanding"],
    },
    {
      id: 4,
      title: "Competition & Edge",
      fields: ["competitive_understanding", "usp"],
    },
    { id: 5, title: "Tech & Vision", fields: ["tech_understanding", "vision"] },
  ];

  const totalSteps = steps.length;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const isStepValid = (stepId) => {
    const step = steps.find((s) => s.id === stepId);
    return step.fields.every((field) => formData[field]?.trim() !== "");
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5" key="step-1">
            <FormField
              key="startup_name"
              icon={Building2}
              label="Startup Name"
              name="startup_name"
              placeholder="Enter your startup name"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
            <FormField
              key="about"
              // icon={Building2}
              label="About"
              name="about"
              placeholder="About your startup"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
            <FormField
              key="phone"
              icon={Phone}
              label="Contact Number"
              name="phone"
              type="tel"
              placeholder="XXXXX XXXXX"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
            <FormField
              key="website"
              icon={Globe}
              label="Website"
              name="website"
              type="url"
              placeholder="https://your-startup.com"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
            <FormField
              key="linkedin_profile_url"
              // icon={Building2}
              label="LinkedIn URL"
              name="linkedin_profile_url"
              placeholder="Enter your startup name"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
            <FormField
              key="campus_startup"
              icon={GraduationCap}
              label="Are you a campus startup?"
              name="campus_startup"
              type="select"
              helpText="Campus startups are founded by students or recent graduates"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-5" key="step-2">
            <FormField
              key="problem_statement"
              icon={Target}
              label="Problem Statement"
              name="problem_statement"
              type="textarea"
              placeholder="What problem are you solving, and who experiences it most directly?"
              helpText="Describe the pain point and who faces it"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
            <FormField
              key="solution"
              icon={Lightbulb}
              label="Your Solution"
              name="solution"
              type="textarea"
              placeholder="What exactly are you building, in the simplest terms?"
              helpText="Explain how your solution addresses the problem"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-5" key="step-3">
            <FormField
              key="market_understanding"
              icon={TrendingUp}
              label="Market Understanding"
              name="market_understanding"
              type="textarea"
              placeholder="How big is the opportunity, and what makes this the right time?"
              helpText="Market size, growth trends, and timing"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
            <FormField
              key="customer_understanding"
              icon={Users}
              label="Customer Understanding"
              name="customer_understanding"
              type="textarea"
              placeholder="Who will be your first customers, and how will you reach them?"
              helpText="Target audience and acquisition strategy"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-5" key="step-4">
            <FormField
              key="competitive_understanding"
              icon={Zap}
              label="Competitive Landscape"
              name="competitive_understanding"
              type="textarea"
              placeholder="Who else is solving this problem, and how are they doing it?"
              helpText="Include direct competitors and alternative solutions"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
            <FormField
              key="usp"
              icon={Award}
              label="Your Unique Selling Proposition"
              name="usp"
              type="textarea"
              placeholder="What makes your approach distinct or hard to copy?"
              helpText="Your competitive advantage and defensibility"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-5" key="step-5">
            <FormField
              key="tech_understanding"
              icon={Code}
              label="Technical Approach"
              name="tech_understanding"
              type="textarea"
              placeholder="What components, infrastructure, or steps go into building your product?"
              helpText="Key technologies and development approach"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
            <FormField
              key="vision"
              icon={Eye}
              label="Your Vision"
              name="vision"
              type="textarea"
              placeholder="What's your vision for building this startup?"
              helpText="Long-term goals and impact you want to create"
              formData={formData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center border border-blue-100">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {loadingMessage}
              </h3>
              <ProgressBar />
              <PulsingDots />
            </div>
            <div className="text-sm text-gray-500">
              Setting up your startup profile...
            </div>
          </div>
        </div>
      )}

      {/* Large/Medium devices */}
      <div className="hidden md:flex w-full">
        {/* Left Section */}
        <div className="w-2/5 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="text-center max-w-md z-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Launch Your
              <span className="block bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Startup Journey
              </span>
            </h1>
            <p className="text-blue-50 text-lg lg:text-xl leading-relaxed mb-8">
              Connect with mentors and accelerate your startup's growth
            </p>

            {/* Progress Indicator */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-8">
              <div className="text-white/90 text-sm font-medium mb-3">
                Step {currentStep} of {totalSteps}
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-white/80 text-sm">
                {steps[currentStep - 1]?.title}
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-16 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Right Section */}
        <div className="overflow-y-auto w-3/5 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Startup Registration
              </h2>
              <p className="text-gray-600">
                Tell us about your startup journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}

              <div className="flex gap-4 pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isLoading}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading || !isStepValid(currentStep)}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                      isLoading || !isStepValid(currentStep)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 cursor-pointer"
                    }`}
                  >
                    <span>Next Step</span>
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !isStepValid(currentStep)}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                      isLoading || !isStepValid(currentStep)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-105 cursor-pointer"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden w-full flex flex-col">
        <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-6 relative">
          <div className="text-center max-w-sm mx-auto">
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              Launch Your
              <span className="block bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Startup Journey
              </span>
            </h1>
            <p className="text-blue-50 text-base leading-relaxed mb-4">
              Connect with mentors and accelerate growth
            </p>

            {/* Mobile Progress */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-white/90 text-sm font-medium mb-2">
                Step {currentStep} of {totalSteps}:{" "}
                {steps[currentStep - 1]?.title}
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute bottom-4 left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="bg-white p-6 pb-8 flex-1 overflow-y-auto">
          <div className="max-w-sm mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              {renderStepContent()}

              {/* Mobile Navigation */}
              <div className="flex gap-3 pt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isLoading}
                    className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Back
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading || !isStepValid(currentStep)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      isLoading || !isStepValid(currentStep)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 cursor-pointer"
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !isStepValid(currentStep)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      isLoading || !isStepValid(currentStep)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 cursor-pointer"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Complete"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupRegistration;
