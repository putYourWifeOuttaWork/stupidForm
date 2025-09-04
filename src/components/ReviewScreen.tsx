import React from 'react';
import { wizardSteps } from '../data/formConfig';
import { FormData } from '../hooks/useFormData';
import { Question } from '../types/assessment'; // Assuming Question type is exported

interface ReviewScreenProps {
  formData: FormData;
  onConfirm: () => void;
  onEdit: (stepIndex: number) => void; // Allows editing a specific step
  isSubmitting?: boolean;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ formData, onConfirm, onEdit, isSubmitting }) => {
  const getFileName = (url: string, index: number): string => {
    const fileName = url.split('/').pop()?.split('_').slice(1).join('_');
    return fileName || `File ${index + 1}`;
  };

  const getAnswerDisplay = (question: Question, value: any) => {
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      return <span className="text-gray-500 italic">Not answered</span>;
    }

    switch (question.type) {
      case 'multiselect':
      case 'checkbox':
        return Array.isArray(value) ? value.join(', ') : String(value);
      case 'file':
        return Array.isArray(value) ? (
          <ul className="list-disc list-inside">
            {value.map((url: string, index: number) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#11b981] hover:underline">
                  {getFileName(url, index)}
                </a>
              </li>
            ))}
          </ul>
        ) : String(value);
      case 'slider':
        // Special handling for 'loss_percentage' which is now a text input but was a slider
        if (question.id === 'loss_percentage') {
          return `${value}%`;
        }
        return String(value);
      case 'text':
      case 'email':
      case 'textarea':
      case 'select':
      case 'radio':
        return String(value);
      default:
        return String(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] via-white to-[#c3defe] flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Review Your Answers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please review your responses carefully before submitting.
          </p>
        </div>

        <div id="review-content" className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-left mb-8 print:shadow-none print:border-0">
          {wizardSteps.map((step, stepIndex) => (
            <div key={step.id} className="mb-8 pb-4 border-b border-gray-200 last:border-b-0 print:mb-4 print:pb-2">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 print:text-xl print:mb-2">{step.title}</h2>
              {step.sections.map((section) => (
                <div key={section.id} className="mb-6 print:mb-3">
                  <h3 className="text-xl font-medium text-gray-700 mb-3 print:text-lg print:mb-1">{section.title}</h3>
                  <div className="space-y-4 print:space-y-1">
                    {section.questions.map((question) => (
                      <div key={question.id} className="flex flex-col sm:flex-row sm:items-start sm:gap-4 print:flex-row print:items-baseline print:gap-2">
                        <p className="font-medium text-gray-800 sm:w-1/3 print:w-1/3 print:text-sm">{question.label}:</p>
                        <div className="text-gray-600 sm:w-2/3 print:w-2/3 print:text-sm">
                          {getAnswerDisplay(question, formData[question.id])}
                          {formData[`${question.id}_context`] && (
                            <p className="text-sm text-gray-500 italic mt-1 print:mt-0">
                              Context: {formData[`${question.id}_context`]}
                            </p>
                          )}
                          {question.id === 'num_rooms' && formData.room_details && Array.isArray(formData.room_details) && formData.room_details.length > 0 && (
                            <div className="mt-2 space-y-1 print:mt-1 print:space-y-0.5">
                              <p className="font-medium text-gray-700 print:text-xs">Room Details:</p>
                              {formData.room_details.map((room: any, roomIndex: number) => (
                                <p key={roomIndex} className="text-sm text-gray-600 print:text-xs">
                                  Room {room.room_number}: {room.purpose} ({room.length_ft}ft x {room.width_ft}ft = {room.length_ft * room.width_ft} sq ft)
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="text-right mt-4 print:hidden">
                <button
                  onClick={() => onEdit(stepIndex + 1)} // Go to step number
                  className="text-[#11b981] hover:underline text-sm font-medium"
                >
                  Edit {step.title}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onEdit(1)} // Go back to the first step to edit
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200"
          >
            Go Back to Edit
          </button>
          
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-gradient-to-r from-[#38aa59] to-[#11b981] text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Confirm and Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;