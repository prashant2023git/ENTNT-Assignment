import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Download, FileText, CheckCircle, XCircle } from 'lucide-react';
import { BiLeftArrow } from 'react-icons/bi';

const statusConfig = {
    applied: { color: 'bg-yellow-100 text-yellow-800', label: 'Applied' },
    screen: { color: 'bg-blue-100 text-blue-800', label: 'Screening' },
    tech: { color: 'bg-cyan-100 text-cyan-800', label: 'Tech Interview' },
    offer: { color: 'bg-green-100 text-green-800', label: 'Offer' },
    hired: { color: 'bg-purple-100 text-purple-800', label: 'Hired' },
    rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
};

const stageConfig = {
    'applied': { label: 'Applied', stages: ['Initial Review'] },
    'screen': { label: 'Screening', stages: ['Resume Review'] },
    'tech': { label: 'Interview', stages: ['Interview 1', 'Interview 2'] },
    'offer': { label: 'Offer', stages: ['Offer Extended', 'Offer Accepted'] },
    'hired': { label: 'Hired', stages: ['Onboarding'] },
    'rejected': { label: 'Rejected', stages: ['Final Rejection'] },
};

export default function CandidateProfile({ candidate, onBack, onStatusChange }) {
    const [activeTab, setActiveTab] = useState('Overview');
    const [notes, setNotes] = useState(candidate.notes); 

    const handleNextStage = () => {
        const stages = ['applied', 'screen', 'tech', 'offer', 'hired'];
        const currentStageIndex = stages.indexOf(candidate.status);
        if (currentStageIndex !== -1 && currentStageIndex < stages.length - 1) {
            const nextStage = stages[currentStageIndex + 1];
            onStatusChange(candidate.id, nextStage);
        }
    };

    const handleReject = () => {
        onStatusChange(candidate.id, 'rejected');
    };

    const handleSaveNotes = (newNotes) => {
        setNotes(newNotes);
        // This is where you would call an onNotesUpdate API prop
        console.log("Notes updated:", newNotes);
    };

    const handleDownloadResume = () => {
        alert('Downloading resume...');
    };

    const renderMainContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-6">
                        <div className="text-black rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl text-white font-bold text-gray-900 mb-4">Application Stages</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(stageConfig).map(([key, config]) => (
                                    <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold">{config.label}</span>
                                            <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">{config.stages.length}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {config.stages.map((stage, index) => (
                                                <div key={index} className="bg-white p-3 rounded-md border border-gray-200">
                                                    <p className="text-sm">{stage}</p>
                                                    <p className="text-xs text-gray-500">Completed: Aug 15, 2023</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'Activity':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Log</h2>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-start space-x-3">
                                <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                <p className="text-sm">Candidate status changed to **Screening** on Aug 18, 2023.</p>
                            </li>
                            <li className="flex items-start space-x-3">
                                <div className="mt-1 w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                                <p className="text-sm">Candidate applied on **Aug 15, 2023**.</p>
                            </li>
                        </ul>
                    </div>
                );
            case 'Documents':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                            <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="text-sm font-medium text-gray-900">{candidate.resume}</p>
                                <p className="text-xs text-gray-500">Last updated: Aug 15, 2023</p>
                            </div>
                            <button onClick={handleDownloadResume} className="text-blue-600 hover:text-blue-800">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#1f2937] ">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button onClick={onBack} className="text-white/80 hover:text-white flex items-center gap-2 mb-4"><BiLeftArrow/> Back</button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">

                        <div className="bg-[#1f2937] rounded-lg shadow-sm border border-[#1f2937] p-6">
                            <img
                                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                                src={candidate.profileImage || 'https://via.placeholder.com/150'}
                                alt={candidate.name}
                            />
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-white">{candidate.name}</h3>
                                <p className="text-sm text-white/80">{candidate.title}</p>
                                <p className="text-xs text-white/60 mt-1">Last updated 2 days ago</p>
                            </div>
                        </div>
                        <div className="bg-[#1f2937]  rounded-lg shadow-sm border border-black p-6 space-y-4">
                            <h4 className="font-semibold text-white">Contact</h4>
                            <div className="flex items-center space-x-2 text-sm text-white/80">
                                <Mail className="w-4 h-4" />
                                <span>{candidate.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-white/80">
                                <Phone className="w-4 h-4" />
                                <span>{candidate.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-white/80">
                                <MapPin className="w-4 h-4" />
                                <span>{candidate.location}</span>
                            </div>
                        </div>
                        <div className="bg-[#1f2937] rounded-lg shadow-sm border border-black p-6 space-y-4">
                            <h4 className="font-semibold text-white">Resume</h4>
                            <div className="flex items-center space-x-3 p-3 bg-[#1f2937] rounded-md border border-[#1f2937]">
                                <FileText className="w-5 h-5 text-white flex-shrink-0" />
                                <span className="flex-grow text-sm font-medium text-white">{candidate.resume}</span>
                                <button onClick={handleDownloadResume} className="text-white/80 hover:text-white">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="bg-[#1f2937] rounded-lg shadow-sm border border-black p-6 space-y-4">
                            <h4 className="font-semibold text-white">Notes</h4>
                            <textarea
                                className="w-full p-2 text-sm border border-[#1f2937] rounded-md bg-[#1f2937] text-white/90 placeholder-white/60 focus:ring-white focus:border-white"
                                rows="4"
                                placeholder="Add a note... You can @mention colleagues."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                            <button
                                onClick={() => handleSaveNotes(notes)}
                                className="w-full bg-white text-[#1f2937] py-2 rounded-md hover:bg-white/90 transition-colors"
                            >
                                Save Note
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-[#1f2937] rounded-lg shadow-sm">
                            <div className="flex border-b border-[#1f2937]">
                                {['Overview', 'Activity', 'Documents'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                            activeTab === tab
                                                ? 'border-white text-white'
                                                : 'border-transparent text-white/70 hover:text-white'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="p-6 text-white">
                                {renderMainContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}