import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeLink }) => {
  const navItems = [
    { name: 'Dashboard', icon: 'M10 3v18l9-9z', to: '/' },
    { name: 'Jobs', icon: 'M20 7v10h-2V7h2zm-5 0v10h-2V7h2zM3 7v10h2V7H3zm5 0v10h2V7H8z', to: '/jobs' },
    { name: 'Candidates', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', to: '/candidates' },
    { name: 'Assessments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h-3m3 4h-3', to: '/assessments' },
  ];

  const NavLink = ({ name, icon, to }) => {
    const isActive = activeLink === to.substring(1) || (activeLink === 'dashboard' && to === '/');
    const baseClasses = "flex items-center text-sm font-medium transition-colors duration-200";
    // Increased left padding for the item wrapper
    const wrapperClasses = "p-2 pl-4 mx-2 rounded-lg";
    // The specific blue color from the screenshot
    const activeBg = "bg-indigo-600"; 
    const inactiveHoverBg = "hover:bg-gray-800"; 

    return (
      <Link 
        to={to} 
        className={`${baseClasses} ${wrapperClasses} ${isActive ? `${activeBg} text-white` : `text-gray-400 ${inactiveHoverBg}`}`}
      >
        <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
          <path d={icon} />
        </svg>
        {name}
      </Link>
    );
  };

  return (
    // Unified dark background color used in the screenshot: bg-gray-900 is often a good match
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-white fixed top-0 left-0 z-50">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-indigo-400 tracking-wider">TalentFlow</h1>
      </div>

      <nav className="flex-grow py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink key={item.name} {...item} />
        ))}
      </nav>

    </div>
  );
};

export default Sidebar;