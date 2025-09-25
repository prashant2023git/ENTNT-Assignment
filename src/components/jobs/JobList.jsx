import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from 'lucide-react';
import JobRow from './JobRow';
import AddJobDialog from './AddJobDialog';
import EditJobDialog from './EditJobDialog';
import JobPreviewDialog from './JobPreview';

const ITEMS_PER_PAGE = 10;

export default function JobList() {
    const [jobList, setJobList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const [filterJobTitle, setFilterJobTitle] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterTags, setFilterTags] = useState('');
    
    const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);

    const [showAddJobDialog, setShowAddJobDialog] = useState(false);
    const [showEditJobDialog, setShowEditJobDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [jobToEdit, setJobToEdit] = useState(null);
    const [jobToPreview, setJobToPreview] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            const queryParams = new URLSearchParams();
            queryParams.append('page', currentPage);
            queryParams.append('pageSize', ITEMS_PER_PAGE);
            if (filterStatus !== 'all') {
                queryParams.append('status', filterStatus);
            }
            if (filterJobTitle) {
                queryParams.append('search', filterJobTitle);
            }
            if (filterTags) {
                queryParams.append('tags', filterTags);
            }

            try {
                const response = await fetch(`/api/jobs?${queryParams.toString()}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch jobs.');
                }
                const data = await response.json();
                setJobList(data.jobs);
                setTotalResults(data.total);
                setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [currentPage, filterStatus, filterJobTitle, filterTags]);

    const handleAddJob = (newJobData) => {
        const maxOrder = jobList.reduce((max, j) => typeof j.order === 'number' ? Math.max(max, j.order) : max, 0);
        const newJob = {
             jobId: Date.now().toString(),
             ...newJobData,
             noOfCandidatesApplied: 0,
             jobCreationDate: new Date().toISOString().split('T')[0],
             status: 'Active',
             order: maxOrder + 1,
        };
        setJobList(prevList => [newJob, ...prevList]);
        setShowAddJobDialog(false);
    };

    const handleUpdateJob = (updatedJobData) => {
        setJobList(prevList =>
            prevList.map(job =>
                job.jobId === updatedJobData.jobId ? updatedJobData : job
            )
        );
        setShowEditJobDialog(false);
    };
    
    const openEditDialog = (job) => {
        setJobToEdit(job);
        setShowEditJobDialog(true);
    };

    const openJobPreview = (job) => {
        setJobToPreview(job);
        setShowPreviewDialog(true);
    };

    const handleArchiveUnarchive = (jobId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Archived' : 'Active';
        setJobList(prevJobs =>
            prevJobs.map(job =>
                job.jobId === jobId ? { ...job, status: newStatus } : job
            )
        );
    };
    
    const moveJob = useCallback(async (dragIndex, hoverIndex) => {
        const dragJob = jobList[dragIndex];
        const originalList = [...jobList];

        const updatedList = [...jobList];
        updatedList.splice(dragIndex, 1);
        updatedList.splice(hoverIndex, 0, dragJob);
        // Optimistically update local order values to match new visual order
        const reordered = updatedList.map((j, idx) => ({ ...j, order: idx + 1 }));
        setJobList(reordered);

        try {
            const response = await fetch(`/api/jobs/${dragJob.jobId}/reorder`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromOrder: dragIndex + 1, toOrder: hoverIndex + 1 }),
            });

            if (!response.ok) {
                setJobList(originalList);
                throw new Error('Failed to reorder job.');
            }
            
            const reFetchedResponse = await fetch(`/api/jobs?page=${currentPage}&pageSize=${ITEMS_PER_PAGE}`);
            const reFetchedData = await reFetchedResponse.json();
            setJobList(reFetchedData.jobs);

        } catch (err) {
            console.error('Reorder failed:', err);
            alert('Failed to reorder job. Rolling back.');
            setJobList(originalList);
        }
    }, [jobList, currentPage]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading jobs...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
    }

    const jobTitleOptions = [
        { value: '', label: 'All Job Titles' },
        { value: 'Software Engineer', label: 'Software Engineer' },
        { value: 'Product Manager', label: 'Product Manager' },
        { value: 'Data Scientist', label: 'Data Scientist' },
        { value: 'UX Designer', label: 'UX Designer' },
        { value: 'Marketing Manager', label: 'Marketing Manager' },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'Active', label: 'Active' },
        { value: 'Archived', label: 'Archived' },
    ];

    const tagsOptions = [
        { value: '', label: 'All Tags' },
        { value: 'React', label: 'React' },
        { value: 'Node.js', label: 'Node.js' },
        { value: 'Agile', label: 'Agile' },
        { value: 'Figma', label: 'Figma' },
    ];

    const getOptionLabel = (options, value) => {
        return options.find(opt => opt.value === value)?.label || 'All';
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Jobs</h1>
                    <button
                        className="px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors bg-blue-700 text-white hover:bg-blue-800"
                        onClick={() => setShowAddJobDialog(true)}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create New Job</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <input
                        type="text"
                        value={filterJobTitle}
                        onChange={(e) => setFilterJobTitle(e.target.value)}
                        placeholder="Filter by title..."
                        className="w-full rounded-md border border-[#1f2937] shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-[#1f2937] text-blue-50 placeholder-blue-200"
                    />

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            className="w-full rounded-md border border-[#1f2937] shadow-sm px-4 py-2 text-left flex justify-between items-center focus:ring-2 focus:ring-blue-400 bg-[#1f2937] text-blue-50"
                            aria-haspopup="true"
                            aria-expanded={isStatusDropdownOpen}
                        >
                            <span>{getOptionLabel(statusOptions, filterStatus)}</span>
                            <ChevronDown className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </button>
                        {isStatusDropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-[#1f2937] ring-1 ring-blue-700/60 focus:outline-none z-10">
                                <div className="py-1">
                                    {statusOptions.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => { setFilterStatus(option.value); setIsStatusDropdownOpen(false); }}
                                            className={`block w-full text-left px-4 py-2 text-sm ${
                                                option.value === filterStatus ? 'bg-blue-800 text-yellow-300' : 'text-blue-100 hover:bg-blue-800'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
                            className="w-full rounded-md border border-[#1f2937] shadow-sm px-4 py-2 text-left flex justify-between items-center focus:ring-2 focus:ring-blue-400 bg-[#1f2937] text-blue-50"
                            aria-haspopup="true"
                            aria-expanded={isTagsDropdownOpen}
                        >
                            <span>{getOptionLabel(tagsOptions, filterTags)}</span>
                            <ChevronDown className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </button>
                        {isTagsDropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-[#1f2937] ring-1 ring-blue-700/60 focus:outline-none z-10">
                                <div className="py-1">
                                    {tagsOptions.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => { setFilterTags(option.value); setIsTagsDropdownOpen(false); }}
                                            className={`block w-full text-left px-4 py-2 text-sm ${
                                                option.value === filterTags ? 'bg-blue-800 text-yellow-300' : 'text-blue-100 hover:bg-blue-800'
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
                
                <div className="bg-[#1f2937] rounded-lg shadow-lg overflow-x-auto border border-[#1f2937]">
                    <table className="min-w-full divide-y divide-blue-800 text-blue-50">
                        <thead className="bg-[#1f2937] text-blue-100">
                            <tr>
                                <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">JOB TITLE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">STATUS</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">TAGS</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#1f2937] divide-y divide-[#1f2937]">
                            {jobList.map((job, index) => (
                                <JobRow
                                    key={job.jobId}
                                    job={job}
                                    index={index}
                                    onCardClick={() => openJobPreview(job)}
                                    onEdit={openEditDialog}
                                    onArchiveUnarchive={handleArchiveUnarchive}
                                    moveJob={moveJob}
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

                <AddJobDialog 
                    isOpen={showAddJobDialog} 
                    onClose={() => setShowAddJobDialog(false)} 
                    onSave={handleAddJob}
                />
                
                <EditJobDialog
                    isOpen={showEditJobDialog}
                    onClose={() => setShowEditJobDialog(false)}
                    onUpdate={handleUpdateJob}
                    job={jobToEdit}
                />
                {
                    showPreviewDialog && 
                    <JobPreviewDialog
                        isOpen={showPreviewDialog}
                        onClose={() => setShowPreviewDialog(false)}
                        job={jobToPreview}
                    />
                }
            </div>
        </DndProvider>
    );
}