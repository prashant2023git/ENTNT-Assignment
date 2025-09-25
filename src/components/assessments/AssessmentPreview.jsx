import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';

const AssessmentPreview = ({ questions }) => {
    const [answers, setAnswers] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (e, questionId) => {
        const { value, type, checked, files } = e.target;
        let answerValue = value;

        if (type === 'checkbox') {
            const currentAnswers = answers[questionId] || [];
            answerValue = checked
                ? [...currentAnswers, value]
                : currentAnswers.filter(item => item !== value);
        } else if (type === 'file') {
            answerValue = files[0];
        }

        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answerValue
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        questions.forEach(q => {
            const answer = answers[q.id];

            if (q.required && (!answer || (Array.isArray(answer) && answer.length === 0))) {
                newErrors[q.id] = 'This field is required.';
            }

            if (q.type === 'numeric-range' && answer) {
                const numValue = Number(answer);
                if (q.validation.min && numValue < Number(q.validation.min)) {
                    newErrors[q.id] = `Must be at least ${q.validation.min}`;
                }
                if (q.validation.max && numValue > Number(q.validation.max)) {
                    newErrors[q.id] = `Must be no more than ${q.validation.max}`;
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            localStorage.setItem('candidate_responses', JSON.stringify(answers));
            alert('Your responses have been saved locally!');
        } else {
            alert('Please correct the errors in the form.');
        }
    };

    const isQuestionVisible = (q) => {
        if (!q.conditional.id) return true;
        const triggerAnswer = answers[q.conditional.id];
        return triggerAnswer === q.conditional.value;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-blue-50">
            {questions.map((q, index) => {
                if (!isQuestionVisible(q)) return null;

                return (
                    <div key={q.id} className="p-4 bg-blue-900 rounded-md shadow-sm border border-blue-700/60">
                        <label className="block text-sm font-medium text-blue-50 mb-1">
                            {index + 1}. {q.text} {q.required && <span className="text-red-500">*</span>}
                        </label>
                        
                        {q.type === 'short-text' && (
                            <input type="text" className="w-full border-blue-700/60 bg-blue-950 text-blue-100 rounded-md shadow-sm p-2 text-sm" value={answers[q.id] || ''} onChange={(e) => handleChange(e, q.id)} placeholder="Your answer" />
                        )}
                        {q.type === 'long-text' && (
                            <textarea rows="4" className="w-full border-blue-700/60 bg-blue-950 text-blue-100 rounded-md shadow-sm p-2 text-sm" value={answers[q.id] || ''} onChange={(e) => handleChange(e, q.id)} placeholder="Your answer" />
                        )}
                        {q.type === 'numeric-range' && (
                            <input type="number" className="w-full border-blue-700/60 bg-blue-950 text-blue-100 rounded-md shadow-sm p-2 text-sm" value={answers[q.id] || ''} onChange={(e) => handleChange(e, q.id)} placeholder={`Enter a number (e.g., 1-10)`} />
                        )}
                        {q.type === 'file-upload' && (
                            <div className="border-2 border-dashed border-blue-700/60 rounded-md text-center p-8 bg-blue-950">
                                <label htmlFor={`file-upload-${q.id}`} className="cursor-pointer text-blue-200 hover:text-blue-100 transition-colors">
                                    <FaUpload className="mx-auto w-8 h-8 mb-2" />
                                    <p className="text-sm">or drag and drop</p>
                                    <p className="text-xs text-blue-300 mt-1">PNG, JPG, PDF up to 10MB</p>
                                    <input id={`file-upload-${q.id}`} type="file" onChange={(e) => handleChange(e, q.id)} className="sr-only" />
                                </label>
                            </div>
                        )}
                        {q.type === 'single-choice' && (
                            <div className="space-y-1">
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center">
                                        <input type="radio" name={q.id} value={option} checked={answers[q.id] === option} onChange={(e) => handleChange(e, q.id)} className="mr-2 text-yellow-400 focus:ring-yellow-400" />
                                        <label className="text-sm text-blue-100">{option}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {q.type === 'multi-choice' && (
                            <div className="space-y-1">
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center">
                                        <input type="checkbox" name={q.id} value={option} checked={(answers[q.id] || []).includes(option)} onChange={(e) => handleChange(e, q.id)} className="mr-2 rounded text-yellow-400 focus:ring-yellow-400" />
                                        <label className="text-sm text-blue-100">{option}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors[q.id] && <p className="text-red-400 text-xs mt-1">{errors[q.id]}</p>}
                    </div>
                );
            })}
            <button type="submit" className="w-full px-4 py-2 text-blue-900 bg-yellow-400 rounded-md hover:bg-yellow-300">
                Submit Assessment
            </button>
        </form>
    );
};

export default AssessmentPreview;