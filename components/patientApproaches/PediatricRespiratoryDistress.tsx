import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Check,
  Copy,
  FileText,
  Info,
  Clock,
} from 'lucide-react';

export default function PediatricRespiratoryApp() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [progress, setProgress] = useState(0);
  const [responses, setResponses] = useState({});
  const [emergencyDetected, setEmergencyDetected] = useState(false);

  // Questions organized by screens
  const screens = {
    welcome: {
      title: 'Pediatric Respiratory Assessment',
      content:
        "This assessment will help gather important information about your child's breathing difficulties. Complete this before your doctor's appointment to help your healthcare provider understand your child's symptoms better.",
      next: 'patient_info',
      type: 'info',
    },
    patient_info: {
      title: 'Child Information',
      question: 'Please share some basic information about your child:',
      fields: [
        { id: 'age', label: 'Age', type: 'text', placeholder: 'e.g., 2 years' },
        {
          id: 'gender',
          label: 'Gender',
          type: 'select',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ],
        },
      ],
      type: 'form',
      next: 'emergency_screening',
    },
    emergency_screening: {
      title: 'Emergency Screening',
      question:
        'Is your child currently experiencing any of these serious symptoms?',
      options: [
        {
          id: 'severe_distress',
          text: 'Severe breathing difficulty (gasping, unable to speak/cry)',
        },
        {
          id: 'blue_color',
          text: 'Blue or gray color of face, lips, or fingernails',
        },
        {
          id: 'decreased_consciousness',
          text: 'Unusually sleepy, difficult to wake, or confused',
        },
        { id: 'drooling', text: 'Excessive drooling or inability to swallow' },
        { id: 'none', text: 'None of the above' },
      ],
      type: 'checkbox',
      next: (responses) => {
        const selected = responses.emergency_screening || [];
        if (selected.length > 0 && !selected.includes('none')) {
          setEmergencyDetected(true);
          return 'emergency_guidance';
        }
        return 'onset';
      },
    },
    emergency_guidance: {
      title: 'Emergency Alert',
      content:
        "These symptoms suggest this could be an emergency. Please call 911 or go to the nearest emergency room immediately. You can continue with this assessment, but don't delay seeking medical care.",
      type: 'emergency',
      next: 'onset',
    },
    onset: {
      title: 'Onset',
      question: "When did your child's breathing problems begin?",
      options: [
        { id: 'sudden', text: 'Suddenly (within minutes)' },
        { id: 'hours', text: 'Over several hours' },
        { id: 'days', text: 'Gradually over days' },
        { id: 'weeks', text: 'Over weeks' },
      ],
      type: 'radio',
      next: 'duration',
    },
    duration: {
      title: 'Duration',
      question: 'How long has your child been having breathing difficulties?',
      options: [
        { id: 'less_6hrs', text: 'Less than 6 hours' },
        { id: '6_24hrs', text: '6-24 hours' },
        { id: '1_3days', text: '1-3 days' },
        { id: 'more_3days', text: 'More than 3 days' },
      ],
      type: 'radio',
      next: 'episode_history',
    },
    episode_history: {
      title: 'Previous Episodes',
      question: 'Has your child had similar breathing problems before?',
      options: [
        { id: 'first_time', text: 'No, this is the first time' },
        { id: 'few_times', text: 'Yes, a few times before' },
        { id: 'many_times', text: 'Yes, many times before' },
      ],
      type: 'radio',
      next: (responses) => {
        if (responses.episode_history === 'first_time') {
          return 'breathing_quality';
        }
        return 'previous_diagnosis';
      },
    },
    previous_diagnosis: {
      title: 'Previous Diagnosis',
      question: 'Has your child been diagnosed with any of these conditions?',
      options: [
        { id: 'asthma', text: 'Asthma' },
        { id: 'bronchiolitis', text: 'Bronchiolitis' },
        { id: 'croup', text: 'Croup' },
        { id: 'pneumonia', text: 'Pneumonia' },
        { id: 'other', text: 'Other respiratory condition' },
        { id: 'none', text: 'No previous diagnosis' },
      ],
      type: 'checkbox',
      next: 'breathing_quality',
    },
    breathing_quality: {
      title: 'Breathing Quality',
      question: "How would you describe your child's breathing?",
      options: [
        { id: 'noisy', text: 'Noisy' },
        { id: 'fast', text: 'Fast' },
        { id: 'labored', text: 'Working hard to breathe' },
        { id: 'shallow', text: 'Shallow' },
        { id: 'irregular', text: 'Irregular pattern' },
      ],
      type: 'checkbox',
      next: 'breathing_sounds',
    },
    breathing_sounds: {
      title: 'Breathing Sounds',
      question: 'What noise does your child make when breathing?',
      options: [
        { id: 'wheeze', text: 'Wheezing (whistling sound when breathing out)' },
        { id: 'stridor', text: 'High-pitched sound when breathing in' },
        { id: 'grunting', text: 'Grunting sound' },
        { id: 'barking', text: 'Barking/seal-like cough' },
        { id: 'no_noise', text: 'No unusual noises' },
      ],
      type: 'checkbox',
      next: (responses) => {
        const selected = responses.breathing_sounds || [];
        if (selected.includes('stridor') || selected.includes('grunting')) {
          setEmergencyDetected(true);
        }
        return 'work_of_breathing';
      },
    },
    work_of_breathing: {
      title: 'Work of Breathing',
      question:
        'Do you notice any of these signs that your child is working hard to breathe?',
      options: [
        { id: 'nasal_flaring', text: 'Nostrils flaring out with each breath' },
        {
          id: 'retractions',
          text: 'Skin pulling in between or below the ribs',
        },
        { id: 'head_bobbing', text: 'Head bobbing with breaths' },
        { id: 'positioning', text: 'Sitting forward, unable to lie down' },
        { id: 'none', text: 'None of these signs' },
      ],
      type: 'checkbox',
      next: (responses) => {
        const selected = responses.work_of_breathing || [];
        if (
          selected.includes('head_bobbing') ||
          selected.includes('positioning')
        ) {
          setEmergencyDetected(true);
        }
        return 'cough';
      },
    },
    cough: {
      title: 'Cough',
      question: 'Does your child have a cough?',
      options: [
        { id: 'no_cough', text: 'No cough' },
        { id: 'dry_cough', text: 'Dry cough' },
        { id: 'wet_cough', text: 'Wet/productive cough' },
        { id: 'barking_cough', text: 'Barking/seal-like cough' },
        { id: 'whooping', text: "Cough ending with a 'whooping' sound" },
      ],
      type: 'radio',
      next: 'fever',
    },
    fever: {
      title: 'Fever',
      question: 'Has your child had a fever?',
      options: [
        { id: 'no_fever', text: 'No fever' },
        { id: 'low_fever', text: 'Low fever (up to 100.4°F/38°C)' },
        { id: 'high_fever', text: 'High fever (over 100.4°F/38°C)' },
        { id: 'not_measured', text: 'Feels warm but temperature not measured' },
      ],
      type: 'radio',
      next: 'fever_duration',
    },
    fever_duration: {
      title: 'Fever Duration',
      question: 'How long has your child had a fever?',
      options: [
        { id: 'no_fever', text: 'No fever' },
        { id: 'less_24hrs', text: 'Less than 24 hours' },
        { id: '1_3days', text: '1-3 days' },
        { id: 'more_3days', text: 'More than 3 days' },
      ],
      type: 'radio',
      next: 'associated_symptoms',
    },
    associated_symptoms: {
      title: 'Associated Symptoms',
      question: 'Does your child have any of these symptoms?',
      options: [
        { id: 'runny_nose', text: 'Runny or stuffy nose' },
        { id: 'sore_throat', text: 'Sore throat or pain when swallowing' },
        { id: 'ear_pain', text: 'Ear pain' },
        { id: 'rash', text: 'Rash' },
        { id: 'vomiting', text: 'Vomiting' },
        { id: 'diarrhea', text: 'Diarrhea' },
        { id: 'none', text: 'None of these symptoms' },
      ],
      type: 'checkbox',
      next: 'feeding',
    },
    feeding: {
      title: 'Feeding/Drinking',
      question: "How is your child's feeding or drinking?",
      options: [
        { id: 'normal', text: 'Normal' },
        { id: 'decreased', text: 'Drinking/eating less than usual' },
        { id: 'refusing', text: 'Refusing to drink or eat' },
        { id: 'vomiting', text: 'Vomiting after feeding' },
        { id: 'difficulty', text: 'Choking or difficulty swallowing' },
      ],
      type: 'radio',
      next: (responses) => {
        if (
          responses.feeding === 'refusing' ||
          responses.feeding === 'difficulty'
        ) {
          setEmergencyDetected(true);
        }
        return 'activity';
      },
    },
    activity: {
      title: 'Activity Level',
      question: "How is your child's activity level compared to normal?",
      options: [
        { id: 'normal', text: 'Normal activity' },
        { id: 'slightly_decreased', text: 'Slightly less active than usual' },
        { id: 'significantly_decreased', text: 'Much less active than usual' },
        { id: 'lethargic', text: 'Very tired/lethargic' },
      ],
      type: 'radio',
      next: (responses) => {
        if (responses.activity === 'lethargic') {
          setEmergencyDetected(true);
        }
        return 'sleep';
      },
    },
    sleep: {
      title: 'Sleep',
      question: "How has your child's breathing affected their sleep?",
      options: [
        { id: 'normal', text: 'Sleeping normally' },
        { id: 'difficulty', text: 'Difficulty falling asleep' },
        { id: 'waking', text: 'Waking up due to breathing problems' },
        { id: 'unable', text: 'Unable to sleep' },
      ],
      type: 'radio',
      next: 'triggers',
    },
    triggers: {
      title: 'Triggers',
      question: "Do any of these things seem to worsen your child's breathing?",
      options: [
        { id: 'activity', text: 'Physical activity' },
        { id: 'lying_down', text: 'Lying down' },
        { id: 'cold_air', text: 'Cold air' },
        { id: 'allergens', text: 'Known allergens' },
        { id: 'crying', text: 'Crying or emotional distress' },
        { id: 'none', text: 'Nothing specific' },
      ],
      type: 'checkbox',
      next: 'improvements',
    },
    improvements: {
      title: 'Improvements',
      question: "Does anything help improve your child's breathing?",
      options: [
        { id: 'position', text: 'Sitting upright or certain positions' },
        { id: 'steam', text: 'Steam (shower, humidifier)' },
        { id: 'cold_air', text: 'Cold air' },
        {
          id: 'medications',
          text: 'Rescue medications (if previously prescribed)',
        },
        { id: 'rest', text: 'Rest' },
        { id: 'nothing', text: 'Nothing helps' },
      ],
      type: 'checkbox',
      next: 'medications',
    },
    medications: {
      title: 'Current Medications',
      question: 'Is your child taking any medications for this episode?',
      options: [
        { id: 'none', text: 'No medications' },
        { id: 'albuterol', text: 'Albuterol or other inhaler' },
        { id: 'steroids', text: 'Steroids (oral or inhaled)' },
        { id: 'antibiotics', text: 'Antibiotics' },
        { id: 'otc', text: 'Over-the-counter medications' },
      ],
      type: 'checkbox',
      next: (responses) => {
        const selected = responses.medications || [];
        if (!selected.includes('none')) {
          return 'medication_details';
        }
        return 'medication_response';
      },
    },
    medication_details: {
      title: 'Medication Details',
      question:
        'Please provide details about the medications your child is taking:',
      type: 'textarea',
      placeholder: 'Name of medication, dose, how often, when started',
      next: 'medication_response',
    },
    medication_response: {
      title: 'Medication Response',
      question: 'If your child is taking medications, how have they responded?',
      options: [
        { id: 'not_taking', text: 'Not taking any medications' },
        { id: 'improved', text: 'Symptoms improved' },
        { id: 'no_change', text: 'No change in symptoms' },
        { id: 'worse', text: 'Symptoms got worse' },
      ],
      type: 'radio',
      next: 'exposure',
    },
    exposure: {
      title: 'Illness Exposure',
      question:
        'Has your child been exposed to anyone with similar symptoms or known infections?',
      options: [
        { id: 'no', text: 'No known exposures' },
        { id: 'household', text: 'Yes, household member' },
        { id: 'school', text: 'Yes, at school/daycare' },
        { id: 'other', text: 'Yes, other exposure' },
      ],
      type: 'radio',
      next: 'medical_history',
    },
    medical_history: {
      title: 'Medical History',
      question: 'Does your child have any of these conditions?',
      options: [
        { id: 'premature', text: 'Born premature' },
        { id: 'asthma', text: 'Asthma' },
        { id: 'allergies', text: 'Allergies' },
        { id: 'eczema', text: 'Eczema' },
        { id: 'heart_disease', text: 'Heart disease' },
        { id: 'reflux', text: 'Acid reflux (GERD)' },
        { id: 'none', text: 'None of these conditions' },
      ],
      type: 'checkbox',
      next: 'environmental',
    },
    environmental: {
      title: 'Environmental Factors',
      question: "Are any of these present in your child's environment?",
      options: [
        { id: 'smoke', text: 'Tobacco smoke' },
        { id: 'pets', text: 'Pets' },
        { id: 'dust', text: 'Dust' },
        { id: 'mold', text: 'Mold' },
        { id: 'recent_renovation', text: 'Recent home renovation' },
        { id: 'none', text: 'None of these factors' },
      ],
      type: 'checkbox',
      next: 'previous_hospitalizations',
    },
    previous_hospitalizations: {
      title: 'Previous Hospitalizations',
      question: 'Has your child ever been hospitalized for breathing problems?',
      options: [
        { id: 'never', text: 'Never' },
        { id: 'once', text: 'Once' },
        { id: 'multiple', text: 'Multiple times' },
        { id: 'icu', text: 'Yes, including ICU stay' },
      ],
      type: 'radio',
      next: 'additional_info',
    },
    additional_info: {
      title: 'Additional Information',
      question: 'Is there anything else important for your doctor to know?',
      type: 'textarea',
      placeholder:
        "Any other concerns or information about your child's breathing problems",
      next: 'review',
    },
    review: {
      title: 'Review Your Responses',
      type: 'review',
      next: 'submit',
    },
    submit: {
      title: 'Assessment Complete',
      content:
        "Thank you for completing the pediatric respiratory assessment. This information will help your healthcare provider understand your child's symptoms better.",
      type: 'completion',
    },
  };

  // Calculate total screens for progress bar (excluding welcome and completion)
  const totalScreens = Object.keys(screens).filter(
    (key) =>
      key !== 'welcome' && key !== 'submit' && key !== 'emergency_guidance'
  ).length;

  const handleNext = () => {
    const currentScreenObj = screens[currentScreen];

    // If the next screen depends on responses
    if (typeof currentScreenObj.next === 'function') {
      const nextScreen = currentScreenObj.next(responses);
      setCurrentScreen(nextScreen);
    } else {
      // Otherwise, go to the defined next screen
      setCurrentScreen(currentScreenObj.next);
    }

    // Update progress (skip welcome and emergency screens for progress calculation)
    if (
      currentScreen !== 'welcome' &&
      currentScreen !== 'emergency_guidance' &&
      currentScreen !== 'submit'
    ) {
      setProgress(Math.min(progress + 1, totalScreens));
    }
  };

  const handleBack = () => {
    // This is simplified - in a real app, we would track the screen history
    if (currentScreen !== 'welcome') {
      if (
        currentScreen !== 'emergency_guidance' &&
        currentScreen !== 'submit'
      ) {
        setProgress(Math.max(progress - 1, 0));
      }
      // This is a simplified version - a real app would need proper navigation history
      const previousScreens = Object.keys(screens);
      const currentIndex = previousScreens.indexOf(currentScreen);
      if (currentIndex > 0) {
        setCurrentScreen(previousScreens[currentIndex - 1]);
      }
    }
  };

  const handleResponse = (question, value) => {
    setResponses({
      ...responses,
      [question]: value,
    });
  };

  const handleCheckboxResponse = (question, id, checked) => {
    const currentSelections = responses[question] || [];
    let newSelections;

    if (checked) {
      // If "none" is selected, clear other selections
      if (id === 'none' || id === 'no_fever' || id === 'normal') {
        newSelections = [id];
      } else {
        // If another option is selected, remove "none" if present
        newSelections = [
          ...currentSelections.filter(
            (item) =>
              item !== 'none' && item !== 'no_fever' && item !== 'normal'
          ),
          id,
        ];
      }
    } else {
      newSelections = currentSelections.filter((item) => item !== id);
    }

    setResponses({
      ...responses,
      [question]: newSelections,
    });
  };

  const handleFormResponse = (question, field, value) => {
    const currentForm = responses[question] || {};
    setResponses({
      ...responses,
      [question]: {
        ...currentForm,
        [field]: value,
      },
    });
  };

  const copyToClipboard = () => {
    // Create a formatted text of all responses
    const formattedText = Object.entries(responses)
      .map(([question, answer]) => {
        const questionText = screens[question]?.question || question;

        if (typeof answer === 'object' && !Array.isArray(answer)) {
          // Handle form responses
          return `${questionText}\n${Object.entries(answer)
            .map(([field, value]) => {
              const fieldLabel =
                screens[question]?.fields?.find((f) => f.id === field)?.label ||
                field;
              return `${fieldLabel}: ${value}`;
            })
            .join('\n')}`;
        }

        const formattedAnswer = Array.isArray(answer)
          ? answer
              .map((id) => {
                const option = screens[question]?.options?.find(
                  (opt) => opt.id === id
                );
                return option ? option.text : id;
              })
              .join(', ')
          : answer;
        return `${questionText}\n${formattedAnswer}`;
      })
      .join('\n\n');

    navigator.clipboard
      .writeText(formattedText)
      .then(() => {
        alert('Assessment copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const renderScreen = () => {
    const screen = screens[currentScreen];

    if (!screen) return <div>Screen not found</div>;

    // Display shared progress bar for all screens except welcome, emergency and completion
    const showProgress =
      currentScreen !== 'welcome' &&
      currentScreen !== 'submit' &&
      currentScreen !== 'emergency_guidance';

    return (
      <div className="flex flex-col h-full">
        {showProgress && (
          <div className="px-4 py-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(progress / totalScreens) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-right mt-1 text-gray-500">
              {progress} of {totalScreens}
            </div>
          </div>
        )}

        <div className="flex-1 p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4">{screen.title}</h2>

          {/* Emergency Screen */}
          {screen.type === 'emergency' && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700">{screen.content}</p>
              </div>
            </div>
          )}

          {/* Info Screen */}
          {screen.type === 'info' && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <p>{screen.content}</p>
              </div>
            </div>
          )}

          {/* Completion Screen */}
          {screen.type === 'completion' && (
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 inline-block mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <p className="mb-6">{screen.content}</p>

              {emergencyDetected && (
                <div className="mb-6 bg-red-100 border-l-4 border-red-500 p-4 text-left">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-red-700">
                      Your responses indicate potential warning signs. Please
                      seek medical attention promptly.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={copyToClipboard}
                className="flex items-center mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Assessment
              </button>
            </div>
          )}

          {/* Review Screen */}
          {screen.type === 'review' && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                <h3 className="font-medium">Summary of Your Responses</h3>
              </div>

              {emergencyDetected && (
                <div className="mb-4 bg-red-100 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-red-700 text-sm">
                      Your responses indicate potentially serious symptoms.
                      Please consider seeking immediate medical attention.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {Object.entries(responses).map(([questionId, answer]) => {
                  const questionScreen = screens[questionId];
                  if (!questionScreen || !questionScreen.question) return null;

                  return (
                    <div key={questionId} className="border-b pb-2">
                      <p className="font-medium text-sm">
                        {questionScreen.question}
                      </p>

                      {/* Handle form responses */}
                      {typeof answer === 'object' && !Array.isArray(answer) ? (
                        <div className="text-gray-700">
                          {Object.entries(answer).map(([field, value]) => {
                            const fieldConfig = questionScreen.fields?.find(
                              (f) => f.id === field
                            );
                            return (
                              <p key={field}>
                                <span className="font-medium">
                                  {fieldConfig?.label || field}:
                                </span>{' '}
                                {value}
                              </p>
                            );
                          })}
                        </div>
                      ) : Array.isArray(answer) ? (
                        <p className="text-gray-700">
                          {answer
                            .map((id) => {
                              const option = questionScreen.options?.find(
                                (opt) => opt.id === id
                              );
                              return option ? option.text : id;
                            })
                            .join(', ')}
                        </p>
                      ) : (
                        <p className="text-gray-700">{answer}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Screen */}
          {screen.type === 'form' && screen.fields && (
            <div className="mb-6 space-y-4">
              <p className="text-gray-700 mb-2">{screen.question}</p>

              {screen.fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder={field.placeholder || ''}
                      value={responses[currentScreen]?.[field.id] || ''}
                      onChange={(e) =>
                        handleFormResponse(
                          currentScreen,
                          field.id,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={responses[currentScreen]?.[field.id] || ''}
                      onChange={(e) =>
                        handleFormResponse(
                          currentScreen,
                          field.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Question Screens */}
          {screen.question && screen.type !== 'form' && (
            <div className="mb-6">
              <p className="text-lg mb-4">{screen.question}</p>

              {/* Radio Options */}
              {screen.type === 'radio' && screen.options && (
                <div className="space-y-3">
                  {screen.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-3 border rounded-lg cursor-pointer ${
                        responses[currentScreen] === option.id
                          ? 'bg-blue-50 border-blue-500'
                          : 'border-gray-300'
                      }`}
                      onClick={() => handleResponse(currentScreen, option.id)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${
                            responses[currentScreen] === option.id
                              ? 'border-blue-500'
                              : 'border-gray-400'
                          }`}
                        >
                          {responses[currentScreen] === option.id && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <span>{option.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Checkbox Options */}
              {screen.type === 'checkbox' && screen.options && (
                <div className="space-y-3">
                  {screen.options.map((option) => {
                    const isSelected = (
                      responses[currentScreen] || []
                    ).includes(option.id);
                    return (
                      <div
                        key={option.id}
                        className={`p-3 border rounded-lg cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500'
                            : 'border-gray-300'
                        }`}
                        onClick={() =>
                          handleCheckboxResponse(
                            currentScreen,
                            option.id,
                            !isSelected
                          )
                        }
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center mr-3 flex-shrink-0 ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-400'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span>{option.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Text Area */}
              {screen.type === 'textarea' && (
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 h-32"
                  placeholder={
                    screen.placeholder || 'Type your response here...'
                  }
                  value={responses[currentScreen] || ''}
                  onChange={(e) =>
                    handleResponse(currentScreen, e.target.value)
                  }
                ></textarea>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="p-4 border-t flex justify-between">
          {currentScreen !== 'welcome' && (
            <button
              onClick={handleBack}
              className="px-4 py-2 flex items-center text-gray-600"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
          )}
          {currentScreen !== 'submit' && (
            <button
              onClick={handleNext}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentScreen === 'welcome'
                  ? 'bg-blue-500 text-white mx-auto'
                  : 'bg-blue-500 text-white ml-auto'
              }`}
              disabled={
                (screen.type === 'radio' && !responses[currentScreen]) ||
                (screen.type === 'form' &&
                  (!responses[currentScreen] ||
                    screen.fields.some(
                      (field) =>
                        !responses[currentScreen]?.[field.id] && field.required
                    )))
              }
            >
              {currentScreen === 'review' ? 'Submit' : 'Next'}
              {currentScreen !== 'review' && (
                <ChevronRight className="h-5 w-5 ml-1" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white h-screen flex flex-col overflow-hidden shadow-lg border">
      {renderScreen()}
    </div>
  );
}
