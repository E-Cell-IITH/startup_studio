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
    Building2
} from 'lucide-react';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { useUser } from '../../Context/userContext';
import { useStartUp } from '../../Context/startupContext';

const StartUpScreen = () => {
    const { user } = useUser();
    const { getAllStartups } = useStartUp();
    const [startUps, setStartUps] = useState([]);
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStartups, setFilteredStartups] = useState([]);

    useEffect(() => {
        const fetchStartUps = async () => {
            const data = await getAllStartups();
            setStartUps(data.startups);
            setFilteredStartups(data.startups);
        };
        fetchStartUps();
    }, []);

    useEffect(() => {
        const filtered = startUps.filter(startup =>
            startup.startup_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (startup.about && startup.about.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredStartups(filtered);
    }, [searchTerm, startUps]);

    const openStartupModal = (startup) => {
        setSelectedStartup(startup);
    };

    const closeStartupModal = () => {
        setSelectedStartup(null);
    };

    if (!(user?.mentor_detail?.approval_status || user?.is_admin)) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center py-24">
                        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Building2 className="text-gray-400" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Access Restricted
                        </h3>
                        <p className="text-gray-600 text-lg max-w-md mx-auto">
                            You need to be an approved mentor to access the startup directory.
                        </p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const StartupCard = ({ startup }) => (
        <div
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
            onClick={() => openStartupModal(startup)}
        >
            <div className="p-8">
                {/* Profile Header */}
                <div className="flex items-start space-x-5 mb-6">
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                            {startup.profile_photo_ref ? (
                                <img
                                    src={startup.profile_photo_ref}
                                    alt={startup.startup_name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                                {startup?.startup_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || "S"}
                            </div>
                        </div>
                        <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <Building2 size={14} className="text-white" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                            {startup.startup_name}
                        </h3>
                        <div className="flex items-center text-blue-600 text-sm font-medium mb-3">
                            <Award size={16} className="mr-2" />
                            <span>Verified Startup</span>
                        </div>
                    </div>
                </div>

                {/* About Preview */}
                <div className="mb-6">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {startup.about || 'No description available'}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {startup.phone && (
                            <div className="flex items-center space-x-2">
                                <Phone size={14} />
                                <span className="font-medium">Contact</span>
                            </div>
                        )}
                        {startup.website && (
                            <div className="flex items-center space-x-2">
                                <Globe size={14} />
                                <span className="font-medium">Website</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                        <span>View Details</span>
                        <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );

    const StartupModal = ({ startup, onClose }) => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Startup Profile</h2>
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
                                {startup.profile_photo_ref ? (
                                    <img
                                        src={startup.profile_photo_ref}
                                        alt={startup.startup_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                                    {startup.startup_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                            </div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <Building2 size={18} className="text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-3xl font-bold text-gray-900 mb-3">{startup.startup_name}</h3>
                            <div className="flex items-center text-blue-600 mb-4">
                                <Award size={20} className="mr-2" />
                                <span className="font-semibold">Verified Startup</span>
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
                                {startup.about || 'No description available'}
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <Phone size={18} className="text-blue-600" />
                            </div>
                            Contact Information
                        </h4>
                        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                            {startup.phone && (
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <Phone className="text-gray-600" size={18} />
                                    </div>
                                    <span className="text-gray-800 font-medium">{startup.phone}</span>
                                </div>
                            )}
                            {startup.website && (
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <Globe className="text-gray-600" size={18} />
                                    </div>
                                    <a
                                        href={startup.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2 transition-colors"
                                    >
                                        <span>Visit Website</span>
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-100">
                        <button disabled className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Connect with Startup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Startups</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover innovative startups looking for mentorship and guidance
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mt-12">
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                            <input
                                type="text"
                                placeholder="Search startups by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Startups Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {filteredStartups && filteredStartups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStartups.map((startup) => (
                            <StartupCard key={startup.user_id} startup={startup} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Building2 className="text-gray-400" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {searchTerm ? 'No startups found' : 'No startups available'}
                        </h3>
                        <p className="text-gray-600 text-lg max-w-md mx-auto">
                            {searchTerm
                                ? 'Try adjusting your search terms to find the perfect startup.'
                                : 'Check back later for new startups joining our platform.'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Startup Modal */}
            {selectedStartup && (
                <StartupModal startup={selectedStartup} onClose={closeStartupModal} />
            )}
            <Footer />
        </>
    );
};

export default StartUpScreen;