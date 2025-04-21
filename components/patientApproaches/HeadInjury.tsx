import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Copy,
  ChevronLeft,
  RefreshCw,
} from 'lucide-react';

export default function HeadacheTrackerApp() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    // Onset
    onsetType: '',
    onsetDate: '',
    // Pain characteristics
    painLocation: [],
    painQuality: [],
    painSeverity: 0,
    // Timing
    duration: '',
    frequency: '',
    // Triggers and relief
    triggers: [],
    reliefFactors: [],
    // Associated symptoms
    associatedSymptoms: [],
    // Alarm features
    alarmFeatures: [],
    // Medications
    currentMedications: [],
    medicationEffectiveness: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Total number of screens (excluding welcome, emergency, and submission screens)
  const totalScreens = 7;

  const handleNext = () => {
    if (currentScreen === 'welcome') {
      setCurrentScreen('emergency');
    } else if (currentScreen === 'emergency') {
      // Check if any alarm features are selected
      if (formData.alarmFeatures && formData.alarmFeatures.length > 0) {
        setCurrentScreen('emergencyWarning');
      } else {
        setCurrentScreen('onset');
        setProgress(1);
      }
    } else if (currentScreen === 'emergencyWarning') {
      setCurrentScreen('onset');
      setProgress(1);
    } else if (currentScreen === 'onset') {
      setCurrentScreen('painCharacteristics');
      setProgress(2);
    } else if (currentScreen === 'painCharacteristics') {
      setCurrentScreen('timing');
      setProgress(3);
    } else if (currentScreen === 'timing') {
      setCurrentScreen('triggersRelief');
      setProgress(4);
    } else if (currentScreen === 'triggersRelief') {
      setCurrentScreen('associatedSymptoms');
      setProgress(5);
    } else if (currentScreen === 'associatedSymptoms') {
      setCurrentScreen('medications');
      setProgress(6);
    } else if (currentScreen === 'medications') {
      setCurrentScreen('review');
      setProgress(7);
    } else if (currentScreen === 'review') {
      setSubmitted(true);
      setCurrentScreen('submitted');
    }
  };

  const handleBack = () => {
    if (currentScreen === 'onset') {
      setCurrentScreen('emergency');
      setProgress(0);
    } else if (currentScreen === 'painCharacteristics') {
      setCurrentScreen('onset');
      setProgress(1);
    } else if (currentScreen === 'timing') {
      setCurrentScreen('painCharacteristics');
      setProgress(2);
    } else if (currentScreen === 'triggersRelief') {
      setCurrentScreen('timing');
      setProgress(3);
    } else if (currentScreen === 'associatedSymptoms') {
      setCurrentScreen('triggersRelief');
      setProgress(4);
    } else if (currentScreen === 'medications') {
      setCurrentScreen('associatedSymptoms');
      setProgress(5);
    } else if (currentScreen === 'review') {
      setCurrentScreen('medications');
      setProgress(6);
    }
  };

  const handleInputChange = (category, value) => {
    setFormData({
      ...formData,
      [category]: value,
    });
  };

  const handleCheckboxChange = (category, value) => {
    const currentValues = formData[category] || [];

    if (currentValues.includes(value)) {
      setFormData({
        ...formData,
        [category]: currentValues.filter((item) => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        [category]: [...currentValues, value],
      });
    }
  };

  const copyToClipboard = () => {
    const reportText = `
Headache Assessment Report
--------------------------
Date: ${new Date().toLocaleDateString()}

ONSET:
Type: ${formData.onsetType}
Date: ${formData.onsetDate}

PAIN CHARACTERISTICS:
Location: ${formData.painLocation.join(', ')}
Quality: ${formData.painQuality.join(', ')}
Severity: ${formData.painSeverity}/10

TIMING:
Duration: ${formData.duration}
Frequency: ${formData.frequency}

TRIGGERS & RELIEVING FACTORS:
Triggers: ${formData.triggers.join(', ')}
Relief Factors: ${formData.reliefFactors.join(', ')}

ASSOCIATED SYMPTOMS:
${formData.associatedSymptoms.join(', ')}

ALARM FEATURES:
${formData.alarmFeatures.join(', ')}

MEDICATIONS:
Current Medications: ${formData.currentMedications.join(', ')}
Effectiveness: ${formData.medicationEffectiveness}
    `;

    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const resetForm = () => {
    setFormData({
      onsetType: '',
      onsetDate: '',
      painLocation: [],
      painQuality: [],
      painSeverity: 0,
      duration: '',
      frequency: '',
      triggers: [],
      reliefFactors: [],
      associatedSymptoms: [],
      alarmFeatures: [],
      currentMedications: [],
      medicationEffectiveness: '',
    });
    setCurrentScreen('welcome');
    setProgress(0);
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto h-screen bg-gray-50 text-gray-800 p-4">
      {/* App Header */}
      <div className="w-full bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <h1 className="text-xl font-bold">Headache Tracker</h1>
        {currentScreen !== 'welcome' && currentScreen !== 'submitted' && (
          <div className="text-sm">
            {currentScreen !== 'emergency' &&
            currentScreen !== 'emergencyWarning' &&
            currentScreen !== 'review'
              ? `${progress} of ${totalScreens}`
              : ''}
          </div>
        )}
      </div>

      {/* Progress Bar - Only show during main questions */}
      {currentScreen !== 'welcome' &&
        currentScreen !== 'emergency' &&
        currentScreen !== 'emergencyWarning' &&
        currentScreen !== 'submitted' && (
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full"
              style={{ width: `${(progress / totalScreens) * 100}%` }}
            />
          </div>
        )}

      {/* Screen Content */}
      <div className="w-full bg-white rounded-b-lg shadow-md flex-grow p-4 overflow-y-auto">
        {/* Welcome Screen */}
        {currentScreen === 'welcome' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-600">
                Welcome to Headache Tracker
              </h2>
              <p className="mb-4">
                This quick assessment will help you track your headache symptoms
                and share important information with your healthcare provider.
              </p>
              <p className="mb-4">
                It should take about 2-3 minutes to complete.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <p className="font-bold flex items-center">
                  <AlertTriangle size={18} className="mr-2 text-yellow-600" />{' '}
                  Important
                </p>
                <p>
                  If you're experiencing severe or unusual symptoms, please seek
                  medical help immediately.
                </p>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="w-full p-4 bg-blue-600 text-white rounded-lg font-bold mt-4 flex items-center justify-center"
            >
              Start Assessment <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        )}

        {/* Emergency Screen - Check for Alarm Features */}
        {currentScreen === 'emergency' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center">
                <AlertTriangle size={20} className="mr-2" /> Emergency Check
              </h2>
              <p className="mb-4">
                Do you have any of these warning signs? (Select all that apply)
              </p>

              <div className="space-y-2">
                {[
                  'Worst headache of your life (thunderclap)',
                  'Headache with fever and stiff neck',
                  'Headache after head injury or fall',
                  'Sudden onset of severe headache',
                  'Headache with confusion or trouble speaking',
                  'Headache with weakness or numbness',
                  'Headache with vision loss or double vision',
                  'Headache that wakes you from sleep',
                  "New headache if you're over 50",
                  'Headache with seizure or passing out',
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <input
                      type="checkbox"
                      id={`alarm-${index}`}
                      className="mt-1 mr-2"
                      checked={
                        formData.alarmFeatures?.includes(feature) || false
                      }
                      onChange={() =>
                        handleCheckboxChange('alarmFeatures', feature)
                      }
                    />
                    <label htmlFor={`alarm-${index}`} className="text-md">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full p-4 bg-blue-600 text-white rounded-lg font-bold mt-4"
            >
              Continue
            </button>
          </div>
        )}

        {/* Emergency Warning Screen */}
        {currentScreen === 'emergencyWarning' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="bg-red-100 border-l-4 border-red-600 p-4 my-4">
                <h2 className="text-xl font-bold text-red-600 flex items-center">
                  <AlertTriangle size={22} className="mr-2" /> Medical Attention
                  Recommended
                </h2>
                <p className="my-4">
                  You've indicated one or more warning signs that may require
                  immediate medical attention.
                </p>
                <p className="font-bold">Consider:</p>
                <ul className="list-disc ml-6 my-2">
                  <li>Calling your doctor right away</li>
                  <li>Going to urgent care</li>
                  <li>Visiting an emergency room</li>
                  <li>Calling 911 if symptoms are severe</li>
                </ul>
              </div>
              <p>
                You can still continue with this assessment to record your
                symptoms.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full p-4 bg-blue-600 text-white rounded-lg font-bold mt-4"
            >
              Continue With Assessment
            </button>
          </div>
        )}

        {/* Onset Screen */}
        {currentScreen === 'onset' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">
                When did your headache start?
              </h2>

              <div className="mb-4">
                <p className="mb-2 font-medium">How did it begin?</p>
                <div className="space-y-2">
                  {[
                    'Suddenly (seconds to minutes)',
                    'Gradually (hours)',
                    'Very gradually (days)',
                  ].map((type, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`onset-${index}`}
                        name="onsetType"
                        className="mr-2"
                        checked={formData.onsetType === type}
                        onChange={() => handleInputChange('onsetType', type)}
                      />
                      <label htmlFor={`onset-${index}`}>{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2 font-medium">When did it start?</p>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={formData.onsetDate}
                  onChange={(e) =>
                    handleInputChange('onsetDate', e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="p-4 bg-gray-200 text-gray-800 rounded-lg font-medium w-1/3"
              >
                <ChevronLeft size={18} className="inline mr-1" /> Back
              </button>
              <button
                onClick={handleNext}
                className="p-4 bg-blue-600 text-white rounded-lg font-bold w-2/3 ml-2"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Pain Characteristics Screen */}
        {currentScreen === 'painCharacteristics' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">Describe your headache</h2>

              <div className="mb-4">
                <p className="mb-2 font-medium">
                  Where is the pain? (Select all that apply)
                </p>
                <div className="space-y-2">
                  {[
                    'One side only',
                    'Both sides',
                    'Front of head',
                    'Back of head',
                    'Temple area',
                    'Behind the eyes',
                    'All over head',
                  ].map((location, index) => (
                    <div key={index} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`location-${index}`}
                        className="mt-1 mr-2"
                        checked={
                          formData.painLocation?.includes(location) || false
                        }
                        onChange={() =>
                          handleCheckboxChange('painLocation', location)
                        }
                      />
                      <label htmlFor={`location-${index}`}>{location}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2 font-medium">
                  How would you describe the pain? (Select all that apply)
                </p>
                <div className="space-y-2">
                  {[
                    'Throbbing/pulsating',
                    'Pressure/squeezing',
                    'Sharp/stabbing',
                    'Dull ache',
                    'Burning',
                  ].map((quality, index) => (
                    <div key={index} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`quality-${index}`}
                        className="mt-1 mr-2"
                        checked={
                          formData.painQuality?.includes(quality) || false
                        }
                        onChange={() =>
                          handleCheckboxChange('painQuality', quality)
                        }
                      />
                      <label htmlFor={`quality-${index}`}>{quality}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2 font-medium">
                  How severe is the pain? (0 = no pain, 10 = worst possible)
                </p>
                <div className="flex items-center">
                  <span className="mr-2">0</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    className="flex-grow"
                    value={formData.painSeverity}
                    onChange={(e) =>
                      handleInputChange(
                        'painSeverity',
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <span className="ml-2">10</span>
                </div>
                <div className="text-center font-bold mt-2">
                  {formData.painSeverity}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="p-4 bg-gray-200 text-gray-800 rounded-lg font-medium w-1/3"
              >
                <ChevronLeft size={18} className="inline mr-1" /> Back
              </button>
              <button
                onClick={handleNext}
                className="p-4 bg-blue-600 text-white rounded-lg font-bold w-2/3 ml-2"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Timing Screen */}
        {currentScreen === 'timing' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">
                Timing of your headache
              </h2>

              <div className="mb-4">
                <p className="mb-2 font-medium">
                  How long does your headache typically last?
                </p>
                <div className="space-y-2">
                  {[
                    'Less than 4 hours',
                    '4-24 hours',
                    '1-3 days',
                    'More than 3 days',
                    'Constant (never goes away completely)',
                  ].map((duration, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`duration-${index}`}
                        name="duration"
                        className="mr-2"
                        checked={formData.duration === duration}
                        onChange={() => handleInputChange('duration', duration)}
                      />
                      <label htmlFor={`duration-${index}`}>{duration}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2 font-medium">
                  How often do you get these headaches?
                </p>
                <div className="space-y-2">
                  {[
                    'This is the first time',
                    'Less than once a month',
                    '1-3 times per month',
                    '1-3 times per week',
                    '4-6 times per week',
                    'Daily',
                  ].map((frequency, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`frequency-${index}`}
                        name="frequency"
                        className="mr-2"
                        checked={formData.frequency === frequency}
                        onChange={() =>
                          handleInputChange('frequency', frequency)
                        }
                      />
                      <label htmlFor={`frequency-${index}`}>{frequency}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="p-4 bg-gray-200 text-gray-800 rounded-lg font-medium w-1/3"
              >
                <ChevronLeft size={18} className="inline mr-1" /> Back
              </button>
              <button
                onClick={handleNext}
                className="p-4 bg-blue-600 text-white rounded-lg font-bold w-2/3 ml-2"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Triggers and Relief Screen */}
        {currentScreen === 'triggersRelief' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">Triggers and Relief</h2>

              <div className="mb-4">
                <p className="mb-2 font-medium">
                  What seems to trigger your headaches? (Select all that apply)
                </p>
                <div className="space-y-2">
                  {[
                    'Stress',
                    'Lack of sleep',
                    'Too much sleep',
                    'Skipped meals',
                    'Certain foods/drinks',
                    'Alcohol',
                    'Weather changes',
                    'Bright lights',
                    'Loud noises',
                    'Strong smells',
                    'Physical activity',
                    'Menstrual period',
                    'Screen time',
                    'Not sure',
                  ].map((trigger, index) => (
                    <div key={index} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`trigger-${index}`}
                        className="mt-1 mr-2"
                        checked={formData.triggers?.includes(trigger) || false}
                        onChange={() =>
                          handleCheckboxChange('triggers', trigger)
                        }
                      />
                      <label htmlFor={`trigger-${index}`}>{trigger}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2 font-medium">
                  What helps relieve your headache? (Select all that apply)
                </p>
                <div className="space-y-2">
                  {[
                    'Over-the-counter pain medication',
                    'Prescription medication',
                    'Sleep/rest',
                    'Dark, quiet room',
                    'Cold compress',
                    'Warm compress',
                    'Caffeine',
                    'Food/eating',
                    'Massage',
                    'Nothing helps',
                    'Not sure',
                  ].map((relief, index) => (
                    <div key={index} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`relief-${index}`}
                        className="mt-1 mr-2"
                        checked={
                          formData.reliefFactors?.includes(relief) || false
                        }
                        onChange={() =>
                          handleCheckboxChange('reliefFactors', relief)
                        }
                      />
                      <label htmlFor={`relief-${index}`}>{relief}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="p-4 bg-gray-200 text-gray-800 rounded-lg font-medium w-1/3"
              >
                <ChevronLeft size={18} className="inline mr-1" /> Back
              </button>
              <button
                onClick={handleNext}
                className="p-4 bg-blue-600 text-white rounded-lg font-bold w-2/3 ml-2"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Associated Symptoms Screen */}
        {currentScreen === 'associatedSymptoms' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">Associated Symptoms</h2>

              <div className="mb-4">
                <p className="mb-2 font-medium">
                  Do you experience any of these symptoms with your headache?
                  (Select all that apply)
                </p>
                <div className="space-y-2">
                  {[
                    'Nausea',
                    'Vomiting',
                    'Sensitivity to light',
                    'Sensitivity to sound',
                    'Sensitivity to smells',
                    'Dizziness/vertigo',
                    'Blurred vision',
                    'Visual changes (spots, zigzag lines)',
                    'Numbness or tingling',
                    'Weakness on one side of body',
                    'Difficulty speaking',
                    'Neck pain/stiffness',
                    'Runny or stuffy nose',
                    'Tearing of eyes',
                    'Drooping eyelid',
                    'Fatigue',
                    'Trouble concentrating',
                    'None of these',
                  ].map((symptom, index) => (
                    <div key={index} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`symptom-${index}`}
                        className="mt-1 mr-2"
                        checked={
                          formData.associatedSymptoms?.includes(symptom) ||
                          false
                        }
                        onChange={() =>
                          handleCheckboxChange('associatedSymptoms', symptom)
                        }
                      />
                      <label htmlFor={`symptom-${index}`}>{symptom}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="p-4 bg-gray-200 text-gray-800 rounded-lg font-medium w-1/3"
              >
                <ChevronLeft size={18} className="inline mr-1" /> Back
              </button>
              <button
                onClick={handleNext}
                className="p-4 bg-blue-600 text-white rounded-lg font-bold w-2/3 ml-2"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Medications Screen */}
        {currentScreen === 'medications' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">Medications</h2>

              <div className="mb-4">
                <p className="mb-2 font-medium">
                  What medications have you taken for this headache? (Select all
                  that apply)
                </p>
                <div className="space-y-2">
                  {[
                    'Acetaminophen (Tylenol)',
                    'Ibuprofen (Advil, Motrin)',
                    'Naproxen (Aleve)',
                    'Aspirin',
                    'Combination pain relievers (Excedrin)',
                    'Prescription migraine medication (triptans)',
                    'Prescription pain medication',
                    'Anti-nausea medication',
                    'Other',
                    'None',
                  ].map((medication, index) => (
                    <div key={index} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`med-${index}`}
                        className="mt-1 mr-2"
                        checked={
                          formData.currentMedications?.includes(medication) ||
                          false
                        }
                        onChange={() =>
                          handleCheckboxChange('currentMedications', medication)
                        }
                      />
                      <label htmlFor={`med-${index}`}>{medication}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2 font-medium">
                  How effective were the medications?
                </p>
                <div className="space-y-2">
                  {[
                    'Complete relief',
                    'Significant relief',
                    'Moderate relief',
                    'Minor relief',
                    'No relief',
                    "Haven't taken any medication",
                  ].map((effectiveness, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`effect-${index}`}
                        name="effectiveness"
                        className="mr-2"
                        checked={
                          formData.medicationEffectiveness === effectiveness
                        }
                        onChange={() =>
                          handleInputChange(
                            'medicationEffectiveness',
                            effectiveness
                          )
                        }
                      />
                      <label htmlFor={`effect-${index}`}>{effectiveness}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="p-4 bg-gray-200 text-gray-800 rounded-lg font-medium w-1/3"
              >
                <ChevronLeft size={18} className="inline mr-1" /> Back
              </button>
              <button
                onClick={handleNext}
                className="p-4 bg-blue-600 text-white rounded-lg font-bold w-2/3 ml-2"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Review Screen */}
        {currentScreen === 'review' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">
                Review Your Information
              </h2>
              <p className="mb-4">
                Please review your information before submitting:
              </p>

              <div className="space-y-3 text-sm overflow-y-auto max-h-96 bg-gray-50 p-4 rounded">
                {formData.alarmFeatures &&
                  formData.alarmFeatures.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-2">
                      <p className="font-bold text-red-700">Warning Signs:</p>
                      <p>{formData.alarmFeatures.join(', ')}</p>
                    </div>
                  )}

                <div>
                  <p className="font-bold">Onset:</p>
                  <p>Type: {formData.onsetType || 'Not specified'}</p>
                  <p>Date: {formData.onsetDate || 'Not specified'}</p>
                </div>

                <div>
                  <p className="font-bold">Pain Characteristics:</p>
                  <p>
                    Location:{' '}
                    {formData.painLocation && formData.painLocation.length > 0
                      ? formData.painLocation.join(', ')
                      : 'Not specified'}
                  </p>
                  <p>
                    Quality:{' '}
                    {formData.painQuality && formData.painQuality.length > 0
                      ? formData.painQuality.join(', ')
                      : 'Not specified'}
                  </p>
                  <p>Severity: {formData.painSeverity}/10</p>
                </div>

                <div>
                  <p className="font-bold">Timing:</p>
                  <p>Duration: {formData.duration || 'Not specified'}</p>
                  <p>Frequency: {formData.frequency || 'Not specified'}</p>
                </div>

                <div>
                  <p className="font-bold">Triggers & Relief:</p>
                  <p>
                    Triggers:{' '}
                    {formData.triggers && formData.triggers.length > 0
                      ? formData.triggers.join(', ')
                      : 'None identified'}
                  </p>
                  <p>
                    Relief Factors:{' '}
                    {formData.reliefFactors && formData.reliefFactors.length > 0
                      ? formData.reliefFactors.join(', ')
                      : 'None identified'}
                  </p>
                </div>

                <div>
                  <p className="font-bold">Associated Symptoms:</p>
                  <p>
                    {formData.associatedSymptoms &&
                    formData.associatedSymptoms.length > 0
                      ? formData.associatedSymptoms.join(', ')
                      : 'None'}
                  </p>
                </div>

                <div>
                  <p className="font-bold">Medications:</p>
                  <p>
                    Current:{' '}
                    {formData.currentMedications &&
                    formData.currentMedications.length > 0
                      ? formData.currentMedications.join(', ')
                      : 'None'}
                  </p>
                  <p>
                    Effectiveness:{' '}
                    {formData.medicationEffectiveness || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="p-4 bg-gray-200 text-gray-800 rounded-lg font-medium w-1/3"
              >
                <ChevronLeft size={18} className="inline mr-1" /> Back
              </button>
              <button
                onClick={handleNext}
                className="p-4 bg-green-600 text-white rounded-lg font-bold w-2/3 ml-2"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Submitted Screen */}
        {currentScreen === 'submitted' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-center my-6">
                <CheckCircle size={64} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">
                Assessment Complete!
              </h2>
              <p className="mb-4 text-center">
                Your headache information has been saved.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <p className="mb-2">
                  Your report is ready to share with your healthcare provider.
                </p>
                <button
                  onClick={copyToClipboard}
                  className="w-full p-3 bg-blue-600 text-white rounded-lg font-bold mt-2 flex items-center justify-center"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={18} className="mr-2" /> Copied to
                      Clipboard
                    </>
                  ) : (
                    <>
                      <Copy size={18} className="mr-2" /> Copy Report
                    </>
                  )}
                </button>
              </div>

              <div className="my-6">
                <p className="mb-2 font-medium">What happens next?</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Share this report with your healthcare provider</li>
                  <li>Continue tracking your headaches over time</li>
                  <li>Look for patterns in your triggers and symptoms</li>
                </ul>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="w-full p-4 bg-gray-200 text-gray-800 rounded-lg font-bold mt-4 flex items-center justify-center"
            >
              <RefreshCw size={18} className="mr-2" /> Start a New Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
