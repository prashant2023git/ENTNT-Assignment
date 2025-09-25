import React, { useState } from 'react';
import { User, Mail, FileText, Eye, ChevronDown } from 'lucide-react';
import NotesDialog from './Notes';

export default function CandidateCard ({ candidate, onStatusChange, onViewProfile, onNotesUpdate }) {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const statusOptions = [
    { value: 'applied', label: 'Applied', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'selected', label: 'Selected', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'interviewcall', label: 'Interview Call', color: 'bg-blue-100 text-blue-800' }
  ];

  const currentStatusConfig = statusOptions.find(option => option.value === candidate.status);

  // This function now directly calls the parent's prop
  const handleStatusChange = (newStatus) => {
    onStatusChange(candidate.id, newStatus);
    setIsDropdownOpen(false);
  };

  const handleNotesUpdate = (newNotes) => {
    onNotesUpdate(candidate.id, newNotes);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
              <p className="text-sm text-gray-500">{candidate.title || 'Software Developer'}</p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${currentStatusConfig?.color} hover:opacity-80 transition-opacity`}
            >
              {currentStatusConfig?.label}
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        option.value === candidate.status ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{candidate.email}</span>
          </div>
          {candidate.phone && (
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm">{candidate.phone}</span>
            </div>
          )}
        </div>

        {candidate.skills && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {candidate.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                  +{candidate.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => setIsNotesOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex-1"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Notes</span>
          </button>
          
          <button
            onClick={() => onViewProfile(candidate.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">View Profile</span>
          </button>
        </div>

        {candidate.appliedDate && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Applied on {new Date(candidate.appliedDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <NotesDialog
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        candidateName={candidate.name}
        notes={candidate.notes || ''}
        onSaveNotes={handleNotesUpdate}
      />
    </>
  );
};