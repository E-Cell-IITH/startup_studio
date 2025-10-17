import React, { useEffect, useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Globe,
    Users,
    X,
    ExternalLink,
    Award,
    Star,
    Briefcase,
    Check,
    Search,
    Loader2
} from 'lucide-react';
import { useMentor } from '../../Context/mentorContext';

const MentorScreen = () => {
    const { getAllMentors } = useMentor();
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMentors, setFilteredMentors] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state




    useEffect(() => {
        const fetchMentors = async () => {
            try {
                setLoading(true); // Set loading to true when starting fetch
                const data = await getAllMentors();

                if (!data) {
                    console.log("error fetching mentors");
                    return;
                }

                // console.log(data);
                setMentors(data.mentors);
                setFilteredMentors(data.mentors);
            } catch (error) {
                console.error("Error fetching mentors:", error);
            } finally {
                setLoading(false); // Set loading to false when fetch completes
            }
        };

        fetchMentors();
    }, []);

    useEffect(() => {
        const filtered = mentors != null && mentors.filter(mentor =>
            mentor.mentor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (mentor.expertise && mentor.expertise.some(skill =>
                skill.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        );
        setFilteredMentors(filtered);
    }, [searchTerm, mentors]);

    const openMentorModal = (mentor) => {
        setSelectedMentor(mentor);
    };

    const closeMentorModal = () => {
        setSelectedMentor(null);
    };

    const handleConnectClick = () => {
        alert("Feature in progress")
    }
    // Loading Skeleton Component
    const MentorCardSkeleton = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="p-8">
                <div className="flex items-start space-x-5 mb-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
                    <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex space-x-2 mb-6">
                    <div className="h-7 bg-gray-200 rounded-full w-20"></div>
                    <div className="h-7 bg-gray-200 rounded-full w-24"></div>
                    <div className="h-7 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        </div>
    );

    // Main Loading Component
    const MentorsLoading = () => (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 text-blue-600">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-lg font-semibold">Loading mentors...</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, index) => (
                    <MentorCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );

    const MentorCard = ({ mentor }) => (
        <div
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
            onClick={() => openMentorModal(mentor)}
        >
            <div className="p-8">
                {/* Profile Header */}
                <div className="flex items-start space-x-5 mb-6">
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                            {mentor.profile_photo_ref ? (
                                <img
                                    src={mentor.profile_photo_ref}
                                    alt={mentor.mentor_name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                                {mentor?.mentor_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || "M"}
                            </div>
                        </div>
                        {mentor.approval_status && (
                            <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <Check size={14} className="text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                            {mentor.mentor_name}
                        </h3>
                        <div className="flex items-center text-blue-600 text-sm font-medium mb-3">
                            <Award size={16} className="mr-2" />
                            <span>Verified Mentor</span>
                        </div>
                    </div>
                </div>

                {/* About Preview */}
                <div className="mb-6">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {mentor.about || 'No description available'}
                    </p>
                </div>

                {/* Expertise Tags */}
                {mentor.expertise && mentor.expertise.length > 0 && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {mentor.expertise.slice(0, 3).map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100"
                                >
                                    {skill}
                                </span>
                            ))}
                            {mentor.expertise.length > 3 && (
                                <span className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
                                    +{mentor.expertise.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {/* {mentor.phone && (
                            <div className="flex items-center space-x-2">
                                <Phone size={14} />
                                <span className="font-medium">Available</span>
                            </div>
                        )} */}
                        {mentor.linked_in_url && (
                            <div className="flex items-center space-x-2">
                                <Globe size={14} />
                                <span className="font-medium">LinkedIn</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                        <span>View Profile</span>
                        <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );

    const MentorModal = ({ mentor, onClose }) => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Mentor Profile</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-8 mb-8">
                        <div className="relative flex-shrink-0">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl">
                                {mentor.profile_photo_ref ? (
                                    <img
                                        src={mentor.profile_photo_ref}
                                        alt={mentor.mentor_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                                    {mentor.mentor_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                            </div>
                            {mentor.approval_status && (
                                <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Check size={18} className="text-white" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-3xl font-bold text-gray-900 mb-3">{mentor.mentor_name}</h3>
                            <div className="flex items-center text-blue-600 mb-4">
                                <Award size={20} className="mr-2" />
                                <span className="font-semibold">Verified Mentor</span>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <User size={18} className="text-blue-600" />
                            </div>
                            About
                        </h4>
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <p className="text-gray-700 leading-relaxed">
                                {mentor.about || 'No description available'}
                            </p>
                        </div>
                    </div>

                    {/* Experience Section */}
                    {mentor.experience && mentor.experience.length > 0 && (
                        <div className="mb-8">
                            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <Briefcase size={18} className="text-blue-600" />
                                </div>
                                Experience
                            </h4>
                            <div className="space-y-3">
                                {mentor.experience.map((exp, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Award className="text-blue-600" size={16} />
                                            </div>
                                            <p className="text-gray-800 font-medium leading-relaxed">{exp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Expertise Section */}
                    {mentor.expertise && mentor.expertise.length > 0 && (
                        <div className="mb-8">
                            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <Star size={18} className="text-blue-600" />
                                </div>
                                Expertise
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {mentor.expertise.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-colors"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <Phone size={18} className="text-blue-600" />
                            </div>
                            Contact Information
                        </h4>
                        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                            {mentor.phone && (
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <Phone className="text-gray-600" size={18} />
                                    </div>
                                    <span className="text-gray-800 font-medium">{mentor.phone}</span>
                                </div>
                            )}
                            {mentor.linked_in_url && (
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <Globe className="text-gray-600" size={18} />
                                    </div>
                                    <a
                                        href={mentor.linked_in_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2 transition-colors"
                                    >
                                        <span>LinkedIn Profile</span>
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-100">
                        <button onClick={handleConnectClick} className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Connect with Mentor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Show loading state while fetching
    if (loading) {
        return (
            <>
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Mentors</h1>
                        </div>

                        {/* Search Bar - disabled while loading */}
                        <div className="max-w-2xl mx-auto mt-12">
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                                <input
                                    type="text"
                                    placeholder="Search mentors by name or expertise..."
                                    disabled
                                    className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-3xl bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <MentorsLoading />
            </>
        );
    }

    return (
        <>
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Mentors</h1>

                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mt-12">
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                            <input
                                type="text"
                                placeholder="Search mentors by name or expertise..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mentors Grid */}
            <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {filteredMentors && filteredMentors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredMentors.map((mentor) => (
                            <MentorCard key={mentor.user_id} mentor={mentor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Users className="text-gray-400" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {searchTerm ? 'No mentors found' : 'No mentors available'}
                        </h3>
                        <p className="text-gray-600 text-lg max-w-md mx-auto">
                            {searchTerm
                                ? 'Try adjusting your search terms to find the perfect mentor.'
                                : 'Check back later for new mentors joining our platform.'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Mentor Modal */}
            {selectedMentor && (
                <MentorModal mentor={selectedMentor} onClose={closeMentorModal} />
            )}
        </>
    );
};

export default MentorScreen;