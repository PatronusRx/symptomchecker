import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Clipboard,
  Heart,
  AlertCircle,
  CheckCircle,
  Home,
} from 'lucide-react';

export default function PalpitationsAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [emergencyWarning, setEmergencyWarning] = useState(false);

  // Questions organized by section
  const questions = [
    // Welcome screen
    {
      type: 'welcome',
      title: 'Palpitations Assessment',
      content:
        'This tool will help you document your palpitation symptoms for your healthcare provider. It takes about 2-3 minutes to complete.',
    },
    // Alarm features (critical information first)
    {
      type: 'emergency_check',
      title: 'Emergency Check',
      question: 'Are you currently experiencing any of these symptoms?',
      options: [
        'Chest pain or pressure',
        'Severe shortness of breath',
        'Dizziness or feeling like you might faint',
        'Confusion or altered mental state',
        'None of the above',
      ],
      emergencyOptions: [0, 1, 2, 3],
    },
    // Onset
    {
      type: 'radio',
      title: 'Onset',
      question: 'When did you first experience these palpitations?',
      options: [
        'Within the last hour',
        'Today',
        'Yesterday',
        'Within the past week',
        'Within the past month',
        'Longer than a month ago',
      ],
    },
    {
      type: 'radio',
      title: 'Onset',
      question: 'How did the palpitations begin?',
      options: ['Suddenly', 'Gradually', "I'm not sure"],
    },
    // Quality
    {
      type: 'checkbox',
      title: 'Description',
      question:
        'How would you describe the palpitations? (Select all that apply)',
      options: [
        'Skipped beats',
        'Racing heartbeat',
        'Pounding',
        'Fluttering',
        'Flip-flopping',
        'Irregular rhythm',
        'Other',
      ],
    },
    // Severity
    {
      type: 'slider',
      title: 'Severity',
      question: 'On a scale of 1-10, how severe are the palpitations?',
      min: 1,
      max: 10,
    },
    // Duration
    {
      type: 'radio',
      title: 'Duration',
      question: 'How long do episodes typically last?',
      options: [
        'A few seconds',
        'Less than a minute',
        'Several minutes',
        'Hours',
        'Constant',
      ],
    },
    // Frequency
    {
      type: 'radio',
      title: 'Frequency',
      question: 'How often do you experience these palpitations?',
      options: [
        'This is the first time',
        'Daily',
        'Several times a week',
        'Weekly',
        'Monthly',
        'Less than monthly',
      ],
    },
    // Associated symptoms
    {
      type: 'checkbox',
      title: 'Associated Symptoms',
      question:
        'Do you experience any of these symptoms with the palpitations? (Select all that apply)',
      options: [
        'Shortness of breath',
        'Chest discomfort',
        'Dizziness/lightheadedness',
        'Fatigue',
        'Anxiety',
        'Sweating',
        'Nausea',
        'None of the above',
      ],
    },
    // Triggers
    {
      type: 'checkbox',
      title: 'Triggers',
      question:
        'Have you noticed anything that triggers your palpitations? (Select all that apply)',
      options: [
        'Exercise/physical activity',
        'Stress or anxiety',
        'Caffeine',
        'Alcohol',
        'Certain body positions',
        'After meals',
        'Medication',
        'None identified',
      ],
    },
    // Relief
    {
      type: 'checkbox',
      title: 'Relief',
      question: 'What helps relieve your palpitations? (Select all that apply)',
      options: [
        'Rest',
        'Deep breathing',
        'Changing position',
        'Drinking water',
        'Nothing helps',
        'They stop on their own',
        'Other',
      ],
    },
    // Impact
    {
      type: 'radio',
      title: 'Impact',
      question: 'How much do these palpitations affect your daily activities?',
      options: [
        'Not at all',
        'Slightly',
        'Moderately',
        'Significantly',
        'Unable to perform daily activities',
      ],
    },
    // Medical history
    {
      type: 'checkbox',
      title: 'Medical History',
      question: 'Do you have any of these conditions? (Select all that apply)',
      options: [
        'Heart disease',
        'High blood pressure',
        'Diabetes',
        'Thyroid disorder',
        'Anxiety',
        'None of the above',
      ],
    },
    // Medications
    {
      type: 'text',
      title: 'Medications',
      question: "Please list any medications you're currently taking:",
      placeholder: 'Enter medications here',
    },
    // Review
    {
      type: 'review',
      title: 'Review Your Responses',
    },
  ];

  const handleInputChange = (questionIndex, value) => {
    // For emergency check, show warning if needed
    if (questionIndex === 1 && questions[1].emergencyOptions.includes(value)) {
      setEmergencyWarning(true);
    }

    setResponses({
      ...responses,
      [questionIndex]: value,
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const copyToClipboard = () => {
    let text = 'PALPITATIONS ASSESSMENT RESULTS\n\n';

    questions.forEach((q, index) => {
      if (q.type !== 'welcome' && q.type !== 'review') {
        text += `${q.title}: ${q.question}\n`;

        if (responses[index] !== undefined) {
          if (Array.isArray(responses[index])) {
            const selectedOptions = responses[index]
              .map((i) => q.options[i])
              .join(', ');
            text += `Response: ${selectedOptions}\n\n`;
          } else if (q.type === 'slider') {
            text += `Response: ${responses[index]}/10\n\n`;
          } else if (q.type === 'text') {
            text += `Response: ${responses[index]}\n\n`;
          } else if (q.type === 'radio') {
            text += `Response: ${q.options[responses[index]]}\n\n`;
          } else if (q.type === 'emergency_check') {
            text += `Response: ${q.options[responses[index]]}\n\n`;
          }
        } else {
          text += 'Response: Not answered\n\n';
        }
      }
    });

    navigator.clipboard.writeText(text);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setResponses({});
    setSubmitted(false);
    setEmergencyWarning(false);
  };

  const renderQuestion = () => {
    const q = questions[currentStep];

    switch (q.type) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center text-center p-6">
            <Heart className="text-red-500 w-16 h-16 mb-4" />
            <h1 className="text-2xl font-bold mb-4">{q.title}</h1>
            <p className="mb-8">{q.content}</p>
            <button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center"
            >
              Begin Assessment
              <ChevronRight className="ml-2" />
            </button>
          </div>
        );

      case 'emergency_check':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{q.title}</h2>
            <p className="mb-4 text-red-600 font-medium">{q.question}</p>
            {q.options.map((option, i) => (
              <div key={i} className="mb-3">
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name={`question-${currentStep}`}
                    checked={responses[currentStep] === i}
                    onChange={() => handleInputChange(currentStep, i)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="ml-3">{option}</span>
                </label>
              </div>
            ))}
            {emergencyWarning && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-start">
                <AlertCircle className="w-6 h-6 mr-2 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold">Emergency Warning</p>
                  <p>
                    The symptoms you've selected may indicate a medical
                    emergency. Please call 911 or go to the nearest emergency
                    room immediately.
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{q.title}</h2>
            <p className="mb-4">{q.question}</p>
            {q.options.map((option, i) => (
              <div key={i} className="mb-3">
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name={`question-${currentStep}`}
                    checked={responses[currentStep] === i}
                    onChange={() => handleInputChange(currentStep, i)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="ml-3">{option}</span>
                </label>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{q.title}</h2>
            <p className="mb-4">{q.question}</p>
            {q.options.map((option, i) => (
              <div key={i} className="mb-3">
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    name={`question-${currentStep}-${i}`}
                    checked={responses[currentStep]?.includes(i) || false}
                    onChange={() => {
                      const currentSelections = responses[currentStep] || [];
                      let newSelections;
                      if (currentSelections.includes(i)) {
                        newSelections = currentSelections.filter(
                          (item) => item !== i
                        );
                      } else {
                        newSelections = [...currentSelections, i];
                      }
                      handleInputChange(currentStep, newSelections);
                    }}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="ml-3">{option}</span>
                </label>
              </div>
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{q.title}</h2>
            <p className="mb-4">{q.question}</p>
            <div className="flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-blue-600">
                {responses[currentStep] || 5}
              </span>
            </div>
            <div className="mb-4 px-2">
              <input
                type="range"
                min={q.min}
                max={q.max}
                value={responses[currentStep] || 5}
                onChange={(e) =>
                  handleInputChange(currentStep, parseInt(e.target.value))
                }
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{q.title}</h2>
            <p className="mb-4">{q.question}</p>
            <textarea
              value={responses[currentStep] || ''}
              onChange={(e) => handleInputChange(currentStep, e.target.value)}
              placeholder={q.placeholder}
              className="w-full h-32 p-3 border rounded-lg"
            />
          </div>
        );

      case 'review':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{q.title}</h2>
            <div className="border rounded-lg divide-y">
              {questions.map((question, index) => {
                if (question.type === 'welcome' || question.type === 'review')
                  return null;

                let responseText = 'Not answered';
                if (responses[index] !== undefined) {
                  if (Array.isArray(responses[index])) {
                    responseText = responses[index]
                      .map((i) => question.options[i])
                      .join(', ');
                  } else if (question.type === 'slider') {
                    responseText = `${responses[index]}/10`;
                  } else if (question.type === 'text') {
                    responseText = responses[index];
                  } else if (
                    question.type === 'radio' ||
                    question.type === 'emergency_check'
                  ) {
                    responseText = question.options[responses[index]];
                  }
                }

                return (
                  <div key={index} className="p-3">
                    <p className="font-semibold">{question.question}</p>
                    <p className="text-gray-600">{responseText}</p>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Submit Assessment
            </button>
          </div>
        );

      default:
        return <p>Unknown question type</p>;
    }
  };

  const renderProgressBar = () => {
    if (questions[currentStep].type === 'welcome') return null;

    const progress = Math.round((currentStep / (questions.length - 1)) * 100);

    return (
      <div className="w-full h-2 bg-gray-200">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  const renderNavButtons = () => {
    if (questions[currentStep].type === 'welcome') return null;

    return (
      <div className="flex justify-between p-4 border-t">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`p-2 rounded-full ${
            currentStep === 0
              ? 'text-gray-300'
              : 'text-blue-500 hover:bg-blue-50'
          }`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-sm text-gray-500">
          {currentStep} of {questions.length - 2}
        </div>
        <button
          onClick={handleNext}
          className="p-2 rounded-full text-blue-500 hover:bg-blue-50"
        >
          {currentStep === questions.length - 1 ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
        </button>
      </div>
    );
  };

  const renderCompletionScreen = () => {
    return (
      <div className="flex flex-col items-center text-center p-6">
        <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Assessment Complete</h1>
        <p className="mb-8">
          Thank you for completing the palpitations assessment. Your responses
          have been saved.
        </p>

        <button
          onClick={copyToClipboard}
          className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center"
        >
          <Clipboard className="mr-2 w-5 h-5" />
          Copy Results
        </button>

        <button
          onClick={resetForm}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg flex items-center justify-center"
        >
          <Home className="mr-2 w-5 h-5" />
          Return to Start
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto h-full bg-white shadow-lg rounded-xl overflow-hidden flex flex-col">
      {!submitted ? (
        <>
          {renderProgressBar()}
          <div className="flex-1 overflow-y-auto">{renderQuestion()}</div>
          {renderNavButtons()}
        </>
      ) : (
        renderCompletionScreen()
      )}
    </div>
  );
}
