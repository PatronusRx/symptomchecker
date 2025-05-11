import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Edit,
} from 'lucide-react';

export default function StrokeSymptomTracker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showEmergency, setShowEmergency] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    {
      id: 'welcome',
      title: 'Stroke/TIA Symptom Tracker',
      content: () => (
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Clock size={48} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold mb-4">
            Welcome to the Stroke Symptom Tracker
          </h2>
          <p className="text-center mb-6">
            This tool helps you record your symptoms and share them with your
            healthcare provider.
          </p>
          <div className="bg-red-100 p-4 rounded-lg mb-6 w-full">
            <p className="text-red-700 font-bold">IMPORTANT:</p>
            <p className="text-red-700">
              If you are currently experiencing stroke symptoms, call 911
              immediately.
            </p>
          </div>
          <p className="mb-4 text-sm">
            This will take approximately 2-3 minutes to complete.
          </p>
        </div>
      ),
    },
    {
      id: 'onset',
      title: 'When did your symptoms start?',
      content: () => (
        <div>
          <p className="mb-4">Please select when your symptoms began:</p>
          <div className="space-y-3">
            <RadioOption
              name="onset"
              value="sudden"
              label="Suddenly (within seconds or minutes)"
              checked={answers.onset === 'sudden'}
              onChange={() => handleAnswer('onset', 'sudden')}
              showWarning={answers.onset === 'sudden'}
            />
            <RadioOption
              name="onset"
              value="gradual"
              label="Gradually (over hours or days)"
              checked={answers.onset === 'gradual'}
              onChange={() => handleAnswer('onset', 'gradual')}
            />
            <RadioOption
              name="onset"
              value="woke_with"
              label="I woke up with these symptoms"
              checked={answers.onset === 'woke_with'}
              onChange={() => handleAnswer('onset', 'woke_with')}
            />
            <RadioOption
              name="onset"
              value="not_sure"
              label="I'm not sure when they started"
              checked={answers.onset === 'not_sure'}
              onChange={() => handleAnswer('onset', 'not_sure')}
            />
          </div>

          {answers.onset && answers.onset === 'sudden' && (
            <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <AlertTriangle
                  className="text-yellow-500 mr-2 mt-1 flex-shrink-0"
                  size={18}
                />
                <p className="text-sm">
                  Sudden onset of symptoms may indicate a medical emergency. If
                  symptoms are severe or ongoing, please seek immediate medical
                  attention.
                </p>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'symptoms',
      title: 'What symptoms are you experiencing?',
      content: () => (
        <div>
          <p className="mb-4">Select all symptoms that apply:</p>
          <div className="space-y-3">
            <CheckboxOption
              name="face_drooping"
              label="Face drooping or numbness (one side)"
              checked={answers.face_drooping}
              onChange={() =>
                handleAnswer('face_drooping', !answers.face_drooping)
              }
              warning={true}
            />
            <CheckboxOption
              name="arm_weakness"
              label="Arm weakness or numbness"
              checked={answers.arm_weakness}
              onChange={() =>
                handleAnswer('arm_weakness', !answers.arm_weakness)
              }
              warning={true}
            />
            <CheckboxOption
              name="speech_difficulty"
              label="Speech difficulty or slurred speech"
              checked={answers.speech_difficulty}
              onChange={() =>
                handleAnswer('speech_difficulty', !answers.speech_difficulty)
              }
              warning={true}
            />
            <CheckboxOption
              name="balance_problems"
              label="Balance problems or difficulty walking"
              checked={answers.balance_problems}
              onChange={() =>
                handleAnswer('balance_problems', !answers.balance_problems)
              }
            />
            <CheckboxOption
              name="vision_changes"
              label="Vision changes (blurry, double vision, loss of vision)"
              checked={answers.vision_changes}
              onChange={() =>
                handleAnswer('vision_changes', !answers.vision_changes)
              }
              warning={true}
            />
            <CheckboxOption
              name="headache"
              label="Severe headache with no known cause"
              checked={answers.headache}
              onChange={() => handleAnswer('headache', !answers.headache)}
              warning={true}
            />
            <CheckboxOption
              name="dizziness"
              label="Dizziness, confusion or trouble understanding"
              checked={answers.dizziness}
              onChange={() => handleAnswer('dizziness', !answers.dizziness)}
            />
            <CheckboxOption
              name="numbness"
              label="Numbness or tingling"
              checked={answers.numbness}
              onChange={() => handleAnswer('numbness', !answers.numbness)}
            />
          </div>

          {(answers.face_drooping ||
            answers.arm_weakness ||
            answers.speech_difficulty ||
            answers.vision_changes ||
            answers.headache) && (
            <div className="mt-4 bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-start">
                <AlertTriangle
                  className="text-red-500 mr-2 mt-1 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-sm font-bold text-red-700">
                    Warning: Possible stroke symptoms
                  </p>
                  <p className="text-sm">
                    The symptoms you selected are potential signs of a stroke.
                    If these symptoms are new or current, call 911 or seek
                    emergency care immediately.
                  </p>
                  <button
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm w-full"
                    onClick={() => setShowEmergency(true)}
                  >
                    Emergency Information
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'side',
      title: 'Which side of your body is affected?',
      content: () => (
        <div>
          <p className="mb-4">
            Please indicate which side of your body is experiencing symptoms:
          </p>
          <div className="space-y-3">
            <RadioOption
              name="side"
              value="right"
              label="Right side only"
              checked={answers.side === 'right'}
              onChange={() => handleAnswer('side', 'right')}
            />
            <RadioOption
              name="side"
              value="left"
              label="Left side only"
              checked={answers.side === 'left'}
              onChange={() => handleAnswer('side', 'left')}
            />
            <RadioOption
              name="side"
              value="both"
              label="Both sides"
              checked={answers.side === 'both'}
              onChange={() => handleAnswer('side', 'both')}
            />
            <RadioOption
              name="side"
              value="no_side"
              label="No side affected / Not applicable"
              checked={answers.side === 'no_side'}
              onChange={() => handleAnswer('side', 'no_side')}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'duration',
      title: 'How long have the symptoms lasted?',
      content: () => (
        <div>
          <p className="mb-4">
            Please select how long your symptoms have lasted:
          </p>
          <div className="space-y-3">
            <RadioOption
              name="duration"
              value="less_than_minute"
              label="Less than 1 minute"
              checked={answers.duration === 'less_than_minute'}
              onChange={() => handleAnswer('duration', 'less_than_minute')}
            />
            <RadioOption
              name="duration"
              value="1_10_minutes"
              label="1-10 minutes"
              checked={answers.duration === '1_10_minutes'}
              onChange={() => handleAnswer('duration', '1_10_minutes')}
            />
            <RadioOption
              name="duration"
              value="10_60_minutes"
              label="10-60 minutes"
              checked={answers.duration === '10_60_minutes'}
              onChange={() => handleAnswer('duration', '10_60_minutes')}
            />
            <RadioOption
              name="duration"
              value="1_24_hours"
              label="1-24 hours"
              checked={answers.duration === '1_24_hours'}
              onChange={() => handleAnswer('duration', '1_24_hours')}
              showWarning={answers.duration === '1_24_hours'}
            />
            <RadioOption
              name="duration"
              value="more_than_24_hours"
              label="More than 24 hours"
              checked={answers.duration === 'more_than_24_hours'}
              onChange={() => handleAnswer('duration', 'more_than_24_hours')}
              showWarning={answers.duration === 'more_than_24_hours'}
            />
            <RadioOption
              name="duration"
              value="ongoing"
              label="Ongoing / Still present"
              checked={answers.duration === 'ongoing'}
              onChange={() => handleAnswer('duration', 'ongoing')}
              showWarning={answers.duration === 'ongoing'}
            />
          </div>

          {answers.duration &&
            ['1_24_hours', 'more_than_24_hours', 'ongoing'].includes(
              answers.duration
            ) && (
              <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <AlertTriangle
                    className="text-yellow-500 mr-2 mt-1 flex-shrink-0"
                    size={18}
                  />
                  <p className="text-sm">
                    Symptoms lasting longer than 1 hour could indicate a stroke
                    rather than a TIA (mini-stroke). If you haven't already,
                    please consult with a healthcare provider.
                  </p>
                </div>
              </div>
            )}
        </div>
      ),
    },
    {
      id: 'previous',
      title: 'Have you had similar symptoms before?',
      content: () => (
        <div>
          <p className="mb-4">
            Have you experienced similar symptoms in the past?
          </p>
          <div className="space-y-3">
            <RadioOption
              name="previous"
              value="yes"
              label="Yes"
              checked={answers.previous === 'yes'}
              onChange={() => handleAnswer('previous', 'yes')}
            />
            <RadioOption
              name="previous"
              value="no"
              label="No"
              checked={answers.previous === 'no'}
              onChange={() => handleAnswer('previous', 'no')}
            />
            <RadioOption
              name="previous"
              value="not_sure"
              label="Not sure"
              checked={answers.previous === 'not_sure'}
              onChange={() => handleAnswer('previous', 'not_sure')}
            />
          </div>

          {answers.previous === 'yes' && (
            <div className="mt-4">
              <p className="mb-2">How many times in the past month?</p>
              <div className="space-y-3">
                <RadioOption
                  name="previous_count"
                  value="once"
                  label="Once"
                  checked={answers.previous_count === 'once'}
                  onChange={() => handleAnswer('previous_count', 'once')}
                />
                <RadioOption
                  name="previous_count"
                  value="2_5_times"
                  label="2-5 times"
                  checked={answers.previous_count === '2_5_times'}
                  onChange={() => handleAnswer('previous_count', '2_5_times')}
                  showWarning={answers.previous_count === '2_5_times'}
                />
                <RadioOption
                  name="previous_count"
                  value="more_than_5"
                  label="More than 5 times"
                  checked={answers.previous_count === 'more_than_5'}
                  onChange={() => handleAnswer('previous_count', 'more_than_5')}
                  showWarning={answers.previous_count === 'more_than_5'}
                />
              </div>

              {answers.previous_count &&
                ['2_5_times', 'more_than_5'].includes(
                  answers.previous_count
                ) && (
                  <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <div className="flex items-start">
                      <AlertTriangle
                        className="text-yellow-500 mr-2 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <p className="text-sm">
                        Multiple episodes of similar symptoms may indicate an
                        increased stroke risk. Please discuss this with your
                        healthcare provider as soon as possible.
                      </p>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'medications',
      title: 'Current Medications',
      content: () => (
        <div>
          <p className="mb-4">
            Are you currently taking any of these medications?
          </p>
          <div className="space-y-3">
            <CheckboxOption
              name="medication_blood_thinners"
              label="Blood thinners (Warfarin, Eliquis, Xarelto, etc.)"
              checked={answers.medication_blood_thinners}
              onChange={() =>
                handleAnswer(
                  'medication_blood_thinners',
                  !answers.medication_blood_thinners
                )
              }
            />
            <CheckboxOption
              name="medication_aspirin"
              label="Aspirin or other antiplatelet medication"
              checked={answers.medication_aspirin}
              onChange={() =>
                handleAnswer('medication_aspirin', !answers.medication_aspirin)
              }
            />
            <CheckboxOption
              name="medication_bp"
              label="Blood pressure medication"
              checked={answers.medication_bp}
              onChange={() =>
                handleAnswer('medication_bp', !answers.medication_bp)
              }
            />
            <CheckboxOption
              name="medication_cholesterol"
              label="Cholesterol medication"
              checked={answers.medication_cholesterol}
              onChange={() =>
                handleAnswer(
                  'medication_cholesterol',
                  !answers.medication_cholesterol
                )
              }
            />
            <CheckboxOption
              name="medication_diabetes"
              label="Diabetes medication"
              checked={answers.medication_diabetes}
              onChange={() =>
                handleAnswer(
                  'medication_diabetes',
                  !answers.medication_diabetes
                )
              }
            />
            <CheckboxOption
              name="medication_none"
              label="None of these"
              checked={answers.medication_none}
              onChange={() => {
                const newValue = !answers.medication_none;
                handleAnswer('medication_none', newValue);
                if (newValue) {
                  handleAnswer('medication_blood_thinners', false);
                  handleAnswer('medication_aspirin', false);
                  handleAnswer('medication_bp', false);
                  handleAnswer('medication_cholesterol', false);
                  handleAnswer('medication_diabetes', false);
                }
              }}
            />
          </div>

          {(answers.medication_blood_thinners || answers.medication_aspirin) &&
            (answers.face_drooping ||
              answers.arm_weakness ||
              answers.speech_difficulty) && (
              <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <AlertTriangle
                    className="text-yellow-500 mr-2 mt-1 flex-shrink-0"
                    size={18}
                  />
                  <p className="text-sm">
                    Experiencing stroke symptoms while on blood thinners or
                    antiplatelet medication is significant information for your
                    healthcare provider.
                  </p>
                </div>
              </div>
            )}
        </div>
      ),
    },
    {
      id: 'risk_factors',
      title: 'Risk Factors',
      content: () => (
        <div>
          <p className="mb-4">
            Do you have any of these conditions? (Select all that apply)
          </p>
          <div className="space-y-3">
            <CheckboxOption
              name="risk_hypertension"
              label="High blood pressure (Hypertension)"
              checked={answers.risk_hypertension}
              onChange={() =>
                handleAnswer('risk_hypertension', !answers.risk_hypertension)
              }
            />
            <CheckboxOption
              name="risk_afib"
              label="Atrial fibrillation (irregular heartbeat)"
              checked={answers.risk_afib}
              onChange={() => handleAnswer('risk_afib', !answers.risk_afib)}
            />
            <CheckboxOption
              name="risk_diabetes"
              label="Diabetes"
              checked={answers.risk_diabetes}
              onChange={() =>
                handleAnswer('risk_diabetes', !answers.risk_diabetes)
              }
            />
            <CheckboxOption
              name="risk_high_cholesterol"
              label="High cholesterol"
              checked={answers.risk_high_cholesterol}
              onChange={() =>
                handleAnswer(
                  'risk_high_cholesterol',
                  !answers.risk_high_cholesterol
                )
              }
            />
            <CheckboxOption
              name="risk_previous_stroke"
              label="Previous stroke or TIA"
              checked={answers.risk_previous_stroke}
              onChange={() =>
                handleAnswer(
                  'risk_previous_stroke',
                  !answers.risk_previous_stroke
                )
              }
            />
            <CheckboxOption
              name="risk_smoker"
              label="Current smoker"
              checked={answers.risk_smoker}
              onChange={() => handleAnswer('risk_smoker', !answers.risk_smoker)}
            />
            <CheckboxOption
              name="risk_none"
              label="None of these"
              checked={answers.risk_none}
              onChange={() => {
                const newValue = !answers.risk_none;
                handleAnswer('risk_none', newValue);
                if (newValue) {
                  handleAnswer('risk_hypertension', false);
                  handleAnswer('risk_afib', false);
                  handleAnswer('risk_diabetes', false);
                  handleAnswer('risk_high_cholesterol', false);
                  handleAnswer('risk_previous_stroke', false);
                  handleAnswer('risk_smoker', false);
                }
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'notes',
      title: 'Additional Notes',
      content: () => (
        <div>
          <p className="mb-4">
            Is there anything else you'd like your healthcare provider to know?
          </p>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 h-32"
            placeholder="Enter any additional information about your symptoms here..."
            value={answers.notes || ''}
            onChange={(e) => handleAnswer('notes', e.target.value)}
          />
        </div>
      ),
    },
    {
      id: 'review',
      title: 'Review Your Information',
      content: () => (
        <div>
          <h2 className="text-lg font-bold mb-4">Review your symptom report</h2>
          <p className="mb-4 text-sm">
            Please review the information you've provided before submitting.
          </p>

          <div className="border border-gray-200 rounded-lg divide-y">
            <SummaryItem title="Onset" value={getOnsetText()} />
            <SummaryItem title="Symptoms" value={getSymptomsList()} />
            <SummaryItem title="Affected Side" value={getSideText()} />
            <SummaryItem title="Duration" value={getDurationText()} />
            <SummaryItem
              title="Previous Occurrences"
              value={getPreviousText()}
            />
            <SummaryItem title="Medications" value={getMedicationsText()} />
            <SummaryItem title="Risk Factors" value={getRiskFactorsText()} />
            {answers.notes && (
              <SummaryItem title="Additional Notes" value={answers.notes} />
            )}
          </div>

          {hasWarningSymptoms() && (
            <div className="mt-4 bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-start">
                <AlertTriangle
                  className="text-red-500 mr-2 mt-1 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-sm font-bold text-red-700">
                    Warning: Possible stroke symptoms detected
                  </p>
                  <p className="text-sm">
                    Based on your responses, you may be experiencing symptoms of
                    a stroke. If these symptoms are current, please seek
                    emergency medical attention immediately.
                  </p>
                  <button
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm w-full"
                    onClick={() => setShowEmergency(true)}
                  >
                    Emergency Information
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleAnswer = (field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));

    // If they select "None of these" for medications, uncheck other options
    if (field === 'medication_none' && value === true) {
      setAnswers((prev) => ({
        ...prev,
        medication_blood_thinners: false,
        medication_aspirin: false,
        medication_bp: false,
        medication_cholesterol: false,
        medication_diabetes: false,
        [field]: value,
      }));
    }

    // If they select any medication, uncheck "None of these"
    if (
      [
        'medication_blood_thinners',
        'medication_aspirin',
        'medication_bp',
        'medication_cholesterol',
        'medication_diabetes',
      ].includes(field) &&
      value === true
    ) {
      setAnswers((prev) => ({
        ...prev,
        medication_none: false,
        [field]: value,
      }));
    }

    // Similar logic for risk factors
    if (field === 'risk_none' && value === true) {
      setAnswers((prev) => ({
        ...prev,
        risk_hypertension: false,
        risk_afib: false,
        risk_diabetes: false,
        risk_high_cholesterol: false,
        risk_previous_stroke: false,
        risk_smoker: false,
        [field]: value,
      }));
    }

    if (
      [
        'risk_hypertension',
        'risk_afib',
        'risk_diabetes',
        'risk_high_cholesterol',
        'risk_previous_stroke',
        'risk_smoker',
      ].includes(field) &&
      value === true
    ) {
      setAnswers((prev) => ({
        ...prev,
        risk_none: false,
        [field]: value,
      }));
    }
  };

  const hasWarningSymptoms = () => {
    return (
      answers.face_drooping ||
      answers.arm_weakness ||
      answers.speech_difficulty ||
      answers.vision_changes ||
      answers.headache ||
      (answers.onset === 'sudden' &&
        (answers.duration === 'ongoing' ||
          answers.duration === 'more_than_24_hours'))
    );
  };

  const getOnsetText = () => {
    switch (answers.onset) {
      case 'sudden':
        return 'Sudden onset (within seconds or minutes)';
      case 'gradual':
        return 'Gradual onset (over hours or days)';
      case 'woke_with':
        return 'Woke up with symptoms';
      case 'not_sure':
        return 'Not sure when they started';
      default:
        return 'Not specified';
    }
  };

  const getSymptomsList = () => {
    const symptoms = [];
    if (answers.face_drooping) symptoms.push('Face drooping or numbness');
    if (answers.arm_weakness) symptoms.push('Arm weakness or numbness');
    if (answers.speech_difficulty) symptoms.push('Speech difficulty');
    if (answers.balance_problems) symptoms.push('Balance problems');
    if (answers.vision_changes) symptoms.push('Vision changes');
    if (answers.headache) symptoms.push('Severe headache');
    if (answers.dizziness) symptoms.push('Dizziness or confusion');
    if (answers.numbness) symptoms.push('Numbness or tingling');

    return symptoms.length > 0 ? symptoms.join(', ') : 'None specified';
  };

  const getSideText = () => {
    switch (answers.side) {
      case 'right':
        return 'Right side';
      case 'left':
        return 'Left side';
      case 'both':
        return 'Both sides';
      case 'no_side':
        return 'No specific side affected';
      default:
        return 'Not specified';
    }
  };

  const getDurationText = () => {
    switch (answers.duration) {
      case 'less_than_minute':
        return 'Less than 1 minute';
      case '1_10_minutes':
        return '1-10 minutes';
      case '10_60_minutes':
        return '10-60 minutes';
      case '1_24_hours':
        return '1-24 hours';
      case 'more_than_24_hours':
        return 'More than 24 hours';
      case 'ongoing':
        return 'Ongoing / Still present';
      default:
        return 'Not specified';
    }
  };

  const getPreviousText = () => {
    if (answers.previous === 'yes') {
      let frequency = '';
      switch (answers.previous_count) {
        case 'once':
          frequency = 'Once in the past month';
          break;
        case '2_5_times':
          frequency = '2-5 times in the past month';
          break;
        case 'more_than_5':
          frequency = 'More than 5 times in the past month';
          break;
        default:
          frequency = 'Frequency not specified';
      }
      return `Yes, ${frequency}`;
    } else if (answers.previous === 'no') {
      return 'No previous occurrences';
    } else if (answers.previous === 'not_sure') {
      return 'Not sure about previous occurrences';
    }
    return 'Not specified';
  };

  const getMedicationsText = () => {
    if (answers.medication_none) return 'None';

    const medications = [];
    if (answers.medication_blood_thinners) medications.push('Blood thinners');
    if (answers.medication_aspirin)
      medications.push('Aspirin/antiplatelet medication');
    if (answers.medication_bp) medications.push('Blood pressure medication');
    if (answers.medication_cholesterol)
      medications.push('Cholesterol medication');
    if (answers.medication_diabetes) medications.push('Diabetes medication');

    return medications.length > 0 ? medications.join(', ') : 'None specified';
  };

  const getRiskFactorsText = () => {
    if (answers.risk_none) return 'None';

    const riskFactors = [];
    if (answers.risk_hypertension) riskFactors.push('Hypertension');
    if (answers.risk_afib) riskFactors.push('Atrial fibrillation');
    if (answers.risk_diabetes) riskFactors.push('Diabetes');
    if (answers.risk_high_cholesterol) riskFactors.push('High cholesterol');
    if (answers.risk_previous_stroke) riskFactors.push('Previous stroke/TIA');
    if (answers.risk_smoker) riskFactors.push('Current smoker');

    return riskFactors.length > 0 ? riskFactors.join(', ') : 'None specified';
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true; // Welcome screen
      case 1:
        return answers.onset !== undefined; // Onset
      case 2:
        return true; // Symptoms (can proceed even if none selected)
      case 3:
        return answers.side !== undefined; // Side
      case 4:
        return answers.duration !== undefined; // Duration
      case 5:
        return answers.previous !== undefined; // Previous occurrences
      case 6:
        return true; // Medications (can proceed even if none selected)
      case 7:
        return true; // Risk factors (can proceed even if none selected)
      case 8:
        return true; // Notes (optional)
      case 9:
        return true; // Review (can always proceed)
      default:
        return false;
    }
  };

  const getReportText = () => {
    return `STROKE/TIA SYMPTOM TRACKER REPORT
    
Onset: ${getOnsetText()}
Symptoms: ${getSymptomsList()}
Affected Side: ${getSideText()}
Duration: ${getDurationText()}
Previous Occurrences: ${getPreviousText()}
Medications: ${getMedicationsText()}
Risk Factors: ${getRiskFactorsText()}
${answers.notes ? `Additional Notes: ${answers.notes}` : ''}

${
  hasWarningSymptoms()
    ? 'WARNING: Possible stroke symptoms detected. If current, seek immediate medical attention.'
    : ''
}

Report Date: ${new Date().toLocaleDateString()}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(getReportText())
      .then(() => {
        alert('Report copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="text-green-600" size={24} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">
            Symptom Report Submitted
          </h2>
          <p className="text-center mb-6">
            Your symptom report has been saved. You can share this with your
            healthcare provider.
          </p>

          <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
            <pre className="text-xs whitespace-pre-wrap">{getReportText()}</pre>
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center w-full bg-blue-600 text-white p-3 rounded-lg mb-3"
          >
            <Copy size={18} className="mr-2" />
            Copy Report
          </button>

          {hasWarningSymptoms() && (
            <div className="mt-4 bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-start">
                <AlertTriangle
                  className="text-red-500 mr-2 mt-1 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-sm font-bold text-red-700">
                    Warning: Possible stroke symptoms detected
                  </p>
                  <p className="text-sm">
                    Based on your responses, you may be experiencing symptoms of
                    a stroke. If these symptoms are current, please seek
                    emergency medical attention immediately.
                  </p>
                  <button
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm w-full"
                    onClick={() => setShowEmergency(true)}
                  >
                    Emergency Information
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(0);
              setAnswers({});
            }}
            className="w-full border border-gray-300 p-3 rounded-lg mt-2"
          >
            Start New Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
      {/* Emergency Modal */}
      {showEmergency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
              <AlertTriangle className="mr-2" /> Emergency Information
            </h2>
            <p className="mb-4">
              <strong>
                Call 911 immediately if you are experiencing stroke symptoms.
              </strong>
            </p>
            <p className="mb-4">Remember the acronym FAST:</p>
            <ul className="list-disc pl-5 mb-6">
              <li className="mb-2">
                <strong>F</strong>ace: Ask the person to smile. Does one side of
                the face droop?
              </li>
              <li className="mb-2">
                <strong>A</strong>rms: Ask the person to raise both arms. Does
                one arm drift downward?
              </li>
              <li className="mb-2">
                <strong>S</strong>peech: Ask the person to repeat a simple
                phrase. Is their speech slurred or strange?
              </li>
              <li>
                <strong>T</strong>ime: If you observe any of these signs, call
                911 immediately.
              </li>
            </ul>
            <p className="mb-6 text-sm">
              Every minute counts! Early treatment can minimize the long-term
              effects of a stroke and prevent death.
            </p>
            <button
              className="w-full bg-red-600 text-white p-3 rounded-lg mb-2"
              onClick={() => (window.location.href = 'tel:911')}
            >
              Call 911
            </button>
            <button
              className="w-full border border-gray-300 p-3 rounded-lg"
              onClick={() => setShowEmergency(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-gray-100 p-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h1 className="text-xl font-bold mb-6">{steps[currentStep].title}</h1>

        {steps[currentStep].content()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className={`px-4 py-2 border border-gray-300 rounded-lg ${
              currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentStep === 0}
          >
            Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center ${
                !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight size={16} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper components
function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
  showWarning = false,
}) {
  return (
    <div
      className={`flex items-center p-3 border rounded-lg ${
        checked ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center flex-1">
        <input
          type="radio"
          id={`${name}_${value}`}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-blue-600"
        />
        <label htmlFor={`${name}_${value}`} className="ml-2 flex-1">
          {label}
          {showWarning && checked && (
            <AlertTriangle
              size={16}
              className="inline-block ml-2 text-yellow-500"
            />
          )}
        </label>
      </div>
    </div>
  );
}

function CheckboxOption({ name, label, checked, onChange, warning = false }) {
  return (
    <div
      className={`flex items-center p-3 border rounded-lg ${
        checked ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-blue-600"
        />
        <label htmlFor={name} className="ml-2 flex-1">
          {label}
          {warning && checked && (
            <AlertTriangle
              size={16}
              className="inline-block ml-2 text-yellow-500"
            />
          )}
        </label>
      </div>
    </div>
  );
}

function SummaryItem({ title, value }) {
  const [expanded, setExpanded] = useState(false);
  const shouldCollapse = value && value.length > 100;

  return (
    <div className="p-3">
      <div className="font-medium text-gray-700">{title}</div>
      {shouldCollapse ? (
        <div>
          <p className="text-sm text-gray-600 mt-1">
            {expanded ? value : `${value.substring(0, 100)}...`}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-xs flex items-center mt-1"
          >
            {expanded ? (
              <>
                Show less <ChevronUp size={14} className="ml-1" />
              </>
            ) : (
              <>
                Show more <ChevronDown size={14} className="ml-1" />
              </>
            )}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-600 mt-1">{value}</p>
      )}
    </div>
  );
}
