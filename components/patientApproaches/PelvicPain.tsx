import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Copy,
  AlertTriangle,
  Info,
} from 'lucide-react';

export default function PelvicPainTracker() {
  // State for tracking current step and user responses
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [emergencyWarning, setEmergencyWarning] = useState(false);

  // Define the steps for progressive disclosure
  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Pelvic Pain Tracker',
      type: 'info',
      content:
        'This app will help you document your pelvic pain symptoms for your healthcare provider. Please answer the questions as accurately as possible.',
    },
    {
      id: 'emergency-screening',
      title: 'Emergency Screening',
      type: 'emergency',
      content: "Let's check for any urgent symptoms first.",
      questions: [
        {
          id: 'severe-pain',
          text: 'Are you experiencing severe, sudden onset pain?',
          type: 'yes-no',
        },
        {
          id: 'syncope',
          text: 'Have you fainted or felt like you might faint?',
          type: 'yes-no',
        },
        {
          id: 'fever',
          text: 'Do you have a high fever (over 101.3°F/38.5°C)?',
          type: 'yes-no',
        },
        {
          id: 'bleeding',
          text: 'Are you experiencing significant vaginal bleeding?',
          type: 'yes-no',
        },
      ],
    },
    {
      id: 'pain-onset',
      title: 'Pain Onset',
      type: 'question',
      content: 'Tell us about when your pain began.',
      questions: [
        {
          id: 'onset-type',
          text: 'How did your pain begin?',
          type: 'single-select',
          options: ['Sudden onset', 'Gradual onset'],
        },
        {
          id: 'onset-date',
          text: 'When did your pain start?',
          type: 'date',
        },
        {
          id: 'precipitating-factors',
          text: 'Was there anything that may have triggered the pain?',
          type: 'multi-select',
          options: [
            'Trauma/injury',
            'Activity',
            'Position change',
            'After intercourse',
            'After urination',
            'After bowel movement',
            'After eating',
            'Spontaneous (no trigger)',
            'Other',
          ],
        },
      ],
    },
    {
      id: 'pain-quality',
      title: 'Pain Description',
      type: 'question',
      content: 'Help us understand what your pain feels like.',
      questions: [
        {
          id: 'pain-description',
          text: 'How would you describe your pain? (Select all that apply)',
          type: 'multi-select',
          options: [
            'Sharp',
            'Dull',
            'Aching',
            'Burning',
            'Cramping',
            'Stabbing',
            'Pressure',
            'Throbbing',
            'Tearing',
            'Colicky',
            'Other',
          ],
        },
        {
          id: 'pain-severity',
          text: 'How severe is your pain on a scale of 0-10?',
          type: 'slider',
          min: 0,
          max: 10,
        },
      ],
    },
    {
      id: 'pain-location',
      title: 'Pain Location',
      type: 'question',
      content: 'Where is your pain located?',
      questions: [
        {
          id: 'primary-location',
          text: 'Where is the main location of your pain?',
          type: 'single-select',
          options: [
            'Lower abdomen',
            'Right lower abdomen',
            'Left lower abdomen',
            'Suprapubic (above pubic bone)',
            'Groin',
            'Perineum',
            'Vagina',
            'Rectum',
            'Other',
          ],
        },
        {
          id: 'radiation',
          text: 'Does your pain spread to other areas?',
          type: 'multi-select',
          options: [
            'Back',
            'Thighs',
            'Genitals',
            'Rectum',
            'Other',
            'No radiation',
          ],
        },
      ],
    },
    {
      id: 'timing',
      title: 'Pain Timing',
      type: 'question',
      content: 'Tell us about the timing of your pain.',
      questions: [
        {
          id: 'pain-pattern',
          text: 'How would you describe the pattern of your pain?',
          type: 'single-select',
          options: [
            'Constant (always present)',
            'Intermittent (comes and goes)',
            'Cyclical (related to menstrual cycle)',
          ],
        },
        {
          id: 'duration',
          text: 'How long do episodes of pain typically last?',
          type: 'single-select',
          options: ['Seconds', 'Minutes', 'Hours', 'Days', 'Constant'],
        },
        {
          id: 'frequency',
          text: 'How often do you experience this pain?',
          type: 'single-select',
          options: [
            'Multiple times per day',
            'Daily',
            'Several times per week',
            'Weekly',
            'Monthly',
            'Less than monthly',
          ],
        },
      ],
    },
    {
      id: 'aggravating-factors',
      title: 'Aggravating Factors',
      type: 'question',
      content: 'What makes your pain worse?',
      questions: [
        {
          id: 'worsening-factors',
          text: 'Select factors that make your pain worse:',
          type: 'multi-select',
          options: [
            'Movement',
            'Specific positions',
            'Sexual intercourse',
            'Urination',
            'Bowel movements',
            'Menstruation',
            'Eating',
            'Stress',
            'Other',
            'Nothing specific',
          ],
        },
      ],
    },
    {
      id: 'relieving-factors',
      title: 'Relieving Factors',
      type: 'question',
      content: 'What makes your pain better?',
      questions: [
        {
          id: 'relief-factors',
          text: 'Select factors that relieve your pain:',
          type: 'multi-select',
          options: [
            'Rest',
            'Specific positions',
            'Heat application',
            'Cold application',
            'Over-the-counter medications',
            'Prescription medications',
            'Bowel movement',
            'Urination',
            'Other',
            'Nothing helps',
          ],
        },
      ],
    },
    {
      id: 'associated-symptoms',
      title: 'Associated Symptoms',
      type: 'question',
      content: 'Are you experiencing any other symptoms?',
      questions: [
        {
          id: 'urinary-symptoms',
          text: 'Are you experiencing any urinary symptoms?',
          type: 'multi-select',
          options: [
            'Frequent urination',
            'Urgent need to urinate',
            'Pain with urination',
            'Blood in urine',
            'Leaking urine',
            'Other',
            'No urinary symptoms',
          ],
        },
        {
          id: 'gi-symptoms',
          text: 'Are you experiencing any digestive symptoms?',
          type: 'multi-select',
          options: [
            'Nausea',
            'Vomiting',
            'Diarrhea',
            'Constipation',
            'Bloating',
            'Changes in bowel habits',
            'Blood in stool',
            'Other',
            'No digestive symptoms',
          ],
        },
        {
          id: 'gyn-symptoms',
          text: 'Are you experiencing any gynecological symptoms?',
          type: 'multi-select',
          options: [
            'Vaginal discharge',
            'Abnormal vaginal bleeding',
            'Pain with intercourse',
            'Painful periods',
            'Other',
            'No gynecological symptoms',
          ],
        },
      ],
    },
    {
      id: 'review',
      title: 'Review Your Responses',
      type: 'review',
      content: 'Please review your responses before submitting.',
    },
  ];

  // Handle response changes
  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });

    // Check for emergency conditions
    if (
      (questionId === 'severe-pain' ||
        questionId === 'syncope' ||
        questionId === 'fever' ||
        questionId === 'bleeding') &&
      value === 'Yes'
    ) {
      setEmergencyWarning(true);
    }
  };

  // Handle navigation
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle copy to clipboard
  const copyResponses = () => {
    // In a real app, this would copy the formatted responses to clipboard
    alert('Responses copied to clipboard!');
  };

  // Render input based on question type
  const renderQuestionInput = (question) => {
    switch (question.type) {
      case 'yes-no':
        return (
          <div className="flex flex-col space-y-2 mt-2">
            <button
              className={`p-3 border rounded-lg ${
                responses[question.id] === 'Yes'
                  ? 'bg-blue-100 border-blue-500'
                  : 'border-gray-300'
              }`}
              onClick={() => handleResponseChange(question.id, 'Yes')}
            >
              Yes
            </button>
            <button
              className={`p-3 border rounded-lg ${
                responses[question.id] === 'No'
                  ? 'bg-blue-100 border-blue-500'
                  : 'border-gray-300'
              }`}
              onClick={() => handleResponseChange(question.id, 'No')}
            >
              No
            </button>
          </div>
        );
      case 'single-select':
        return (
          <div className="flex flex-col space-y-2 mt-2">
            {question.options.map((option) => (
              <button
                key={option}
                className={`p-3 border rounded-lg text-left ${
                  responses[question.id] === option
                    ? 'bg-blue-100 border-blue-500'
                    : 'border-gray-300'
                }`}
                onClick={() => handleResponseChange(question.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'multi-select':
        return (
          <div className="flex flex-col space-y-2 mt-2">
            {question.options.map((option) => {
              const isSelected =
                responses[question.id] &&
                Array.isArray(responses[question.id]) &&
                responses[question.id].includes(option);

              return (
                <button
                  key={option}
                  className={`p-3 border rounded-lg text-left flex justify-between items-center ${
                    isSelected
                      ? 'bg-blue-100 border-blue-500'
                      : 'border-gray-300'
                  }`}
                  onClick={() => {
                    const currentSelections = responses[question.id] || [];
                    let newSelections;

                    if (isSelected) {
                      newSelections = currentSelections.filter(
                        (item) => item !== option
                      );
                    } else {
                      newSelections = [...currentSelections, option];
                    }

                    handleResponseChange(question.id, newSelections);
                  }}
                >
                  {option}
                  {isSelected && <Check size={18} className="text-blue-500" />}
                </button>
              );
            })}
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            className="w-full p-3 border rounded-lg mt-2"
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
          />
        );
      case 'slider':
        const value = responses[question.id] || 0;
        return (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span>No pain</span>
              <span>Worst pain</span>
            </div>
            <input
              type="range"
              min={question.min}
              max={question.max}
              value={value}
              className="w-full"
              onChange={(e) =>
                handleResponseChange(question.id, parseInt(e.target.value))
              }
            />
            <div className="text-center text-xl font-bold mt-2">{value}</div>
          </div>
        );
      default:
        return <div>Unsupported question type</div>;
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    const step = steps[currentStep];

    if (step.type === 'info') {
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">{step.title}</h2>
          <p className="mb-6">{step.content}</p>
          <div className="flex justify-center">
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium flex items-center"
              onClick={goToNextStep}
            >
              Get Started <ChevronRight size={20} className="ml-1" />
            </button>
          </div>
        </div>
      );
    }

    if (step.type === 'emergency') {
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{step.title}</h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 flex items-start">
            <AlertTriangle
              size={20}
              className="text-amber-500 mr-2 flex-shrink-0 mt-1"
            />
            <p className="text-sm">{step.content}</p>
          </div>

          {emergencyWarning && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <h3 className="font-bold text-red-700">Emergency Warning</h3>
              <p className="text-sm text-red-700">
                Your symptoms suggest you may need immediate medical attention.
                Please contact your healthcare provider right away or go to the
                nearest emergency room.
              </p>
              <p className="text-sm text-red-700 mt-2">
                You can still continue with this assessment to share with your
                provider.
              </p>
            </div>
          )}

          {step.questions.map((question) => (
            <div key={question.id} className="mb-6">
              <h3 className="font-medium mb-2">{question.text}</h3>
              {renderQuestionInput(question)}
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center"
              onClick={goToPreviousStep}
            >
              <ChevronLeft size={18} className="mr-1" /> Back
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
              onClick={goToNextStep}
            >
              Continue <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
        </div>
      );
    }

    if (step.type === 'question') {
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{step.title}</h2>
          <p className="mb-4 text-gray-600">{step.content}</p>

          {step.questions.map((question) => (
            <div key={question.id} className="mb-6">
              <h3 className="font-medium mb-2">{question.text}</h3>
              {renderQuestionInput(question)}
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center"
              onClick={goToPreviousStep}
            >
              <ChevronLeft size={18} className="mr-1" /> Back
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
              onClick={goToNextStep}
            >
              Continue <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
        </div>
      );
    }

    if (step.type === 'review') {
      // Create a summary of responses
      const responseSummary = Object.entries(responses).map(
        ([questionId, value]) => {
          // Find the question text for this response
          let questionText = '';
          let questionType = '';

          for (const step of steps) {
            if (step.questions) {
              const question = step.questions.find((q) => q.id === questionId);
              if (question) {
                questionText = question.text;
                questionType = question.type;
                break;
              }
            }
          }

          // Format the response value based on type
          let formattedValue = value;
          if (Array.isArray(value)) {
            formattedValue = value.join(', ');
          } else if (questionType === 'slider') {
            formattedValue = `${value}/10`;
          }

          return { questionText, value: formattedValue };
        }
      );

      return (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{step.title}</h2>
          <p className="mb-4 text-gray-600">{step.content}</p>

          <div className="border rounded-lg divide-y">
            {responseSummary.map((item, index) => (
              <div key={index} className="p-3">
                <h4 className="font-medium text-gray-700">
                  {item.questionText}
                </h4>
                <p className="text-gray-900">{item.value || 'No response'}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center"
              onClick={goToPreviousStep}
            >
              <ChevronLeft size={18} className="mr-1" /> Back
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center"
              onClick={goToNextStep}
            >
              Submit <Check size={18} className="ml-1" />
            </button>
          </div>
        </div>
      );
    }

    return <div>Unknown step type</div>;
  };

  // Render submission confirmation
  const renderSubmissionConfirmation = () => {
    return (
      <div className="p-4 flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-center mb-2">
          Submission Complete
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Your pelvic pain assessment has been successfully recorded. Your
          healthcare provider will review this information.
        </p>

        <button
          className="px-4 py-2 border border-gray-300 rounded-lg flex items-center mb-4"
          onClick={copyResponses}
        >
          <Copy size={18} className="mr-2" /> Copy Responses
        </button>

        {emergencyWarning && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full">
            <h3 className="font-bold text-red-700">Emergency Warning</h3>
            <p className="text-sm text-red-700">
              Your symptoms suggest you may need immediate medical attention.
              Please contact your healthcare provider right away or go to the
              nearest emergency room.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Main render
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-white">Pelvic Pain Tracker</h1>
        <button className="text-white">
          <Info size={22} />
        </button>
      </div>

      {/* Progress bar */}
      {!submitted && (
        <div className="h-2 bg-gray-200">
          <div
            className="h-2 bg-blue-500 transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      )}

      {/* Main content */}
      <div className="min-h-screen">
        {submitted ? renderSubmissionConfirmation() : renderCurrentStep()}
      </div>
    </div>
  );
}
