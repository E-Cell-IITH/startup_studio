import React, { useEffect, useState } from 'react';
import { Menu, X, User, LogOut, Users, UserCheck } from 'lucide-react';
import { useUser } from '../../Context/userContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    console.log("Navbar User:", user);
  }, [user]);

  if (!user) return null; 

  // Role detection
  const isStartup = !!user.startup_detail;
  const isMentor = !!user.mentor_detail;
  const isAdmin = user.is_admin || false; // backend must send this

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // TODO: hook this to backend logout
    console.log('Logout clicked');
    alert('Logout functionality to be implemented');
  };

  const getNavigationItems = () => {
    const baseItems = [];

    if (isStartup) {
      baseItems.push({ name: 'All Mentors', href: '/mentors', icon: Users });
    }
    if (isMentor) {
      baseItems.push({ name: 'All Startups', href: '/startups', icon: Users });
    }
    if (isAdmin) {
      baseItems.push({ name: 'Mentor Approval', href: '/mentor-approval', icon: UserCheck });
    }

    baseItems.push({ name: 'Profile', href: '/profile', icon: User });

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-blue-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="bg-white rounded-lg p-2">
                <span className="text-blue-500 font-bold text-lg">SS</span>
              </div>
              <span className="ml-2 text-white font-semibold text-lg hidden sm:block">
                Startup Studio
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition duration-300 ease-in-out"
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="text-white text-sm">
              <div className="font-medium">{user.full_name}</div>
              <div className="text-blue-100 text-xs">{user.email}</div>
              <div className="text-blue-200 text-xs">
                {isStartup && "Startup"}
                {isMentor && "Mentor"}
                {!isStartup && !isMentor && "User"}
                {isAdmin && " (Admin)"}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition duration-300 ease-in-out"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-blue-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-300 ease-in-out"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-600">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition duration-300 ease-in-out"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </a>
              );
            })}

            {/* Mobile User Info */}
            <div className="border-t border-blue-500 mt-3 pt-3">
              <div className="text-white px-3 py-2">
                <div className="font-medium">{user.full_name}</div>
                <div className="text-blue-100 text-sm">{user.email}</div>
                <div className="text-blue-200 text-sm">
                  {isStartup && "Startup"}
                  {isMentor && "Mentor"}
                  {!isStartup && !isMentor && "User"}
                  {isAdmin && " (Admin)"}
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left bg-blue-700 hover:bg-blue-800 text-white block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition duration-300 ease-in-out mt-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
