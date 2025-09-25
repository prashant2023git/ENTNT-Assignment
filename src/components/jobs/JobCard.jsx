// JobCard.jsx (No changes required)
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const JobCard = ({ job, index, moveJob, onEdit, onArchiveUnarchive, onCardClick }) => {
    const ref = useRef(null);
    
    const [{ isDragging }, drag] = useDrag({
        type: 'JOB_CARD',
        item: { id: job.jobId, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'JOB_CARD',
        hover: (item, monitor) => {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveJob(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-red-100 text-red-800';
        }
    };

    const cardStyle = {
        opacity: isDragging ? 0.5 : 1,
        cursor: 'pointer',
    };

    return (
        <div ref={ref} style={cardStyle} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200">
            <div onClick={onCardClick}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{job.jobTitle}</h3>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusClasses(job.status)}`}>
                        {job.status}
                    </span>
                </div>
                
                <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Location:</span> {job.location}
                </p>
                <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Salary:</span> {job.jobSalary}
                </p>
                <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Type:</span> {job.jobType}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                    <span className="font-semibold">{job.noOfCandidatesApplied}</span> candidates applied
                </p>
            </div>

            <div className="mt-6 flex justify-between space-x-2">
                <button 
                    className="flex-1 bg-blue-500 text-white text-sm py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                >
                    Edit
                </button>
                <button 
                    className="flex-1 bg-yellow-500 text-white text-sm py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onArchiveUnarchive(job.jobId, job.status); }}
                >
                    {job.status === 'Active' ? 'Archive' : 'Unarchive'}
                </button>
            </div>
        </div>
    );
};

export default JobCard;