import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Check,
  Copy,
  Info,
} from 'lucide-react';

export default function WristPainApp() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Define the sections and questions
  const steps = [
    {
      title: 'Emergency Assessment',
      subtitle: 'Check if you need immediate medical attention',
      questions: [
        {
          id: 'severe_injury',
          type: 'boolean',
          text: 'Have you had a severe injury like a fall or accident?',
          emergency: true,
        },
        {
          id: 'deformity',
          type: 'boolean',
          text: 'Is there a visible deformity in your wrist?',
          emergency: true,
        },
        {
          id: 'numbness_fingers',
          type: 'boolean',
          text: 'Do you have complete numbness in your fingers?',
          emergency: true,
        },
        {
          id: 'fever_redness',
          type: 'boolean',
          text: 'Do you have fever with increasing redness and warmth?',
          emergency: true,
        },
        {
          id: 'cant_move',
          type: 'boolean',
          text: 'Are you unable to move your wrist or fingers at all?',
          emergency: true,
        },
      ],
    },
    {
      title: 'Onset',
      subtitle: 'How and when your pain started',
      questions: [
        {
          id: 'onset_type',
          type: 'radio',
          text: 'How did your pain begin?',
          options: ['Suddenly', 'Gradually over time'],
        },
        { id: 'onset_date', type: 'date', text: 'When did your pain start?' },
        {
          id: 'injury',
          type: 'boolean',
          text: 'Was the pain from an injury or trauma?',
        },
        {
          id: 'activity_related',
          type: 'boolean',
          text: 'Did your pain start during a specific activity?',
        },
        {
          id: 'activity_type',
          type: 'text',
          text: 'What activity were you doing?',
          conditional: 'activity_related',
        },
      ],
    },
    {
      title: 'Pain Characteristics',
      subtitle: 'Describe your pain',
      questions: [
        {
          id: 'pain_quality',
          type: 'multiselect',
          text: 'How would you describe your pain?',
          options: [
            'Sharp',
            'Dull',
            'Aching',
            'Burning',
            'Throbbing',
            'Shooting',
            'Tingling',
            'Numbness',
            'Stiffness',
          ],
        },
        {
          id: 'pain_severity',
          type: 'slider',
          text: 'How severe is your pain?',
          labels: ['Mild (1-3)', 'Moderate (4-6)', 'Severe (7-10)'],
          min: 1,
          max: 10,
        },
        {
          id: 'pain_location',
          type: 'image_select',
          text: 'Where is your pain located?',
          options: [
            'Thumb side',
            'Center of wrist',
            'Pinky side',
            'Back of wrist',
            'Palm side of wrist',
          ],
        },
      ],
    },
    {
      title: 'Pain Patterns',
      subtitle: 'When your pain occurs and what affects it',
      questions: [
        {
          id: 'pain_timing',
          type: 'multiselect',
          text: 'When is your pain worst?',
          options: [
            'Morning',
            'Evening',
            'Night',
            'During activity',
            'After activity',
            'At rest',
          ],
        },
        {
          id: 'pain_constant',
          type: 'radio',
          text: 'Is your pain constant or does it come and go?',
          options: ['Constant', 'Intermittent'],
        },
        {
          id: 'frequency',
          type: 'text',
          text: 'How often does the pain occur?',
          conditional: 'pain_constant',
          conditionalValue: 'Intermittent',
        },
      ],
    },
    {
      title: 'Aggravating & Relieving Factors',
      subtitle: 'What makes your pain better or worse',
      questions: [
        {
          id: 'aggravates',
          type: 'multiselect',
          text: 'What makes your pain worse?',
          options: [
            'Wrist bending forward',
            'Wrist bending backward',
            'Twisting motion',
            'Gripping',
            'Typing/Writing',
            'Lifting objects',
          ],
        },
        {
          id: 'relieves',
          type: 'multiselect',
          text: 'What helps relieve your pain?',
          options: [
            'Rest',
            'Ice',
            'Heat',
            'Elevation',
            'Pain medication',
            'Wrist brace/splint',
          ],
        },
        {
          id: 'meds_used',
          type: 'text',
          text: "List any medications you've used for this pain:",
          conditional: 'relieves',
          conditionalValue: 'Pain medication',
        },
      ],
    },
    {
      title: 'Associated Symptoms',
      subtitle: 'Other symptoms you experience with your pain',
      questions: [
        {
          id: 'associated',
          type: 'multiselect',
          text: 'Do you have any of these along with your pain?',
          options: [
            'Swelling',
            'Bruising',
            'Clicking/popping sounds',
            'Weakness',
            'Limited motion',
            'Numbness/tingling',
          ],
        },
        {
          id: 'radiation',
          type: 'multiselect',
          text: 'Does your pain spread to other areas?',
          options: [
            'Fingers',
            'Hand',
            'Forearm',
            'Elbow',
            'Shoulder',
            'It stays in my wrist',
          ],
        },
        {
          id: 'fingers',
          type: 'multiselect',
          text: 'Which fingers?',
          conditional: 'radiation',
          conditionalValue: 'Fingers',
          options: [
            'Thumb',
            'Index finger',
            'Middle finger',
            'Ring finger',
            'Pinky finger',
          ],
        },
      ],
    },
    {
      title: 'Impact on Life',
      subtitle: 'How your pain affects your daily activities',
      questions: [
        {
          id: 'impact',
          type: 'radio',
          text: 'How much does your pain limit your daily activities?',
          options: [
            'Not at all',
            'Slightly limited',
            'Moderately limited',
            'Severely limited',
            'Cannot perform normal activities',
          ],
        },
        {
          id: 'activities_limited',
          type: 'multiselect',
          text: 'Which activities are affected by your pain?',
          options: [
            'Work/school',
            'Household chores',
            'Personal care',
            'Hobbies',
            'Sleep',
            'Exercise/sports',
          ],
        },
        {
          id: 'work_affect',
          type: 'text',
          text: 'How has your pain affected your work?',
          conditional: 'activities_limited',
          conditionalValue: 'Work/school',
        },
      ],
    },
    {
      title: 'Risk Factors',
      subtitle: 'Activities that may contribute to your wrist pain',
      questions: [
        { id: 'occupation', type: 'text', text: 'What is your occupation?' },
        {
          id: 'repetitive_activities',
          type: 'multiselect',
          text: 'Do you regularly perform any of these activities?',
          options: [
            'Typing/computer use',
            'Writing',
            'Assembly work',
            'Using vibrating tools',
            'Playing musical instruments',
            'Sports with wrist use',
          ],
        },
        {
          id: 'hours_activity',
          type: 'radio',
          text: 'How many hours per day do you spend on these activities?',
          options: [
            'Less than 1 hour',
            '1-3 hours',
            '4-6 hours',
            'More than 6 hours',
          ],
        },
        {
          id: 'ergonomics',
          type: 'boolean',
          text: 'Do you use ergonomic equipment (keyboard, mouse, tools)?',
        },
      ],
    },
    {
      title: 'Medical History',
      subtitle: 'Previous conditions that may relate to your wrist pain',
      questions: [
        {
          id: 'previous_wrist',
          type: 'multiselect',
          text: 'Have you previously been diagnosed with any of these?',
          options: [
            'Carpal tunnel syndrome',
            'Arthritis',
            'Tendonitis',
            'Ganglion cyst',
            'Wrist fracture',
            'Wrist sprain',
            'None of these',
          ],
        },
        {
          id: 'chronic_conditions',
          type: 'multiselect',
          text: 'Do you have any of these medical conditions?',
          options: [
            'Diabetes',
            'Rheumatoid arthritis',
            'Gout',
            'Thyroid disease',
            'Osteoporosis',
            'None of these',
          ],
        },
        {
          id: 'previous_treatment',
          type: 'multiselect',
          text: 'What treatments have you tried for wrist pain in the past?',
          options: [
            'Physical therapy',
            'Cortisone injection',
            'Wrist brace/splint',
            'Surgery',
            'Pain medication',
            'None',
          ],
        },
      ],
    },
    {
      title: 'Review Summary',
      subtitle: 'Review your responses before submission',
      review: true,
    },
  ];

  // Handle advancing to next step
  const handleNext = () => {
    // Check if any emergency conditions are true
    if (currentStep === 0) {
      const hasEmergency = steps[0].questions.some(
        (q) => responses[q.id] === true
      );
      if (hasEmergency) {
        setShowEmergencyInfo(true);
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      setSubmitted(true);
    }
  };

  // Handle going back to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle input changes
  const handleInputChange = (id, value) => {
    setResponses({
      ...responses,
      [id]: value,
    });
  };

  // Handle copy to clipboard
  const handleCopyResults = () => {
    const text = Object.entries(responses)
      .map(([key, value]) => {
        // Find the question text for this response
        const question = steps
          .flatMap((s) => s.questions || [])
          .find((q) => q.id === key);
        return question
          ? `${question.text}: ${
              Array.isArray(value) ? value.join(', ') : value
            }`
          : null;
      })
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Render the current step
  const renderStep = () => {
    const step = steps[currentStep];

    if (submitted) {
      return (
        <div className="p-6 bg-green-50 rounded-xl">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="text-green-600" size={32} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-2">
            Assessment Submitted
          </h2>
          <p className="text-center mb-6">
            Your wrist pain assessment has been successfully submitted. Your
            healthcare provider will review this information.
          </p>

          <button
            onClick={handleCopyResults}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4"
          >
            {copied ? 'Copied!' : 'Copy Results'}{' '}
            <Copy size={18} className="ml-2" />
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Bring these results to your next appointment</li>
              <li>Follow any treatment plan you've been given</li>
              <li>Contact your healthcare provider if your symptoms worsen</li>
            </ul>
          </div>
        </div>
      );
    }

    if (showEmergencyInfo) {
      return (
        <div className="p-6 bg-red-50 rounded-xl">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-2">
            Seek Medical Attention
          </h2>
          <p className="text-center mb-6">
            Based on your responses, you should seek immediate medical
            attention.
          </p>

          <div className="mt-4 p-4 bg-white rounded-lg">
            <h3 className="font-semibold mb-2">
              Your indicated emergency signs:
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {steps[0].questions
                .filter((q) => responses[q.id] === true)
                .map((q) => (
                  <li key={q.id}>{q.text}</li>
                ))}
            </ul>
          </div>

          <button
            onClick={() => setShowEmergencyInfo(false)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg mt-6"
          >
            Return to Assessment
          </button>

          <div className="mt-6 p-4 bg-red-100 rounded-lg">
            <h3 className="font-semibold mb-2">Options:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Call emergency services (911)</li>
              <li>Go to nearest emergency room</li>
              <li>Call your doctor for immediate guidance</li>
            </ul>
          </div>
        </div>
      );
    }

    if (step.review) {
      return (
        <div>
          <h2 className="text-xl font-bold mb-1">{step.title}</h2>
          <p className="text-gray-600 mb-4">{step.subtitle}</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            {steps.slice(0, steps.length - 1).map((section, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="font-semibold mb-2">{section.title}</h3>
                <div className="pl-2">
                  {section.questions &&
                    section.questions.map((q) => {
                      // Skip questions that wouldn't be shown due to conditional logic
                      if (
                        q.conditional &&
                        responses[q.conditional] !== q.conditionalValue &&
                        !(
                          Array.isArray(responses[q.conditional]) &&
                          responses[q.conditional]?.includes(q.conditionalValue)
                        )
                      ) {
                        return null;
                      }

                      const value = responses[q.id];
                      if (value === undefined || value === '') return null;

                      return (
                        <div key={q.id} className="mb-2">
                          <div className="text-sm text-gray-600">{q.text}</div>
                          <div className="font-medium">
                            {typeof value === 'boolean'
                              ? value
                                ? 'Yes'
                                : 'No'
                              : Array.isArray(value)
                              ? value.join(', ')
                              : value}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-xl font-bold mb-1">{step.title}</h2>
        <p className="text-gray-600 mb-4">{step.subtitle}</p>

        {step.questions &&
          step.questions.map((question) => {
            // Skip questions based on conditional logic
            if (
              question.conditional &&
              responses[question.conditional] !== question.conditionalValue &&
              !(
                Array.isArray(responses[question.conditional]) &&
                responses[question.conditional]?.includes(
                  question.conditionalValue
                )
              )
            ) {
              return null;
            }

            return (
              <div key={question.id} className="mb-6">
                <div className="flex justify-between">
                  <label className="block mb-2 font-medium">
                    {question.text}
                  </label>
                  {question.emergency && (
                    <div
                      onClick={() => setShowInfoModal(true)}
                      className="text-red-500 cursor-pointer flex items-center"
                    >
                      <AlertTriangle size={16} className="mr-1" />
                      <span className="text-sm">Emergency</span>
                    </div>
                  )}
                </div>

                {question.type === 'boolean' && (
                  <div className="flex space-x-4">
                    <button
                      className={`flex-1 py-2 px-4 rounded-lg border ${
                        responses[question.id] === true
                          ? 'bg-blue-100 border-blue-500'
                          : 'border-gray-300'
                      }`}
                      onClick={() => handleInputChange(question.id, true)}
                    >
                      Yes
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 rounded-lg border ${
                        responses[question.id] === false
                          ? 'bg-blue-100 border-blue-500'
                          : 'border-gray-300'
                      }`}
                      onClick={() => handleInputChange(question.id, false)}
                    >
                      No
                    </button>
                  </div>
                )}

                {question.type === 'text' && (
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={responses[question.id] || ''}
                    onChange={(e) =>
                      handleInputChange(question.id, e.target.value)
                    }
                    placeholder="Enter your answer"
                  />
                )}

                {question.type === 'date' && (
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={responses[question.id] || ''}
                    onChange={(e) =>
                      handleInputChange(question.id, e.target.value)
                    }
                  />
                )}

                {question.type === 'radio' && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        className={`w-full py-2 px-4 text-left rounded-lg border ${
                          responses[question.id] === option
                            ? 'bg-blue-100 border-blue-500'
                            : 'border-gray-300'
                        }`}
                        onClick={() => handleInputChange(question.id, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === 'multiselect' && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        className={`w-full py-2 px-4 text-left rounded-lg border ${
                          responses[question.id]?.includes(option)
                            ? 'bg-blue-100 border-blue-500'
                            : 'border-gray-300'
                        }`}
                        onClick={() => {
                          const currentValues = responses[question.id] || [];
                          if (currentValues.includes(option)) {
                            handleInputChange(
                              question.id,
                              currentValues.filter((v) => v !== option)
                            );
                          } else {
                            handleInputChange(question.id, [
                              ...currentValues,
                              option,
                            ]);
                          }
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === 'slider' && (
                  <div>
                    <input
                      type="range"
                      min={question.min || 0}
                      max={question.max || 10}
                      className="w-full"
                      value={responses[question.id] || 1}
                      onChange={(e) =>
                        handleInputChange(question.id, parseInt(e.target.value))
                      }
                    />
                    <div className="flex justify-between mt-1">
                      {question.labels &&
                        question.labels.map((label, idx) => (
                          <span key={idx} className="text-sm text-gray-600">
                            {label}
                          </span>
                        ))}
                    </div>
                    <div className="text-center font-bold mt-2">
                      Current: {responses[question.id] || 1}
                    </div>
                  </div>
                )}

                {question.type === 'image_select' && (
                  <div className="grid grid-cols-2 gap-3">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        className={`p-4 text-center rounded-lg border ${
                          responses[question.id]?.includes(option)
                            ? 'bg-blue-100 border-blue-500'
                            : 'border-gray-300'
                        }`}
                        onClick={() => {
                          const currentValues = responses[question.id] || [];
                          if (currentValues.includes(option)) {
                            handleInputChange(
                              question.id,
                              currentValues.filter((v) => v !== option)
                            );
                          } else {
                            handleInputChange(question.id, [
                              ...currentValues,
                              option,
                            ]);
                          }
                        }}
                      >
                        {/* Placeholder for where an image would go */}
                        <div className="w-full h-16 bg-gray-200 mb-2 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {option}
                          </span>
                        </div>
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* App Header */}
      <div className="bg-blue-600 p-4 text-white">
        <h1 className="text-xl font-bold">Wrist Pain Assessment</h1>
      </div>

      {/* Progress Bar */}
      <div className="bg-blue-100 h-2">
        <div
          className="bg-blue-600 h-full"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>

      {/* Step indicator */}
      <div className="bg-blue-50 px-4 py-2 text-sm text-blue-800">
        Step {currentStep + 1} of {steps.length}
      </div>

      {/* Content Area */}
      <div className="p-4">{renderStep()}</div>

      {/* Navigation Buttons */}
      {!submitted && !showEmergencyInfo && (
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`py-2 px-4 rounded-lg flex items-center ${
              currentStep === 0 ? 'text-gray-400' : 'text-blue-600'
            }`}
          >
            <ChevronLeft size={20} /> Back
          </button>

          <button
            onClick={handleNext}
            className="py-2 px-6 bg-blue-600 text-white rounded-lg flex items-center"
          >
            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}{' '}
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <Info className="text-blue-600 mr-2" size={24} />
              <h3 className="text-lg font-bold">Emergency Information</h3>
            </div>

            <p className="mb-4">
              Questions marked as "Emergency" identify symptoms that may require
              immediate medical attention. If you answer "Yes" to any of these
              questions, the app will provide emergency guidance.
            </p>

            <div className="bg-red-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-red-800">
                If you're experiencing severe symptoms, don't wait to complete
                this assessment - seek medical care right away.
              </p>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
