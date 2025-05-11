import { useState } from 'react';
import {
  ChevronRight,
  Check,
  Copy,
  AlertTriangle,
  ArrowLeft,
  Home,
} from 'lucide-react';

export default function PeripheralNeuropathyTracker() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [alarmFeaturesDetected, setAlarmFeaturesDetected] = useState(false);

  // All screens in the assessment
  const screens = [
    'home',
    'symptom-location',
    'symptom-quality',
    'symptom-severity',
    'symptom-timing',
    'symptom-triggers',
    'symptom-relief',
    'symptom-onset',
    'alarm-check',
    'mobility-impact',
    'review',
    'results',
  ];

  // Get the index of the current screen
  const currentIndex = screens.indexOf(currentScreen);

  // Calculate progress percentage
  const calculateProgress = () => {
    if (currentScreen === 'home') return 0;
    if (currentScreen === 'results') return 100;
    return Math.round(((currentIndex - 1) / (screens.length - 3)) * 100);
  };

  // Handle navigation
  const goNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < screens.length) {
      setCurrentScreen(screens[nextIndex]);
      setProgress(calculateProgress());
    }
  };

  const goBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentScreen(screens[prevIndex]);
      setProgress(calculateProgress());
    }
  };

  const goHome = () => {
    setCurrentScreen('home');
    setProgress(0);
    setAnswers({});
    setAlarmFeaturesDetected(false);
  };

  // Handle form submission
  const handleAnswer = (question, answer) => {
    setAnswers({ ...answers, [question]: answer });

    // Check if this is an alarm feature
    if (question === 'alarmFeatures' && answer.length > 0) {
      setAlarmFeaturesDetected(true);
    }

    // Automatically move to next screen
    goNext();
  };

  // Copy results to clipboard
  const copyResults = () => {
    const resultText = Object.entries(answers)
      .map(
        ([key, value]) =>
          `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
      )
      .join('\n');

    navigator.clipboard
      .writeText(resultText)
      .then(() => alert('Results copied to clipboard'))
      .catch((err) => console.error('Failed to copy results: ', err));
  };

  // Screen components
  const HomeScreen = () => (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold text-blue-700">
          Peripheral Neuropathy Symptom Tracker
        </h1>
        <p className="mt-4 text-lg px-4">
          Track and monitor your peripheral neuropathy symptoms to share with
          your healthcare provider.
        </p>
        <div className="mt-8 px-6">
          <p className="text-left text-sm mb-2">
            This assessment will help you:
          </p>
          <ul className="list-disc text-left text-sm ml-6 space-y-2">
            <li>Document your current symptoms</li>
            <li>Track changes over time</li>
            <li>Identify potential warning signs</li>
            <li>Prepare for your medical appointments</li>
          </ul>
        </div>
      </div>
      <div className="mb-8 w-full px-8">
        <button
          onClick={goNext}
          className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold flex items-center justify-center"
        >
          Start Assessment <ChevronRight className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );

  const SymptomLocationScreen = () => {
    const [selected, setSelected] = useState(answers.location || []);

    const toggleLocation = (loc) => {
      if (selected.includes(loc)) {
        setSelected(selected.filter((item) => item !== loc));
      } else {
        setSelected([...selected, loc]);
      }
    };

    return (
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-4">
          Where do you feel your symptoms?
        </h2>
        <p className="text-sm mb-6">Select all that apply</p>

        <div className="space-y-3">
          {[
            'Feet',
            'Ankles',
            'Legs',
            'Hands',
            'Arms',
            'Face',
            'Trunk/Torso',
          ].map((location) => (
            <button
              key={location}
              onClick={() => toggleLocation(location)}
              className={`w-full py-3 px-4 rounded-lg border-2 flex justify-between items-center ${
                selected.includes(location)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <span>{location}</span>
              {selected.includes(location) && (
                <Check size={20} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <button
            onClick={() => handleAnswer('location', selected)}
            disabled={selected.length === 0}
            className={`px-6 py-2 rounded-lg ${
              selected.length === 0
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const SymptomQualityScreen = () => {
    const [selected, setSelected] = useState(answers.quality || []);

    const toggleQuality = (qual) => {
      if (selected.includes(qual)) {
        setSelected(selected.filter((item) => item !== qual));
      } else {
        setSelected([...selected, qual]);
      }
    };

    return (
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-4">
          How would you describe your symptoms?
        </h2>
        <p className="text-sm mb-6">Select all that apply</p>

        <div className="space-y-3">
          {[
            'Burning',
            'Electric shock-like',
            'Pins and needles',
            'Numbness',
            'Stabbing/Sharp',
            'Tightness',
            'Coldness',
            'Crawling sensation',
          ].map((quality) => (
            <button
              key={quality}
              onClick={() => toggleQuality(quality)}
              className={`w-full py-3 px-4 rounded-lg border-2 flex justify-between items-center ${
                selected.includes(quality)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <span>{quality}</span>
              {selected.includes(quality) && (
                <Check size={20} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <button
            onClick={() => handleAnswer('quality', selected)}
            disabled={selected.length === 0}
            className={`px-6 py-2 rounded-lg ${
              selected.length === 0
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const SymptomSeverityScreen = () => {
    const [painLevel, setPainLevel] = useState(answers.painLevel || null);

    return (
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-4">How severe is your pain?</h2>
        <p className="text-sm mb-6">
          Rate from 0 (no pain) to 10 (worst pain imaginable)
        </p>

        <div className="space-y-8">
          <div className="flex justify-between">
            <span>No Pain</span>
            <span>Worst Pain</span>
          </div>
          <div className="flex justify-between">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <button
                key={level}
                onClick={() => setPainLevel(level)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  painLevel === level
                    ? 'bg-blue-600 text-white'
                    : level <= 3
                    ? 'bg-green-100 border border-green-600'
                    : level <= 6
                    ? 'bg-yellow-100 border border-yellow-600'
                    : 'bg-red-100 border border-red-600'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">
              How does this affect your daily activities?
            </h3>
            <div className="space-y-3">
              {[
                'No interference with activities',
                'Mild interference with activities',
                'Moderate interference with activities',
                'Severe interference with activities',
                'Cannot perform most activities',
              ].map((impact, index) => (
                <button
                  key={impact}
                  onClick={() =>
                    setAnswers({ ...answers, functionalImpact: impact })
                  }
                  className={`w-full py-3 px-4 rounded-lg border-2 flex justify-between items-center ${
                    answers.functionalImpact === impact
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  <span>{impact}</span>
                  {answers.functionalImpact === impact && (
                    <Check size={20} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <button
            onClick={() => {
              setAnswers({ ...answers, painLevel });
              goNext();
            }}
            disabled={painLevel === null || !answers.functionalImpact}
            className={`px-6 py-2 rounded-lg ${
              painLevel === null || !answers.functionalImpact
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const SymptomTimingScreen = () => {
    const [selected, setSelected] = useState(answers.timing || null);

    return (
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-4">
          When do you experience these symptoms?
        </h2>

        <div className="space-y-3">
          {[
            'Constant (all the time)',
            'Intermittent (comes and goes)',
            'Only during certain activities',
            'Worse at night',
            'Worse in the morning',
            'Worse in the evening',
          ].map((timing) => (
            <button
              key={timing}
              onClick={() => setSelected(timing)}
              className={`w-full py-3 px-4 rounded-lg border-2 flex justify-between items-center ${
                selected === timing
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <span>{timing}</span>
              {selected === timing && (
                <Check size={20} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <button
            onClick={() => handleAnswer('timing', selected)}
            disabled={!selected}
            className={`px-6 py-2 rounded-lg ${
              !selected ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const SymptomTriggersScreen = () => {
    const [selected, setSelected] = useState(answers.triggers || []);

    const toggleTrigger = (trigger) => {
      if (selected.includes(trigger)) {
        setSelected(selected.filter((item) => item !== trigger));
      } else {
        setSelected([...selected, trigger]);
      }
    };

    return (
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-4">
          What makes your symptoms worse?
        </h2>
        <p className="text-sm mb-6">Select all that apply</p>

        <div className="space-y-3">
          {[
            'Walking',
            'Standing',
            'Physical activity',
            'Rest',
            'Cold environment',
            'Hot environment',
            'Stress',
            'Nothing specific',
          ].map((trigger) => (
            <button
              key={trigger}
              onClick={() => toggleTrigger(trigger)}
              className={`w-full py-3 px-4 rounded-lg border-2 flex justify-between items-center ${
                selected.includes(trigger)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <span>{trigger}</span>
              {selected.includes(trigger) && (
                <Check size={20} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <button
            onClick={() => handleAnswer('triggers', selected)}
            disabled={selected.length === 0}
            className={`px-6 py-2 rounded-lg ${
              selected.length === 0
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const SymptomReliefScreen = () => {
    const [selected, setSelected] = useState(answers.relief || []);

    const toggleRelief = (relief) => {
      if (selected.includes(relief)) {
        setSelected(selected.filter((item) => item !== relief));
      } else {
        setSelected([...selected, relief]);
      }
    };

    return (
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-4">
          What helps relieve your symptoms?
        </h2>
        <p className="text-sm mb-6">Select all that apply</p>

        <div className="space-y-3">
          {[
            'Rest',
            'Moving/exercising',
            'Medication',
            'Elevation of limbs',
            'Heat application',
            'Cold application',
            'Massage',
            'Nothing seems to help',
          ].map((relief) => (
            <button
              key={relief}
              onClick={() => toggleRelief(relief)}
              className={`w-full py-3 px-4 rounded-lg border-2 flex justify-between items-center ${
                selected.includes(relief)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <span>{relief}</span>
              {selected.includes(relief) && (
                <Check size={20} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <button
            onClick={() => handleAnswer('relief', selected)}
            disabled={selected.length === 0}
            className={`px-6 py-2 rounded-lg ${
              selected.length === 0
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const SymptomOnsetScreen = () => {
    const [duration, setDuration] = useState(answers.duration || '');
    const [timeUnit, setTimeUnit] = useState(answers.timeUnit || 'months');
    const [onset, setOnset] = useState(answers.onset || '');

    return (
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-4">
          When did these symptoms begin?
        </h2>

        <div className="space-y-6">
          <div>
            <p className="text-sm mb-3">
              How long have you had these symptoms?
            </p>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-3 py-2 w-20"
                placeholder="0"
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>

          <div>
            <p className="text-sm mb-3">How did the symptoms begin?</p>
            <div className="space-y-3">
              {[
                'Suddenly (over hours or days)',
                'Gradually (over weeks or months)',
                'Very slowly (over months or years)',
              ].map((onsetType) => (
                <button
                  key={onsetType}
                  onClick={() => setOnset(onsetType)}
                  className={`w-full py-3 px-4 rounded-lg border-2 flex justify-between items-center ${
                    onset === onsetType
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  <span>{onsetType}</span>
                  {onset === onsetType && (
                    <Check size={20} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <button
            onClick={() => {
              setAnswers({ ...answers, duration, timeUnit, onset });
              goNext();
            }}
            disabled={!duration || !onset}
            className={`px-6 py-2 rounded-lg ${
              !duration || !onset
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const AlarmCheckScreen = () => {
    const [selected, setSelected] = useState(answers.alarmFeatures || []);

    const toggleAlarm = (alarm) => {
      if (selected.includes(alarm)) {
        setSelected(selected.filter((item) => item !== alarm));
      } else {
        setSelected([...selected, alarm]);
      }
    };

    return (
      <div className="px-6">
        <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="text-red-600 mr-2" size={24} />
            <h2 className="text-xl font-semibold text-red-800">
              Important Warning Signs
            </h2>
          </div>
          <p className="text-sm mt-2">
            Please check if you've experienced any of these urgent symptoms.
          </p>
        </div>

        <div className="space-y-3">
          {[
            'Rapidly worsening weakness (days to weeks)',
            'Recent severe weight loss',
            'Difficulty breathing',
            'Trouble with bladder or bowel control',
            'Balance problems with frequent falls',
            'Weakness in face or trouble speaking',
            'Fever along with nerve symptoms',
            'None of the above',
          ].map((alarm) => (
            <button
              key={alarm}
              onClick={() => {
                if (alarm === 'None of the above') {
                  setSelected(['None of the above']);
                } else {
                  const newSelected = selected.filter(
                    (item) => item !== 'None of the above'
                  );
                  toggleAlarm(alarm);
                  setSelected(newSelected);
                }
              }}
              className={`w-full py-3 px-4 rounded-lg border-2 flex justify-between items-center ${
                selected.includes(alarm)
                  ? alarm === 'None of the above'
                    ? 'border-green-600 bg-green-50'
                    : 'border-red-600 bg-red-50'
                  : 'border-gray-300'
              }`}
            >
              <span>{alarm}</span>
              {selected.includes(alarm) && (
                <Check
                  size={20}
                  className={
                    alarm === 'None of the above'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <button
            onClick={() => handleAnswer('alarmFeatures', selected)}
            disabled={selected.length === 0}
            className={`px-6 py-2 rounded-lg ${
              selected.length === 0
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const MobilityImpactScreen = () => {
    const [selected, setSelected] = useState(answers.mobilityImpact || []);

    const toggleImpact = (impact) => {
      if (selected.includes(impact)) {
        setSelected(selected.filter((item) => item !== impact));
      } else {
        setSelected([...selected, impact]);
      }
    };

    return (
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-4">
          How do your symptoms affect your mobility?
        </h2>
        <p className="text-sm mb-6">Select all that apply</p>

        <div className="space-y-3">
          {[
            'Difficulty walking long distances',
            'Unsteady walking/poor balance',
            'Need to use a cane or walker',
            'Difficulty climbing stairs',
            'Difficulty standing from sitting',
            'Falls or near-falls',
            'No mobility problems',
          ].map((impact) => (
            <button
              key={impact}
              onClick={() => {
                if (impact === 'No mobility problems') {
                  setSelected(['No mobility problems']);
                } else {
                  const newSelected = selected.filter(
                    (item) => item !== 'No mobility problems'
                  );
                  toggleImpact(impact);
                  setSelected(newSelected);
                }
              }}
              className={`w-full py-3 px-4 rounded-lg border-2 flex justify-between items-center ${
                selected.includes(impact)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <span>{impact}</span>
              {selected.includes(impact) && (
                <Check size={20} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <button
            onClick={() => handleAnswer('mobilityImpact', selected)}
            disabled={selected.length === 0}
            className={`px-6 py-2 rounded-lg ${
              selected.length === 0
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const ReviewScreen = () => {
    return (
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-4">Review Your Responses</h2>
        <p className="text-sm mb-6">Please check that everything is correct</p>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium">Symptom Location</h3>
            <p className="text-sm mt-1">
              {answers.location?.join(', ') || 'Not specified'}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium">Symptom Quality</h3>
            <p className="text-sm mt-1">
              {answers.quality?.join(', ') || 'Not specified'}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium">Pain Level</h3>
            <p className="text-sm mt-1">{answers.painLevel} out of 10</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium">Functional Impact</h3>
            <p className="text-sm mt-1">{answers.functionalImpact}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium">Timing</h3>
            <p className="text-sm mt-1">{answers.timing}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium">Triggers</h3>
            <p className="text-sm mt-1">
              {answers.triggers?.join(', ') || 'Not specified'}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium">Relief Factors</h3>
            <p className="text-sm mt-1">
              {answers.relief?.join(', ') || 'Not specified'}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium">Symptom Onset</h3>
            <p className="text-sm mt-1">
              {answers.duration} {answers.timeUnit} ago, {answers.onset}
            </p>
          </div>

          {answers.alarmFeatures && answers.alarmFeatures.length > 0 && (
            <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-600">
              <h3 className="font-medium flex items-center">
                <AlertTriangle className="text-red-600 mr-2" size={16} />
                Warning Signs
              </h3>
              <p className="text-sm mt-1">{answers.alarmFeatures.join(', ')}</p>
            </div>
          )}

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium">Mobility Impact</h3>
            <p className="text-sm mt-1">
              {answers.mobilityImpact?.join(', ') || 'Not specified'}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <button
            onClick={goNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    );
  };

  const ResultsScreen = () => {
    const hasWarningFlags =
      answers.alarmFeatures &&
      answers.alarmFeatures.length > 0 &&
      !answers.alarmFeatures.includes('None of the above');

    return (
      <div className="px-6">
        <h2 className="text-xl font-semibold mb-4">Assessment Results</h2>

        {hasWarningFlags ? (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="text-red-600 mr-2" size={24} />
              <h3 className="font-semibold text-red-800">
                Important Warning Signs Detected
              </h3>
            </div>
            <p className="mt-2 text-sm">
              You've reported symptoms that require prompt medical attention.
              Please contact your healthcare provider as soon as possible or go
              to the emergency room if symptoms are severe.
            </p>
            <ul className="mt-2 text-sm list-disc pl-5">
              {answers.alarmFeatures.map((alarm, index) => (
                <li key={index} className="text-red-800">
                  {alarm}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Check className="text-green-600 mr-2" size={24} />
              <h3 className="font-semibold text-green-800">
                Assessment Complete
              </h3>
            </div>
            <p className="mt-2 text-sm">
              Your symptom information has been recorded. Share this with your
              healthcare provider at your next appointment.
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800">Next Steps</h3>
          <ul className="mt-2 text-sm list-disc pl-5 space-y-2">
            <li>Share this assessment with your healthcare provider</li>
            <li>Keep track of any changes in your symptoms</li>
            <li>
              Complete this assessment regularly to monitor changes over time
            </li>
            {hasWarningFlags && (
              <li className="font-semibold">
                Contact your healthcare provider promptly about your warning
                signs
              </li>
            )}
          </ul>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Your Assessment Summary</h3>
          <p className="text-sm text-gray-600 mb-3">
            Date: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-2 text-sm">
            <p>
              <strong>Symptoms:</strong> {answers.quality?.join(', ')}
            </p>
            <p>
              <strong>Locations:</strong> {answers.location?.join(', ')}
            </p>
            <p>
              <strong>Pain Level:</strong> {answers.painLevel}/10
            </p>
            <p>
              <strong>Impact:</strong> {answers.functionalImpact}
            </p>
            <p>
              <strong>Duration:</strong> {answers.duration} {answers.timeUnit}
            </p>
            <p>
              <strong>Onset:</strong> {answers.onset}
            </p>
          </div>

          <button
            onClick={copyResults}
            className="mt-4 w-full bg-gray-200 py-2 rounded-lg flex items-center justify-center"
          >
            <Copy size={16} className="mr-2" />
            Copy Results
          </button>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goHome}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center"
          >
            <Home size={18} className="mr-1" /> Home
          </button>
          <button
            onClick={() => {
              /* Would initiate save/export functionality */
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Save Results
          </button>
        </div>
      </div>
    );
  };

  // Progress bar component
  const ProgressBar = () => {
    if (currentScreen === 'home' || currentScreen === 'results') return null;

    return (
      <div className="w-full px-6 mb-4">
        <div className="relative pt-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-blue-600">
                {progress}% Complete
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-blue-700 text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-lg font-bold">Neuropathy Tracker</h1>
        {currentScreen !== 'home' && (
          <button onClick={goHome} className="text-white">
            <Home size={20} />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <ProgressBar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto py-4">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'symptom-location' && <SymptomLocationScreen />}
        {currentScreen === 'symptom-quality' && <SymptomQualityScreen />}
        {currentScreen === 'symptom-severity' && <SymptomSeverityScreen />}
        {currentScreen === 'symptom-timing' && <SymptomTimingScreen />}
        {currentScreen === 'symptom-triggers' && <SymptomTriggersScreen />}
        {currentScreen === 'symptom-relief' && <SymptomReliefScreen />}
        {currentScreen === 'symptom-onset' && <SymptomOnsetScreen />}
        {currentScreen === 'alarm-check' && <AlarmCheckScreen />}
        {currentScreen === 'mobility-impact' && <MobilityImpactScreen />}
        {currentScreen === 'review' && <ReviewScreen />}
        {currentScreen === 'results' && <ResultsScreen />}
      </div>
    </div>
  );
}
