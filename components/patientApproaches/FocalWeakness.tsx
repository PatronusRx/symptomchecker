'use client'; // This directive is needed when using Next.js App Router

import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Copy,
  Check,
  Home,
} from 'lucide-react';

export default function FocalWeaknessTracker() {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  const sections = [
    {
      title: 'Symptom Onset',
      questions: [
        {
          id: 'onset_type',
          label: 'How did your weakness start?',
          options: [
            'Suddenly (within minutes)',
            'Gradually (over hours or days)',
            'Very slowly (over weeks)',
          ],
        },
        {
          id: 'onset_time',
          label: 'When did you first notice the weakness?',
          options: [
            'Within the last hour',
            'Today',
            'Yesterday',
            'Within past week',
            'Longer than a week ago',
          ],
        },
      ],
    },
    {
      title: 'Affected Areas',
      questions: [
        {
          id: 'location',
          label: 'Where are you experiencing weakness?',
          options: [
            'Right arm',
            'Left arm',
            'Right leg',
            'Left leg',
            'Right side of face',
            'Left side of face',
            'Multiple areas',
          ],
        },
        {
          id: 'distribution',
          label: 'Is the weakness affecting:',
          options: [
            'The entire limb',
            'Just the hand/foot',
            'Just the upper arm/thigh',
          ],
        },
      ],
    },
    {
      title: 'Severity Assessment',
      questions: [
        {
          id: 'severity',
          label: 'How severe is the weakness?',
          options: [
            'Mild - noticeable but I can still use the affected part',
            'Moderate - significant difficulty using the affected part',
            'Severe - cannot move the affected part at all',
          ],
        },
        {
          id: 'function',
          label: 'How is this affecting your daily activities?',
          options: [
            'Not affecting daily activities',
            'Some difficulty with activities',
            'Unable to perform normal activities',
          ],
        },
      ],
    },
    {
      title: 'Associated Symptoms',
      questions: [
        {
          id: 'speech',
          label: 'Are you having any trouble with speech?',
          options: [
            'No',
            'Yes - slurred speech',
            'Yes - difficulty finding words',
            'Yes - unable to speak',
          ],
        },
        {
          id: 'sensory',
          label: 'Are you experiencing any unusual sensations?',
          options: [
            'No',
            'Numbness',
            'Tingling',
            'Pain',
            'Multiple sensations',
          ],
        },
        {
          id: 'balance',
          label: 'Are you having trouble with balance or coordination?',
          options: [
            'No',
            'Mild unsteadiness',
            'Significant difficulty walking',
            'Unable to walk safely',
          ],
        },
      ],
    },
    {
      title: 'Alarm Features',
      isEmergency: true,
      questions: [
        {
          id: 'face_droop',
          label: 'Is your face drooping on one side?',
          options: ['No', 'Yes'],
          emergency: 'Yes',
        },
        {
          id: 'sudden_onset',
          label: 'Did the weakness start suddenly (within minutes)?',
          options: ['No', 'Yes'],
          emergency: 'Yes',
        },
        {
          id: 'visual_changes',
          label: 'Are you experiencing any vision changes?',
          options: [
            'No',
            'Yes - blurred vision',
            'Yes - double vision',
            'Yes - loss of vision',
          ],
          emergency: ['Yes - double vision', 'Yes - loss of vision'],
        },
        {
          id: 'headache',
          label: 'Do you have a severe headache with the weakness?',
          options: ['No', 'Yes - mild', 'Yes - severe'],
          emergency: 'Yes - severe',
        },
      ],
    },
    {
      title: 'Pattern & Timing',
      questions: [
        {
          id: 'pattern',
          label: 'How would you describe the pattern of weakness?',
          options: [
            'Constant',
            'Comes and goes',
            'Getting worse',
            'Getting better',
          ],
        },
        {
          id: 'triggers',
          label:
            'Have you noticed anything that triggers or worsens the weakness?',
          options: [
            'No',
            'Physical activity',
            'Specific position',
            'Time of day',
            'Other',
          ],
        },
      ],
    },
    {
      title: 'Medical Background',
      questions: [
        {
          id: 'history',
          label: 'Do you have any history of:',
          options: [
            'Stroke or TIA',
            'Diabetes',
            'High blood pressure',
            'Heart problems',
            'Autoimmune disease',
            'None of these',
          ],
        },
        {
          id: 'medications',
          label: 'Are you taking any medications?',
          options: [
            'No',
            'Blood pressure medication',
            'Cholesterol medication',
            'Blood thinners',
            'Other',
          ],
        },
      ],
    },
  ];

  const checkForEmergency = (section, answers) => {
    if (section.isEmergency) {
      const hasEmergencyResponse = section.questions.some((q) => {
        const response = answers[q.id];
        return (
          q.emergency === response ||
          (Array.isArray(q.emergency) && q.emergency.includes(response))
        );
      });

      if (hasEmergencyResponse) {
        setShowEmergencyAlert(true);
      }
    }
  };

  const handleOptionSelect = (questionId, answer) => {
    const newResponses = { ...responses, [questionId]: answer };
    setResponses(newResponses);

    // Check current section for emergency responses
    checkForEmergency(sections[currentSection], newResponses);
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowReview(true);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleCopyResults = () => {
    let resultText = 'FOCAL WEAKNESS ASSESSMENT RESULTS\n\n';

    sections.forEach((section) => {
      resultText += `${section.title}:\n`;
      section.questions.forEach((question) => {
        const answer = responses[question.id] || 'Not answered';
        resultText += `- ${question.label} ${answer}\n`;
      });
      resultText += '\n';
    });

    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(resultText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  const handleRestart = () => {
    setCurrentSection(0);
    setResponses({});
    setShowReview(false);
    setShowEmergencyAlert(false);
  };

  // Emergency Alert
  if (showEmergencyAlert) {
    return (
      <div className="flex flex-col items-center p-6 bg-red-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle size={48} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 text-center mb-4">
            MEDICAL EMERGENCY
          </h1>
          <p className="text-lg mb-6 text-center">
            Your symptoms suggest a possible medical emergency. Please call
            emergency services (911) or go to the nearest emergency room
            immediately.
          </p>
          <div className="bg-red-100 p-4 rounded-md mb-6">
            <p className="font-semibold text-red-800">
              Sudden weakness, especially with facial drooping or speech
              changes, could indicate a stroke. Time is critical - seek help
              now.
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="w-full p-4 bg-red-600 text-white rounded-lg font-bold flex items-center justify-center"
          >
            <Home className="mr-2" size={20} />
            Return to Start
          </button>
        </div>
      </div>
    );
  }

  // Review Screen
  if (showReview) {
    return (
      <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <h1 className="text-xl font-bold text-center mb-6">
            Review Your Responses
          </h1>

          <div className="mb-8 max-h-96 overflow-y-auto">
            {sections.map((section, idx) => (
              <div key={idx} className="mb-4">
                <h2 className="font-semibold text-lg text-blue-700">
                  {section.title}
                </h2>
                <div className="ml-2">
                  {section.questions.map((question) => (
                    <div
                      key={question.id}
                      className="py-2 border-b border-gray-100"
                    >
                      <p className="text-sm text-gray-600">{question.label}</p>
                      <p className="font-medium">
                        {responses[question.id] || 'Not answered'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleCopyResults}
            className="w-full p-4 bg-blue-600 text-white rounded-lg font-bold mb-3 flex items-center justify-center"
          >
            {copied ? (
              <>
                <Check className="mr-2" size={20} />
                Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="mr-2" size={20} />
                Copy Results
              </>
            )}
          </button>

          <button
            onClick={handleRestart}
            className="w-full p-4 bg-gray-200 text-gray-800 rounded-lg font-medium"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  // Question screens
  const currentSectionData = sections[currentSection];
  const totalSections = sections.length;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">
            Step {currentSection + 1} of {totalSections}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${((currentSection + 1) / totalSections) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Section title */}
        <h1
          className={`text-xl font-bold mb-6 ${
            currentSectionData.isEmergency ? 'text-red-600' : 'text-gray-800'
          }`}
        >
          {currentSectionData.isEmergency && (
            <AlertTriangle size={20} className="inline mr-2" />
          )}
          {currentSectionData.title}
        </h1>

        {/* Questions */}
        <div className="mb-8">
          {currentSectionData.questions.map((question, qIdx) => (
            <div key={qIdx} className="mb-6">
              <p className="font-medium mb-3">{question.label}</p>
              <div className="space-y-2">
                {question.options.map((option, oIdx) => (
                  <button
                    key={oIdx}
                    className={`w-full p-3 rounded-lg border text-left ${
                      responses[question.id] === option
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionSelect(question.id, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentSection === 0}
            className={`px-5 py-3 rounded-lg font-medium flex items-center ${
              currentSection === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center hover:bg-blue-700"
          >
            {currentSection < totalSections - 1 ? (
              <>
                Next
                <ChevronRight size={20} className="ml-1" />
              </>
            ) : (
              'Review'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
