import React, { useEffect, useState } from 'react'
import {  Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-blue-600 shadow-lg py-3' : 'bg-blue-600 py-4'
                }`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white">Startup Studio</h1>

                        {/* Horizontal Desktop Menu - All items in one line */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-white hover:text-blue-200 transition-colors duration-300 font-medium cursor-pointer">
                                Home
                            </Link>
                            <Link to="/mentors" className="text-white hover:text-blue-200 transition-colors duration-300 font-medium cursor-pointer">
                                Mentors
                            </Link>
                            <Link to="/startups" className="text-white hover:text-blue-200 transition-colors duration-300 font-medium cursor-pointer">
                                Startups
                            </Link>
                            <Link to="/cohort-registration" className="bg-white cursor-pointer text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg">
                                Join the Cohort
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-blue-700 px-6 py-4 space-y-3 animate-fadeIn mt-4">
                            <Link to="/" className="block text-white hover:text-blue-200 transition-colors">Home</Link>
                            <Link to="/mentors" className="block text-white hover:text-blue-200 transition-colors">Mentors</Link>
                            <Link to="/startups" className="block text-white hover:text-blue-200 transition-colors">Startups</Link>
                            <Link to="/cohort-registration" className="w-full bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300">
                                Join the Cohort
                            </Link>
                        </div>
                    )}
                </div>
            </nav>


        </div>
    )
}

export default LandingNavbar