import React, { useState } from 'react';
import { Menu, X, User, LogOut, Users, UserCheck, Briefcase, GraduationCap, ClipboardCheck, Building2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '../../Context/userContext';
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  // Role detection
  const isStartup = user.startup_detail ? true : false;
  const isMentor = user.mentor_detail ? true : false;
  const isAdmin = user.is_admin || false;

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res) {
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getNavigationItems = () => {
    const baseItems = [];

    if (isStartup) {
      baseItems.push({ name: 'All Mentors', href: '/mentors', icon: GraduationCap });
    }
    if (isMentor) {
      baseItems.push({ name: 'All Startups', href: '/startups', icon: Briefcase });
      baseItems.push({ name: 'All Mentors', href: '/mentors', icon: Users });
    }
    if (isAdmin) {
      baseItems.length = 0;
      baseItems.push({ name: 'Mentor Approval', href: '/mentor-approval', icon: ClipboardCheck });
      baseItems.push({ name: 'Startup Approval', href: '/startup-approval', icon: CheckCircle });
      baseItems.push({ name: 'All Mentors', href: '/mentors', icon: GraduationCap });
      baseItems.push({ name: 'All Startups', href: '/startups', icon: Building2 });
    }

    baseItems.push({ name: 'Profile', href: '/profile', icon: User });

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-blue-600 shadow-lg z-50 h-16 flex items-center justify-between px-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-white p-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="text-white font-semibold text-lg">Startup Studio</span>
        <div className="w-10"></div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 backdrop-blur-lg bg-white/30 z-40"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-blue-600 shadow-xl z-50 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-20'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-blue-500">
            {isOpen ? (
              <span className="text-white font-bold text-xl transition-opacity duration-300">
                Startup Studio
              </span>
            ) : (
              <div className="w-6"></div>
            )}
            {/* Close button for all devices */}
            <button
              onClick={() => {
                setIsMobileOpen(false);
                setIsOpen(!isOpen);
              }}
              className="text-white p-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 group relative cursor-pointer
                    ${isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                    }
                  `}
                >
                  <Icon size={22} className="flex-shrink-0" />
                  <span
                    className={`ml-3 font-medium transition-opacity duration-300 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 w-0'
                      }`}
                  >
                    {item.name}
                  </span>
                  {!isOpen && (
                    <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-blue-500 p-4">
            <div
              className={`text-white mb-3 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 mb-0 overflow-hidden'
                }`}
            >
              <div className="font-semibold text-sm truncate">{user.full_name}</div>
              <div className="text-blue-200 text-xs truncate">{user.email}</div>
              <div className="text-blue-300 text-xs mt-1">
                {isStartup && "Startup"}
                {isMentor && "Mentor"}
                {!isStartup && !isMentor && "User"}
                {isAdmin && " (Admin)"}
              </div>
            </div>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200 group relative cursor-pointer"
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span
                className={`ml-3 font-medium transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'
                  }`}
              >
                Logout
              </span>
              {!isOpen && (
                <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Spacer */}
      <div
        className={`hidden lg:block transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'
          }`}
      ></div>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default Sidebar;