import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Copy,
  Info,
} from 'lucide-react';

export default function UrinaryRetentionApp() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  // Sample assessment flow - in a real app, this would be more extensive
  const screens = [
    {
      id: 'welcome',
      type: 'welcome',
      title: 'Urinary Retention Assessment',
      content:
        'This assessment will help your healthcare provider understand your urinary symptoms better. Please answer each question to the best of your ability.',
    },
    {
      id: 'emergency-check',
      type: 'emergency',
      title: 'Emergency Check',
      question: 'Are you experiencing any of the following?',
      options: [
        'Severe pain that prevents standing or sitting',
        'Complete inability to urinate for over 8 hours with painful bladder',
        'Blood in urine with inability to urinate',
        'Fever above 38.0°C (100.4°F) with urinary symptoms',
        'Recent trauma to lower abdomen or pelvis',
        'None of the above',
      ],
    },
    {
      id: 'onset',
      type: 'question',
      title: 'Onset of Symptoms',
      question: 'When did you first notice difficulty urinating?',
      options: [
        'Within the last 24 hours (sudden onset)',
        'Gradually over days',
        'Gradually over weeks',
        'Gradually over months',
        "I've had this problem for years",
      ],
    },
    {
      id: 'ability',
      type: 'question',
      title: 'Current Ability to Urinate',
      question: 'Which best describes your current ability to urinate?',
      options: [
        'Cannot urinate at all',
        'Can only pass small amounts of urine',
        'Need to strain/push to start urination',
        'Urination starts and stops during the process',
        "Can urinate but don't feel bladder is empty after",
      ],
    },
    {
      id: 'frequency',
      type: 'question',
      title: 'Urinary Frequency',
      question: 'How often do you feel the need to urinate?',
      options: [
        'Much more frequently than normal',
        'Somewhat more frequently than normal',
        'Normal frequency but difficult to urinate',
        'Less frequently than normal',
        'Only when my bladder feels very full',
      ],
    },
    {
      id: 'pain',
      type: 'question',
      title: 'Pain or Discomfort',
      question: 'Do you have any pain or discomfort?',
      options: [
        'Severe pain in lower abdomen/bladder area',
        'Moderate pain in lower abdomen/bladder area',
        'Mild discomfort or pressure sensation',
        'Burning sensation when trying to urinate',
        'Pain in lower back',
        'No pain or discomfort',
      ],
    },
    {
      id: 'medications',
      type: 'question',
      title: 'Medications',
      question: 'Are you currently taking any of these medications?',
      options: [
        'Cold or allergy medications',
        'Medications for depression or anxiety',
        'Pain medications (especially opioids)',
        'Muscle relaxants',
        'Medications for an enlarged prostate',
        'Blood pressure medications',
        'None of the above',
      ],
      multiSelect: true,
    },
    {
      id: 'medical-history',
      type: 'question',
      title: 'Medical History',
      question: 'Do you have any of the following conditions?',
      options: [
        'Enlarged prostate (BPH)',
        'Prostate cancer',
        'Previous urinary retention',
        "Neurological conditions (MS, Parkinson's, etc.)",
        'Diabetes',
        'Recent surgery (within 4 weeks)',
        'Urinary tract infection (past or current)',
        'None of the above',
      ],
      multiSelect: true,
    },
    {
      id: 'triggers',
      type: 'question',
      title: 'Triggers',
      question: 'Have you noticed anything that seems to worsen your symptoms?',
      options: [
        'Drinking alcohol',
        'Consuming caffeine',
        'Cold weather',
        'Certain medications',
        'Holding urine for long periods',
        'Stress or anxiety',
        'Nothing specific',
        'Other',
      ],
      multiSelect: true,
    },
    {
      id: 'associated',
      type: 'question',
      title: 'Associated Symptoms',
      question: 'Do you have any of these additional symptoms?',
      options: [
        'Fever or chills',
        'Visible blood in urine',
        'Cloudy or foul-smelling urine',
        'Nausea or vomiting',
        'Recent changes in bowel habits',
        'Weakness or numbness in legs',
        'None of the above',
      ],
      multiSelect: true,
    },
    {
      id: 'review',
      type: 'review',
      title: 'Review Your Answers',
      content:
        'Please review your answers before submitting. You can go back to change any response.',
    },
  ];

  const handleAnswer = (option) => {
    // Check for emergency answers
    if (currentScreen === 1 && option !== 'None of the above') {
      setShowEmergency(true);
      return;
    }

    // Store answer
    setAnswers({
      ...answers,
      [screens[currentScreen].id]: Array.isArray(
        answers[screens[currentScreen].id]
      )
        ? [...answers[screens[currentScreen].id], option]
        : screens[currentScreen].multiSelect
        ? [option]
        : option,
    });

    // Move to next screen if not multi-select
    if (!screens[currentScreen].multiSelect) {
      nextScreen();
    }
  };

  const toggleMultiSelectOption = (option) => {
    const currentAnswers = answers[screens[currentScreen].id] || [];

    if (currentAnswers.includes(option)) {
      setAnswers({
        ...answers,
        [screens[currentScreen].id]: currentAnswers.filter(
          (item) => item !== option
        ),
      });
    } else {
      setAnswers({
        ...answers,
        [screens[currentScreen].id]: [...currentAnswers, option],
      });
    }
  };

  const nextScreen = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const prevScreen = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const submitAssessment = () => {
    setSubmitted(true);
  };

  const copyResults = () => {
    const resultsText = Object.entries(answers)
      .map(([key, value]) => {
        const screen = screens.find((s) => s.id === key);
        const question = screen?.question || screen?.title;
        return `${question}: ${
          Array.isArray(value) ? value.join(', ') : value
        }`;
      })
      .join('\n');

    navigator.clipboard.writeText(resultsText);
    alert('Assessment results copied to clipboard');
  };

  const resetAssessment = () => {
    setCurrentScreen(0);
    setAnswers({});
    setSubmitted(false);
    setShowEmergency(false);
  };

  const renderScreen = () => {
    const screen = screens[currentScreen];

    if (showEmergency) {
      return (
        <div className="p-6 bg-red-100 rounded-lg">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-red-600 mr-2" size={24} />
            <h2 className="text-xl font-bold text-red-700">
              Seek Emergency Care
            </h2>
          </div>
          <p className="mb-4">
            Based on your response, you may be experiencing a medical emergency
            related to urinary retention.
          </p>
          <p className="mb-6 font-bold">
            Please go to the nearest emergency room or call 911 immediately.
          </p>
          <button
            onClick={resetAssessment}
            className="bg-red-600 text-white py-2 px-4 rounded-lg w-full"
          >
            Reset Assessment
          </button>
        </div>
      );
    }

    if (submitted) {
      return (
        <div className="p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="text-green-600 mr-2" size={24} />
            <h2 className="text-xl font-bold">Assessment Completed</h2>
          </div>
          <p className="mb-4">
            Thank you for completing the urinary retention assessment. Your
            responses have been saved.
          </p>
          <p className="mb-6">
            Share this information with your healthcare provider at your next
            appointment.
          </p>
          <button
            onClick={copyResults}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full mb-4 flex items-center justify-center"
          >
            <Copy className="mr-2" size={16} />
            Copy Results
          </button>
          <button
            onClick={resetAssessment}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg w-full"
          >
            Start New Assessment
          </button>
        </div>
      );
    }

    switch (screen.type) {
      case 'welcome':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{screen.title}</h2>
            <p className="mb-6">{screen.content}</p>
            <button
              onClick={nextScreen}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
            >
              Begin Assessment
            </button>
          </div>
        );

      case 'emergency':
      case 'question':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{screen.title}</h2>
            <p className="mb-4">{screen.question}</p>
            <div className="space-y-3 mb-6">
              {screen.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    screen.multiSelect
                      ? toggleMultiSelectOption(option)
                      : handleAnswer(option)
                  }
                  className={`py-3 px-4 rounded-lg border border-gray-300 w-full text-left ${
                    screen.multiSelect &&
                    answers[screen.id] &&
                    answers[screen.id].includes(option)
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {screen.multiSelect && (
              <button
                onClick={nextScreen}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
              >
                Continue
              </button>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{screen.title}</h2>
            <p className="mb-4">{screen.content}</p>
            <div className="mb-6 space-y-4 max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg">
              {Object.entries(answers).map(([key, value]) => {
                const questionScreen = screens.find((s) => s.id === key);
                if (!questionScreen || !questionScreen.question) return null;

                return (
                  <div key={key} className="border-b border-gray-200 pb-3">
                    <p className="font-medium text-gray-700">
                      {questionScreen.question}
                    </p>
                    <p className="text-gray-900">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </p>
                  </div>
                );
              })}
            </div>
            <button
              onClick={submitAssessment}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full mb-3"
            >
              Submit Assessment
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* App header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Urinary Retention Assessment</h1>
        <div className="flex items-center">
          <Info size={20} />
        </div>
      </div>

      {/* Progress indicator */}
      {!submitted && !showEmergency && (
        <div className="px-4 py-2 bg-gray-50">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${(currentScreen / (screens.length - 1)) * 100}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Start</span>
            <span>{`${Math.round(
              (currentScreen / (screens.length - 1)) * 100
            )}%`}</span>
          </div>
        </div>
      )}

      {/* Screen content */}
      {renderScreen()}

      {/* Navigation buttons */}
      {!submitted &&
        !showEmergency &&
        currentScreen > 0 &&
        currentScreen < screens.length - 1 && (
          <div className="p-4 bg-gray-50 flex justify-between border-t border-gray-200">
            <button
              onClick={prevScreen}
              className="flex items-center text-blue-600 py-2 px-3"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </button>
            {screens[currentScreen].multiSelect && (
              <button
                onClick={nextScreen}
                className="flex items-center text-blue-600 py-2 px-3"
              >
                Next
                <ArrowRight size={16} className="ml-1" />
              </button>
            )}
          </div>
        )}
    </div>
  );
}
