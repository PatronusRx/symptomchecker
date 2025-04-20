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
    text: 'How would you describe the onset of your headache?',
    options: [
      {
        text: 'Sudden and severe (within seconds to minutes)',
        next: 'sudden_onset',
        severity: 'high',
      },
      { text: 'Gradual (built up over hours)', next: 'gradual_onset' },
      { text: 'Constant for days or longer', next: 'chronic' },
    ],
  },
  sudden_onset: {
    id: 'sudden_onset',
    text: 'Would you describe this as the worst headache of your life?',
    options: [
      { text: 'Yes', next: 'results_emergency', severity: 'high' },
      { text: 'No, but still very severe', next: 'severe_symptoms' },
      { text: 'No, it&apos;s moderate to mild', next: 'other_symptoms' },
    ],
  },
  severe_symptoms: {
    id: 'severe_symptoms',
    text: 'Do you have any of these symptoms?',
    options: [
      {
        text: 'Confusion or trouble speaking',
        next: 'results_emergency',
        severity: 'high',
      },
      {
        text: 'Weakness or numbness, especially on one side',
        next: 'results_emergency',
        severity: 'high',
      },
      {
        text: 'Stiff neck and fever',
        next: 'results_emergency',
        severity: 'high',
      },
      { text: 'None of the above', next: 'other_symptoms' },
    ],
  },
  other_symptoms: {
    id: 'other_symptoms',
    text: 'Do you have any of these additional symptoms?',
    options: [
      { text: 'Nausea or vomiting', next: 'migraine_symptoms' },
      { text: 'Sensitivity to light or sound', next: 'migraine_symptoms' },
      {
        text: 'Visual changes like flashing lights before headache',
        next: 'migraine_symptoms',
      },
      { text: 'None of the above', next: 'location' },
    ],
  },
  migraine_symptoms: {
    id: 'migraine_symptoms',
    text: 'Have you been diagnosed with migraines before?',
    options: [
      { text: 'Yes', next: 'results_migraine', severity: 'medium' },
      { text: 'No', next: 'location' },
    ],
  },
  gradual_onset: {
    id: 'gradual_onset',
    text: 'Where is your headache located?',
    options: [
      { text: 'One side of the head', next: 'one_sided' },
      { text: 'Both sides of the head', next: 'both_sides' },
      { text: 'Face or sinus area', next: 'sinus_symptoms' },
      { text: 'Back of the head/neck', next: 'tension_symptoms' },
    ],
  },
  one_sided: {
    id: 'one_sided',
    text: 'Is the pain pulsating or throbbing?',
    options: [
      { text: 'Yes', next: 'migraine_symptoms' },
      { text: 'No, it&apos;s steady pain', next: 'tension_symptoms' },
    ],
  },
  both_sides: {
    id: 'both_sides',
    text: 'How would you describe the pain?',
    options: [
      {
        text: 'Pressure or tightness like a band around the head',
        next: 'tension_symptoms',
      },
      { text: 'Throbbing or pulsating', next: 'migraine_symptoms' },
      { text: 'Dull, constant ache', next: 'duration' },
    ],
  },
  tension_symptoms: {
    id: 'tension_symptoms',
    text: 'Do you have tightness or tenderness in your neck, shoulders, or scalp?',
    options: [
      { text: 'Yes', next: 'results_tension', severity: 'low' },
      { text: 'No', next: 'duration' },
    ],
  },
  sinus_symptoms: {
    id: 'sinus_symptoms',
    text: 'Do you have any of these symptoms?',
    options: [
      {
        text: 'Facial pressure or pain that worsens when bending forward',
        next: 'results_sinus',
        severity: 'low',
      },
      {
        text: 'Nasal congestion or runny nose',
        next: 'results_sinus',
        severity: 'low',
      },
      { text: 'Neither of these', next: 'duration' },
    ],
  },
  location: {
    id: 'location',
    text: 'Where is your headache located?',
    options: [
      { text: 'One side of the head', next: 'one_sided' },
      { text: 'Both sides of the head', next: 'both_sides' },
      { text: 'Face or sinus area', next: 'sinus_symptoms' },
      { text: 'Back of the head/neck', next: 'tension_symptoms' },
    ],
  },
  duration: {
    id: 'duration',
    text: 'How long have you had this headache?',
    options: [
      { text: 'Less than 24 hours', next: 'triggers' },
      { text: '1-3 days', next: 'frequency' },
      { text: 'More than 3 days', next: 'chronic' },
    ],
  },
  chronic: {
    id: 'chronic',
    text: 'Have you had headaches like this for more than 2 weeks?',
    options: [
      { text: 'Yes', next: 'results_chronic', severity: 'medium' },
      { text: 'No', next: 'frequency' },
    ],
  },
  frequency: {
    id: 'frequency',
    text: 'How often do you get headaches?',
    options: [
      { text: 'This is unusual for me', next: 'triggers' },
      {
        text: 'I get them occasionally (less than once a month)',
        next: 'triggers',
      },
      {
        text: 'Regularly (several times a month)',
        next: 'results_recurrent',
        severity: 'medium',
      },
      {
        text: 'Very frequently (weekly or more)',
        next: 'results_recurrent',
        severity: 'medium',
      },
    ],
  },
  triggers: {
    id: 'triggers',
    text: 'Did anything potentially trigger this headache?',
    options: [
      {
        text: 'Stress, lack of sleep, or skipped meals',
        next: 'results_primary',
        severity: 'low',
      },
      {
        text: 'Alcohol, certain foods, or strong scents',
        next: 'results_primary',
        severity: 'low',
      },
      {
        text: 'Recent head injury',
        next: 'results_post_trauma',
        severity: 'medium',
      },
      {
        text: 'None that I can identify',
        next: 'results_primary',
        severity: 'low',
      },
    ],
  },
};

const results: Record<string, Result> = {
  results_emergency: {
    title: 'Seek Emergency Care',
    description:
      'Your symptoms suggest a potentially serious condition that requires immediate medical evaluation.',
    recommendation:
      'Please go to the nearest emergency room or call emergency services immediately.',
    severity: 'high',
  },
  results_migraine: {
    title: 'Likely Migraine Headache',
    description:
      'Your symptoms are consistent with a migraine headache, especially given your previous diagnosis.',
    recommendation:
      'Follow your usual migraine treatment plan. If this migraine is unusually severe or different from your usual pattern, consider contacting your healthcare provider.',
    severity: 'medium',
  },
  results_tension: {
    title: 'Tension Headache',
    description:
      'Your symptoms suggest a tension headache, which is often related to stress, muscle tension, or poor posture.',
    recommendation:
      'Rest, over-the-counter pain relievers, and relaxation techniques may help. If headaches are frequent or interfere with daily activities, consult your healthcare provider.',
    severity: 'low',
  },
  results_sinus: {
    title: 'Possible Sinus Headache',
    description:
      'Your symptoms suggest a headache related to sinus congestion or infection.',
    recommendation:
      'Over-the-counter decongestants and pain relievers may help. If you have fever, severe pain, or symptoms lasting more than 7 days, consult your healthcare provider.',
    severity: 'low',
  },
  results_primary: {
    title: 'Common Headache',
    description:
      'Your symptoms suggest a primary headache (like tension-type or mild migraine), which is uncomfortable but typically not dangerous.',
    recommendation:
      'Rest, hydration, and over-the-counter pain relievers may help. If headaches become more frequent or severe, consult your healthcare provider.',
    severity: 'low',
  },
  results_recurrent: {
    title: 'Recurrent Headache Pattern',
    description:
      'You appear to have a pattern of recurring headaches that should be evaluated.',
    recommendation:
      'Please schedule an appointment with your healthcare provider to discuss your headache pattern and possible treatment options.',
    severity: 'medium',
  },
  results_chronic: {
    title: 'Chronic Headache',
    description:
      'Persistent headaches lasting more than two weeks should be evaluated by a healthcare provider.',
    recommendation:
      'Please make an appointment with your healthcare provider to discuss your symptoms and develop a management plan.',
    severity: 'medium',
  },
  results_post_trauma: {
    title: 'Post-Traumatic Headache',
    description:
      'Headaches following head injury could indicate a concussion or other trauma-related issue.',
    recommendation:
      'Please consult with a healthcare provider to evaluate your head injury and headache symptoms.',
    severity: 'medium',
  },
};

export default function Headache() {
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
