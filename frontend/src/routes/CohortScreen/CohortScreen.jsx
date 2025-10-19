import React, { useState } from 'react';
import LandingNavbar from '../../components/LandingNavbar/LandingNavbar';
import { Loader2, CheckCircle } from 'lucide-react';

export default function CohortScreen() {
    const [answers, setAnswers] = useState({
        problem: '',
        solution: '',
        market: '',
        customer: '',
        competitive: '',
        usp: '',
        tech: '',
        vision: '',
        campus: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const questions = [
        {
            id: 'problem',
            title: 'Problem Statement',
            description: 'What problem are you solving, and who experiences it most directly?'
        },
        {
            id: 'solution',
            title: 'Solution',
            description: 'What exactly are you building, in the simplest terms, and how does it address the problem?'
        },
        {
            id: 'market',
            title: 'Market Understanding',
            description: 'How big is the opportunity, and what makes this the right time for it?'
        },
        {
            id: 'customer',
            title: 'Customer Understanding',
            description: 'Who will be your first users/customers, and how will you reach them?'
        },
        {
            id: 'competitive',
            title: 'Competitive Understanding',
            description: 'Who else is solving this problem (including substitutes), and how are they doing it?'
        },
        {
            id: 'usp',
            title: 'USP',
            description: 'What makes your approach distinct or hard to copy?'
        },
        {
            id: 'tech',
            title: 'Tech Understanding',
            description: 'What components, infrastructure, or steps would go into actually building your product?'
        },
        {
            id: 'vision',
            title: 'Vision',
            description: "What's your vision building this startup?"
        },
        {
            id: 'campus',
            title: 'Campus',
            description: 'Are you a campus startup?'
        }
    ];

    const handleChange = (id, value) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        // Check if all fields are filled
        const allFieldsFilled = Object.values(answers).every(answer => answer.trim() !== '');
        
        if (!allFieldsFilled) {
            alert('Please fill in all fields before submitting.');
            return;
        }
        
        setIsSubmitting(true);
        
        
        setIsSubmitting(false);
        setShowSuccessPopup(true);
    };

    const closePopup = () => {
        setShowSuccessPopup(false);
    };

    return (
        <div className="min-h-screen bg-white">
            <LandingNavbar />
            <div className="pt-32 pb-20 max-w-6xl mx-auto px-4">
                <div className="bg-blue-600 text-white p-8 rounded-t-lg">
                    <h1 className="text-3xl font-bold mb-2">Startup Questionnaire</h1>
                    <p className="text-blue-100">Answer these key questions to define your startup</p>
                </div>

                <div className="bg-white shadow-lg rounded-b-lg p-8">
                    <div className="space-y-8">
                        {questions.map((q, index) => (
                            <div key={q.id} className="pb-6 border-b border-blue-100 last:border-b-0">
                                <label className="block mb-3">
                                    <div className="flex items-start mb-2">
                                        <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-700 mb-1">
                                                {q.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {q.description}
                                            </p>
                                        </div>
                                    </div>
                                    <textarea
                                        value={answers[q.id]}
                                        onChange={(e) => handleChange(q.id, e.target.value)}
                                        placeholder="Type your answer here..."
                                        className="w-full mt-3 p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors min-h-24 resize-y"
                                    />
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Answers'
                            )}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-blue-100">
                        <p className="text-center text-gray-600 text-sm">
                            Your startup will be selected based on these questions. Please provide detailed and thoughtful responses.
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 transform transition-all">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Submitted Successfully!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Your startup questionnaire has been submitted. We'll review your responses and get back to you soon.
                            </p>
                            <button
                                onClick={closePopup}
                                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}