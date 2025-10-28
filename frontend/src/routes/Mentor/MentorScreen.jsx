import React, { useEffect, useState } from 'react';
import {
    User,
    Phone,
    Globe,
    Users,
    X,
    ExternalLink,
    Award,
    Star,
    Briefcase,
    Search,
    Building2
} from 'lucide-react';
import { useMentor } from '../../Context/mentorContext';
import { useUser } from '../../Context/userContext';

const MentorScreen = () => {
    const { user } = useUser()
    const { getAllMentors } = useMentor();
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMentors, setFilteredMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                setLoading(true);
                const data = await getAllMentors();

                if (!data) {
                    console.log("error fetching mentors");
                    return;
                }

                setMentors(data.mentors);
                setFilteredMentors(data.mentors);
            } catch (error) {
                console.error("Error fetching mentors:", error);
            } finally {
                setLoading(false);
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

    // Access check
    if (!(user?.startup_detail?.approval_status || user?.mentor_detail?.approval_status || user?.is_admin)) {
        return (
            <div className="flex-1 bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white border border-gray-200 shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-6">
                            <Building2 className="text-gray-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Access Restricted
                        </h3>
                        <p className="text-gray-600 text-base max-w-md mx-auto">
                            You need to be an approved startup/mentor to access the mentor directory.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Loading Skeleton
    const MentorCardSkeleton = () => (
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden animate-pulse">
            <div className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200"></div>
                    <div className="flex-1">
                        <div className="h-5 bg-gray-200 mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-200 w-1/2"></div>
                    </div>
                </div>
                <div className="mb-4">
                    <div className="h-4 bg-gray-200 mb-2"></div>
                    <div className="h-4 bg-gray-200 mb-2 w-5/6"></div>
                    <div className="h-4 bg-gray-200 w-3/4"></div>
                </div>
                <div className="flex space-x-2 mb-4">
                    <div className="h-6 bg-gray-200 w-20"></div>
                    <div className="h-6 bg-gray-200 w-24"></div>
                </div>
                <div className="h-10 bg-gray-200 w-full"></div>
            </div>
        </div>
    );

    const MentorsLoading = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, index) => (
                <MentorCardSkeleton key={index} />
            ))}
        </div>
    );

    const MentorCard = ({ mentor }) => (
        <div className="group rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-start space-x-4 mb-4">
                   
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                            {mentor.mentor_name}
                        </h3>
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                            <Award size={14} className="mr-1.5" />
                            <span>Verified Mentor</span>
                        </div>
                    </div>
                </div>

                {/* About Preview */}
                <div className="mb-4">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {mentor.about || 'No description available'}
                    </p>
                </div>

                {/* Expertise Tags */}
                {mentor.expertise && mentor.expertise.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {mentor.expertise.slice(0, 3).map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex rounded-xl items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200"
                                >
                                    {skill}
                                </span>
                            ))}
                            {mentor.expertise.length > 3 && (
                                <span className="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-600 text-xs font-semibold border border-gray-200">
                                    +{mentor.expertise.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* View Profile Button */}
                <button
                    onClick={() => openMentorModal(mentor)}
                    className="w-full bg-blue-600 rounded-xl hover:bg-blue-700 text-white py-2.5 px-4 font-semibold text-sm transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                    <span>View Profile</span>
                    <ExternalLink size={14} />
                </button>
            </div>
        </div>
    );

    const MentorModal = ({ mentor, onClose }) => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-4xl rounded-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-900">Mentor Profile</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 cursor-pointer rounded-4xl bg-white border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-200">
                   
                        <div className="flex-1">
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">{mentor.mentor_name}</h3>
                            <div className="flex items-center text-blue-600">
                                <Award size={18} className="mr-2" />
                                <span className="font-semibold">Verified Mentor</span>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 flex items-center justify-center mr-3 rounded-xl ">
                                <User size={16} className="text-blue-600" />
                            </div>
                            About
                        </h4>
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                            <p className="text-gray-700 leading-relaxed">
                                {mentor.about || 'No description available'}
                            </p>
                        </div>
                    </div>

                    {/* Experience Section */}
                    {mentor.experience && mentor.experience.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                <div className="w-8 h-8 bg-blue-100 flex items-center justify-center mr-3 rounded-xl ">
                                    <Briefcase size={16} className="text-blue-600" />
                                </div>
                                Experience
                            </h4>
                            <div className="space-y-3">
                                {mentor.experience.map((exp, index) => (
                                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-xl">
                                                <Award className="text-blue-600" size={14} />
                                            </div>
                                            <p className="text-gray-800 leading-relaxed">{exp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Expertise Section */}
                    {mentor.expertise && mentor.expertise.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                <div className="w-8 h-8 bg-blue-100 flex items-center justify-center mr-3 rounded-xl">
                                    <Star size={16} className="text-blue-600" />
                                </div>
                                Expertise
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {mentor.expertise.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center rounded-xl px-4 py-2 bg-blue-50 text-blue-700 font-semibold text-sm border-2 border-blue-200"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 flex items-center justify-center mr-3 rounded-xl ">
                                <Phone size={16} className="text-blue-600" />
                            </div>
                            Contact Information
                        </h4>
                        <div className="bg-gray-50 border border-gray-200 p-4 space-y-3 rounded-xl">
                            {mentor.phone && (
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white border border-gray-300 flex items-center justify-center shadow-sm">
                                        <Phone className="text-gray-600" size={16} />
                                    </div>
                                    <span className="text-gray-800 font-medium">{mentor.phone}</span>
                                </div>
                            )}
                            {mentor.linked_in_url && (
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white border border-gray-300 flex items-center justify-center shadow-sm">
                                        <Globe className="text-gray-600" size={16} />
                                    </div>
                                    <a
                                        href={mentor.linked_in_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2 transition-colors"
                                    >
                                        <span>LinkedIn Profile</span>
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-200">
                        <button 
                            onClick={handleConnectClick} 
                            className="w-full cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 font-bold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Connect with Mentor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 bg-gray-50">
            {/* Header Section */}
            <div className="">
                <div className="max-w-6xl mx-auto px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Our Mentors</h1>
                    
                    {/* Search Bar - 2/3 width */}
                    <div className="max-w-4xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search mentors by name or expertise..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                disabled={loading}
                                className="w-full rounded-xl pl-12 pr-4 py-3 text-base border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-8 py-8">
                {loading ? (
                    <MentorsLoading />
                ) : filteredMentors && filteredMentors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMentors.map((mentor) => (
                            <MentorCard key={mentor.user_id} mentor={mentor} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-6">
                            <Users className="text-gray-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {searchTerm ? 'No mentors found' : 'No mentors available'}
                        </h3>
                        <p className="text-gray-600 text-base max-w-md mx-auto">
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
        </div>
    );
};

export default MentorScreen;