import React, { useEffect, useState } from 'react'
import { X, Phone, ExternalLink, User, Award, Briefcase } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import { useUser } from '../../Context/userContext'
import { useMentor } from '../../Context/mentorContext'

const MentorApproval = () => {
    const { user } = useUser()
    const [mentors, setMentors] = useState([])
    const [selectedMentor, setSelectedMentor] = useState(null)
    const { getAllNonApprovedMentors, approveMentor, rejectMentor } = useMentor()

    async function fetchMentors() {
        const data = await getAllNonApprovedMentors(user.user_id)
        console.log(data.mentors)

        if (data.mentors == null) {
            return
        }

        setMentors(data.mentors)
    }

    useEffect(() => {
        fetchMentors()
    }, [])

    const handleMentorClick = (mentor) => {
        setSelectedMentor(mentor)
    }

    const handleCloseModal = () => {
        setSelectedMentor(null)
    }

    const handleApproveMentor = async (mentorId) => {


        const res = await approveMentor(user.user_id, mentorId)

        if (!res) {

            console.log('Approving mentor failed')
        }

        setMentors(mentors.filter(mentor => mentor.user_id !== mentorId))
        setSelectedMentor(null)
        console.log('Approving mentor:', mentorId)
    }

    const handleRejectMentor = async (mentorId) => {


        await rejectMentor(user.user_id, mentorId)

        setMentors(mentors.filter(mentor => mentor.user_id !== mentorId))
        setSelectedMentor(null)


        console.log('Rejecting mentor:', mentorId)
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mentor Approval Dashboard</h1>
                        <p className="text-gray-600">Review and approve mentor applications</p>
                        <div className="mt-4">
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                {mentors != null ? `${mentors.length}` : '0'} Pending Approvals
                            </span>
                        </div>
                    </div>

                    {mentors != null && mentors.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-gray-400 mb-4">
                                <User size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Mentors</h3>
                            <p className="text-gray-500">All mentor applications have been processed.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {mentors != null && mentors.map((mentor, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleMentorClick(mentor)}
                                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-gray-200 mb-4 overflow-hidden">
                                            <img
                                                src={mentor.profile_photo_ref}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none'
                                                    e.target.nextSibling.style.display = 'flex'
                                                }}
                                            />
                                            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold" style={{ display: 'none' }}>
                                                {mentor.user_id.charAt(0).toUpperCase()}
                                            </div>
                                        </div>

                                        <h3 className="font-semibold text-gray-800 mb-2">{mentor.mentor_name}</h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {mentor.about.substring(0, 80)}...
                                        </p>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {mentor.expertise.slice(0, 2).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {mentor.expertise.length > 2 && (
                                                <span className="text-xs text-gray-500">
                                                    +{mentor.expertise.length - 2} more
                                                </span>
                                            )}
                                        </div>

                                        <button className="cursor-pointer text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Modal */}
                    {selectedMentor && (
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">Mentor Application</h2>
                                    <button
                                        onClick={handleCloseModal}
                                        className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="w-20 h-20 rounded-full bg-gray-200 mr-6 overflow-hidden">
                                            <img
                                                src={selectedMentor.profile_photo_ref}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none'
                                                    e.target.nextSibling.style.display = 'flex'
                                                }}
                                            />
                                            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl" style={{ display: 'none' }}>
                                                {selectedMentor.user_id.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedMentor.mentor_name}</h3>
                                            <div className="flex items-center text-gray-600 mb-1">
                                                <Phone size={16} className="mr-2" />
                                                <span>{selectedMentor.phone}</span>
                                            </div>
                                            {selectedMentor.linked_in_url && (
                                                <div className="flex items-center text-blue-600">
                                                    <ExternalLink size={16} className="mr-2" />
                                                    <a
                                                        href={selectedMentor.linked_in_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline"
                                                    >
                                                        LinkedIn Profile
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                                <User size={18} className="mr-2" />
                                                About
                                            </h4>
                                            <p className="text-gray-600 leading-relaxed">{selectedMentor.about}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                                <Award size={18} className="mr-2" />
                                                Expertise
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedMentor.expertise.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                                <Briefcase size={18} className="mr-2" />
                                                Experience
                                            </h4>
                                            <ul className="space-y-2">
                                                {selectedMentor.experience.map((exp, index) => (
                                                    <li key={index} className="text-gray-600 flex items-start">
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                        {exp}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
                                        <button
                                            onClick={() => handleApproveMentor(selectedMentor.user_id)}
                                            className="flex-1 cursor-pointer bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                                        >
                                            Approve 
                                        </button>
                                        <button
                                            onClick={() => handleRejectMentor(selectedMentor.user_id)}
                                            className="flex-1  cursor-pointer  text-white py-3 px-6 rounded-lg font-semibold bg-red-500 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}


export default MentorApproval