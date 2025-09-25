import React from 'react';
import Sidebar from '../../sidebar'; 
import { Bell } from 'lucide-react';

const DashboardLayout = ({ activeLink, children }) => {
  return (
    // Unified dark background color
    <div className="min-h-screen bg-gray-900">
      
      <Sidebar activeLink={activeLink} />

      {/* Uses padding to offset the fixed sidebar */}
      <div className="pl-64"> 
        
        {/* Header must use the same dark background as the layout */}
        <header className="flex justify-end items-center p-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
          
          <div className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
            <Bell/>   
          </div>
          
          <div className="flex items-center ml-4 cursor-pointer">
            <img 
              className="h-10 w-10 rounded-full object-cover mr-3" 
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Sarah Miller" 
            />
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-semibold">Sarah Miller</p>
              <p className="text-gray-400 text-xs">HR Manager</p>
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;