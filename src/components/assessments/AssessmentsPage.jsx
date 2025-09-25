import React, { useEffect, useState } from 'react';
import { Jobs } from '../../constants/jobs';
import AssessmentPreview from './AssessmentPreview';

const AssessmentsPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/assessments');
                const data = await res.json();
                setItems(data.assessments || []);
            } catch (e) {
                setError('Failed to load assessments');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-100">Loading assessments...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;

    const getJobTitle = (jobId) => Jobs.find(j => j.jobId === jobId)?.jobTitle || `Job ${jobId}`;

    return (
        <div className="min-h-screen bg-[#1f2937] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">Assessments</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-[#1f2937] border border-[#1f2937] rounded-xl p-4">
                        <ul className="space-y-3">
                            {items.map(item => (
                                <li key={item.jobId}>
                                    <button
                                        onClick={() => setSelected(item)}
                                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${selected?.jobId === item.jobId ? 'bg-white text-[#1f2937] border-white' : 'bg-[#1f2937] text-white border-[#1f2937] hover:bg-white/10'}`}
                                    >
                                        <div className="font-medium">{getJobTitle(item.jobId)}</div>
                                        <div className="text-xs opacity-80">{item.totalQuestions} questions</div>
                                    </button>
                                </li>
                            ))}
                            {items.length === 0 && (
                                <li className="text-white/80">No assessments yet. Build one from a job preview.</li>
                            )}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 bg-[#1f2937] border border-[#1f2937] rounded-xl p-6">
                        {!selected ? (
                            <div className="text-white/80">Select an assessment on the left to preview.</div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">{getJobTitle(selected.jobId)} — Preview</h2>
                                <AssessmentPreview questions={selected.questions || []} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessmentsPage;
