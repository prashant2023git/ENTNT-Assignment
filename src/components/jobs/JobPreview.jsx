import React, { useState } from 'react';
import { FaTimes, FaEdit } from 'react-icons/fa';
import AssessmentBuilderDialog from '../assessments/AssessmentBuilder';

const JobPreviewDialog = ({ isOpen, onClose, job }) => {
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [assessment, setAssessment] = useState(null);

    const handleSaveAssessment = (newQuestions) => {
        setAssessment(newQuestions);
        console.log("New Assessment Data:", newQuestions);
    };

    if (!isOpen || !job) {
        return null;
    }

    return (
        <div>
            {isBuilderOpen === false ?
        <div className="text-white fixed inset-0 bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-[#1f2937] rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 hover:scale-100">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold text-white">{job.jobTitle}</h2>
                        <div className="flex items-center space-x-2 text-sm">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.jobType}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                        <FaTimes size={24} />
                    </button>
                </div>
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setIsBuilderOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <FaEdit />
                        <span>{assessment ? 'Edit Assessment' : 'Add Assessment'}</span>
                    </button>
                </div>

                <div className="space-y-6">
                    <p className="text-lg font-semibold text-blue-600">{job.jobSalary}</p>
                    {/* ... (rest of the job preview content) ... */}
                </div>

                <div className="mt-8 pt-4 border-t text-sm flex justify-between items-center">
                    <span>Posted on: {job.jobCreationDate}</span>
                    <span className="font-semibold">{job.noOfCandidatesApplied} Candidates Applied</span>
                </div>
            </div>
        </div>
        :
        (
            <div className='fixed w-full h-full inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50'>
                <AssessmentBuilderDialog
                    isOpen={true} // The builder is always "open" when visible
                    onClose={() => setIsBuilderOpen(false)}
                    onSave={handleSaveAssessment}
                    jobId={job.jobId}
                />
            </div>
        )
    }
        </div>

    );
};

export default JobPreviewDialog;