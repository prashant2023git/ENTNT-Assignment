import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const EditJobDialog = ({ isOpen, onClose, onUpdate, job }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (job) {
            setFormData({
                ...job,
                jobRoles: job.jobRoles ? job.jobRoles.join(', ') : '',
                jobEligibility: job.jobEligibility ? job.jobEligibility.join(', ') : '',
                jobAssessmentQuestions: job.jobAssessmentQuestions ? job.jobAssessmentQuestions.join(', ') : '',
            });
        }
    }, [job]);

    if (!isOpen || !job) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedJob = {
            ...formData,
            jobRoles: formData.jobRoles.split(',').map(item => item.trim()).filter(Boolean),
            jobEligibility: formData.jobEligibility.split(',').map(item => item.trim()).filter(Boolean),
            jobAssessmentQuestions: formData.jobAssessmentQuestions.split(',').map(item => item.trim()).filter(Boolean),
        };
        onUpdate(updatedJob);
    };

    return (
        <div className="hide-scrollbar fixed inset-0 flex justify-center items-center p-4 z-50">
            <div className="hide-scrollbar bg-[#1f2937] border border-[#1f2937] rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-[#1f2937] pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-blue-50">Edit Job: {job.jobTitle}</h2>
                    <button onClick={onClose} className="text-blue-200 hover:text-blue-100 transition-colors">
                        <FaTimes size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-blue-100">Job Title</label>
                        <input type="text" name="jobTitle" value={formData.jobTitle || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-blue-50 shadow-sm p-3 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-100">Location</label>
                        <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-blue-50 shadow-sm p-3 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-100">Salary</label>
                        <input type="text" name="jobSalary" value={formData.jobSalary || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-blue-50 shadow-sm p-3 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-100">Job Type</label>
                        <select name="jobType" value={formData.jobType || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-blue-50 shadow-sm p-3 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50">
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Internship</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-100">Job Description</label>
                        <textarea name="jobDescription" rows="3" value={formData.jobDescription || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-blue-50 shadow-sm p-3 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50" required></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-100">Job Roles (comma-separated)</label>
                        <input type="text" name="jobRoles" value={formData.jobRoles || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-blue-50 shadow-sm p-3 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-100">Job Eligibility (comma-separated)</label>
                        <input type="text" name="jobEligibility" value={formData.jobEligibility || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-blue-50 shadow-sm p-3 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-100">Assessment Questions (comma-separated)</label>
                        <input type="text" name="jobAssessmentQuestions" value={formData.jobAssessmentQuestions || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-blue-50 shadow-sm p-3 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-100">Application Deadline</label>
                        <input type="date" name="jobDeadline" value={formData.jobDeadline || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-blue-50 shadow-sm p-3 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50" required />
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-blue-100 bg-[#6383b0] rounded-lg hover:bg-blue-800 transition-colors border border-[#1f2937]">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 text-blue-900 bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-colors">
                            Update Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditJobDialog;