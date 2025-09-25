import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Archive, Edit } from 'lucide-react';

export default function JobRow({ job, index, onCardClick, onEdit, onArchiveUnarchive, moveJob }) {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'JOB_ROW',
        item: { id: job.jobId, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'JOB_ROW',
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

    const rowStyle = {
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    return (
        <tr ref={ref} style={rowStyle} className="hover:bg-blue-900/40 transition-colors">
            <td className="w-12 px-4 py-4 text-blue-400">⋮⋮</td>
            <td className="px-6 py-4 whitespace-nowrap" onClick={() => onCardClick(job)}>
                <div className="text-sm font-medium text-blue-50">{job.jobTitle}</div>
                <div className="text-xs text-blue-200">{job.location}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap" onClick={() => onCardClick(job)}>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(job.status)}`}>
                    {job.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-2">
                    {(job.jobRoles || []).slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-xs border border-yellow-500 text-yellow-300 bg-blue-900">{tag}</span>
                    ))}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(job); }}
                        className="p-2 rounded-full text-yellow-300 hover:bg-blue-900 border border-yellow-500 transition-colors"
                        title="Edit Job"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onArchiveUnarchive(job.jobId, job.status); }}
                        className="p-2 rounded-full text-yellow-300 hover:bg-blue-900 border border-yellow-500 transition-colors"
                        title={job.status === 'Active' ? 'Archive Job' : 'Unarchive Job'}
                    >
                        <Archive className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}