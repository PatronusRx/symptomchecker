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
    text: 'Have your COPD symptoms gotten worse recently?',
    options: [
      {
        text: 'Yes, significantly worse in the past 24-48 hours',
        next: 'breathing_difficulty',
      },
      { text: 'Yes, gradually worsening over days to weeks', next: 'duration' },
      { text: 'No, just checking my symptoms', next: 'regular_symptoms' },
    ],
  },
  breathing_difficulty: {
    id: 'breathing_difficulty',
    text: 'How difficult is your breathing right now?',
    options: [
      {
        text: "Severe - I can barely speak, can't walk across room, or can't lie flat",
        next: 'results_emergency',
        severity: 'high',
      },
      {
        text: "Moderate - I'm short of breath with minimal activity",
        next: 'color_changes',
      },
      {
        text: "Mild - I'm more short of breath than usual but can still do most activities",
        next: 'color_changes',
      },
    ],
  },
  color_changes: {
    id: 'color_changes',
    text: 'Have you noticed any changes in the color of your phlegm/sputum?',
    options: [
      {
        text: "Yes, it's turned yellow, green, or brown",
        next: 'increased_sputum',
      },
      {
        text: 'No, still clear or white as usual',
        next: 'increased_sputum',
      },
      { text: "I don't produce sputum", next: 'fever' },
    ],
  },
  increased_sputum: {
    id: 'increased_sputum',
    text: 'Are you producing more sputum than usual?',
    options: [
      { text: 'Yes, significantly more', next: 'fever' },
      { text: 'No, about the same amount', next: 'fever' },
      { text: 'Less than usual', next: 'dehydration' },
    ],
  },
  dehydration: {
    id: 'dehydration',
    text: 'Do you have signs of dehydration (dry mouth, reduced urination, extreme thirst)?',
    options: [
      {
        text: 'Yes',
        next: 'results_urgent_care',
        severity: 'medium',
      },
      { text: 'No', next: 'fever' },
    ],
  },
  fever: {
    id: 'fever',
    text: 'Do you have a fever (temperature over 100.4°F or 38°C)?',
    options: [
      {
        text: 'Yes, high fever (over 102°F/39°C)',
        next: 'results_urgent_care',
        severity: 'medium',
      },
      {
        text: 'Yes, low-grade fever',
        next: 'symptoms_worsening',
      },
      { text: 'No fever', next: 'symptoms_worsening' },
    ],
  },
  duration: {
    id: 'duration',
    text: 'How long have your symptoms been worsening?',
    options: [
      { text: '2-3 days', next: 'color_changes' },
      { text: '4-7 days', next: 'color_changes' },
      {
        text: 'More than a week',
        next: 'results_primary_care',
        severity: 'medium',
      },
    ],
  },
  regular_symptoms: {
    id: 'regular_symptoms',
    text: 'How would you describe your usual COPD symptoms?',
    options: [
      {
        text: 'Well-controlled with current medications',
        next: 'results_stable',
        severity: 'low',
      },
      {
        text: 'Sometimes bothersome but manageable',
        next: 'results_stable',
        severity: 'low',
      },
      {
        text: 'Often limiting my daily activities',
        next: 'results_primary_care',
        severity: 'medium',
      },
    ],
  },
  symptoms_worsening: {
    id: 'symptoms_worsening',
    text: 'Have your symptoms been getting worse despite using your rescue inhaler?',
    options: [
      {
        text: "Yes, my inhaler isn't helping much",
        next: 'inhaler_frequency',
      },
      {
        text: 'My inhaler helps somewhat but I need it much more often',
        next: 'inhaler_frequency',
      },
      {
        text: 'No, my inhaler is helping as usual',
        next: 'results_self_management',
        severity: 'low',
      },
    ],
  },
  inhaler_frequency: {
    id: 'inhaler_frequency',
    text: 'How often are you using your rescue inhaler?',
    options: [
      {
        text: 'Much more than usual (every 1-2 hours or more)',
        next: 'results_urgent_care',
        severity: 'medium',
      },
      {
        text: 'More than usual but less than every 2 hours',
        next: 'bluish_color',
      },
      {
        text: 'About the same as usual',
        next: 'bluish_color',
      },
    ],
  },
  bluish_color: {
    id: 'bluish_color',
    text: 'Do you notice any bluish color around your lips or fingernails?',
    options: [
      { text: 'Yes', next: 'results_emergency', severity: 'high' },
      { text: 'No', next: 'confusion' },
    ],
  },
  confusion: {
    id: 'confusion',
    text: 'Do you feel confused or more drowsy than usual?',
    options: [
      { text: 'Yes', next: 'results_emergency', severity: 'high' },
      { text: 'No', next: 'swelling' },
    ],
  },
  swelling: {
    id: 'swelling',
    text: 'Do you have swelling in your ankles or legs that is worse than usual?',
    options: [
      { text: 'Yes', next: 'results_urgent_care', severity: 'medium' },
      { text: 'No', next: 'results_primary_care', severity: 'medium' },
    ],
  },
};

const results: Record<string, Result> = {
  results_emergency: {
    title: 'Seek Emergency Care Immediately',
    description:
      'Your symptoms suggest a severe COPD exacerbation that requires immediate medical attention.',
    recommendation:
      'Call emergency services (911) or have someone take you to the nearest emergency room right away.',
    severity: 'high',
  },
  results_urgent_care: {
    title: 'Seek Urgent Medical Care',
    description:
      'Your symptoms suggest a significant COPD exacerbation that should be evaluated promptly.',
    recommendation:
      'Contact your healthcare provider today or visit an urgent care center within the next few hours.',
    severity: 'medium',
  },
  results_primary_care: {
    title: 'Contact Your Healthcare Provider',
    description:
      'Your symptoms suggest a COPD exacerbation that should be evaluated by your healthcare provider.',
    recommendation:
      'Call your healthcare provider today to discuss your symptoms and arrange for an evaluation in the next 1-2 days.',
    severity: 'medium',
  },
  results_self_management: {
    title: 'Self-Management Appropriate',
    description:
      'Your symptoms suggest a mild COPD exacerbation that may be manageable at home with your prescribed medications.',
    recommendation:
      'Follow your COPD action plan if you have one. Use your medications as prescribed and monitor your symptoms closely. If they worsen, reassess using this tool or contact your healthcare provider.',
    severity: 'low',
  },
  results_stable: {
    title: 'COPD Appears Stable',
    description:
      'Your symptoms appear to be consistent with your usual COPD status.',
    recommendation:
      'Continue your regular COPD management plan. If you have concerns about your overall COPD control, consider discussing them with your healthcare provider at your next visit.',
    severity: 'low',
  },
};

export default function COPDExacerbation() {
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
