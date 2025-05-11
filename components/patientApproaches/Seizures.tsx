import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function SeizureAssessmentApp() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [copied, setCopied] = useState(false);

  // Emergency detection
  const hasEmergencyCondition = () => {
    return (
      answers.currentlyHavingSeizure === 'yes' ||
      answers.consciousnessNotRecovered === 'yes' ||
      answers.seizureDuration === 'more-than-5-minutes' ||
      answers.injuryDuringSeizure === 'severe'
    );
  };

  // Copy assessment results
  const copyToClipboard = () => {
    const text = Object.entries(answers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Move to next screen based on conditional logic
  const navigateNext = (screenName) => {
    // Special handling for emergency detection
    if (hasEmergencyCondition() && currentScreen !== 'emergency') {
      setCurrentScreen('emergency');
      return;
    }

    setCurrentScreen(screenName);

    // Update progress percentage based on total number of screens (approx 12)
    const screenCount = 12;
    const screenOrder = {
      welcome: 0,
      'alarm-check': 1,
      'basic-info': 2,
      'seizure-frequency': 3,
      'last-seizure': 4,
      'seizure-duration': 5,
      consciousness: 6,
      triggers: 7,
      'symptoms-before': 8,
      'symptoms-during': 9,
      'symptoms-after': 10,
      medications: 11,
      review: 12,
      'thank-you': 13,
    };

    if (screenOrder[screenName] !== undefined) {
      setProgress(Math.floor((screenOrder[screenName] / screenCount) * 100));
    }
  };

  // Update answers state when user selects an option
  const handleAnswer = (question, answer) => {
    setAnswers({ ...answers, [question]: answer });
  };

  // Render emergency screen with instructions
  const EmergencyScreen = () => (
    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 text-center">
      <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
      <h2 className="text-xl font-bold text-red-700 mb-2">
        Medical Emergency Detected
      </h2>
      <p className="mb-4 text-red-700">
        Based on your responses, immediate medical attention is needed.
      </p>
      <div className="bg-white p-4 rounded-lg mb-4 text-left">
        <p className="font-bold mb-2">Please take these actions now:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>Call emergency services (911) immediately</li>
          <li>Time the seizure if possible</li>
          <li>Move dangerous objects away</li>
          <li>Don't restrain the person</li>
          <li>Don't put anything in their mouth</li>
          <li>Turn the person on their side if safe to do so</li>
        </ul>
      </div>
      <button
        className="bg-red-600 text-white py-2 px-6 rounded-lg w-full"
        onClick={() => navigateNext('welcome')}
      >
        Restart Assessment
      </button>
    </div>
  );

  // Question screen template
  const QuestionScreen = ({
    title,
    description,
    children,
    nextScreen,
    backScreen,
  }) => (
    <div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {description && <p className="mb-4 text-gray-600">{description}</p>}

      <div className="my-6">{children}</div>

      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-200 py-2 px-4 rounded-lg flex items-center"
          onClick={() => setCurrentScreen(backScreen || 'welcome')}
        >
          <ChevronLeft size={18} className="mr-1" />
          Back
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-6 rounded-lg flex items-center"
          onClick={() => navigateNext(nextScreen)}
        >
          Continue
          <ChevronRight size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );

  // Option button component
  const OptionButton = ({ value, label, question, selected }) => (
    <button
      className={`border rounded-lg p-4 mb-3 w-full text-left flex items-center ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onClick={() => handleAnswer(question, value)}
    >
      <div
        className={`w-6 h-6 mr-3 rounded-full border ${
          selected ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
        } flex items-center justify-center`}
      >
        {selected && <Check size={16} className="text-white" />}
      </div>
      <span>{label}</span>
    </button>
  );

  // Progress bar component
  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div
        className="bg-blue-500 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  // Screen content based on current screen state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Seizure Assessment</h1>
            <p className="mb-6">
              This assessment helps gather information about your seizures to
              share with your healthcare provider.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm">
                <strong>Note:</strong> If you're currently having a seizure or
                witnessing someone having a seizure, please call emergency
                services (911) immediately.
              </p>
            </div>
            <button
              className="bg-blue-500 text-white py-3 px-6 rounded-lg w-full flex justify-center items-center"
              onClick={() => navigateNext('alarm-check')}
            >
              Start Assessment
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        );

      case 'alarm-check':
        return (
          <>
            <ProgressBar />
            <QuestionScreen
              title="Emergency Check"
              description="Let's first check if immediate medical attention is needed."
              nextScreen="basic-info"
              backScreen="welcome"
            >
              <h3 className="font-medium mb-2">
                Are you or the patient currently having a seizure?
              </h3>
              <OptionButton
                value="yes"
                label="Yes"
                question="currentlyHavingSeizure"
                selected={answers.currentlyHavingSeizure === 'yes'}
              />
              <OptionButton
                value="no"
                label="No"
                question="currentlyHavingSeizure"
                selected={answers.currentlyHavingSeizure === 'no'}
              />

              <h3 className="font-medium mt-4 mb-2">
                Has the person had multiple seizures without regaining
                consciousness?
              </h3>
              <OptionButton
                value="yes"
                label="Yes"
                question="consciousnessNotRecovered"
                selected={answers.consciousnessNotRecovered === 'yes'}
              />
              <OptionButton
                value="no"
                label="No"
                question="consciousnessNotRecovered"
                selected={answers.consciousnessNotRecovered === 'no'}
              />
            </QuestionScreen>
          </>
        );

      case 'basic-info':
        return (
          <>
            <ProgressBar />
            <QuestionScreen
              title="Basic Information"
              nextScreen="seizure-frequency"
              backScreen="alarm-check"
            >
              <h3 className="font-medium mb-2">
                Who is completing this assessment?
              </h3>
              <OptionButton
                value="self"
                label="I am the patient"
                question="completedBy"
                selected={answers.completedBy === 'self'}
              />
              <OptionButton
                value="caregiver"
                label="I am a caregiver/family member"
                question="completedBy"
                selected={answers.completedBy === 'caregiver'}
              />
              <OptionButton
                value="witness"
                label="I witnessed the seizure"
                question="completedBy"
                selected={answers.completedBy === 'witness'}
              />

              <h3 className="font-medium mt-4 mb-2">
                Has the patient been diagnosed with epilepsy?
              </h3>
              <OptionButton
                value="yes"
                label="Yes"
                question="diagnosedEpilepsy"
                selected={answers.diagnosedEpilepsy === 'yes'}
              />
              <OptionButton
                value="no"
                label="No"
                question="diagnosedEpilepsy"
                selected={answers.diagnosedEpilepsy === 'no'}
              />
              <OptionButton
                value="unknown"
                label="I don't know"
                question="diagnosedEpilepsy"
                selected={answers.diagnosedEpilepsy === 'unknown'}
              />
            </QuestionScreen>
          </>
        );

      case 'seizure-frequency':
        return (
          <>
            <ProgressBar />
            <QuestionScreen
              title="Seizure Frequency"
              nextScreen="last-seizure"
              backScreen="basic-info"
            >
              <h3 className="font-medium mb-2">
                How often do seizures typically occur?
              </h3>
              <OptionButton
                value="daily"
                label="Daily"
                question="seizureFrequency"
                selected={answers.seizureFrequency === 'daily'}
              />
              <OptionButton
                value="weekly"
                label="Weekly"
                question="seizureFrequency"
                selected={answers.seizureFrequency === 'weekly'}
              />
              <OptionButton
                value="monthly"
                label="Monthly"
                question="seizureFrequency"
                selected={answers.seizureFrequency === 'monthly'}
              />
              <OptionButton
                value="yearly"
                label="A few times per year"
                question="seizureFrequency"
                selected={answers.seizureFrequency === 'yearly'}
              />
              <OptionButton
                value="less-than-yearly"
                label="Less than once per year"
                question="seizureFrequency"
                selected={answers.seizureFrequency === 'less-than-yearly'}
              />
              <OptionButton
                value="first-time"
                label="This is the first seizure"
                question="seizureFrequency"
                selected={answers.seizureFrequency === 'first-time'}
              />
            </QuestionScreen>
          </>
        );

      case 'last-seizure':
        return (
          <>
            <ProgressBar />
            <QuestionScreen
              title="Most Recent Seizure"
              nextScreen="seizure-duration"
              backScreen="seizure-frequency"
            >
              <h3 className="font-medium mb-2">
                When was the most recent seizure?
              </h3>
              <OptionButton
                value="today"
                label="Today"
                question="lastSeizure"
                selected={answers.lastSeizure === 'today'}
              />
              <OptionButton
                value="yesterday"
                label="Yesterday"
                question="lastSeizure"
                selected={answers.lastSeizure === 'yesterday'}
              />
              <OptionButton
                value="past-week"
                label="Within the past week"
                question="lastSeizure"
                selected={answers.lastSeizure === 'past-week'}
              />
              <OptionButton
                value="past-month"
                label="Within the past month"
                question="lastSeizure"
                selected={answers.lastSeizure === 'past-month'}
              />
              <OptionButton
                value="more-than-month"
                label="More than a month ago"
                question="lastSeizure"
                selected={answers.lastSeizure === 'more-than-month'}
              />
              <OptionButton
                value="happening-now"
                label="It's happening now"
                question="lastSeizure"
                selected={answers.lastSeizure === 'happening-now'}
              />
            </QuestionScreen>
          </>
        );

      case 'seizure-duration':
        return (
          <>
            <ProgressBar />
            <QuestionScreen
              title="Seizure Duration"
              nextScreen="consciousness"
              backScreen="last-seizure"
            >
              <h3 className="font-medium mb-2">
                How long did the seizure last?
              </h3>
              <OptionButton
                value="less-than-1-minute"
                label="Less than 1 minute"
                question="seizureDuration"
                selected={answers.seizureDuration === 'less-than-1-minute'}
              />
              <OptionButton
                value="1-2-minutes"
                label="1-2 minutes"
                question="seizureDuration"
                selected={answers.seizureDuration === '1-2-minutes'}
              />
              <OptionButton
                value="2-5-minutes"
                label="2-5 minutes"
                question="seizureDuration"
                selected={answers.seizureDuration === '2-5-minutes'}
              />
              <OptionButton
                value="more-than-5-minutes"
                label="More than 5 minutes"
                question="seizureDuration"
                selected={answers.seizureDuration === 'more-than-5-minutes'}
              />
              <OptionButton
                value="unknown"
                label="I don't know"
                question="seizureDuration"
                selected={answers.seizureDuration === 'unknown'}
              />

              <h3 className="font-medium mt-4 mb-2">
                Was there any injury during the seizure?
              </h3>
              <OptionButton
                value="none"
                label="No injury"
                question="injuryDuringSeizure"
                selected={answers.injuryDuringSeizure === 'none'}
              />
              <OptionButton
                value="minor"
                label="Minor injury (bruising, scratches)"
                question="injuryDuringSeizure"
                selected={answers.injuryDuringSeizure === 'minor'}
              />
              <OptionButton
                value="moderate"
                label="Moderate injury (cuts, falling)"
                question="injuryDuringSeizure"
                selected={answers.injuryDuringSeizure === 'moderate'}
              />
              <OptionButton
                value="severe"
                label="Severe injury (head injury, fracture)"
                question="injuryDuringSeizure"
                selected={answers.injuryDuringSeizure === 'severe'}
              />
            </QuestionScreen>
          </>
        );

      case 'consciousness':
        return (
          <>
            <ProgressBar />
            <QuestionScreen
              title="Consciousness"
              nextScreen="triggers"
              backScreen="seizure-duration"
            >
              <h3 className="font-medium mb-2">
                Was there loss of consciousness during the seizure?
              </h3>
              <OptionButton
                value="yes"
                label="Yes, complete loss of consciousness"
                question="lossOfConsciousness"
                selected={answers.lossOfConsciousness === 'yes'}
              />
              <OptionButton
                value="partial"
                label="Partial - awareness was altered but not completely lost"
                question="lossOfConsciousness"
                selected={answers.lossOfConsciousness === 'partial'}
              />
              <OptionButton
                value="no"
                label="No, remained fully aware"
                question="lossOfConsciousness"
                selected={answers.lossOfConsciousness === 'no'}
              />
              <OptionButton
                value="unknown"
                label="I don't know"
                question="lossOfConsciousness"
                selected={answers.lossOfConsciousness === 'unknown'}
              />
            </QuestionScreen>
          </>
        );

      case 'triggers':
        return (
          <>
            <ProgressBar />
            <QuestionScreen
              title="Seizure Triggers"
              description="Select all that apply or were present before the seizure."
              nextScreen="symptoms-before"
              backScreen="consciousness"
            >
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trigger-sleep"
                    className="w-5 h-5 mr-3"
                    checked={answers.triggerSleepDeprivation}
                    onChange={(e) =>
                      handleAnswer('triggerSleepDeprivation', e.target.checked)
                    }
                  />
                  <label htmlFor="trigger-sleep">Sleep deprivation</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trigger-stress"
                    className="w-5 h-5 mr-3"
                    checked={answers.triggerStress}
                    onChange={(e) =>
                      handleAnswer('triggerStress', e.target.checked)
                    }
                  />
                  <label htmlFor="trigger-stress">Stress or anxiety</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trigger-alcohol"
                    className="w-5 h-5 mr-3"
                    checked={answers.triggerAlcohol}
                    onChange={(e) =>
                      handleAnswer('triggerAlcohol', e.target.checked)
                    }
                  />
                  <label htmlFor="trigger-alcohol">Alcohol consumption</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trigger-missed-meds"
                    className="w-5 h-5 mr-3"
                    checked={answers.triggerMissedMeds}
                    onChange={(e) =>
                      handleAnswer('triggerMissedMeds', e.target.checked)
                    }
                  />
                  <label htmlFor="trigger-missed-meds">
                    Missed medications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trigger-lights"
                    className="w-5 h-5 mr-3"
                    checked={answers.triggerFlashingLights}
                    onChange={(e) =>
                      handleAnswer('triggerFlashingLights', e.target.checked)
                    }
                  />
                  <label htmlFor="trigger-lights">Flashing lights</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trigger-fever"
                    className="w-5 h-5 mr-3"
                    checked={answers.triggerFever}
                    onChange={(e) =>
                      handleAnswer('triggerFever', e.target.checked)
                    }
                  />
                  <label htmlFor="trigger-fever">Fever or illness</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trigger-menstruation"
                    className="w-5 h-5 mr-3"
                    checked={answers.triggerMenstruation}
                    onChange={(e) =>
                      handleAnswer('triggerMenstruation', e.target.checked)
                    }
                  />
                  <label htmlFor="trigger-menstruation">Menstruation</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trigger-unknown"
                    className="w-5 h-5 mr-3"
                    checked={answers.triggerUnknown}
                    onChange={(e) =>
                      handleAnswer('triggerUnknown', e.target.checked)
                    }
                  />
                  <label htmlFor="trigger-unknown">Unknown trigger</label>
                </div>
              </div>
            </QuestionScreen>
          </>
        );

      case 'symptoms-before':
        return (
          <>
            <ProgressBar />
            <QuestionScreen
              title="Symptoms Before Seizure"
              description="Did you experience any warning signs before the seizure (aura)? Select all that apply."
              nextScreen="symptoms-during"
              backScreen="triggers"
            >
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aura-stomach"
                    className="w-5 h-5 mr-3"
                    checked={answers.auraStomachSensation}
                    onChange={(e) =>
                      handleAnswer('auraStomachSensation', e.target.checked)
                    }
                  />
                  <label htmlFor="aura-stomach">
                    Rising sensation in stomach
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aura-smell"
                    className="w-5 h-5 mr-3"
                    checked={answers.auraSmell}
                    onChange={(e) =>
                      handleAnswer('auraSmell', e.target.checked)
                    }
                  />
                  <label htmlFor="aura-smell">Unusual smell or taste</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aura-visual"
                    className="w-5 h-5 mr-3"
                    checked={answers.auraVisual}
                    onChange={(e) =>
                      handleAnswer('auraVisual', e.target.checked)
                    }
                  />
                  <label htmlFor="aura-visual">
                    Visual changes (spots, lights, blurring)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aura-deja-vu"
                    className="w-5 h-5 mr-3"
                    checked={answers.auraDejaVu}
                    onChange={(e) =>
                      handleAnswer('auraDejaVu', e.target.checked)
                    }
                  />
                  <label htmlFor="aura-deja-vu">
                    Déjà vu or jamais vu feeling
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aura-fear"
                    className="w-5 h-5 mr-3"
                    checked={answers.auraFear}
                    onChange={(e) => handleAnswer('auraFear', e.target.checked)}
                  />
                  <label htmlFor="aura-fear">Sudden fear or anxiety</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aura-dizziness"
                    className="w-5 h-5 mr-3"
                    checked={answers.auraDizziness}
                    onChange={(e) =>
                      handleAnswer('auraDizziness', e.target.checked)
                    }
                  />
                  <label htmlFor="aura-dizziness">
                    Dizziness or lightheadedness
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aura-none"
                    className="w-5 h-5 mr-3"
                    checked={answers.auraNoWarning}
                    onChange={(e) =>
                      handleAnswer('auraNoWarning', e.target.checked)
                    }
                  />
                  <label htmlFor="aura-none">No warning signs</label>
                </div>
              </div>
            </QuestionScreen>
          </>
        );

      case 'symptoms-during':
        return (
          <>
            <ProgressBar />
            <QuestionScreen
              title="Symptoms During Seizure"
              description="Select all symptoms that occurred during the seizure."
              nextScreen="symptoms-after"
              backScreen="symptoms-before"
            >
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symptom-convulsion"
                    className="w-5 h-5 mr-3"
                    checked={answers.symptomConvulsion}
                    onChange={(e) =>
                      handleAnswer('symptomConvulsion', e.target.checked)
                    }
                  />
                  <label htmlFor="symptom-convulsion">
                    Convulsions (jerking movements)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symptom-stiffening"
                    className="w-5 h-5 mr-3"
                    checked={answers.symptomStiffening}
                    onChange={(e) =>
                      handleAnswer('symptomStiffening', e.target.checked)
                    }
                  />
                  <label htmlFor="symptom-stiffening">Muscle stiffening</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symptom-fall"
                    className="w-5 h-5 mr-3"
                    checked={answers.symptomFall}
                    onChange={(e) =>
                      handleAnswer('symptomFall', e.target.checked)
                    }
                  />
                  <label htmlFor="symptom-fall">Falling</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symptom-wandering"
                    className="w-5 h-5 mr-3"
                    checked={answers.symptomWandering}
                    onChange={(e) =>
                      handleAnswer('symptomWandering', e.target.checked)
                    }
                  />
                  <label htmlFor="symptom-wandering">
                    Automatisms (wandering, lip smacking)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symptom-staring"
                    className="w-5 h-5 mr-3"
                    checked={answers.symptomStaring}
                    onChange={(e) =>
                      handleAnswer('symptomStaring', e.target.checked)
                    }
                  />
                  <label htmlFor="symptom-staring">Staring spell</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symptom-tongue"
                    className="w-5 h-5 mr-3"
                    checked={answers.symptomTongueBiting}
                    onChange={(e) =>
                      handleAnswer('symptomTongueBiting', e.target.checked)
                    }
                  />
                  <label htmlFor="symptom-tongue">Tongue biting</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symptom-incontinence"
                    className="w-5 h-5 mr-3"
                    checked={answers.symptomIncontinence}
                    onChange={(e) =>
                      handleAnswer('symptomIncontinence', e.target.checked)
                    }
                  />
                  <label htmlFor="symptom-incontinence">
                    Loss of bladder/bowel control
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symptom-breathing"
                    className="w-5 h-5 mr-3"
                    checked={answers.symptomBreathingChange}
                    onChange={(e) =>
                      handleAnswer('symptomBreathingChange', e.target.checked)
                    }
                  />
                  <label htmlFor="symptom-breathing">
                    Changes in breathing
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symptom-eyedeviation"
                    className="w-5 h-5 mr-3"
                    checked={answers.symptomEyeDeviation}
                    onChange={(e) =>
                      handleAnswer('symptomEyeDeviation', e.target.checked)
                    }
                  />
                  <label htmlFor="symptom-eyedeviation">
                    Eye deviation (eyes turning to one side)
                  </label>
                </div>
              </div>
            </QuestionScreen>
          </>
        );

      case 'symptoms-after':
        return (
          <>
            <ProgressBar />
            <QuestionScreen
              title="Post-Seizure Symptoms"
              description="How did you feel after the seizure? Select all that apply."
              nextScreen="medications"
              backScreen="symptoms-during"
            >
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="postictal-confusion"
                    className="w-5 h-5 mr-3"
                    checked={answers.postictalConfusion}
                    onChange={(e) =>
                      handleAnswer('postictalConfusion', e.target.checked)
                    }
                  />
                  <label htmlFor="postictal-confusion">Confusion</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="postictal-fatigue"
                    className="w-5 h-5 mr-3"
                    checked={answers.postictalFatigue}
                    onChange={(e) =>
                      handleAnswer('postictalFatigue', e.target.checked)
                    }
                  />
                  <label htmlFor="postictal-fatigue">
                    Fatigue or sleepiness
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="postictal-headache"
                    className="w-5 h-5 mr-3"
                    checked={answers.postictalHeadache}
                    onChange={(e) =>
                      handleAnswer('postictalHeadache', e.target.checked)
                    }
                  />
                  <label htmlFor="postictal-headache">Headache</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="postictal-muscle-pain"
                    className="w-5 h-5 mr-3"
                    checked={answers.postictalMusclePain}
                    onChange={(e) =>
                      handleAnswer('postictalMusclePain', e.target.checked)
                    }
                  />
                  <label htmlFor="postictal-muscle-pain">
                    Muscle pain or soreness
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="postictal-weakness"
                    className="w-5 h-5 mr-3"
                    checked={answers.postictalWeakness}
                    onChange={(e) =>
                      handleAnswer('postictalWeakness', e.target.checked)
                    }
                  />
                  <label htmlFor="postictal-weakness">
                    Weakness on one side of the body
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="postictal-speech"
                    className="w-5 h-5 mr-3"
                    checked={answers.postictalSpeechDifficulty}
                    onChange={(e) =>
                      handleAnswer(
                        'postictalSpeechDifficulty',
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor="postictal-speech">Difficulty speaking</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="postictal-memory"
                    className="w-5 h-5 mr-3"
                    checked={answers.postictalMemoryLoss}
                    onChange={(e) =>
                      handleAnswer('postictalMemoryLoss', e.target.checked)
                    }
                  />
                  <label htmlFor="postictal-memory">
                    Memory loss around the time of seizure
                  </label>
                </div>

                <h3 className="font-medium mt-4 mb-2">
                  How long did it take to return to normal after the seizure?
                </h3>
                <OptionButton
                  value="minutes"
                  label="Minutes"
                  question="timeToNormal"
                  selected={answers.timeToNormal === 'minutes'}
                />
                <OptionButton
                  value="hours"
                  label="Hours"
                  question="timeToNormal"
                  selected={answers.timeToNormal === 'hours'}
                />
                <OptionButton
                  value="days"
                  label="Days"
                  question="timeToNormal"
                  selected={answers.timeToNormal === 'days'}
                />
              </div>
            </QuestionScreen>
          </>
        );

      case 'medications':
        return (
          <>
            <ProgressBar />
            <QuestionScreen
              title="Medications"
              nextScreen="review"
              backScreen="symptoms-after"
            >
              <h3 className="font-medium mb-2">
                Are you taking any anti-seizure medications?
              </h3>
              <OptionButton
                value="yes"
                label="Yes"
                question="takingMedications"
                selected={answers.takingMedications === 'yes'}
              />
              <OptionButton
                value="no"
                label="No"
                question="takingMedications"
                selected={answers.takingMedications === 'no'}
              />

              {answers.takingMedications === 'yes' && (
                <>
                  <h3 className="font-medium mt-4 mb-2">
                    Did you miss any doses before this seizure?
                  </h3>
                  <OptionButton
                    value="yes"
                    label="Yes"
                    question="missedDoses"
                    selected={answers.missedDoses === 'yes'}
                  />
                  <OptionButton
                    value="no"
                    label="No"
                    question="missedDoses"
                    selected={answers.missedDoses === 'no'}
                  />
                  <OptionButton
                    value="unsure"
                    label="I'm not sure"
                    question="missedDoses"
                    selected={answers.missedDoses === 'unsure'}
                  />

                  <h3 className="font-medium mt-4 mb-2">
                    Have there been any recent medication changes?
                  </h3>
                  <OptionButton
                    value="yes"
                    label="Yes"
                    question="recentMedChanges"
                    selected={answers.recentMedChanges === 'yes'}
                  />
                  <OptionButton
                    value="no"
                    label="No"
                    question="recentMedChanges"
                    selected={answers.recentMedChanges === 'no'}
                  />
                </>
              )}
            </QuestionScreen>
          </>
        );

      case 'review':
        return (
          <>
            <ProgressBar />
            <div>
              <h2 className="text-xl font-bold mb-4">Review Your Answers</h2>
              <p className="mb-4 text-gray-600">
                Please review your assessment before submitting.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
                <h3 className="font-medium mb-2">Basic Information</h3>
                <ul className="ml-4 space-y-1 mb-4">
                  {answers.completedBy && (
                    <li>
                      <strong>Completed by:</strong>{' '}
                      {answers.completedBy === 'self'
                        ? 'Patient'
                        : answers.completedBy === 'caregiver'
                        ? 'Caregiver/family member'
                        : 'Witness'}
                    </li>
                  )}
                  {answers.diagnosedEpilepsy && (
                    <li>
                      <strong>Diagnosed with epilepsy:</strong>{' '}
                      {answers.diagnosedEpilepsy}
                    </li>
                  )}
                  {answers.seizureFrequency && (
                    <li>
                      <strong>Seizure frequency:</strong>{' '}
                      {answers.seizureFrequency}
                    </li>
                  )}
                  {answers.lastSeizure && (
                    <li>
                      <strong>Last seizure:</strong> {answers.lastSeizure}
                    </li>
                  )}
                </ul>

                <h3 className="font-medium mb-2">Seizure Details</h3>
                <ul className="ml-4 space-y-1 mb-4">
                  {answers.seizureDuration && (
                    <li>
                      <strong>Duration:</strong> {answers.seizureDuration}
                    </li>
                  )}
                  {answers.lossOfConsciousness && (
                    <li>
                      <strong>Loss of consciousness:</strong>{' '}
                      {answers.lossOfConsciousness}
                    </li>
                  )}
                  {answers.injuryDuringSeizure && (
                    <li>
                      <strong>Injuries:</strong> {answers.injuryDuringSeizure}
                    </li>
                  )}
                </ul>

                <h3 className="font-medium mb-2">Triggers</h3>
                <ul className="ml-4 space-y-1 mb-4">
                  {answers.triggerSleepDeprivation && (
                    <li>Sleep deprivation</li>
                  )}
                  {answers.triggerStress && <li>Stress or anxiety</li>}
                  {answers.triggerAlcohol && <li>Alcohol consumption</li>}
                  {answers.triggerMissedMeds && <li>Missed medications</li>}
                  {answers.triggerFlashingLights && <li>Flashing lights</li>}
                  {answers.triggerFever && <li>Fever or illness</li>}
                  {answers.triggerMenstruation && <li>Menstruation</li>}
                  {answers.triggerUnknown && <li>Unknown trigger</li>}
                </ul>

                <h3 className="font-medium mb-2">Medications</h3>
                <ul className="ml-4 space-y-1">
                  {answers.takingMedications && (
                    <li>
                      <strong>Taking anti-seizure medications:</strong>{' '}
                      {answers.takingMedications}
                    </li>
                  )}
                  {answers.takingMedications === 'yes' &&
                    answers.missedDoses && (
                      <li>
                        <strong>Missed doses:</strong> {answers.missedDoses}
                      </li>
                    )}
                  {answers.takingMedications === 'yes' &&
                    answers.recentMedChanges && (
                      <li>
                        <strong>Recent medication changes:</strong>{' '}
                        {answers.recentMedChanges}
                      </li>
                    )}
                </ul>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  className="bg-gray-200 py-2 px-4 rounded-lg flex items-center"
                  onClick={() => setCurrentScreen('medications')}
                >
                  <ChevronLeft size={18} className="mr-1" />
                  Back
                </button>
                <button
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg flex items-center"
                  onClick={() => navigateNext('thank-you')}
                >
                  Submit Assessment
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </div>
          </>
        );

      case 'thank-you':
        return (
          <div className="text-center">
            <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Assessment Complete</h2>
            <p className="mb-6">
              Thank you for completing the seizure assessment. This information
              will help your healthcare provider better understand your
              condition.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2">Next Steps</h3>
              <p className="mb-2">
                1. Share this assessment with your healthcare provider at your
                next appointment.
              </p>
              <p className="mb-2">
                2. Continue to track your seizures, including triggers and
                patterns.
              </p>
              <p>
                3. Take all medications as prescribed and follow your treatment
                plan.
              </p>
            </div>

            <button
              className={`border border-blue-500 text-blue-500 py-3 px-6 rounded-lg w-full flex justify-center items-center mb-4 ${
                copied ? 'bg-blue-50' : ''
              }`}
              onClick={copyToClipboard}
            >
              {copied ? 'Copied!' : 'Copy Assessment Results'}
              <Copy size={18} className="ml-2" />
            </button>

            <button
              className="bg-blue-500 text-white py-3 px-6 rounded-lg w-full flex justify-center items-center"
              onClick={() => navigateNext('welcome')}
            >
              Start New Assessment
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        );

      case 'emergency':
        return <EmergencyScreen />;

      default:
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
            <button
              className="bg-blue-500 text-white py-3 px-6 rounded-lg"
              onClick={() => setCurrentScreen('welcome')}
            >
              Restart Assessment
            </button>
          </div>
        );
    }
  };

  return (
    <div className="font-sans max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      {renderScreen()}
    </div>
  );
}
