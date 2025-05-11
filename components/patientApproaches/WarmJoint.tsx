import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clipboard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function JointAssessmentApp() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Define the questions in a logical clinical framework
  const questions = [
    {
      id: 'introduction',
      type: 'info',
      title: 'Painful Warm Joint Assessment',
      content:
        'This app will guide you through questions about your joint pain. If you have severe symptoms, please seek immediate medical attention.',
      alarmCheck: false,
    },
    {
      id: 'joint-location',
      type: 'select',
      question: 'Which joint is painful or warm?',
      options: [
        'Knee',
        'Shoulder',
        'Elbow',
        'Wrist',
        'Ankle',
        'Hip',
        'Finger joint',
        'Toe joint',
        'Other',
      ],
      alarmCheck: false,
    },
    {
      id: 'onset',
      type: 'select',
      question: 'How quickly did the pain or swelling develop?',
      options: ['Suddenly (within hours)', 'Gradually (over days or weeks)'],
      alarmCheck: false,
    },
    // ALARM FEATURES - assessed early
    {
      id: 'fever',
      type: 'boolean',
      question: 'Do you have a fever (temperature above 38°C/100.4°F)?',
      alarmCheck: true,
      alarmMessage:
        'Fever with joint pain may indicate an infection requiring immediate attention.',
    },
    {
      id: 'unable-to-move',
      type: 'boolean',
      question: 'Are you completely unable to move the joint?',
      alarmCheck: true,
      alarmMessage:
        'Complete inability to move a joint with pain may require urgent evaluation.',
    },
    {
      id: 'redness-warmth',
      type: 'boolean',
      question: 'Is the joint red and warm to touch?',
      alarmCheck: true,
      alarmMessage:
        'Significant redness and warmth may indicate infection or severe inflammation.',
    },
    // Regular assessment continues
    {
      id: 'pain-severity',
      type: 'slider',
      question: 'On a scale of 0-10, how severe is your pain?',
      min: 0,
      max: 10,
      step: 1,
      alarmCheck: false,
    },
    {
      id: 'pain-quality',
      type: 'multiselect',
      question: 'How would you describe the pain?',
      options: ['Sharp', 'Dull/aching', 'Throbbing', 'Burning', 'Stabbing'],
      alarmCheck: false,
    },
    {
      id: 'swelling',
      type: 'boolean',
      question: 'Is there swelling in or around the joint?',
      alarmCheck: false,
    },
    {
      id: 'movement-limitations',
      type: 'select',
      question: 'How is your ability to move the joint affected?',
      options: [
        'Normal movement with pain',
        'Slightly limited movement',
        'Severely limited movement',
        'Cannot move joint at all',
      ],
      alarmCheck: false,
    },
    {
      id: 'pain-timing',
      type: 'multiselect',
      question: 'When is the pain worse?',
      options: [
        'In the morning',
        'During the day',
        'At night',
        'When moving the joint',
        'When resting',
        'All the time',
      ],
      alarmCheck: false,
    },
    {
      id: 'helps-pain',
      type: 'multiselect',
      question: 'What helps the pain?',
      options: [
        'Rest',
        'Ice',
        'Heat',
        'Elevation',
        'Over-the-counter pain medication',
        'Nothing helps',
      ],
      alarmCheck: false,
    },
    {
      id: 'previous-episodes',
      type: 'boolean',
      question: 'Have you had similar episodes in the past?',
      alarmCheck: false,
    },
    {
      id: 'medications',
      type: 'multiselect',
      question: 'What medications are you currently taking?',
      options: [
        'NSAIDs (e.g., ibuprofen, naproxen)',
        'Acetaminophen (e.g., Tylenol)',
        'Steroids',
        'Blood thinners',
        'Antibiotics',
        'Gout medication',
        'Other',
        'None',
      ],
      alarmCheck: false,
    },
    {
      id: 'medical-conditions',
      type: 'multiselect',
      question: 'Do you have any of these medical conditions?',
      options: [
        'Gout',
        'Rheumatoid arthritis',
        'Osteoarthritis',
        'Diabetes',
        'High blood pressure',
        'Previous joint injury',
        'Previous joint surgery',
        'None of these',
      ],
      alarmCheck: false,
    },
    {
      id: 'additional-info',
      type: 'textarea',
      question:
        'Is there anything else important you want to share about your symptoms?',
      alarmCheck: false,
    },
  ];

  // Function to handle responses
  const handleResponse = (value) => {
    const question = questions[currentStep];
    const updatedResponses = { ...responses, [question.id]: value };
    setResponses(updatedResponses);

    // Check if this is an alarm feature
    if (question.alarmCheck && value === true) {
      setShowEmergencyModal(true);
    } else {
      // Move to next question
      handleNext();
    }
  };

  // Functions to navigate
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleCopyResults = () => {
    const resultsText = Object.entries(responses)
      .map(([id, response]) => {
        const question = questions.find((q) => q.id === id);
        if (!question || question.type === 'info') return null;

        let responseText = '';
        if (Array.isArray(response)) {
          responseText = response.join(', ');
        } else if (typeof response === 'boolean') {
          responseText = response ? 'Yes' : 'No';
        } else {
          responseText = response.toString();
        }

        return `${question.question}: ${responseText}`;
      })
      .filter((item) => item !== null)
      .join('\n');

    navigator.clipboard
      .writeText(resultsText)
      .then(() => alert('Assessment results copied to clipboard!'))
      .catch((err) => console.error('Failed to copy: ', err));
  };

  // Calculate progress percentage
  const progress = Math.round((currentStep / (questions.length - 1)) * 100);

  // Render the current question
  const renderQuestion = () => {
    const question = questions[currentStep];

    if (!question) return null;

    switch (question.type) {
      case 'info':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{question.title}</h2>
            <p className="mb-6">{question.content}</p>
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center"
              onClick={handleNext}
            >
              Begin Assessment <ArrowRight className="ml-2" size={18} />
            </button>
          </div>
        );

      case 'select':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">{question.question}</h2>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 border rounded-lg hover:bg-blue-50 mb-2"
                  onClick={() => handleResponse(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">{question.question}</h2>
            <div className="flex space-x-3">
              <button
                className="flex-1 p-3 border rounded-lg bg-green-50 hover:bg-green-100"
                onClick={() => handleResponse(true)}
              >
                Yes
              </button>
              <button
                className="flex-1 p-3 border rounded-lg bg-red-50 hover:bg-red-100"
                onClick={() => handleResponse(false)}
              >
                No
              </button>
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">{question.question}</h2>
            <div className="mx-4">
              <input
                type="range"
                min={question.min}
                max={question.max}
                step={question.step}
                className="w-full"
                onChange={(e) => handleResponse(parseInt(e.target.value))}
              />
              <div className="flex justify-between mt-2">
                <span>No pain</span>
                <span>Worst pain</span>
              </div>
            </div>
          </div>
        );

      case 'multiselect':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">{question.question}</h2>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-blue-50 mb-2 cursor-pointer"
                  onClick={() => {
                    const current = responses[question.id] || [];
                    const updated = current.includes(option)
                      ? current.filter((item) => item !== option)
                      : [...current, option];

                    setResponses({ ...responses, [question.id]: updated });
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded border ${
                        responses[question.id]?.includes(option)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      } mr-3`}
                    >
                      {responses[question.id]?.includes(option) && (
                        <CheckCircle className="text-white" size={20} />
                      )}
                    </div>
                    {option}
                  </div>
                </div>
              ))}
              <button
                className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4"
                onClick={handleNext}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">{question.question}</h2>
            <textarea
              className="w-full h-32 p-3 border rounded-lg"
              onChange={(e) =>
                setResponses({ ...responses, [question.id]: e.target.value })
              }
              value={responses[question.id] || ''}
            ></textarea>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4"
              onClick={handleNext}
            >
              Continue
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Render the summary screen
  const renderSummary = () => {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Assessment Summary</h2>

        {questions.map((question, index) => {
          if (question.type === 'info') return null;

          const response = responses[question.id];
          if (!response) return null;

          let displayResponse = '';
          if (Array.isArray(response)) {
            displayResponse = response.join(', ');
          } else if (typeof response === 'boolean') {
            displayResponse = response ? 'Yes' : 'No';
          } else {
            displayResponse = response.toString();
          }

          return (
            <div key={index} className="mb-4 pb-4 border-b">
              <p className="font-medium">{question.question}</p>
              <p className="text-gray-700">{displayResponse}</p>
            </div>
          );
        })}

        <div className="flex space-x-3 mt-6">
          <button
            className="flex-1 p-3 border rounded-lg flex items-center justify-center"
            onClick={() => setSubmitted(false)}
          >
            <ChevronLeft size={18} className="mr-2" /> Edit
          </button>
          <button
            className="flex-1 bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center"
            onClick={handleCopyResults}
          >
            <Clipboard size={18} className="mr-2" /> Copy Results
          </button>
        </div>
      </div>
    );
  };

  // Render the emergency warning modal
  const renderEmergencyModal = () => {
    if (!showEmergencyModal) return null;

    const currentQuestion = questions[currentStep];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center mb-4 text-red-600">
            <AlertTriangle size={24} className="mr-2" />
            <h2 className="text-xl font-bold">Warning</h2>
          </div>

          <p className="mb-6">{currentQuestion.alarmMessage}</p>
          <p className="mb-6 font-bold">
            Consider seeking immediate medical attention.
          </p>

          <div className="flex space-x-3">
            <button
              className="flex-1 bg-gray-200 p-3 rounded-lg"
              onClick={() => {
                setShowEmergencyModal(false);
                handleNext();
              }}
            >
              Continue Assessment
            </button>
            <button
              className="flex-1 bg-red-600 text-white p-3 rounded-lg"
              onClick={() => {
                setShowEmergencyModal(false);
                setSubmitted(true);
              }}
            >
              End Assessment
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Joint Pain Assessment</h1>
      </div>

      {/* Progress bar */}
      {!submitted && (
        <div className="px-4 py-2 bg-white">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Start</span>
            <span>{progress}%</span>
            <span>Complete</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 p-4">
        {submitted ? renderSummary() : renderQuestion()}
      </div>

      {/* Navigation buttons */}
      {!submitted &&
        currentStep > 0 &&
        questions[currentStep].type !== 'multiselect' &&
        questions[currentStep].type !== 'textarea' && (
          <div className="p-4 bg-white border-t">
            <div className="flex space-x-3">
              <button
                className="flex-1 p-3 border rounded-lg flex items-center justify-center"
                onClick={handlePrevious}
              >
                <ChevronLeft size={18} className="mr-2" /> Back
              </button>
              {questions[currentStep].type !== 'select' &&
                questions[currentStep].type !== 'boolean' && (
                  <button
                    className="flex-1 bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center"
                    onClick={handleNext}
                  >
                    Next <ChevronRight size={18} className="ml-2" />
                  </button>
                )}
            </div>
          </div>
        )}

      {/* Emergency modal */}
      {renderEmergencyModal()}
    </div>
  );
}
