import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Check,
  Copy,
  Eye,
  BarChart3,
} from 'lucide-react';

export default function VisualDisturbancesApp() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [alarmFeatures, setAlarmFeatures] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Main sections of the assessment
  const sections = [
    { id: 'intro', title: 'Visual Symptom Tracker', isIntro: true },
    { id: 'alarm', title: 'Critical Symptoms', isAlarm: true },
    { id: 'onset', title: 'Onset of Symptoms' },
    { id: 'quality', title: 'Visual Changes' },
    { id: 'location', title: 'Location of Changes' },
    { id: 'timing', title: 'Timing of Symptoms' },
    { id: 'associated', title: 'Associated Symptoms' },
    { id: 'medications', title: 'Current Medications' },
    { id: 'history', title: 'Medical History' },
    { id: 'review', title: 'Review Your Responses', isReview: true },
    { id: 'submit', title: 'Submission Complete', isSubmit: true },
  ];

  // Critical alarm features (assessed early)
  const alarmQuestions = [
    {
      id: 'sudden_loss',
      text: 'Have you experienced sudden complete vision loss (within seconds to minutes)?',
      critical: true,
    },
    {
      id: 'monocular_loss',
      text: 'Have you had temporary vision loss in one eye only?',
      critical: true,
    },
    {
      id: 'new_diplopia',
      text: 'Have you recently developed double vision?',
      critical: true,
    },
    {
      id: 'severe_pain',
      text: 'Are you experiencing severe eye pain?',
      critical: true,
    },
    {
      id: 'curtain_vision',
      text: 'Have you seen a curtain-like shadow moving across your vision?',
      critical: true,
    },
    {
      id: 'severe_headache',
      text: 'Do you have the worst headache of your life?',
      critical: true,
    },
  ];

  // Questions about onset
  const onsetQuestions = [
    {
      id: 'onset_timing',
      text: 'When did you first notice the visual changes?',
      type: 'select',
      options: [
        'Within the last hour',
        'Today',
        'Yesterday',
        'This week',
        'This month',
        'Several months ago',
        'Over a year ago',
      ],
    },
    {
      id: 'onset_pattern',
      text: 'How did the symptoms begin?',
      type: 'select',
      options: [
        'Suddenly (seconds to minutes)',
        'Quickly (minutes to hours)',
        'Gradually (hours to days)',
        'Very gradually (days to weeks)',
      ],
    },
  ];

  // Questions about the quality of visual changes
  const qualityQuestions = [
    {
      id: 'quality_type',
      text: 'What kind of visual changes are you experiencing?',
      type: 'multiselect',
      options: [
        'Blurry vision',
        'Double vision',
        'Blind spots',
        'Flashes of light',
        'Floaters or spots',
        'Halos around lights',
        'Dimming of vision',
        'Distorted vision',
        'Complete vision loss',
        'Zigzag lines',
        'Visual snow',
      ],
    },
    {
      id: 'severity',
      text: 'How severe are your symptoms?',
      type: 'select',
      options: [
        "Mild - noticeable but doesn't affect activities",
        'Moderate - affects some activities',
        'Severe - significantly impairs function',
        'Complete - total loss of vision',
      ],
    },
  ];

  // Location questions
  const locationQuestions = [
    {
      id: 'affected_eyes',
      text: 'Which eye(s) are affected?',
      type: 'select',
      options: ['Right eye only', 'Left eye only', 'Both eyes', 'Not sure'],
    },
    {
      id: 'vision_field',
      text: 'Which part of your vision is affected?',
      type: 'multiselect',
      options: [
        'Central vision',
        'Peripheral vision',
        'Upper visual field',
        'Lower visual field',
        'Entire visual field',
        'Not sure',
      ],
    },
  ];

  // Timing questions
  const timingQuestions = [
    {
      id: 'frequency',
      text: 'How often do the symptoms occur?',
      type: 'select',
      options: [
        'Constant (all the time)',
        'Intermittent (comes and goes)',
        'Only once so far',
      ],
    },
    {
      id: 'duration',
      text: 'How long do the episodes typically last?',
      type: 'select',
      options: [
        'Seconds',
        'Minutes',
        'Hours',
        'Days',
        'Constant',
        'Not applicable (only one episode)',
      ],
    },
    {
      id: 'progression',
      text: 'How have the symptoms changed over time?',
      type: 'select',
      options: [
        'Getting worse',
        'Improving',
        'Staying about the same',
        'Fluctuating (better and worse)',
        'Too soon to tell',
      ],
    },
  ];

  // Associated symptoms
  const associatedQuestions = [
    {
      id: 'associated_symptoms',
      text: 'Do you have any of these associated symptoms?',
      type: 'multiselect',
      options: [
        'Headache',
        'Eye pain',
        'Sensitivity to light',
        'Eye redness',
        'Tearing/watery eyes',
        'Dry eyes',
        'Dizziness',
        'Nausea or vomiting',
        'Face pain or numbness',
      ],
    },
  ];

  // Medication questions
  const medicationQuestions = [
    {
      id: 'current_meds',
      text: 'Please list any medications you currently take:',
      type: 'textarea',
    },
    {
      id: 'eye_drops',
      text: 'Do you use any eye drops or eye medications?',
      type: 'select',
      options: ['Yes', 'No'],
    },
    {
      id: 'eye_meds_detail',
      text: 'Please list your eye medications:',
      type: 'textarea',
      condition: (answers) => answers.eye_drops === 'Yes',
    },
  ];

  // History questions
  const historyQuestions = [
    {
      id: 'eye_conditions',
      text: 'Have you previously been diagnosed with any eye conditions?',
      type: 'multiselect',
      options: [
        'Glaucoma',
        'Cataracts',
        'Macular degeneration',
        'Diabetic eye disease',
        'Retinal detachment',
        'Eye injury',
        'Need for glasses/contacts',
        'None of these',
      ],
    },
    {
      id: 'medical_conditions',
      text: 'Do you have any of these medical conditions?',
      type: 'multiselect',
      options: [
        'Diabetes',
        'High blood pressure',
        'Migraine',
        'Stroke',
        'Multiple sclerosis',
        'Thyroid disease',
        'Autoimmune disorders',
        'None of these',
      ],
    },
  ];

  // Get questions for current section
  const getCurrentQuestions = () => {
    const currentSection = sections[currentStep];
    if (currentSection.isAlarm) return alarmQuestions;
    if (currentSection.id === 'onset') return onsetQuestions;
    if (currentSection.id === 'quality') return qualityQuestions;
    if (currentSection.id === 'location') return locationQuestions;
    if (currentSection.id === 'timing') return timingQuestions;
    if (currentSection.id === 'associated') return associatedQuestions;
    if (currentSection.id === 'medications') return medicationQuestions;
    if (currentSection.id === 'history') return historyQuestions;
    return [];
  };

  // Handle answer changes
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    // Check for alarm features
    if (currentStep === 1) {
      // Alarm section
      const question = alarmQuestions.find((q) => q.id === questionId);
      if (question && question.critical && value === 'Yes') {
        if (!alarmFeatures.includes(questionId)) {
          setAlarmFeatures((prev) => [...prev, questionId]);
        }
      } else {
        setAlarmFeatures((prev) => prev.filter((id) => id !== questionId));
      }
    }
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit the assessment
  const handleSubmit = () => {
    // Here you would normally send data to server
    setSubmitted(true);
    nextStep();
  };

  // Copy results to clipboard
  const copyResults = () => {
    const results = Object.entries(answers)
      .map(
        ([key, value]) =>
          `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
      )
      .join('\n');

    navigator.clipboard
      .writeText(results)
      .then(() => alert('Results copied to clipboard!'))
      .catch((err) => console.error('Failed to copy: ', err));
  };

  // Render a single question
  const renderQuestion = (question) => {
    // Skip questions that don't meet their condition
    if (question.condition && !question.condition(answers)) {
      return null;
    }

    return (
      <div key={question.id} className="mb-6">
        <label className="block text-lg font-medium mb-2">
          {question.text}
        </label>

        {question.type === 'select' && (
          <select
            className="w-full p-3 border rounded-lg bg-white"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          >
            <option value="">Select an option</option>
            {question.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {question.type === 'multiselect' && (
          <div className="space-y-2">
            {question.options.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${question.id}-${option}`}
                  className="h-5 w-5 mr-2"
                  checked={answers[question.id]?.includes(option) || false}
                  onChange={(e) => {
                    const currentSelections = answers[question.id] || [];
                    const newSelections = e.target.checked
                      ? [...currentSelections, option]
                      : currentSelections.filter((item) => item !== option);
                    handleAnswerChange(question.id, newSelections);
                  }}
                />
                <label
                  htmlFor={`${question.id}-${option}`}
                  className="text-base"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}

        {question.type === 'textarea' && (
          <textarea
            className="w-full p-3 border rounded-lg"
            rows="3"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          ></textarea>
        )}

        {!question.type && (
          <div className="flex space-x-4">
            <button
              className="bg-green-100 text-green-800 rounded-lg px-8 py-3 flex-1 font-medium"
              onClick={() => handleAnswerChange(question.id, 'No')}
            >
              No
            </button>
            <button
              className="bg-red-100 text-red-800 rounded-lg px-8 py-3 flex-1 font-medium"
              onClick={() => handleAnswerChange(question.id, 'Yes')}
            >
              Yes
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render introduction screen
  const renderIntro = () => (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <Eye size={60} className="text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold mb-6">
        Visual Disturbances Symptom Tracker
      </h1>
      <p className="mb-6">
        This assessment will help track your visual symptoms to share with your
        healthcare provider.
      </p>
      <p className="mb-6">
        We'll ask about your symptoms, when they started, and other important
        details.
      </p>
      <div className="bg-yellow-100 p-4 rounded-lg mb-6">
        <p className="text-yellow-800 font-medium flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          If you're experiencing sudden vision loss or severe eye pain, seek
          immediate medical attention.
        </p>
      </div>
      <button
        className="bg-blue-600 text-white rounded-lg py-3 px-6 w-full text-lg font-medium"
        onClick={nextStep}
      >
        Start Assessment
      </button>
    </div>
  );

  // Render the review screen
  const renderReview = () => (
    <div>
      <h2 className="text-xl font-bold mb-4">Review Your Responses</h2>

      {alarmFeatures.length > 0 && (
        <div className="bg-red-100 p-4 rounded-lg mb-6">
          <p className="text-red-800 font-bold mb-2">
            Critical Symptoms Detected:
          </p>
          <ul className="list-disc pl-5">
            {alarmFeatures.map((id) => (
              <li key={id}>{alarmQuestions.find((q) => q.id === id)?.text}</li>
            ))}
          </ul>
          <p className="mt-2 font-medium text-red-800">
            Please seek immediate medical attention.
          </p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {sections.slice(1, sections.length - 2).map((section) => {
          // Get questions for this section
          let sectionQuestions;
          if (section.isAlarm) sectionQuestions = alarmQuestions;
          else if (section.id === 'onset') sectionQuestions = onsetQuestions;
          else if (section.id === 'quality')
            sectionQuestions = qualityQuestions;
          else if (section.id === 'location')
            sectionQuestions = locationQuestions;
          else if (section.id === 'timing') sectionQuestions = timingQuestions;
          else if (section.id === 'associated')
            sectionQuestions = associatedQuestions;
          else if (section.id === 'medications')
            sectionQuestions = medicationQuestions;
          else if (section.id === 'history')
            sectionQuestions = historyQuestions;
          else return null;

          // Only show sections with answers
          const hasAnswers = sectionQuestions.some((q) => answers[q.id]);
          if (!hasAnswers) return null;

          return (
            <div key={section.id} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">{section.title}</h3>
              <div className="space-y-2">
                {sectionQuestions.map((question) => {
                  if (
                    !answers[question.id] ||
                    (question.condition && !question.condition(answers))
                  )
                    return null;

                  const value = answers[question.id];
                  const displayValue = Array.isArray(value)
                    ? value.join(', ')
                    : value;

                  return (
                    <div key={question.id} className="flex flex-col">
                      <span className="text-gray-600">{question.text}</span>
                      <span className="font-medium">{displayValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex space-x-4">
        <button
          className="bg-gray-200 text-gray-800 rounded-lg py-3 px-6 flex-1"
          onClick={prevStep}
        >
          Edit Responses
        </button>
        <button
          className="bg-blue-600 text-white rounded-lg py-3 px-6 flex-1"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );

  // Render the submit confirmation screen
  const renderSubmitConfirmation = () => (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <Check size={60} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Submission Complete</h2>
      <p className="mb-6">
        Your symptom information has been saved and is ready to share with your
        healthcare provider.
      </p>

      {alarmFeatures.length > 0 && (
        <div className="bg-red-100 p-4 rounded-lg mb-6">
          <p className="text-red-800 font-bold">
            Based on your responses, please seek immediate medical attention.
          </p>
        </div>
      )}

      <button
        className="bg-blue-600 text-white rounded-lg py-3 px-6 w-full text-lg font-medium mb-4 flex items-center justify-center"
        onClick={copyResults}
      >
        <Copy size={20} className="mr-2" />
        Copy Results
      </button>

      <button
        className="bg-gray-200 text-gray-800 rounded-lg py-3 px-6 w-full text-lg font-medium"
        onClick={() => {
          setCurrentStep(0);
          setAnswers({});
          setAlarmFeatures([]);
          setSubmitted(false);
        }}
      >
        Start New Assessment
      </button>
    </div>
  );

  // Render the current section
  const renderCurrentSection = () => {
    const currentSection = sections[currentStep];

    if (currentSection.isIntro) return renderIntro();
    if (currentSection.isReview) return renderReview();
    if (currentSection.isSubmit) return renderSubmitConfirmation();

    const questions = getCurrentQuestions();

    return (
      <div>
        <h2 className="text-xl font-bold mb-6">{currentSection.title}</h2>

        {currentSection.isAlarm && (
          <div className="bg-yellow-100 p-4 rounded-lg mb-6">
            <p className="text-yellow-800 font-medium flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              Please answer these critical questions first.
            </p>
          </div>
        )}

        {questions.map((question) => renderQuestion(question))}

        <div className="flex justify-between mt-8">
          <button
            className="bg-gray-200 text-gray-800 rounded-lg py-3 px-6 flex items-center"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">
              {currentStep} of {sections.length - 2}
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full"
                style={{
                  width: `${(currentStep / (sections.length - 2)) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <button
            className="bg-blue-600 text-white rounded-lg py-3 px-6 flex items-center"
            onClick={nextStep}
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Eye className="h-6 w-6 text-blue-600 mr-2" />
          <span className="font-bold text-blue-800">VisualTrack</span>
        </div>
        {!sections[currentStep].isIntro && !sections[currentStep].isSubmit && (
          <BarChart3 className="h-6 w-6 text-gray-500" />
        )}
      </div>

      {renderCurrentSection()}
    </div>
  );
}
