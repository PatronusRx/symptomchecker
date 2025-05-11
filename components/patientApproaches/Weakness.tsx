import { useState } from 'react';
import {
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Copy,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function WeaknessAssessmentApp() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sample responses state would be more complex in a real app
  const [responses, setResponses] = useState({});

  const handleNext = (screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleComplete = () => {
    setCompleted(true);
    setCurrentScreen('summary');
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setResponses({});
    setCompleted(false);
    setCurrentScreen('welcome');
    window.scrollTo(0, 0);
  };

  // Screen components
  const screens = {
    welcome: (
      <div className="flex flex-col items-center justify-center p-4 space-y-6">
        <h1 className="text-2xl font-bold text-center">Weakness Assessment</h1>
        <div className="rounded-lg bg-blue-50 p-4 w-full">
          <p className="text-center">
            This tool helps you document your weakness symptoms before your
            appointment.
          </p>
        </div>
        <div className="flex items-center text-amber-700 bg-amber-50 p-3 rounded-lg w-full">
          <AlertTriangle className="mr-2 flex-shrink-0" size={20} />
          <p className="text-sm">
            If you have sudden weakness on one side of your face or body,
            trouble speaking, or severe headache - call 911 immediately!
          </p>
        </div>
        <div className="flex items-center text-blue-700">
          <Clock className="mr-2" size={16} />
          <p className="text-sm">Estimated completion time: 3-5 minutes</p>
        </div>
        <button
          onClick={() => handleNext('alarmFeatures')}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium w-full flex items-center justify-center"
        >
          Begin Assessment
          <ChevronRight className="ml-1" size={20} />
        </button>
      </div>
    ),

    alarmFeatures: (
      <div className="flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-bold">Important Safety Check</h2>
          <span className="text-sm text-gray-500">1 of 10</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: '10%' }}
          ></div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="font-medium text-red-800 mb-3">
            Do you have any of these urgent symptoms?
          </p>

          <div className="space-y-4">
            {[
              'Rapidly worsening weakness (hours to days)',
              'Difficulty breathing or shortness of breath',
              'Trouble swallowing or speaking',
              'Loss of bladder or bowel control',
              'Severe neck or back pain with weakness',
              'Facial drooping or asymmetry',
              'Fever along with weakness',
            ].map((symptom, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`alarm${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`alarm${i}`} className="text-red-800">
                  {symptom}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-red-100 rounded border border-red-300">
            <p className="text-sm text-red-800 font-medium">
              If you checked any boxes above, please contact your healthcare
              provider immediately or go to the nearest emergency room.
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleNext('welcome')}
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex-1"
          >
            Back
          </button>
          <button
            onClick={() => handleNext('onsetTiming')}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            Continue
            <ChevronRight className="ml-1" size={20} />
          </button>
        </div>
      </div>
    ),

    onsetTiming: (
      <div className="flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-bold">About Your Weakness</h2>
          <span className="text-sm text-gray-500">2 of 10</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: '20%' }}
          ></div>
        </div>

        <div>
          <p className="font-medium mb-3">
            When did you first notice your weakness?
          </p>
          <div className="space-y-3">
            {[
              'Within the last few hours',
              'Within the last few days',
              'Within the last few weeks',
              'Within the last few months',
              'More than 6 months ago',
            ].map((option, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="radio"
                  name="onset"
                  id={`onset${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`onset${i}`}>{option}</label>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="font-medium mb-2">
              Can you remember the exact date when it started?
            </p>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleNext('alarmFeatures')}
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex-1"
          >
            Back
          </button>
          <button
            onClick={() => handleNext('locationPattern')}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            Continue
            <ChevronRight className="ml-1" size={20} />
          </button>
        </div>
      </div>
    ),

    locationPattern: (
      <div className="flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-bold">Location of Weakness</h2>
          <span className="text-sm text-gray-500">3 of 10</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: '30%' }}
          ></div>
        </div>

        <div>
          <p className="font-medium mb-3">
            Where are you experiencing weakness? (select all that apply)
          </p>
          <div className="space-y-3">
            {[
              'Right arm',
              'Left arm',
              'Right leg',
              'Left leg',
              'Right side of face',
              'Left side of face',
              'Both arms',
              'Both legs',
              'Whole body',
            ].map((location, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`location${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`location${i}`}>{location}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleNext('onsetTiming')}
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex-1"
          >
            Back
          </button>
          <button
            onClick={() => handleNext('severityDescription')}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            Continue
            <ChevronRight className="ml-1" size={20} />
          </button>
        </div>
      </div>
    ),

    severityDescription: (
      <div className="flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-bold">Severity & Description</h2>
          <span className="text-sm text-gray-500">4 of 10</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: '40%' }}
          ></div>
        </div>

        <div>
          <p className="font-medium mb-3">
            How would you describe the severity of your weakness?
          </p>
          <div className="space-y-3">
            {[
              'Mild - noticeable but minimal impact on daily activities',
              'Moderate - affects some daily activities',
              'Severe - significantly limits function',
              'Complete - total loss of function',
            ].map((severity, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="radio"
                  name="severity"
                  id={`severity${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`severity${i}`}>{severity}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium mb-3">
            How would you describe the weakness? (select all that apply)
          </p>
          <div className="space-y-3">
            {[
              'Cannot move the affected area at all',
              'Can move, but with reduced strength',
              'Feels heavy or tired',
              'Problems with coordination rather than strength',
              'Comes and goes throughout the day',
              'Gets worse with activity',
              'Improves with rest',
            ].map((description, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`desc${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`desc${i}`}>{description}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleNext('locationPattern')}
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex-1"
          >
            Back
          </button>
          <button
            onClick={() => handleNext('factorsTriggers')}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            Continue
            <ChevronRight className="ml-1" size={20} />
          </button>
        </div>
      </div>
    ),

    factorsTriggers: (
      <div className="flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-bold">Factors & Triggers</h2>
          <span className="text-sm text-gray-500">5 of 10</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: '50%' }}
          ></div>
        </div>

        <div>
          <p className="font-medium mb-3">
            What makes your weakness worse? (select all that apply)
          </p>
          <div className="space-y-3">
            {[
              'Physical activity or exercise',
              'Certain times of day (morning/evening)',
              'Specific positions or movements',
              'Hot temperature or weather',
              'Cold temperature or weather',
              'Stress or anxiety',
              'After taking certain medications',
              'After eating certain foods',
              'Nothing specific makes it worse',
            ].map((factor, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`worse${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`worse${i}`}>{factor}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium mb-3">
            What makes your weakness better? (select all that apply)
          </p>
          <div className="space-y-3">
            {[
              'Rest',
              'Specific position or posture',
              'Medications',
              'Massage or stretching',
              'Heat application',
              'Cold application',
              'Time of day (morning/evening)',
              'Nothing specific helps',
            ].map((factor, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`better${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`better${i}`}>{factor}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleNext('severityDescription')}
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex-1"
          >
            Back
          </button>
          <button
            onClick={() => handleNext('associatedSymptoms')}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            Continue
            <ChevronRight className="ml-1" size={20} />
          </button>
        </div>
      </div>
    ),

    associatedSymptoms: (
      <div className="flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-bold">Associated Symptoms</h2>
          <span className="text-sm text-gray-500">6 of 10</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: '60%' }}
          ></div>
        </div>

        <div>
          <p className="font-medium mb-3">
            Are you experiencing any of these symptoms along with weakness?
            (select all that apply)
          </p>
          <div className="space-y-3">
            {[
              'Numbness or tingling',
              'Pain',
              'Muscle cramps',
              'Headache',
              'Dizziness',
              'Vision changes',
              'Speech problems',
              'Swallowing difficulties',
              'Memory or thinking problems',
              'Fatigue or tiredness',
              'Fever',
              'Weight loss',
              'Joint pain or stiffness',
              'Rash or skin changes',
              'Sleep problems',
              'Mood changes (anxiety/depression)',
            ].map((symptom, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`symptom${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`symptom${i}`}>{symptom}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleNext('factorsTriggers')}
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex-1"
          >
            Back
          </button>
          <button
            onClick={() => handleNext('medicationHistory')}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            Continue
            <ChevronRight className="ml-1" size={20} />
          </button>
        </div>
      </div>
    ),

    medicationHistory: (
      <div className="flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-bold">Medications</h2>
          <span className="text-sm text-gray-500">7 of 10</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: '70%' }}
          ></div>
        </div>

        <div>
          <p className="font-medium mb-3">
            Are you currently taking any of these medications? (select all that
            apply)
          </p>
          <div className="space-y-3">
            {[
              'Cholesterol medications (statins)',
              'Steroids (prednisone, etc.)',
              'Blood pressure medications',
              'Heart medications',
              'Antibiotics',
              'Pain medications',
              'Sleep medications',
              'Anxiety/depression medications',
              'Diabetes medications',
              'Thyroid medications',
              'Over-the-counter supplements',
              'None of these',
            ].map((med, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`med${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`med${i}`}>{med}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium mb-3">
            Have there been any recent changes to your medications?
          </p>
          <div className="space-y-3">
            {[
              'Started a new medication recently',
              'Stopped a medication recently',
              'Changed dosage of a medication recently',
              'No recent medication changes',
            ].map((change, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="radio"
                  name="medChanges"
                  id={`change${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`change${i}`}>{change}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleNext('associatedSymptoms')}
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex-1"
          >
            Back
          </button>
          <button
            onClick={() => handleNext('medicalHistory')}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            Continue
            <ChevronRight className="ml-1" size={20} />
          </button>
        </div>
      </div>
    ),

    medicalHistory: (
      <div className="flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-bold">Medical History</h2>
          <span className="text-sm text-gray-500">8 of 10</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: '80%' }}
          ></div>
        </div>

        <div>
          <p className="font-medium mb-3">
            Do you have any of these medical conditions? (select all that apply)
          </p>
          <div className="space-y-3">
            {[
              'High blood pressure',
              'Diabetes',
              'Heart disease',
              'Stroke or mini-stroke (TIA)',
              'Thyroid problems',
              'Autoimmune disease (lupus, rheumatoid arthritis, etc.)',
              "Neurological conditions (MS, Parkinson's, etc.)",
              'Muscle disorders',
              'Nerve disorders',
              'Cancer (current or past)',
              'Chronic pain conditions',
              'Kidney disease',
              'Liver disease',
              'None of these conditions',
            ].map((condition, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`condition${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`condition${i}`}>{condition}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium mb-3">
            Has anyone in your family experienced similar weakness?
          </p>
          <div className="space-y-3">
            {[
              'Yes - immediate family (parents, siblings, children)',
              'Yes - extended family',
              'No',
              "I don't know",
            ].map((family, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="radio"
                  name="family"
                  id={`family${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`family${i}`}>{family}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleNext('medicationHistory')}
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex-1"
          >
            Back
          </button>
          <button
            onClick={() => handleNext('lifestyleFactors')}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            Continue
            <ChevronRight className="ml-1" size={20} />
          </button>
        </div>
      </div>
    ),

    lifestyleFactors: (
      <div className="flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-bold">Lifestyle Factors</h2>
          <span className="text-sm text-gray-500">9 of 10</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: '90%' }}
          ></div>
        </div>

        <div>
          <p className="font-medium mb-3">
            Have you experienced any recent changes in:
          </p>
          <div className="space-y-3">
            {[
              'Weight (gain or loss)',
              'Diet or eating habits',
              'Sleep patterns',
              'Activity or exercise level',
              'Stress levels',
              'Work environment or responsibilities',
              'Living situation',
              'None of these',
            ].map((factor, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`lifestyle${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`lifestyle${i}`}>{factor}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium mb-3">
            In the past 30 days, have you: (select all that apply)
          </p>
          <div className="space-y-3">
            {[
              'Traveled internationally',
              'Had an infection or illness',
              'Received any vaccinations',
              'Been under unusual stress',
              'Changed your diet significantly',
              'Been exposed to any unusual chemicals/toxins',
              'None of these',
            ].map((activity, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`activity${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`activity${i}`}>{activity}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleNext('medicalHistory')}
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex-1"
          >
            Back
          </button>
          <button
            onClick={() => handleNext('additionalInfo')}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            Continue
            <ChevronRight className="ml-1" size={20} />
          </button>
        </div>
      </div>
    ),

    additionalInfo: (
      <div className="flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-bold">Additional Information</h2>
          <span className="text-sm text-gray-500">10 of 10</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full w-full"></div>
        </div>

        <div>
          <p className="font-medium mb-3">
            Is there anything else about your weakness that you'd like your
            healthcare provider to know?
          </p>
          <textarea
            className="w-full p-3 h-32 border border-gray-300 rounded-lg"
            placeholder="Type any additional information here..."
          ></textarea>
        </div>

        <div>
          <p className="font-medium mb-3">
            How is this weakness affecting your daily life? (select all that
            apply)
          </p>
          <div className="space-y-3">
            {[
              'Difficulty with self-care (bathing, dressing, etc.)',
              'Difficulty with household tasks',
              'Affecting work or school performance',
              'Limiting social activities',
              'Causing emotional distress',
              'Sleep disruption',
              'Minimal impact on daily activities',
              'Other impacts (please describe in text box above)',
            ].map((impact, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`impact${i}`}
                  className="w-5 h-5 mr-3 text-blue-600"
                />
                <label htmlFor={`impact${i}`}>{impact}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleNext('lifestyleFactors')}
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex-1"
          >
            Back
          </button>
          <button
            onClick={() => handleNext('review')}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            Review Answers
            <ChevronRight className="ml-1" size={20} />
          </button>
        </div>
      </div>
    ),

    review: (
      <div className="flex flex-col p-4 space-y-6">
        <h2 className="text-xl font-bold">Review Your Information</h2>
        <p className="text-gray-700">
          Please review the information you've provided before submitting.
        </p>

        <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-blue-800">
                Important Safety Check
              </h3>
              <p className="text-sm text-gray-700 italic">
                No urgent symptoms reported
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Onset & Timing</h3>
              <p className="text-sm text-gray-700">
                Weakness started within the last few weeks, approximately April
                10, 2025
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Location</h3>
              <p className="text-sm text-gray-700">Left arm, Right leg</p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">
                Severity & Description
              </h3>
              <p className="text-sm text-gray-700">
                Moderate - affects some daily activities; Feels heavy or tired,
                Gets worse with activity
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Factors & Triggers</h3>
              <p className="text-sm text-gray-700">
                Worse with: Physical activity, Hot temperature; Better with:
                Rest, Cold application
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Associated Symptoms</h3>
              <p className="text-sm text-gray-700">
                Fatigue, Numbness or tingling
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Medications</h3>
              <p className="text-sm text-gray-700">
                Currently taking: Cholesterol medications; Started a new
                medication recently
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Medical History</h3>
              <p className="text-sm text-gray-700">
                High blood pressure, Diabetes; No family history of similar
                weakness
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Lifestyle Factors</h3>
              <p className="text-sm text-gray-700">
                Recent changes in: Activity level, Sleep patterns; Been under
                unusual stress in past 30 days
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">
                Impact on Daily Life
              </h3>
              <p className="text-sm text-gray-700">
                Affecting work performance, Difficulty with household tasks
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">
                Additional Information
              </h3>
              <p className="text-sm text-gray-700">
                The weakness seems to be worse in the evenings after work,
                especially after typing all day.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            Please note that this summary will be available to your healthcare
            provider before your appointment.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleNext('additionalInfo')}
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex-1"
          >
            Back
          </button>
          <button
            onClick={handleComplete}
            className="bg-green-600 text-white py-3 px-4 rounded-lg font-medium flex-1"
          >
            Submit
          </button>
        </div>
      </div>
    ),

    summary: (
      <div className="flex flex-col p-4 space-y-6">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="text-green-500 mr-2" size={28} />
          <h2 className="text-xl font-bold text-green-700">
            Successfully Submitted
          </h2>
        </div>

        <p className="text-center">
          Thank you for completing the weakness assessment. Your healthcare
          provider will have access to this information before your appointment.
        </p>

        <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-blue-800">
                Important Safety Check
              </h3>
              <p className="text-sm text-gray-700 italic">
                No urgent symptoms reported
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Onset & Timing</h3>
              <p className="text-sm text-gray-700">
                Weakness started within the last few weeks, approximately April
                10, 2025
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Location</h3>
              <p className="text-sm text-gray-700">Left arm, Right leg</p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">
                Severity & Description
              </h3>
              <p className="text-sm text-gray-700">
                Moderate - affects some daily activities; Feels heavy or tired,
                Gets worse with activity
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Factors & Triggers</h3>
              <p className="text-sm text-gray-700">
                Worse with: Physical activity, Hot temperature; Better with:
                Rest, Cold application
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Associated Symptoms</h3>
              <p className="text-sm text-gray-700">
                Fatigue, Numbness or tingling
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Medications</h3>
              <p className="text-sm text-gray-700">
                Currently taking: Cholesterol medications; Started a new
                medication recently
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Medical History</h3>
              <p className="text-sm text-gray-700">
                High blood pressure, Diabetes; No family history of similar
                weakness
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">Lifestyle Factors</h3>
              <p className="text-sm text-gray-700">
                Recent changes in: Activity level, Sleep patterns; Been under
                unusual stress in past 30 days
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">
                Impact on Daily Life
              </h3>
              <p className="text-sm text-gray-700">
                Affecting work performance, Difficulty with household tasks
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-800">
                Additional Information
              </h3>
              <p className="text-sm text-gray-700">
                The weakness seems to be worse in the evenings after work,
                especially after typing all day.
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleCopy}
            className="border border-blue-500 text-blue-700 py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            {copied ? 'Copied!' : 'Copy Results'}
            {copied ? (
              <CheckCircle className="ml-2" size={18} />
            ) : (
              <Copy className="ml-2" size={18} />
            )}
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-600 text-white py-3 px-4 rounded-lg font-medium flex-1 flex items-center justify-center"
          >
            Start Over
            <RotateCcw className="ml-2" size={18} />
          </button>
        </div>
      </div>
    ),
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full my-4">
        {screens[currentScreen]}
      </div>
    </div>
  );
}
