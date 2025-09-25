import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import CandidateRow from './CandidateRow';
import CandidateProfile from './CandidateProfile.jsx';
import AddCandidateDialog from './AddCandidateDialog';

const ITEMS_PER_PAGE = 10;

export default function CandidateListPage() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // State for filtering and search
    const [currentStage, setCurrentStage] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch candidates from the API based on filters and pagination
    useEffect(() => {
        const fetchCandidates = async () => {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (currentStage !== 'All') {
                queryParams.append('stage', currentStage.toLowerCase());
            }
            if (searchQuery) {
                queryParams.append('search', searchQuery);
            }
            queryParams.append('page', currentPage);
            queryParams.append('pageSize', ITEMS_PER_PAGE);

            try {
                const response = await fetch(`/api/candidates?${queryParams.toString()}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch candidates');
                }
                const data = await response.json();
                setCandidates(data.candidates);
                setTotalResults(data.total);
                setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [currentStage, searchQuery, currentPage]); // Re-fetch on filter/search/page change

    const handleViewProfile = async (candidateId) => {
        try {
            const response = await fetch(`/api/candidates/${candidateId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch candidate profile');
            }
            const data = await response.json();
            setSelectedCandidate(data);
            setIsModalOpen(true);
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCandidate(null);
    };

    const handleAddCandidate = async (newCandidateData) => {
        try {
            const response = await fetch('/api/candidates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newCandidateData, status: 'applied' }),
            });
            if (!response.ok) {
                throw new Error('Failed to add candidate');
            }
            const addedCandidate = await response.json();
            setCandidates(prev => [addedCandidate, ...prev]);
            setIsAddModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to add candidate.');
        }
    };

    const handleStatusChange = async (candidateId, newStatus) => {
        try {
            const response = await fetch(`/api/candidates/${candidateId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            setCandidates(prevCandidates =>
                prevCandidates.map(candidate =>
                    candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate
                )
            );
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status. Please try again.');
        }
    };

    const handleNotesUpdate = async (candidateId, newNotes) => {
        try {
            const response = await fetch(`/api/candidates/${candidateId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: newNotes }),
            });
            if (!response.ok) {
                throw new Error('Failed to update notes');
            }
            setCandidates(prevCandidates =>
                prevCandidates.map(candidate =>
                    candidate.id === candidateId ? { ...candidate, notes: newNotes } : candidate
                )
            );
        } catch (err) {
            console.error('Error updating notes:', err);
            alert('Failed to update notes. Please try again.');
        }
    };

    const stageOptions = ['All', 'Applied', 'Screen', 'Tech', 'Offer', 'Hired', 'Rejected'];

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading candidates...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-[#111829] p-6">
             {isModalOpen === false ? (<div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-50">Candidates</h1>
                    <button 
                        onClick={() => setIsAddModalOpen(true)} 
                        className="px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors bg-blue-700 text-white hover:bg-blue-800"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Candidate</span>
                    </button>
                </div>

                <div className="bg-transparent rounded-xl shadow-sm p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-[#1f2937] focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-[#1f2937] text-blue-50 placeholder-blue-200"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full inline-flex justify-between items-center px-4 py-2 rounded-md bg-[#1f2937] border border-[#1f2937] shadow-sm text-blue-50 hover:bg-blue-800 focus:ring-2 focus:ring-blue-400"
                            >
                                <span className="font-medium text-sm">Stage: {currentStage}</span>
                                <ChevronDown className={`w-4 h-4 text-yellow-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-full bg-[#1f2937] rounded-md shadow-lg border border-[#1f2937] z-10">
                                    <div className="py-1">
                                        {stageOptions.map(stage => (
                                            <button
                                                key={stage}
                                                onClick={() => {
                                                    setCurrentStage(stage);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-800 transition-colors ${
                                                    currentStage === stage ? 'bg-blue-800 text-yellow-300' : 'text-blue-100'
                                                }`}
                                            >
                                                {stage}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-[#1f2937] rounded-xl shadow-sm border border-[#1f2937] overflow-x-auto">
                    <table className="min-w-full divide-y divide-blue-800 text-blue-50">
                        <thead className="bg-[#1f2937] text-blue-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name & Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role Applied
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applied Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#1f2937] divide-y divide-blue-900">
                            {candidates.map((candidate) => (
                                <CandidateRow
                                    key={candidate.id}
                                    candidate={candidate}
                                    onViewProfile={handleViewProfile}
                                    onStatusChange={handleStatusChange}
                                    onNotesUpdate={handleNotesUpdate}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-between items-center text-sm text-blue-100">
                    <span>Showing {Math.min(1 + (currentPage - 1) * ITEMS_PER_PAGE, totalResults)} to {Math.min(currentPage * ITEMS_PER_PAGE, totalResults)} of {totalResults} results</span>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-700 hover:bg-blue-50'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1.5 rounded-md font-medium transition-colors border ${
                                    currentPage === i + 1 ? 'bg-blue-700 text-white border-yellow-500' : 'bg-white text-blue-700 border-blue-700 hover:bg-blue-50'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-700 hover:bg-blue-50'}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>) 
            :
            
            selectedCandidate && (
                <CandidateProfile
                    candidate={selectedCandidate}
                    onBack={handleCloseModal}
                    onStatusChange={handleStatusChange}
                />
            )
            
        }

            <AddCandidateDialog 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddCandidate}
            />
        </div>
    );
}