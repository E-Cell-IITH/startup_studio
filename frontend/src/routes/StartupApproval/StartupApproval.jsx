import React, { useEffect, useState } from 'react';
import {
  Globe,
  Phone,
  Search,
  ExternalLink,
  X,
  Clock,
  Building2,
  CheckCircle,
  Target,
  Lightbulb,
  TrendingUp,
  Users,
  Zap,
  Award,
  Code,
  Eye,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useUser } from '../../Context/userContext';
import { useStartUp } from '../../Context/startupContext';

const StartupApproval = () => {
  const { user } = useUser();
  const { getAllNonApprovedStartups, approveStartup, rejectStartup } = useStartUp();
  const [startups, setStartups] = useState([]);
  const [filteredStartups, setFilteredStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch startups
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        const data = await getAllNonApprovedStartups(user.user_id);

        if (!data || data.length === 0) {
          setStartups([]);
          setFilteredStartups([]);
          return;
        }

        setStartups(data);
        setFilteredStartups(data);
      } catch (error) {
        console.error('Error fetching startups:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_id) fetchStartups();
  }, [user]);

  // Search
  useEffect(() => {
    const filtered = startups.filter(
      (s) =>
        s.startup_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.website && s.website.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredStartups(filtered);
  }, [searchTerm, startups]);

  const openModal = (startup) => {
    setSelectedStartup(startup);
    setCurrentStep(1);
  };
  
  const closeModal = () => {
    setSelectedStartup(null);
    setCurrentStep(1);
  };

  const handleApprove = async (startupId) => {
    const res = await approveStartup(user.user_id, startupId);
    if (!res) return;
    setStartups(startups.filter((s) => s.user_id !== startupId));
    setFilteredStartups(filteredStartups.filter((s) => s.user_id !== startupId));
    closeModal();
  };

  const handleReject = async (startupId) => {
    await rejectStartup(user.user_id, startupId);
    setStartups(startups.filter((s) => s.user_id !== startupId));
    setFilteredStartups(filteredStartups.filter((s) => s.user_id !== startupId));
    closeModal();
  };

  const StartupCardSkeleton = () => (
    <div className="bg-white border border-gray-200 shadow-sm overflow-hidden animate-pulse rounded-xl">
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 w-3/4"></div>
        <div className="h-4 bg-gray-200 w-1/2"></div>
        <div className="h-4 bg-gray-200 w-full"></div>
        <div className="h-10 bg-gray-200 w-full rounded-xl"></div>
      </div>
    </div>
  );

  const StartupsLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {[...Array(6)].map((_, i) => (
        <StartupCardSkeleton key={i} />
      ))}
    </div>
  );

  const StartupCard = ({ startup }) => (
    <div className="group rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
              {startup.startup_name}
            </h3>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <Clock size={14} className="mr-1.5" />
              <span>Pending Approval</span>
            </div>
          </div>
          <Building2 className="text-blue-500 flex-shrink-0" size={24} />
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {startup.about || 'No description provided.'}
          </p>
        </div>

        <button
          onClick={() => openModal(startup)}
          className="cursor-pointer w-full bg-blue-600 rounded-xl hover:bg-blue-700 text-white py-2.5 px-4 font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
        >
          <span>Review Application</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );

  const InfoSection = ({ icon: Icon, label, value, helpText }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-semibold text-gray-700">
        {Icon && <Icon className="w-4 h-4 mr-2 text-blue-600" />}
        {label}
      </label>
      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 min-h-[48px]">
        {value || <span className="text-gray-400">Not provided</span>}
      </div>
      {helpText && <p className="text-xs text-gray-500 ml-1">{helpText}</p>}
    </div>
  );

  const steps = [
    { id: 1, title: 'Basic Info' },
    { id: 2, title: 'Problem & Solution' },
    { id: 3, title: 'Market & Customers' },
    { id: 4, title: 'Competition & Edge' },
    { id: 5, title: 'Tech & Vision' }
  ];

  const renderStepContent = (startup) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <InfoSection
              icon={Building2}
              label="Startup Name"
              value={startup.startup_name}
            />
            <InfoSection
              label="About"
              value={startup.about}
            />
            <InfoSection
              icon={Phone}
              label="Contact Number"
              value={startup.phone}
            />
            <InfoSection
              icon={Globe}
              label="Website"
              value={startup.website}
            />
            <InfoSection
              icon={GraduationCap}
              label="Campus Startup"
              value={startup.campus_startup === 'yes' ? 'Yes' : 'No'}
              helpText="Campus startups are founded by students or recent graduates"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <InfoSection
              icon={Target}
              label="Problem Statement"
              value={startup.problem_statement}
              helpText="The pain point and who faces it"
            />
            <InfoSection
              icon={Lightbulb}
              label="Solution"
              value={startup.solution}
              helpText="How the solution addresses the problem"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <InfoSection
              icon={TrendingUp}
              label="Market Understanding"
              value={startup.market_understanding}
              helpText="Market size, growth trends, and timing"
            />
            <InfoSection
              icon={Users}
              label="Customer Understanding"
              value={startup.customer_understanding}
              helpText="Target audience and acquisition strategy"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <InfoSection
              icon={Zap}
              label="Competitive Landscape"
              value={startup.competitive_understanding}
              helpText="Direct competitors and alternative solutions"
            />
            <InfoSection
              icon={Award}
              label="Unique Selling Proposition"
              value={startup.usp}
              helpText="Competitive advantage and defensibility"
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-5">
            <InfoSection
              icon={Code}
              label="Technical Approach"
              value={startup.tech_understanding}
              helpText="Key technologies and development approach"
            />
            <InfoSection
              icon={Eye}
              label="Vision"
              value={startup.vision}
              helpText="Long-term goals and impact"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const StartupModal = ({ startup, onClose }) => {
    const totalSteps = steps.length;
    const progressPercentage = (currentStep / totalSteps) * 100;

    const nextStep = () => {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    };

    const prevStep = () => {
      if (currentStep > 1) {
        setCurrentStep(prev => prev - 1);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white max-w-4xl rounded-xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{startup.startup_name}</h2>
              <p className="text-gray-600 text-sm mt-1">Review application details before approval</p>
              
              {/* Progress indicator */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">
                    Step {currentStep} of {totalSteps}: {steps[currentStep - 1]?.title}
                  </span>
                  <div className="flex items-center text-blue-600">
                    <Clock size={14} className="mr-1.5" />
                    <span className="font-semibold text-xs">Pending</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 w-10 h-10 cursor-pointer rounded-full bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center flex-shrink-0"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderStepContent(startup)}
          </div>

          {/* Footer - Navigation & Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex gap-3">
              {/* Previous Button */}
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2.5 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>
              )}

              {/* Next or Action Buttons */}
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next Step</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleReject(startup.user_id)}
                    className="flex-1 cursor-pointer rounded-xl bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 font-semibold transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <X size={18} />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(startup.user_id)}
                    className="flex-1 cursor-pointer rounded-xl bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 font-semibold transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <CheckCircle size={18} />
                    <span>Approve</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Startup Approval Dashboard</h1>

        <div className="max-w-4xl mb-8">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search startups by name or website..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl pl-12 pr-4 py-3 text-base border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors shadow-sm disabled:bg-gray-100"
            />
          </div>
        </div>

        {loading ? (
          <StartupsLoading />
        ) : filteredStartups && filteredStartups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <StartupCard key={startup.user_id} startup={startup} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 shadow-sm p-12 text-center rounded-xl">
            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-6 rounded-full">
              <CheckCircle className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {startups.length === 0
                ? 'All Startups Reviewed'
                : searchTerm
                  ? 'No results found'
                  : 'No applications available'}
            </h3>
            <p className="text-gray-600 text-base max-w-md mx-auto">
              {startups.length === 0
                ? 'Great job! There are no pending startup applications at the moment.'
                : searchTerm
                  ? 'Try changing your search terms to find startups.'
                  : 'Check back later for new startup applications.'}
            </p>
          </div>
        )}
      </div>

      {selectedStartup && (
        <StartupModal startup={selectedStartup} onClose={closeModal} />
      )}
    </div>
  );
};

export default StartupApproval;