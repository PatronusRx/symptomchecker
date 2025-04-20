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
    text: 'Where is the bleeding coming from?',
    options: [
      {
        text: 'Vomiting blood or coffee-ground material',
        next: 'upper_quantity',
      },
      { text: 'Black, tarry stool', next: 'black_stool' },
      { text: 'Red or maroon blood in stool', next: 'lower_quantity' },
      { text: 'Blood on toilet paper only', next: 'rectal_pain' },
      {
        text: 'Not sure, but I have symptoms of blood loss',
        next: 'symptoms_blood_loss',
      },
    ],
  },
  upper_quantity: {
    id: 'upper_quantity',
    text: 'How much blood have you vomited?',
    options: [
      {
        text: 'Large amount (more than a cup)',
        next: 'results_emergency',
        severity: 'high',
      },
      {
        text: 'Small to moderate amount',
        next: 'symptoms_blood_loss',
      },
      {
        text: 'Just specks or coffee-ground appearance',
        next: 'recent_medications',
      },
    ],
  },
  black_stool: {
    id: 'black_stool',
    text: 'How many black bowel movements have you had?',
    options: [
      { text: 'Multiple in the past 24 hours', next: 'symptoms_blood_loss' },
      { text: 'Just one recently', next: 'recent_medications' },
      { text: 'Several over the past few days', next: 'symptoms_blood_loss' },
    ],
  },
  lower_quantity: {
    id: 'lower_quantity',
    text: 'How would you describe the amount of blood?',
    options: [
      {
        text: 'Large amount mixed with stool or clots',
        next: 'results_emergency',
        severity: 'high',
      },
      {
        text: 'Moderate amount mixed with stool',
        next: 'symptoms_blood_loss',
      },
      { text: 'Small streaks on the surface of stool', next: 'rectal_pain' },
    ],
  },
  rectal_pain: {
    id: 'rectal_pain',
    text: 'Do you have pain during bowel movements?',
    options: [
      { text: 'Yes, significant pain', next: 'anal_symptoms' },
      { text: 'Mild discomfort', next: 'anal_symptoms' },
      { text: 'No pain', next: 'stool_changes' },
    ],
  },
  anal_symptoms: {
    id: 'anal_symptoms',
    text: 'Do you have any of these symptoms in the anal area?',
    options: [
      {
        text: 'Lumps or swelling around the anus',
        next: 'results_hemorrhoids',
        severity: 'low',
      },
      {
        text: 'Tear or crack in the skin around the anus',
        next: 'results_anal_fissure',
        severity: 'low',
      },
      { text: 'None of these', next: 'stool_changes' },
    ],
  },
  symptoms_blood_loss: {
    id: 'symptoms_blood_loss',
    text: 'Do you have any of these symptoms?',
    options: [
      {
        text: 'Feeling dizzy or lightheaded when standing',
        next: 'results_emergency',
        severity: 'high',
      },
      {
        text: 'Rapid heartbeat or shortness of breath',
        next: 'results_emergency',
        severity: 'high',
      },
      {
        text: 'Pale skin or fatigue',
        next: 'results_urgent_care',
        severity: 'medium',
      },
      { text: 'None of these', next: 'recent_medications' },
    ],
  },
  recent_medications: {
    id: 'recent_medications',
    text: 'Do you take any of these medications?',
    options: [
      {
        text: 'Blood thinners (e.g., warfarin, apixaban, aspirin)',
        next: 'results_urgent_care',
        severity: 'medium',
      },
      {
        text: 'NSAIDs (e.g., ibuprofen, naproxen)',
        next: 'duration',
      },
      { text: 'None of these', next: 'duration' },
    ],
  },
  duration: {
    id: 'duration',
    text: 'How long have you been experiencing this bleeding?',
    options: [
      { text: 'First time today', next: 'abdominal_pain' },
      { text: 'Started in the past few days', next: 'abdominal_pain' },
      {
        text: 'On and off for weeks or longer',
        next: 'results_primary_care',
        severity: 'medium',
      },
    ],
  },
  abdominal_pain: {
    id: 'abdominal_pain',
    text: 'Do you have abdominal pain?',
    options: [
      {
        text: 'Severe pain',
        next: 'results_emergency',
        severity: 'high',
      },
      { text: 'Mild to moderate pain', next: 'stool_changes' },
      { text: 'No pain', next: 'stool_changes' },
    ],
  },
  stool_changes: {
    id: 'stool_changes',
    text: 'Have you noticed any recent changes in your bowel habits?',
    options: [
      {
        text: 'New onset diarrhea',
        next: 'results_primary_care',
        severity: 'medium',
      },
      {
        text: 'New constipation',
        next: 'results_primary_care',
        severity: 'medium',
      },
      {
        text: 'Alternating diarrhea and constipation',
        next: 'results_primary_care',
        severity: 'medium',
      },
      { text: 'No changes', next: 'age' },
    ],
  },
  age: {
    id: 'age',
    text: 'Are you 50 years or older?',
    options: [
      {
        text: 'Yes',
        next: 'results_primary_care',
        severity: 'medium',
      },
      {
        text: 'No',
        next: 'risk_factors',
      },
    ],
  },
  risk_factors: {
    id: 'risk_factors',
    text: 'Do you have any of these risk factors?',
    options: [
      {
        text: 'Family history of colon cancer',
        next: 'results_primary_care',
        severity: 'medium',
      },
      {
        text: 'Personal history of polyps or inflammatory bowel disease',
        next: 'results_primary_care',
        severity: 'medium',
      },
      {
        text: 'Recent weight loss without trying',
        next: 'results_primary_care',
        severity: 'medium',
      },
      {
        text: 'None of these',
        next: 'results_primary_care_routine',
        severity: 'low',
      },
    ],
  },
};

const results: Record<string, Result> = {
  results_emergency: {
    title: 'Seek Emergency Care Immediately',
    description:
      'Your symptoms suggest a potentially serious GI bleed that requires immediate medical attention.',
    recommendation:
      'Call emergency services (911) or have someone take you to the nearest emergency room right away.',
    severity: 'high',
  },
  results_urgent_care: {
    title: 'Seek Urgent Medical Care',
    description:
      'Your symptoms suggest a significant GI bleed that should be evaluated promptly.',
    recommendation:
      'Go to an urgent care center or emergency room within the next few hours.',
    severity: 'medium',
  },
  results_primary_care: {
    title: 'Contact Your Healthcare Provider',
    description:
      'Your symptoms suggest a condition that needs medical evaluation.',
    recommendation:
      'Call your healthcare provider today to discuss your symptoms and arrange for an evaluation in the next 1-2 days.',
    severity: 'medium',
  },
  results_primary_care_routine: {
    title: 'Schedule a Medical Appointment',
    description:
      'Your symptoms suggest a condition that should be evaluated by a healthcare provider.',
    recommendation:
      'Schedule an appointment with your healthcare provider within the next week.',
    severity: 'low',
  },
  results_hemorrhoids: {
    title: 'Possible Hemorrhoids',
    description:
      'Your symptoms suggest hemorrhoids, which are swollen veins in the rectum and anus that can cause bleeding and discomfort.',
    recommendation:
      'Try over-the-counter hemorrhoid treatments. If symptoms persist beyond a week or worsen, see your healthcare provider.',
    severity: 'low',
  },
  results_anal_fissure: {
    title: 'Possible Anal Fissure',
    description:
      'Your symptoms suggest an anal fissure, which is a small tear in the lining of the anus that can cause bleeding and pain during bowel movements.',
    recommendation:
      'Try sitz baths and stool softeners. If symptoms persist beyond two weeks or worsen, see your healthcare provider.',
    severity: 'low',
  },
};

export default function GIBleeding() {
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
