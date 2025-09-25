import React, { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import NotesDialog from './Notes';

const statusOptions = [
    { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-800' },
    { value: 'screen', label: 'Screen', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'tech', label: 'Tech', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'offer', label: 'Offer', color: 'bg-green-100 text-green-800' },
    { value: 'hired', label: 'Hired', color: 'bg-purple-100 text-purple-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
];

export default function CandidateRow({ candidate, onStatusChange, onViewProfile, onNotesUpdate }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);

    const currentStatusConfig = statusOptions.find(option => option.value === candidate.status);

    const handleStatusChange = (newStatus) => {
        // Prevent API call if status is not changing
        if (newStatus === candidate.status) {
            setIsDropdownOpen(false);
            return;
        }
        onStatusChange(candidate.id, newStatus);
        setIsDropdownOpen(false);
    };

    const handleNotesUpdate = (newNotes) => {
        onNotesUpdate(candidate.id, newNotes);
        setIsNotesOpen(false);
    };

    return (
        <tr className="hover:bg-blue-900/40 transition-colors">
            <td 
                className="px-6 py-4 whitespace-nowrap cursor-pointer" 
                onClick={() => onViewProfile(candidate.id)}
            >
                <div className="text-sm font-medium text-blue-50">{candidate.name}</div>
                <div className="text-xs text-blue-200">{candidate.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-blue-50">{candidate.title || 'N/A'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-blue-200">{candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString() : 'N/A'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative inline-block">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${currentStatusConfig?.color} hover:opacity-80 transition-opacity border border-yellow-500`}
                    >
                        {currentStatusConfig?.label}
                        <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                    {isDropdownOpen && (
    <div className="absolute left-0 mt-2 w-36 bg-blue-900 rounded-lg shadow-lg border border-blue-700/60 z-10">
        <div className="py-1 flex flex-col">
            {statusOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={(e) => { e.stopPropagation(); handleStatusChange(option.value); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-800 transition-colors ${
                        option.value === candidate.status ? 'bg-blue-800 text-yellow-300' : 'text-blue-100'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    </div>
)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={(e) => { e.stopPropagation(); setIsNotesOpen(true); }}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-900 text-yellow-300 rounded-md hover:bg-blue-800 transition-colors border border-yellow-500"
                >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Notes</span>
                </button>
            </td>
            <NotesDialog
                isOpen={isNotesOpen}
                onClose={() => setIsNotesOpen(false)}
                candidateName={candidate.name}
                notes={candidate.notes || ''}
                onSaveNotes={handleNotesUpdate}
            />
        </tr>
    );
}