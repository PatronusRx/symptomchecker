import { useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  Check,
  ArrowLeft,
  Copy,
  Info,
} from 'lucide-react';

export default function ThirdTrimesterBleedingApp() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [showEmergency, setShowEmergency] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Progress steps
  const steps = [
    'Emergency Check',
    'Bleeding Details',
    'Pain & Symptoms',
    'Timing',
    'Associated Symptoms',
    'Fetal Movement',
    'Review',
  ];

  // Emergency symptoms that require immediate medical attention
  const emergencySymptoms = [
    {
      id: 'heavyBleeding',
      label: 'Heavy bleeding (soaking 1 or more pads per hour)',
    },
    { id: 'severeAbdPain', label: 'Severe abdominal pain' },
    { id: 'rigidAbdomen', label: 'Rigid/board-like abdomen' },
    {
      id: 'rapidHeartbeat',
      label: 'Rapid heartbeat (above 120 beats per minute)',
    },
    { id: 'dizziness', label: 'Severe dizziness or fainting' },
    { id: 'decreasedMovement', label: 'Decreased or absent fetal movement' },
    { id: 'fever', label: 'Fever above 100.4°F/38°C' },
    { id: 'severeHeadache', label: 'Severe headache with visual changes' },
    { id: 'trauma', label: 'Recent trauma or injury to abdomen' },
  ];

  // Questions for each step
  const questionsForStep = {
    // Step 1: Emergency Check
    0: [
      {
        id: 'emergencyCheck',
        type: 'checkboxGroup',
        label: 'Do you have any of these emergency symptoms?',
        options: emergencySymptoms,
        note: 'Select all that apply. If none apply, continue without selecting any.',
      },
    ],
    // Step 2: Bleeding Details
    1: [
      {
        id: 'onsetTime',
        type: 'time',
        label: 'When did the bleeding begin?',
      },
      {
        id: 'onsetType',
        type: 'radio',
        label: 'How did the bleeding start?',
        options: [
          { id: 'sudden', label: 'Suddenly' },
          { id: 'gradual', label: 'Gradually' },
        ],
      },
      {
        id: 'bleedingColor',
        type: 'radio',
        label: 'What color is the blood?',
        options: [
          { id: 'brightRed', label: 'Bright red' },
          { id: 'darkRed', label: 'Dark red' },
          { id: 'brown', label: 'Brown/old blood' },
          { id: 'pink', label: 'Pink-tinged' },
        ],
      },
      {
        id: 'bleedingAmount',
        type: 'radio',
        label: 'How much are you bleeding?',
        options: [
          { id: 'spotting', label: 'Spotting (just when wiping)' },
          { id: 'light', label: 'Light (less than a period)' },
          { id: 'moderate', label: 'Moderate (like a period)' },
          { id: 'heavy', label: 'Heavy (more than a period)' },
        ],
      },
      {
        id: 'clots',
        type: 'radio',
        label: 'Are there any blood clots?',
        options: [
          { id: 'noClots', label: 'No clots' },
          { id: 'smallClots', label: 'Small clots' },
          { id: 'largeClots', label: 'Large clots' },
        ],
      },
    ],
    // Step 3: Pain & Symptoms
    2: [
      {
        id: 'abdPain',
        type: 'radio',
        label: 'Do you have abdominal pain?',
        options: [
          { id: 'noPain', label: 'No pain' },
          { id: 'mildPain', label: 'Mild pain' },
          { id: 'moderatePain', label: 'Moderate pain' },
          { id: 'severePain', label: 'Severe pain' },
        ],
      },
      {
        id: 'painLocation',
        type: 'checkboxGroup',
        label: 'Where is the pain located?',
        options: [
          { id: 'lowerAbd', label: 'Lower abdomen' },
          { id: 'upperAbd', label: 'Upper abdomen' },
          { id: 'back', label: 'Back' },
          { id: 'pelvic', label: 'Pelvic area' },
        ],
        conditional: (responses) =>
          responses.abdPain && responses.abdPain !== 'noPain',
      },
      {
        id: 'painFrequency',
        type: 'radio',
        label: 'How often does the pain occur?',
        options: [
          { id: 'constant', label: 'Constant' },
          { id: 'intermittent', label: 'Comes and goes' },
        ],
        conditional: (responses) =>
          responses.abdPain && responses.abdPain !== 'noPain',
      },
    ],
    // Step 4: Timing
    3: [
      {
        id: 'bleedingPattern',
        type: 'radio',
        label: 'Is the bleeding constant or intermittent?',
        options: [
          { id: 'constant', label: 'Constant' },
          { id: 'intermittent', label: 'Comes and goes' },
        ],
      },
      {
        id: 'gestationalAge',
        type: 'input',
        inputType: 'number',
        label: 'How many weeks pregnant are you?',
        placeholder: 'Enter number of weeks',
      },
      {
        id: 'previousEpisodes',
        type: 'radio',
        label: 'Have you had bleeding episodes earlier in this pregnancy?',
        options: [
          { id: 'yes', label: 'Yes' },
          { id: 'no', label: 'No' },
        ],
      },
    ],
    // Step 5: Associated Symptoms
    4: [
      {
        id: 'contractions',
        type: 'radio',
        label: 'Are you having contractions?',
        options: [
          { id: 'noContractions', label: 'No contractions' },
          { id: 'irregularContractions', label: 'Irregular contractions' },
          { id: 'regularContractions', label: 'Regular contractions' },
        ],
      },
      {
        id: 'contractionFrequency',
        type: 'input',
        inputType: 'number',
        label: 'How many minutes apart are the contractions?',
        placeholder: 'Enter minutes',
        conditional: (responses) =>
          responses.contractions && responses.contractions !== 'noContractions',
      },
      {
        id: 'waterBroken',
        type: 'radio',
        label: 'Has your water broken?',
        options: [
          { id: 'yes', label: 'Yes' },
          { id: 'maybe', label: 'Not sure' },
          { id: 'no', label: 'No' },
        ],
      },
      {
        id: 'otherSymptoms',
        type: 'checkboxGroup',
        label: 'Do you have any of these other symptoms?',
        options: [
          { id: 'nausea', label: 'Nausea or vomiting' },
          { id: 'dizziness', label: 'Dizziness' },
          { id: 'fatigue', label: 'Unusual fatigue' },
          { id: 'headache', label: 'Headache' },
          { id: 'visionChanges', label: 'Vision changes' },
        ],
      },
    ],
    // Step 6: Fetal Movement
    5: [
      {
        id: 'fetalMovement',
        type: 'radio',
        label: "How is your baby's movement?",
        options: [
          { id: 'normal', label: 'Normal movement' },
          { id: 'decreased', label: 'Decreased movement' },
          { id: 'absent', label: 'No movement in the last 2 hours' },
        ],
      },
      {
        id: 'lastMovement',
        type: 'time',
        label: 'When did you last feel the baby move?',
        conditional: (responses) =>
          responses.fetalMovement && responses.fetalMovement !== 'normal',
      },
      {
        id: 'kickCount',
        type: 'input',
        inputType: 'number',
        label: 'How many kicks have you felt in the last hour?',
        placeholder: 'Enter number of kicks',
        conditional: (responses) => responses.fetalMovement !== 'absent',
      },
    ],
    // Step 7: Review - handled separately
    6: [],
  };

  // Process and display emergency guidance if needed
  const checkForEmergencySymptoms = (responses) => {
    if (!responses.emergencyCheck) return false;

    const selectedEmergencies = Object.keys(responses.emergencyCheck).filter(
      (key) => responses.emergencyCheck[key]
    ).length;

    return selectedEmergencies > 0;
  };

  // Handle response changes
  const handleResponseChange = (questionId, value, optionId = null) => {
    const newResponses = { ...responses };

    if (optionId !== null) {
      // Handle checkbox groups
      if (!newResponses[questionId]) {
        newResponses[questionId] = {};
      }
      newResponses[questionId][optionId] = value;
    } else {
      // Handle other input types
      newResponses[questionId] = value;
    }

    setResponses(newResponses);

    // Check for emergencies after the first step
    if (currentStep === 0) {
      const hasEmergency = checkForEmergencySymptoms(newResponses);
      setShowEmergency(hasEmergency);
    }
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Submit the form
      setSubmitted(true);
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Copy responses to clipboard
  const copyResponses = () => {
    const formattedResponses = Object.entries(responses)
      .map(([key, value]) => {
        if (typeof value === 'object') {
          // Handle checkbox groups
          const selected = Object.entries(value)
            .filter(([_, checked]) => checked)
            .map(([option, _]) => option)
            .join(', ');
          return `${key}: ${selected || 'None selected'}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');

    navigator.clipboard
      .writeText(formattedResponses)
      .then(() => alert('Response copied to clipboard'))
      .catch((err) => console.error('Failed to copy: ', err));
  };

  // Render a question based on its type
  const renderQuestion = (question) => {
    // Check if question should be shown based on conditional logic
    if (question.conditional && !question.conditional(responses)) {
      return null;
    }

    switch (question.type) {
      case 'radio':
        return (
          <div className="mb-6" key={question.id}>
            <p className="font-medium mb-3">{question.label}</p>
            <div className="flex flex-col space-y-2">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    className="h-5 w-5 text-blue-600"
                    name={question.id}
                    value={option.id}
                    checked={responses[question.id] === option.id}
                    onChange={() =>
                      handleResponseChange(question.id, option.id)
                    }
                  />
                  <span className="ml-2">{option.label}</span>
                </label>
              ))}
            </div>
            {question.note && (
              <p className="text-sm text-gray-500 mt-2">{question.note}</p>
            )}
          </div>
        );

      case 'checkboxGroup':
        return (
          <div className="mb-6" key={question.id}>
            <p className="font-medium mb-3">{question.label}</p>
            <div className="flex flex-col space-y-2">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 rounded"
                    name={`${question.id}-${option.id}`}
                    checked={responses[question.id]?.[option.id] || false}
                    onChange={(e) =>
                      handleResponseChange(
                        question.id,
                        e.target.checked,
                        option.id
                      )
                    }
                  />
                  <span className="ml-2">{option.label}</span>
                </label>
              ))}
            </div>
            {question.note && (
              <p className="text-sm text-gray-500 mt-2">{question.note}</p>
            )}
          </div>
        );

      case 'input':
        return (
          <div className="mb-6" key={question.id}>
            <p className="font-medium mb-3">{question.label}</p>
            <input
              type={question.inputType || 'text'}
              className="w-full p-3 border rounded-lg"
              placeholder={question.placeholder || ''}
              value={responses[question.id] || ''}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
            />
          </div>
        );

      case 'time':
        return (
          <div className="mb-6" key={question.id}>
            <p className="font-medium mb-3">{question.label}</p>
            <input
              type="time"
              className="w-full p-3 border rounded-lg"
              value={responses[question.id] || ''}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Render emergency guidance
  const renderEmergencyGuidance = () => {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">
              Seek Medical Care Immediately
            </h3>
            <div className="mt-2 text-red-700">
              <p>Your symptoms may require urgent medical attention. Please:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Call your healthcare provider right away</li>
                <li>Go to the nearest emergency room</li>
                <li>Or call 911 if you cannot safely get to medical care</li>
              </ul>
              <p className="mt-2">
                Still complete this form to share with your healthcare provider,
                but do not delay seeking care.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render review step
  const renderReviewStep = () => {
    const sections = [
      {
        title: 'Bleeding Details',
        fields: [
          { id: 'onsetTime', label: 'Time bleeding began' },
          { id: 'onsetType', label: 'How bleeding started' },
          { id: 'bleedingColor', label: 'Blood color' },
          { id: 'bleedingAmount', label: 'Amount of bleeding' },
          { id: 'clots', label: 'Blood clots' },
        ],
      },
      {
        title: 'Pain & Symptoms',
        fields: [
          { id: 'abdPain', label: 'Abdominal pain' },
          { id: 'painLocation', label: 'Pain location', isCheckbox: true },
          { id: 'painFrequency', label: 'Pain frequency' },
        ],
      },
      {
        title: 'Timing',
        fields: [
          { id: 'bleedingPattern', label: 'Bleeding pattern' },
          { id: 'gestationalAge', label: 'Weeks pregnant' },
          { id: 'previousEpisodes', label: 'Previous bleeding episodes' },
        ],
      },
      {
        title: 'Associated Symptoms',
        fields: [
          { id: 'contractions', label: 'Contractions' },
          {
            id: 'contractionFrequency',
            label: 'Contraction frequency (minutes)',
          },
          { id: 'waterBroken', label: 'Water broken' },
          { id: 'otherSymptoms', label: 'Other symptoms', isCheckbox: true },
        ],
      },
      {
        title: 'Fetal Movement',
        fields: [
          { id: 'fetalMovement', label: "Baby's movement" },
          { id: 'lastMovement', label: 'Last felt movement' },
          { id: 'kickCount', label: 'Kicks in last hour' },
        ],
      },
    ];

    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Review Your Responses</h2>

        {showEmergency && renderEmergencyGuidance()}

        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="font-medium text-lg mb-2">{section.title}</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {section.fields.map((field) => {
                // Skip fields that don't have a response
                if (
                  !responses[field.id] ||
                  (typeof responses[field.id] === 'object' &&
                    Object.values(responses[field.id]).every((v) => !v))
                ) {
                  return null;
                }

                let displayValue;
                if (
                  field.isCheckbox &&
                  typeof responses[field.id] === 'object'
                ) {
                  const selected = Object.entries(responses[field.id])
                    .filter(([_, checked]) => checked)
                    .map(([option, _]) => option)
                    .join(', ');
                  displayValue = selected || 'None';
                } else {
                  displayValue = responses[field.id];
                }

                return (
                  <div
                    key={field.id}
                    className="py-2 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-600">{field.label}</span>
                      <span className="font-medium">{displayValue}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render submission confirmation
  const renderSubmissionConfirmation = () => {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Information Submitted</h2>
        <p className="text-gray-600 mb-6">
          Your symptom information has been saved. Please share this with your
          healthcare provider.
        </p>

        {showEmergency && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="font-medium text-red-800">Emergency Warning</h3>
                <p className="text-red-700 mt-1">
                  You've indicated emergency symptoms. Please seek immediate
                  medical care.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          className="flex items-center justify-center w-full py-3 bg-blue-600 text-white rounded-lg font-medium mb-4"
          onClick={copyResponses}
        >
          <Copy className="h-5 w-5 mr-2" />
          Copy Your Responses
        </button>

        <button
          className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium"
          onClick={() => {
            setCurrentStep(0);
            setResponses({});
            setShowEmergency(false);
            setSubmitted(false);
          }}
        >
          Start New Report
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {!submitted ? (
        <>
          {/* App Header */}
          <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
            <h1 className="text-xl font-semibold">
              Third Trimester Bleeding Tracker
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="px-4 pt-4">
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>
                Step {currentStep + 1}/{steps.length}
              </span>
              <span>{steps[currentStep]}</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4">
            {/* Emergency Alert */}
            {showEmergency && renderEmergencyGuidance()}

            {/* Step Content */}
            {currentStep < 6 ? (
              <div>
                {questionsForStep[currentStep].map((question) =>
                  renderQuestion(question)
                )}
              </div>
            ) : (
              renderReviewStep()
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex space-x-4">
              {currentStep > 0 && (
                <button
                  className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 flex-1"
                  onClick={goToPreviousStep}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </button>
              )}
              <button
                className="flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg font-medium flex-1"
                onClick={goToNextStep}
              >
                {currentStep < 6 ? (
                  <>
                    Next
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>

            {/* Info Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-start text-sm text-gray-600">
                <Info className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <p>
                  This tool is for information gathering only. Always consult
                  with your healthcare provider about any concerns during
                  pregnancy.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Submission confirmation screen
        <div className="p-4">{renderSubmissionConfirmation()}</div>
      )}
    </div>
  );
}
