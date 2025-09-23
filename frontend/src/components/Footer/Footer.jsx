import React from 'react';
import {
    Building,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Github,
    ExternalLink,
    Users,
    BookOpen,
    Briefcase,
    Award,
    Heart
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Platform",
            links: [
                { name: "For Startups", href: "/startups", icon: Building },
                { name: "For Mentors", href: "/mentors", icon: Users },
                { name: "Mentorship Program", href: "/mentorship", icon: Award },
                { name: "Success Stories", href: "/success-stories", icon: BookOpen }
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "Startup Guide", href: "/guide", icon: BookOpen },
                { name: "Events & Workshops", href: "/events", icon: Award },
                { name: "Funding Opportunities", href: "/funding", icon: Briefcase },
                { name: "Blog", href: "/blog", icon: BookOpen }
            ]
        },
        {
            title: "About",
            links: [
                { name: "About E-Cell", href: "/about", icon: Users },
                { name: "Our Team", href: "/team", icon: Users },
                { name: "Contact Us", href: "/contact", icon: Mail },
                { name: "Privacy Policy", href: "/privacy", icon: null },
                { name: "Terms of Service", href: "/terms", icon: null }
            ]
        }
    ];

    const socialLinks = [
        { name: "LinkedIn", icon: Linkedin, href: "https://in.linkedin.com/company/ecell-iith", color: "hover:text-blue-600" },
        { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/ecell_iith/?hl=en", color: "hover:text-pink-600" },      
        { name: "GitHub", icon: Github, href: "https://github.com/orgs/E-Cell-IITH", color: "hover:text-gray-900" }
    ];

    return (
        <footer className="bg-gray-50 border-t border-gray-200">

            

            {/* Bottom Footer */}
            <div className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                        {/* Copyright and Credits */}
                        <div className="text-center lg:text-left">
                            <p className="text-gray-600 text-sm">
                                © {currentYear} Startup Studio IIT Hyderabad. All rights reserved.
                            </p>
                            <p className="text-gray-500 text-xs mt-1 flex items-center justify-center lg:justify-start space-x-1">
                                <span>Made with</span>
                                <Heart size={12} className="text-red-500 fill-current" />
                                <span>by E-Cell IIT Hyderabad</span>
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 mr-2">Follow us:</span>
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className={`text-gray-400 ${social.color} transition duration-200`}
                                    aria-label={social.name}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;