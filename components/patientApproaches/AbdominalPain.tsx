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
    text: 'Where is your abdominal pain located?',
    options: [
      { text: 'Upper right abdomen', next: 'upper_right' },
      { text: 'Upper left abdomen', next: 'upper_left' },
      { text: 'Upper center/middle abdomen', next: 'upper_center' },
      { text: 'Lower right abdomen', next: 'lower_right' },
      { text: 'Lower left abdomen', next: 'lower_left' },
      { text: 'Lower center/middle abdomen', next: 'lower_center' },
      { text: 'All over abdomen/generalized', next: 'generalized' },
    ],
  },
  upper_right: {
    id: 'upper_right',
    text: 'Do you have any of these additional symptoms?',
    options: [
      {
        text: 'Yellowing of skin or eyes (jaundice)',
        next: 'results_liver',
        severity: 'high',
      },
      {
        text: 'Pain radiates to back or shoulder',
        next: 'gallbladder_symptoms',
      },
      { text: 'Nausea or vomiting', next: 'gallbladder_symptoms' },
      { text: 'None of the above', next: 'pain_characteristics' },
    ],
  },
  gallbladder_symptoms: {
    id: 'gallbladder_symptoms',
    text: 'Is your pain worse after eating fatty foods?',
    options: [
      { text: 'Yes', next: 'results_gallbladder', severity: 'medium' },
      { text: 'No', next: 'pain_characteristics' },
    ],
  },
  upper_left: {
    id: 'upper_left',
    text: 'Do you have any of these symptoms?',
    options: [
      {
        text: 'Pain that worsens when taking deep breaths',
        next: 'results_spleen',
        severity: 'medium',
      },
      {
        text: 'Recent injury to the area',
        next: 'results_spleen',
        severity: 'medium',
      },
      {
        text: 'Feeling full quickly when eating',
        next: 'results_gastric',
        severity: 'medium',
      },
      { text: 'None of the above', next: 'pain_characteristics' },
    ],
  },
  upper_center: {
    id: 'upper_center',
    text: 'Do you have any of these symptoms?',
    options: [
      {
        text: 'Burning sensation that worsens after eating',
        next: 'results_gerd',
        severity: 'low',
      },
      {
        text: 'Pain that improves when eating or taking antacids',
        next: 'results_gastric',
        severity: 'medium',
      },
      {
        text: 'Pain radiating through to your back',
        next: 'pancreas_symptoms',
      },
      { text: 'None of the above', next: 'pain_characteristics' },
    ],
  },
  pancreas_symptoms: {
    id: 'pancreas_symptoms',
    text: 'Have you been drinking a lot of alcohol recently?',
    options: [
      { text: 'Yes', next: 'results_pancreatitis', severity: 'high' },
      { text: 'No', next: 'pain_characteristics' },
    ],
  },
  lower_right: {
    id: 'lower_right',
    text: 'How would you describe your pain?',
    options: [
      {
        text: 'Started near belly button, then moved to lower right',
        next: 'appendix_symptoms',
      },
      {
        text: 'Pain in right side that may affect urination',
        next: 'results_kidney',
        severity: 'medium',
      },
      {
        text: 'Women only: Pain with vaginal bleeding or discharge',
        next: 'results_gynecological',
        severity: 'medium',
      },
      {
        text: 'General discomfort rather than sharp pain',
        next: 'results_intestinal',
        severity: 'low',
      },
    ],
  },
  appendix_symptoms: {
    id: 'appendix_symptoms',
    text: 'Do you have these other symptoms?',
    options: [
      {
        text: 'Loss of appetite',
        next: 'results_appendicitis',
        severity: 'high',
      },
      {
        text: 'Nausea or vomiting',
        next: 'results_appendicitis',
        severity: 'high',
      },
      {
        text: 'Pain gets worse when moving, coughing, or sneezing',
        next: 'results_appendicitis',
        severity: 'high',
      },
      { text: 'None of the above', next: 'pain_characteristics' },
    ],
  },
  lower_left: {
    id: 'lower_left',
    text: 'Do you have any of these symptoms?',
    options: [
      {
        text: 'Fever and/or change in bowel movements',
        next: 'results_diverticulitis',
        severity: 'medium',
      },
      {
        text: 'Pain that improves after bowel movement',
        next: 'results_intestinal',
        severity: 'low',
      },
      {
        text: 'Women only: Pain with vaginal bleeding or discharge',
        next: 'results_gynecological',
        severity: 'medium',
      },
      { text: 'None of the above', next: 'pain_characteristics' },
    ],
  },
  lower_center: {
    id: 'lower_center',
    text: 'Do you have any of these symptoms?',
    options: [
      {
        text: 'Burning when urinating or frequent urination',
        next: 'results_urinary',
        severity: 'medium',
      },
      {
        text: 'Women only: Missed period or abnormal bleeding',
        next: 'results_gynecological',
        severity: 'medium',
      },
      {
        text: 'Pain comes and goes in waves',
        next: 'results_intestinal',
        severity: 'low',
      },
      { text: 'None of the above', next: 'pain_characteristics' },
    ],
  },
  generalized: {
    id: 'generalized',
    text: 'How would you describe your pain?',
    options: [
      {
        text: 'Severe, intense pain that came on suddenly',
        next: 'emergency_symptoms',
      },
      { text: 'Crampy pain that comes and goes', next: 'gastro_symptoms' },
      { text: 'Constant dull ache or discomfort', next: 'duration_symptoms' },
    ],
  },
  emergency_symptoms: {
    id: 'emergency_symptoms',
    text: 'Do you have any of these serious symptoms?',
    options: [
      {
        text: 'Vomiting blood or material that looks like coffee grounds',
        next: 'results_emergency',
        severity: 'high',
      },
      {
        text: 'Unable to pass gas or have bowel movements',
        next: 'results_emergency',
        severity: 'high',
      },
      {
        text: 'Severe tenderness when abdomen is touched',
        next: 'results_emergency',
        severity: 'high',
      },
      {
        text: 'Abdominal swelling/bloating',
        next: 'results_intestinal_severe',
        severity: 'high',
      },
      { text: 'None of the above', next: 'pain_characteristics' },
    ],
  },
  gastro_symptoms: {
    id: 'gastro_symptoms',
    text: 'Do you have diarrhea, nausea, or vomiting?',
    options: [
      {
        text: 'Yes, with fever over 101°F (38.3°C)',
        next: 'results_gastroenteritis',
        severity: 'medium',
      },
      {
        text: 'Yes, but no significant fever',
        next: 'results_gastroenteritis',
        severity: 'low',
      },
      { text: 'No', next: 'pain_characteristics' },
    ],
  },
  duration_symptoms: {
    id: 'duration_symptoms',
    text: 'How long have you had this pain?',
    options: [
      { text: 'Less than 24 hours', next: 'recent_symptoms' },
      { text: '1-3 days', next: 'recent_symptoms' },
      { text: 'More than 3 days', next: 'chronic_symptoms' },
      { text: 'Comes and goes for weeks or months', next: 'chronic_symptoms' },
    ],
  },
  recent_symptoms: {
    id: 'recent_symptoms',
    text: 'Have you eaten anything unusual or possibly spoiled in the last 24 hours?',
    options: [
      { text: 'Yes', next: 'results_food_poisoning', severity: 'medium' },
      { text: 'No', next: 'pain_characteristics' },
    ],
  },
  chronic_symptoms: {
    id: 'chronic_symptoms',
    text: 'Do you often have pain associated with eating certain foods?',
    options: [
      { text: 'Yes', next: 'results_food_intolerance', severity: 'low' },
      { text: 'No', next: 'results_chronic_pain', severity: 'medium' },
    ],
  },
  pain_characteristics: {
    id: 'pain_characteristics',
    text: 'How severe is your pain?',
    options: [
      { text: 'Mild to moderate', next: 'mild_duration' },
      { text: 'Severe (7-10 on a scale of 10)', next: 'emergency_symptoms' },
    ],
  },
  mild_duration: {
    id: 'mild_duration',
    text: 'How long have you had this pain?',
    options: [
      { text: 'Less than 24 hours', next: 'results_monitor', severity: 'low' },
      { text: '1-3 days', next: 'results_primary_care', severity: 'medium' },
      {
        text: 'More than 3 days',
        next: 'results_primary_care',
        severity: 'medium',
      },
      {
        text: 'Comes and goes for weeks or months',
        next: 'results_chronic_pain',
        severity: 'medium',
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
  results_appendicitis: {
    title: 'Possible Appendicitis',
    description:
      'Your symptoms suggest possible appendicitis, which is inflammation of the appendix.',
    recommendation:
      'This is a medical emergency that requires prompt attention. Please go to the emergency room immediately.',
    severity: 'high',
  },
  results_gallbladder: {
    title: 'Possible Gallbladder Issue',
    description:
      'Your symptoms are consistent with gallbladder problems, such as gallstones or cholecystitis.',
    recommendation:
      'Please see a healthcare provider within 24 hours. If pain becomes severe or you develop fever or vomiting, seek emergency care.',
    severity: 'medium',
  },
  results_gastric: {
    title: 'Possible Gastric Issue',
    description:
      'Your symptoms suggest a stomach problem such as gastritis or a peptic ulcer.',
    recommendation:
      'Schedule an appointment with your healthcare provider within a few days. Avoid spicy foods, alcohol, and NSAIDs in the meantime.',
    severity: 'medium',
  },
  results_gerd: {
    title: 'Possible Acid Reflux (GERD)',
    description:
      'Your symptoms are consistent with acid reflux or GERD (gastroesophageal reflux disease).',
    recommendation:
      'Try over-the-counter antacids and avoid trigger foods. If symptoms persist beyond a week, see your healthcare provider.',
    severity: 'low',
  },
  results_pancreatitis: {
    title: 'Possible Pancreatitis',
    description:
      'Your symptoms suggest inflammation of the pancreas, which can be serious.',
    recommendation:
      'Please seek medical care promptly. If pain is severe or worsening, go to the emergency room.',
    severity: 'high',
  },
  results_diverticulitis: {
    title: 'Possible Diverticulitis',
    description:
      'Your symptoms suggest inflammation of small pouches in your digestive tract (diverticulitis).',
    recommendation:
      'Please see a healthcare provider within 24-48 hours. If pain becomes severe or you develop fever over 101°F, seek emergency care.',
    severity: 'medium',
  },
  results_intestinal: {
    title: 'Likely Intestinal Issue',
    description:
      'Your symptoms suggest a functional bowel disorder or irritable bowel syndrome.',
    recommendation:
      'Try over-the-counter remedies appropriate for your symptoms. If symptoms persist beyond a week, see your healthcare provider.',
    severity: 'low',
  },
  results_intestinal_severe: {
    title: 'Possible Intestinal Obstruction',
    description:
      'Your symptoms suggest a possible intestinal obstruction or other serious intestinal issue.',
    recommendation:
      'This requires immediate medical attention. Please go to the emergency room.',
    severity: 'high',
  },
  results_gastroenteritis: {
    title: 'Possible Gastroenteritis',
    description:
      'Your symptoms suggest gastroenteritis (stomach flu) or a similar infection of the digestive tract.',
    recommendation:
      'Rest, stay hydrated, and try clear liquids. If unable to keep fluids down for more than 6 hours, have severe abdominal pain, or bloody diarrhea, seek medical care promptly.',
    severity: 'medium',
  },
  results_kidney: {
    title: 'Possible Kidney Issue',
    description:
      'Your symptoms may indicate a kidney stone or urinary tract infection that has reached the kidneys.',
    recommendation:
      'Please see a healthcare provider within 24-48 hours. If pain becomes severe or you develop high fever, seek emergency care.',
    severity: 'medium',
  },
  results_liver: {
    title: 'Possible Liver Issue',
    description: 'Your symptoms suggest a liver problem that needs evaluation.',
    recommendation:
      'Please seek medical attention within 24 hours. If you develop confusion or severe pain, go to the emergency room.',
    severity: 'high',
  },
  results_spleen: {
    title: 'Possible Spleen Issue',
    description:
      'Your symptoms suggest a problem with your spleen, especially if there was recent trauma.',
    recommendation:
      'Please see a healthcare provider promptly. If pain is severe or worsening, seek emergency care.',
    severity: 'medium',
  },
  results_urinary: {
    title: 'Possible Urinary Tract Infection',
    description: 'Your symptoms suggest a urinary tract infection (UTI).',
    recommendation:
      'Please see a healthcare provider within 24-48 hours. Drink plenty of water in the meantime.',
    severity: 'medium',
  },
  results_gynecological: {
    title: 'Possible Gynecological Issue',
    description:
      'Your symptoms suggest a gynecological condition such as ovarian cyst, pelvic inflammatory disease, or possibly ectopic pregnancy (if pregnancy is possible).',
    recommendation:
      'Please see a healthcare provider within 24-48 hours. If pain is severe or you have heavy vaginal bleeding, seek emergency care.',
    severity: 'medium',
  },
  results_food_poisoning: {
    title: 'Possible Food Poisoning',
    description:
      'Your symptoms suggest food poisoning from contaminated food or drink.',
    recommendation:
      'Rest and stay hydrated. If unable to keep fluids down, have symptoms lasting more than 2 days, or develop high fever, seek medical care.',
    severity: 'medium',
  },
  results_food_intolerance: {
    title: 'Possible Food Intolerance',
    description: 'Your symptoms suggest a food intolerance or sensitivity.',
    recommendation:
      'Consider keeping a food diary to identify triggers. Schedule an appointment with your healthcare provider to discuss testing and management options.',
    severity: 'low',
  },
  results_chronic_pain: {
    title: 'Chronic Abdominal Pain',
    description:
      'Persistent abdominal pain lasting weeks or months should be evaluated by a healthcare provider.',
    recommendation:
      'Please schedule an appointment with your healthcare provider to discuss your symptoms and develop a management plan.',
    severity: 'medium',
  },
  results_monitor: {
    title: 'Monitor Symptoms',
    description:
      'Your symptoms appear to be mild and recent, which often indicate a minor, self-limiting condition.',
    recommendation:
      'Rest, stay hydrated, and monitor symptoms. If pain worsens or new symptoms develop within 24 hours, reassess using this tool or contact your healthcare provider.',
    severity: 'low',
  },
  results_primary_care: {
    title: 'See Healthcare Provider',
    description:
      'Your symptoms suggest a condition that should be evaluated by a healthcare provider.',
    recommendation:
      'Please schedule an appointment with your healthcare provider within the next few days to evaluate your symptoms.',
    severity: 'medium',
  },
};

export default function AbdominalPain() {
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
