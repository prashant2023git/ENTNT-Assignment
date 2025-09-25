import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import AssessmentPreview from './AssessmentPreview';
import { Jobs } from '../../constants/jobs';

const questionTypes = [
    { value: 'single-choice', label: 'Single Choice' },
    { value: 'multi-choice', label: 'Multi Choice' },
    { value: 'short-text', label: 'Short Text' },
    { value: 'long-text', label: 'Long Text' },
    { value: 'numeric-range', label: 'Numeric Range' },
    { value: 'file-upload', label: 'File Upload' },
];

const AssessmentBuilderDialog = ({ isOpen, onClose, jobId, onSave }) => {
    const [questions, setQuestions] = useState([]);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionType, setNewQuestionType] = useState('single-choice');
    const [newQuestionOptions, setNewQuestionOptions] = useState('');

    useEffect(() => {
        const storedData = localStorage.getItem(`assessment_builder_${jobId}`);
        if (storedData) {
            setQuestions(JSON.parse(storedData));
        }
    }, [jobId]);

    const handleAddQuestion = () => {
        if (newQuestionText.trim() === '') return;

        const newQuestion = {
            id: Date.now().toString(),
            text: newQuestionText,
            type: newQuestionType,
            options: newQuestionType.includes('choice') ? newQuestionOptions.split(',').map(o => o.trim()).filter(Boolean) : [],
            required: false,
            validation: {},
            conditional: {
                id: '',
                value: '',
            },
        };

        setQuestions([...questions, newQuestion]);
        setNewQuestionText('');
        setNewQuestionOptions('');
    };

    const handleQuestionChange = (id, field, value) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        ));
    };

    const handleValidationChange = (id, field, value) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, validation: { ...q.validation, [field]: value } } : q
        ));
    };
	
	const handleAddOption = (id) => {
		setQuestions(questions.map(q =>
			q.id === id ? { ...q, options: [...(q.options || []), ''] } : q
		));
	};

	const handleRemoveOption = (id, optionIndex) => {
		setQuestions(questions.map(q => {
			if (q.id !== id) return q;
			const nextOptions = [...(q.options || [])];
			nextOptions.splice(optionIndex, 1);
			return { ...q, options: nextOptions };
		}));
	};

	const handleOptionChange = (id, optionIndex, value) => {
		setQuestions(questions.map(q => {
			if (q.id !== id) return q;
			const nextOptions = [...(q.options || [])];
			nextOptions[optionIndex] = value;
			return { ...q, options: nextOptions };
		}));
	};
    
    const handleConditionalChange = (id, field, value) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, conditional: { ...q.conditional, [field]: value } } : q
        ));
    };

    const handleSave = async () => {
        try {
            localStorage.setItem(`assessment_builder_${jobId}`, JSON.stringify(questions));
            await fetch(`/api/assessments/${jobId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(questions),
            });
            onSave(questions);
            onClose();
        } catch (e) {
            console.error('Failed to save assessment', e);
            alert('Failed to save assessment.');
        }
    };
    const role = Jobs.find(job => job.jobId === jobId) || {};
    if (!isOpen) return null;

    return (
        <div className="hide-scrollbar container mx-auto p-8 bg-[#1f2937] overflow-auto h-[90%] rounded-2xl">
            <div className="hide-scrollbar flex justify-between items-center mb-6">
                <div className="space-y-1">
                    <div className="text-sm text-white/70"><span onClick={handleSave} className='cursor-pointer'>Jobs/ </span> {role.jobTitle}</div>
                    <h1 className="text-3xl font-bold text-white">Assessment Builder</h1>
                    <p className="text-white/70">Add questions to your assessment. Preview the form on the right.</p>
                </div>
                <button onClick={handleSave} className="px-6 py-2 bg-white text-[#1f2937] rounded-md hover:bg-white/90">
                    Save Assessment
                </button>
            </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
  {/* Add Question Pane */}
  <div className="bg-[#1f2937] border border-[#1f2937] rounded-lg shadow-sm p-4 sm:p-6">
    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Add Question</h3>

    {/* Question Type Tabs */}
    <div className="flex flex-wrap gap-2 border-b border-white/10 mb-6 pb-2">
      {questionTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => setNewQuestionType(type.value)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 border-b-2 text-sm sm:text-base font-medium transition-colors ${
            newQuestionType === type.value
              ? "border-white text-white"
              : "border-transparent text-white/70 hover:text-white"
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>

    {/* Question Input */}
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white">
          Question
        </label>
        <input
          type="text"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          placeholder="e.g., What is your favorite programming language?"
          className="mt-1 block w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-white shadow-sm text-sm sm:text-base py-2 px-4"
        />
      </div>

      {/* Options Field */}
      {newQuestionType.includes("choice") && (
        <div>
          <label className="block text-sm font-medium text-white">
            Options
          </label>
          <input
            type="text"
            value={newQuestionOptions}
            onChange={(e) => setNewQuestionOptions(e.target.value)}
            placeholder="Enter options separated by commas: JavaScript, Python, Rust"
            className="mt-1 block w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-white shadow-sm text-sm sm:text-base py-2 px-4"
          />
        </div>
      )}

      <button
        onClick={handleAddQuestion}
        className="w-full px-4 py-2 bg-white text-[#1f2937] rounded-md hover:bg-white/90 text-sm sm:text-base"
      >
        Add Question
      </button>
    </div>

    {/* Questions List */}
    <div className="mt-8 space-y-4">
      {questions.map((q, index) => (
        <div
          key={q.id}
          className="bg-[#1f2937] p-4 rounded-md border border-[#1f2937] space-y-2 text-white"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm sm:text-base">
              Question {index + 1}: {q.text}
            </span>
            <button
              onClick={() =>
                setQuestions(questions.filter((item) => item.id !== q.id))
              }
              className="text-white/80 hover:text-white"
            >
              <FaTrash />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-white/70">Type: {q.type}</p>

          {/* Choices */}
          {q.type.includes("choice") && (
            <div className="space-y-2">
              {q.options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  className="flex items-center gap-2 min-w-0"
                >
						<input
                    type="text"
                    value={option}
							onChange={(e) => handleOptionChange(q.id, oIndex, e.target.value)}
                    className="flex-grow min-w-0 rounded-md border border-[#1f2937] bg-[#6383b0] text-white shadow-sm text-xs sm:text-sm py-2 px-4"
                  />
                  <button
                    onClick={() => handleRemoveOption(q.id, oIndex)}
                    className="text-white/80 hover:text-white"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddOption(q.id)}
                className="text-white text-sm hover:underline"
              >
                + Add Option
              </button>
            </div>
          )}

          {/* Numeric Range */}
          {q.type === "numeric-range" && (
            <div className="flex gap-2 text-xs sm:text-sm">
              <input
                type="number"
                placeholder="Min"
                value={q.validation.min || ""}
                onChange={(e) =>
                  handleValidationChange(q.id, "min", e.target.value)
                }
                className="w-1/2 rounded-md border border-[#1f2937] bg-[#6383b0] text-white"
              />
              <input
                type="number"
                placeholder="Max"
                value={q.validation.max || ""}
                onChange={(e) =>
                  handleValidationChange(q.id, "max", e.target.value)
                }
                className="w-1/2 rounded-md border border-[#1f2937] bg-[#6383b0] text-white"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>

  {/* Preview Pane */}
  <div className="bg-[#1f2937] p-4 sm:p-8 rounded-lg shadow-sm border border-[#1f2937] text-white">
    <h3 className="text-md sm:text-md font-semibold mb-4">
      Assessment Preview
    </h3>
    <AssessmentPreview questions={questions} />
  </div>
</div>

        </div>
    );
};

export default AssessmentBuilderDialog;