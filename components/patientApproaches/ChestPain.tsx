import React, { useState } from 'react';

interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    next: string | null;
    severity?: 'low' | 'medium' | 'high';
  }[];
}

interface Result {
  title: string;
  description: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
}

const questions: Record<string, Question> = {
  start: {
    id: 'start',
    text: 'Where is your chest pain located?',
    options: [
      { text: 'Center of chest', next: 'center_pain' },
      { text: 'Left side of chest', next: 'left_pain' },
      { text: 'Right side of chest', next: 'right_pain' },
      { text: 'Upper chest/throat area', next: 'upper_pain' },
    ],
  },
  center_pain: {
    id: 'center_pain',
    text: 'Is your pain: ',
    options: [
      {
        text: 'Crushing or heavy pressure',
        next: 'cardiac_symptoms',
        severity: 'high',
      },
      { text: 'Sharp or stabbing', next: 'sharp_center' },
      { text: 'Burning sensation', next: 'burning' },
      { text: 'Aching or sore', next: 'mild_symptoms' },
    ],
  },
  left_pain: {
    id: 'left_pain',
    text: 'How would you describe the left-sided pain?',
    options: [
      {
        text: 'Radiating to arm, neck, or jaw',
        next: 'cardiac_symptoms',
        severity: 'high',
      },
      {
        text: 'Sharp or stabbing that worsens with breathing',
        next: 'sharp_left',
      },
      { text: 'Localized tenderness', next: 'mild_symptoms' },
    ],
  },
  cardiac_symptoms: {
    id: 'cardiac_symptoms',
    text: 'Do you have any of these symptoms along with the chest pain?',
    options: [
      {
        text: 'Shortness of breath',
        next: 'results_cardiac_emergency',
        severity: 'high',
      },
      {
        text: 'Nausea or vomiting',
        next: 'results_cardiac_emergency',
        severity: 'high',
      },
      {
        text: 'Sweating profusely',
        next: 'results_cardiac_emergency',
        severity: 'high',
      },
      {
        text: 'Dizziness or lightheadedness',
        next: 'results_cardiac_emergency',
        severity: 'high',
      },
      { text: 'None of the above', next: 'risk_factors' },
    ],
  },
  risk_factors: {
    id: 'risk_factors',
    text: 'Do you have any risk factors for heart disease?',
    options: [
      {
        text: 'High blood pressure, diabetes, or high cholesterol',
        next: 'results_cardiac_concern',
        severity: 'high',
      },
      {
        text: 'Previous heart problems',
        next: 'results_cardiac_concern',
        severity: 'high',
      },
      {
        text: 'Family history of heart disease',
        next: 'results_cardiac_concern',
        severity: 'medium',
      },
      {
        text: 'None of the above',
        next: 'results_noncardiac',
        severity: 'medium',
      },
    ],
  },
  burning: {
    id: 'burning',
    text: 'Is the burning pain related to eating or lying down?',
    options: [
      {
        text: 'Yes, worse after eating or when lying down',
        next: 'results_gerd',
        severity: 'low',
      },
      { text: 'No, unrelated to eating or position', next: 'cardiac_symptoms' },
    ],
  },
  right_pain: {
    id: 'right_pain',
    text: 'How would you describe the right-sided pain?',
    options: [
      {
        text: 'Sharp pain that worsens with breathing',
        next: 'results_pulmonary',
        severity: 'medium',
      },
      {
        text: 'Dull ache and tenderness',
        next: 'results_musculoskeletal',
        severity: 'low',
      },
      {
        text: 'Pain that radiates to the back or abdomen',
        next: 'results_gallbladder',
        severity: 'medium',
      },
    ],
  },
  upper_pain: {
    id: 'upper_pain',
    text: 'Do you have difficulty swallowing or a lump sensation in your throat?',
    options: [
      { text: 'Yes', next: 'results_esophageal', severity: 'medium' },
      { text: 'No', next: 'mild_symptoms' },
    ],
  },
  sharp_center: {
    id: 'sharp_center',
    text: 'Does the pain change with breathing or body position?',
    options: [
      {
        text: 'Yes, worse with breathing',
        next: 'results_pulmonary',
        severity: 'medium',
      },
      {
        text: 'Yes, worse with movement or touch',
        next: 'results_musculoskeletal',
        severity: 'low',
      },
      {
        text: 'No change with breathing or movement',
        next: 'cardiac_symptoms',
      },
    ],
  },
  sharp_left: {
    id: 'sharp_left',
    text: 'Does the pain get worse when taking a deep breath?',
    options: [
      { text: 'Yes', next: 'results_pulmonary', severity: 'medium' },
      { text: 'No', next: 'cardiac_symptoms' },
    ],
  },
  mild_symptoms: {
    id: 'mild_symptoms',
    text: 'How long have you had this pain?',
    options: [
      {
        text: 'Less than 24 hours',
        next: 'results_mild_recent',
        severity: 'low',
      },
      {
        text: 'Between 1-7 days',
        next: 'results_mild_ongoing',
        severity: 'low',
      },
      {
        text: 'More than a week',
        next: 'results_mild_chronic',
        severity: 'medium',
      },
    ],
  },
};

const results: Record<string, Result> = {
  results_cardiac_emergency: {
    title: 'Possible Cardiac Emergency',
    description:
      'Your symptoms suggest a possible heart-related emergency that requires immediate medical attention.',
    recommendation:
      'Please call emergency services or go to the nearest emergency room immediately.',
    severity: 'high',
  },
  results_cardiac_concern: {
    title: 'Cardiac Concern',
    description:
      'Your symptoms suggest a possible cardiac issue that should be evaluated promptly.',
    recommendation:
      'Please seek medical attention today. If symptoms worsen, call emergency services.',
    severity: 'high',
  },
  results_gerd: {
    title: 'Possible Acid Reflux (GERD)',
    description: 'Your symptoms are consistent with acid reflux or GERD.',
    recommendation:
      'Try over-the-counter antacids and avoid trigger foods. If symptoms persist or worsen, consult with your doctor within a few days.',
    severity: 'low',
  },
  results_pulmonary: {
    title: 'Possible Respiratory Issue',
    description:
      'Your symptoms suggest a possible respiratory cause, such as pleurisy, pneumonia, or a pulmonary embolism.',
    recommendation:
      'Please see a doctor within 24 hours. If you develop severe shortness of breath, call emergency services.',
    severity: 'medium',
  },
  results_musculoskeletal: {
    title: 'Possible Musculoskeletal Pain',
    description:
      'Your symptoms suggest chest wall pain, which may be due to muscle strain, costochondritis, or rib injury.',
    recommendation:
      'Rest and try over-the-counter pain relievers. If pain persists beyond a week or worsens significantly, see your doctor.',
    severity: 'low',
  },
  results_gallbladder: {
    title: 'Possible Gallbladder Issue',
    description:
      'Right-sided pain radiating to the back could indicate gallbladder problems.',
    recommendation:
      'Please see a doctor within 24-48 hours. Avoid fatty foods meanwhile.',
    severity: 'medium',
  },
  results_esophageal: {
    title: 'Possible Esophageal Issue',
    description:
      'Your symptoms suggest an esophageal problem like spasm, inflammation, or difficulty swallowing.',
    recommendation:
      'Please see a doctor within 2-3 days. If you cannot swallow liquids or are drooling, seek immediate care.',
    severity: 'medium',
  },
  results_noncardiac: {
    title: 'Likely Non-Cardiac Chest Pain',
    description:
      'Your symptoms may be related to anxiety, digestive issues, or musculoskeletal causes.',
    recommendation:
      'If the pain persists beyond a few days or worsens, please see your doctor.',
    severity: 'medium',
  },
  results_mild_recent: {
    title: 'Recent Mild Chest Discomfort',
    description:
      'Your symptoms suggest a mild and recent issue that may be due to muscle strain, minor inflammation, or stress.',
    recommendation:
      'Rest and monitor symptoms. If pain increases or new symptoms develop, contact your doctor.',
    severity: 'low',
  },
  results_mild_ongoing: {
    title: 'Ongoing Mild Chest Discomfort',
    description:
      'Your symptoms suggest a mild but ongoing issue that should be evaluated.',
    recommendation:
      'Schedule an appointment with your doctor within the next few days.',
    severity: 'low',
  },
  results_mild_chronic: {
    title: 'Chronic Chest Discomfort',
    description:
      'Long-lasting chest discomfort should be evaluated, even if mild.',
    recommendation:
      'Please schedule an appointment with your doctor this week.',
    severity: 'medium',
  },
};

export default function ChestPain() {
  const [currentQuestion, setCurrentQuestion] = useState<string>('start');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleOptionSelect = (next: string | null) => {
    if (next === null) {
      return;
    }

    setHistory([...history, currentQuestion]);

    if (next.startsWith('results_')) {
      setResult(next);
    } else {
      setCurrentQuestion(next);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;

    const previousQuestion = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    setHistory(newHistory);
    setCurrentQuestion(previousQuestion);
    setResult(null);
  };

  const handleRestart = () => {
    setCurrentQuestion('start');
    setResult(null);
    setHistory([]);
  };

  const renderSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    const colorClasses = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels = {
      low: 'Low Urgency',
      medium: 'Medium Urgency',
      high: 'High Urgency',
    };

    return (
      <span
        className={`text-sm px-2.5 py-0.5 rounded-full border ${colorClasses[severity]}`}
      >
        {labels[severity]}
      </span>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {result ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {results[result].title}
            </h2>
            {renderSeverityBadge(results[result].severity)}
          </div>
          <p className="text-gray-700 mb-4">{results[result].description}</p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="font-medium">Recommendation:</p>
            <p>{results[result].recommendation}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Previous Question
            </button>
            <button
              onClick={handleRestart}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start Over
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {questions[currentQuestion].text}
          </h2>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option.next)}
                className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50 flex justify-between items-center"
              >
                <span>{option.text}</span>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
          {history.length > 0 && (
            <button
              onClick={handleBack}
              className="mt-6 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          )}
        </div>
      )}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          <strong>Important:</strong> This symptom checker is for informational
          purposes only and does not replace professional medical advice.
        </p>
      </div>
    </div>
  );
}
