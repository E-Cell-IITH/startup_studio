import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Globe,
    Users,
    Building,
    Edit3,
    Camera,
    ExternalLink,
    UserCheck,
    Briefcase
} from 'lucide-react';
import { useUser } from '../../Context/userContext';
import Navbar from '../../components/Navbar/Navbar';

const ProfileScreen = () => {

    const { user } = useUser()

    const userData = user;

    console.log(userData.startup_detail?.profile_photo_ref )

    const mentorships = userData.startup_detail?.mentorships || userData.mentor_detail?.mentorships

    const isStartup = userData.mentor_detail === undefined && userData.startup_detail !== undefined;
    const isMentor = userData.startup_detail === undefined && userData.mentor_detail !== undefined;



    const handleChangePhoto = () => {
        alert('Change photo functionality to be implemented');
    };

    const ProfileHeader = () => (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-blue-500">
                        {userData.startup_detail?.profile_photo_ref ? (
                            <img
                                src={userData.startup_detail.profile_photo_ref}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                            {userData.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                    </div>
                    <button
                        onClick={handleChangePhoto}
                        className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200"
                    >
                        <Camera size={16} />
                    </button>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{userData.full_name}</h1>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                        <User className="text-blue-500" size={20} />
                        <span className="text-lg text-gray-600">
                            {isStartup ? 'Startup Founder' : isMentor ? 'Mentor' : 'User'}
                        </span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                        <Mail className="text-blue-500" size={16} />
                        <span className="text-gray-600">{userData.email}</span>
                    </div>

                    {isStartup && userData.startup_detail && (
                        <div className="flex items-center justify-center md:justify-start space-x-2">
                            <Building className="text-blue-500" size={16} />
                            <span className="text-lg font-semibold text-blue-600">
                                {userData.startup_detail.startup_name}
                            </span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );

    const ContactInfo = () => (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Phone className="text-blue-500" />
                <span>Contact Information</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                    <Phone className="text-gray-400" size={18} />
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold">
                            {(isStartup && userData.startup_detail?.phone) ||
                                (isMentor && userData.mentor_detail?.phone) ||
                                'Not provided'}
                        </p>
                    </div>
                </div>

                {isStartup && userData.startup_detail?.website && (
                    <div className="flex items-center space-x-3">
                        <Globe className="text-gray-400" size={18} />
                        <div>
                            <p className="text-sm text-gray-500">Website</p>
                            <a
                                href={userData.startup_detail.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                            >
                                <span>{userData.startup_detail.website}</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const AboutSection = () => {
        const about = (isStartup && userData.startup_detail?.about) ||
            (isMentor && userData.mentor_detail?.about) || '';

        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <User className="text-blue-500" />
                    <span>About</span>
                </h2>
                <div className="text-gray-600">
                    {
                        about ? (
                            <>

                                {about}
                            </>
                        ) : (
                            <>
                                No about
                            </>
                        )

                    }
                </div>
            </div>
        );
    };

    const MentorshipsSection = () => {
        if (!mentorships || mentorships.length === 0) {
            return (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                        <Users className="text-blue-500" />
                        <span>
                            {isStartup ? 'Mentorships Received' : 'Mentorships Provided'}
                        </span>
                    </h2>
                    <div className="text-center py-8">
                        <UserCheck className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500">
                            {isStartup
                                ? 'No mentorships received yet. Connect with mentors to get guidance!'
                                : 'No mentorships provided yet. Start mentoring startups to make an impact!'
                            }
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Users className="text-blue-500" />
                    <span>
                        {isStartup ? 'Mentorships Received' : 'Mentorships Provided'} ({mentorships.length})
                    </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mentorships.map((mentorship) => (
                        <div
                            key={mentorship.mentorship_id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Briefcase className="text-blue-600" size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">
                                        {isStartup ? mentorship.mentor_name : mentorship.startup_name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {isStartup ? 'Mentor' : 'Startup'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="">
            <Navbar />
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">

                <ProfileHeader />
                <ContactInfo />
                <AboutSection />
                <MentorshipsSection />
            </div>
        </div>
    );
};

export default ProfileScreen;