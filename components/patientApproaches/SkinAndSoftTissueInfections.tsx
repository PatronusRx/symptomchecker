import { useState } from 'react';

export default function SSTITrackerApp() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [progress, setProgress] = useState(0);
  const [responses, setResponses] = useState({});
  const [alarmFeatures, setAlarmFeatures] = useState([]);

  const screens = {
    welcome: {
      title: 'Skin & Soft Tissue Infection Tracker',
      content: () => (
        <div className="flex flex-col items-center p-6 space-y-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center">
            Skin & Soft Tissue Infection Tracker
          </h1>
          <p className="text-center text-gray-600">
            Track your symptoms and share important information with your
            healthcare provider.
          </p>
          <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300 w-full">
            <h3 className="font-bold text-yellow-700">Emergency Warning</h3>
            <p className="text-sm text-yellow-800">
              If you have high fever, severe pain, rapidly spreading redness, or
              feel very unwell, seek immediate medical attention.
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentScreen('onset');
              setProgress(5);
            }}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
          >
            Start Assessment
          </button>
        </div>
      ),
    },

    onset: {
      title: 'Symptom Onset',
      content: () => (
        <div className="flex flex-col p-6 space-y-6">
          <h2 className="text-xl font-bold">When did your symptoms begin?</h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="sudden"
                name="onset"
                className="w-6 h-6"
                onChange={() => updateResponses('onset', 'Sudden onset')}
              />
              <label htmlFor="sudden" className="text-lg">
                Sudden onset
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="gradual"
                name="onset"
                className="w-6 h-6"
                onChange={() => updateResponses('onset', 'Gradual onset')}
              />
              <label htmlFor="gradual" className="text-lg">
                Gradual onset
              </label>
            </div>

            <div className="mt-6">
              <label htmlFor="days" className="block text-lg font-medium mb-2">
                How many days ago did it start?
              </label>
              <input
                type="number"
                id="days"
                className="w-full p-4 text-lg border rounded-lg"
                placeholder="Enter number of days"
                onChange={(e) =>
                  updateResponses('duration', e.target.value + ' days')
                }
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setCurrentScreen('appearance');
                setProgress(10);
              }}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    appearance: {
      title: 'Appearance',
      content: () => (
        <div className="flex flex-col p-6 space-y-6">
          <h2 className="text-xl font-bold">
            How does the affected area look?
          </h2>
          <p className="text-gray-600">Select all that apply</p>

          <div className="space-y-4">
            {[
              { id: 'redness', label: 'Redness' },
              { id: 'swelling', label: 'Swelling' },
              { id: 'warmth', label: 'Warmth to touch' },
              { id: 'drainage', label: 'Drainage or pus' },
              { id: 'blisters', label: 'Blisters' },
              { id: 'streaking', label: 'Red streaks extending from area' },
            ].map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={item.id}
                  className="w-6 h-6"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updateResponses('appearance', {
                      ...responses.appearance,
                      [item.label]: checked,
                    });

                    // Add alarm features
                    if (checked && item.id === 'streaking') {
                      setAlarmFeatures([
                        ...alarmFeatures,
                        'Lymphangitic streaking',
                      ]);
                    }
                  }}
                />
                <label htmlFor={item.id} className="text-lg">
                  {item.label}
                </label>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setCurrentScreen('location');
                setProgress(15);
              }}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    location: {
      title: 'Location',
      content: () => (
        <div className="flex flex-col p-6 space-y-6">
          <h2 className="text-xl font-bold">Where is the infection located?</h2>

          <div className="space-y-4">
            {[
              { id: 'face', label: 'Face or neck', isAlarm: true },
              { id: 'arm', label: 'Arm or hand', isAlarm: false },
              { id: 'leg', label: 'Leg or foot', isAlarm: false },
              { id: 'trunk', label: 'Chest or back', isAlarm: false },
              { id: 'abdomen', label: 'Abdomen', isAlarm: false },
              { id: 'groin', label: 'Groin or genitals', isAlarm: true },
            ].map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={item.id}
                  name="location"
                  className="w-6 h-6"
                  onChange={() => {
                    updateResponses('location', item.label);

                    // Add alarm features if needed
                    if (item.isAlarm) {
                      setAlarmFeatures([
                        ...alarmFeatures,
                        `Concerning location: ${item.label}`,
                      ]);
                    }
                  }}
                />
                <label htmlFor={item.id} className="text-lg">
                  {item.label}
                </label>
              </div>
            ))}

            <div className="mt-6">
              <label
                htmlFor="specificLocation"
                className="block text-lg font-medium mb-2"
              >
                Please describe the specific location:
              </label>
              <input
                type="text"
                id="specificLocation"
                className="w-full p-4 text-lg border rounded-lg"
                placeholder="E.g., right lower leg, left forearm"
                onChange={(e) =>
                  updateResponses('specificLocation', e.target.value)
                }
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setCurrentScreen('alarmFeatures');
                setProgress(25);
              }}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    alarmFeatures: {
      title: 'Important Symptoms',
      content: () => (
        <div className="flex flex-col p-6 space-y-6">
          <h2 className="text-xl font-bold">
            Do you have any of these symptoms?
          </h2>
          <p className="text-gray-600 mb-2">Select all that apply</p>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
            <p className="text-sm text-red-800">
              These symptoms may indicate a serious infection requiring
              immediate attention.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { id: 'fever', label: 'High fever (>101°F/38.3°C)' },
              { id: 'chills', label: 'Severe chills or shaking' },
              { id: 'lightHeaded', label: 'Feeling light-headed or dizzy' },
              { id: 'rapid', label: 'Rapid heartbeat' },
              { id: 'confusion', label: 'Confusion or altered mental state' },
              {
                id: 'severePain',
                label: 'Severe pain out of proportion to appearance',
              },
              { id: 'darkSkin', label: 'Dark or purple discoloration of skin' },
              { id: 'crepitus', label: 'Crackling sensation under the skin' },
            ].map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={item.id}
                  className="w-6 h-6"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updateResponses('alarmFeatures', {
                      ...responses.alarmFeatures,
                      [item.label]: checked,
                    });

                    if (checked) {
                      setAlarmFeatures([...alarmFeatures, item.label]);
                    } else {
                      setAlarmFeatures(
                        alarmFeatures.filter((f) => f !== item.label)
                      );
                    }
                  }}
                />
                <label htmlFor={item.id} className="text-lg">
                  {item.label}
                </label>
              </div>
            ))}
          </div>

          {alarmFeatures.length > 1 && (
            <div className="bg-red-100 p-4 rounded-lg border border-red-300">
              <h3 className="font-bold text-red-700">Warning</h3>
              <p className="text-sm text-red-800">
                Based on your responses, you should seek immediate medical
                attention. These symptoms could indicate a serious infection.
              </p>
            </div>
          )}

          <div className="pt-6">
            <button
              onClick={() => {
                setCurrentScreen('severity');
                setProgress(35);
              }}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    severity: {
      title: 'Pain & Function',
      content: () => (
        <div className="flex flex-col p-6 space-y-6">
          <h2 className="text-xl font-bold">How severe is your pain?</h2>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="painScore"
                className="block text-lg font-medium mb-2"
              >
                Pain level (0 = no pain, 10 = worst possible pain):
              </label>
              <input
                type="range"
                id="painScore"
                min="0"
                max="10"
                step="1"
                defaultValue="5"
                className="w-full h-8"
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  updateResponses('painScore', value);

                  if (value >= 8) {
                    if (!alarmFeatures.includes('Severe pain (8-10/10)')) {
                      setAlarmFeatures([
                        ...alarmFeatures,
                        'Severe pain (8-10/10)',
                      ]);
                    }
                  } else {
                    setAlarmFeatures(
                      alarmFeatures.filter((f) => f !== 'Severe pain (8-10/10)')
                    );
                  }
                }}
              />
              <div className="flex justify-between text-xs mt-1">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>

            <div>
              <p className="text-lg font-medium mb-2">
                How is this affecting your daily activities?
              </p>
              <div className="space-y-3">
                {[
                  { id: 'none', label: 'Not affecting my activities' },
                  { id: 'mild', label: 'Mildly limiting some activities' },
                  {
                    id: 'moderate',
                    label: 'Moderately limiting many activities',
                  },
                  { id: 'severe', label: 'Severely limiting most activities' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={item.id}
                      name="functional"
                      className="w-6 h-6"
                      onChange={() =>
                        updateResponses('functionalLimitation', item.label)
                      }
                    />
                    <label htmlFor={item.id} className="text-lg">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setCurrentScreen('history');
                setProgress(45);
              }}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    history: {
      title: 'Medical History',
      content: () => (
        <div className="flex flex-col p-6 space-y-6">
          <h2 className="text-xl font-bold">
            Do you have any of these conditions?
          </h2>
          <p className="text-gray-600">Select all that apply</p>

          <div className="space-y-4">
            {[
              { id: 'diabetes', label: 'Diabetes' },
              { id: 'immunocompromised', label: 'Weakened immune system' },
              { id: 'vascular', label: 'Vascular disease' },
              { id: 'previousInfections', label: 'Previous skin infections' },
              { id: 'mrsa', label: 'Previous MRSA infection' },
              { id: 'none', label: 'None of the above' },
            ].map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={item.id}
                  className="w-6 h-6"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updateResponses('medicalHistory', {
                      ...responses.medicalHistory,
                      [item.label]: checked,
                    });

                    // Add risk factors
                    if (
                      checked &&
                      (item.id === 'diabetes' ||
                        item.id === 'immunocompromised')
                    ) {
                      setAlarmFeatures([
                        ...alarmFeatures,
                        `Risk factor: ${item.label}`,
                      ]);
                    }
                  }}
                />
                <label htmlFor={item.id} className="text-lg">
                  {item.label}
                </label>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setCurrentScreen('treatment');
                setProgress(55);
              }}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    treatment: {
      title: 'Current Treatment',
      content: () => (
        <div className="flex flex-col p-6 space-y-6">
          <h2 className="text-xl font-bold">
            Are you currently taking any antibiotics?
          </h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="yesAntibiotics"
                name="antibiotics"
                className="w-6 h-6"
                onChange={() => updateResponses('takingAntibiotics', true)}
              />
              <label htmlFor="yesAntibiotics" className="text-lg">
                Yes
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="noAntibiotics"
                name="antibiotics"
                className="w-6 h-6"
                onChange={() => updateResponses('takingAntibiotics', false)}
              />
              <label htmlFor="noAntibiotics" className="text-lg">
                No
              </label>
            </div>

            {responses.takingAntibiotics && (
              <div className="mt-4 p-4 border rounded-lg space-y-4">
                <div>
                  <label
                    htmlFor="antibiotic"
                    className="block text-lg font-medium mb-2"
                  >
                    Antibiotic name:
                  </label>
                  <input
                    type="text"
                    id="antibiotic"
                    className="w-full p-4 text-lg border rounded-lg"
                    placeholder="E.g., Cephalexin, Doxycycline"
                    onChange={(e) =>
                      updateResponses('antibioticName', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="dose"
                    className="block text-lg font-medium mb-2"
                  >
                    Dose:
                  </label>
                  <input
                    type="text"
                    id="dose"
                    className="w-full p-4 text-lg border rounded-lg"
                    placeholder="E.g., 500mg twice daily"
                    onChange={(e) =>
                      updateResponses('antibioticDose', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-lg font-medium mb-2"
                  >
                    When did you start?
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="w-full p-4 text-lg border rounded-lg"
                    onChange={(e) =>
                      updateResponses('antibioticStartDate', e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">
              Have you tried any other treatments?
            </h2>
            <div className="space-y-4">
              {[
                { id: 'warmCompress', label: 'Warm compress' },
                { id: 'coldCompress', label: 'Cold compress' },
                {
                  id: 'topicalAntibiotics',
                  label: 'Topical antibiotic ointment',
                },
                { id: 'drainedPus', label: 'Drained pus at home' },
                { id: 'elevatedArea', label: 'Elevated the area' },
                { id: 'otc', label: 'OTC pain relievers' },
                { id: 'none', label: 'None of the above' },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={item.id}
                    className="w-6 h-6"
                    onChange={(e) => {
                      const checked = e.target.checked;
                      updateResponses('otherTreatments', {
                        ...responses.otherTreatments,
                        [item.label]: checked,
                      });
                    }}
                  />
                  <label htmlFor={item.id} className="text-lg">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setCurrentScreen('progression');
                setProgress(65);
              }}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    progression: {
      title: 'Symptom Progression',
      content: () => (
        <div className="flex flex-col p-6 space-y-6">
          <h2 className="text-xl font-bold">How are your symptoms changing?</h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="improving"
                name="progression"
                className="w-6 h-6"
                onChange={() => updateResponses('progression', 'Improving')}
              />
              <label htmlFor="improving" className="text-lg">
                Improving
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="stable"
                name="progression"
                className="w-6 h-6"
                onChange={() =>
                  updateResponses('progression', 'Stable (not better or worse)')
                }
              />
              <label htmlFor="stable" className="text-lg">
                Stable (not better or worse)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="slowlyWorse"
                name="progression"
                className="w-6 h-6"
                onChange={() =>
                  updateResponses('progression', 'Slowly getting worse')
                }
              />
              <label htmlFor="slowlyWorse" className="text-lg">
                Slowly getting worse
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="rapidlyWorse"
                name="progression"
                className="w-6 h-6"
                onChange={() => {
                  updateResponses('progression', 'Rapidly getting worse');
                  if (!alarmFeatures.includes('Rapidly worsening symptoms')) {
                    setAlarmFeatures([
                      ...alarmFeatures,
                      'Rapidly worsening symptoms',
                    ]);
                  }
                }}
              />
              <label htmlFor="rapidlyWorse" className="text-lg">
                Rapidly getting worse
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="sizeChange"
              className="block text-lg font-medium mb-2"
            >
              Has the size of the affected area changed?
            </label>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="sizeIncreased"
                  name="sizeChange"
                  className="w-6 h-6"
                  onChange={() =>
                    updateResponses('sizeChange', 'Increased in size')
                  }
                />
                <label htmlFor="sizeIncreased" className="text-lg">
                  Increased in size
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="sizeDecreased"
                  name="sizeChange"
                  className="w-6 h-6"
                  onChange={() =>
                    updateResponses('sizeChange', 'Decreased in size')
                  }
                />
                <label htmlFor="sizeDecreased" className="text-lg">
                  Decreased in size
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="sizeUnchanged"
                  name="sizeChange"
                  className="w-6 h-6"
                  onChange={() => updateResponses('sizeChange', 'Unchanged')}
                />
                <label htmlFor="sizeUnchanged" className="text-lg">
                  Unchanged
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setCurrentScreen('photoUpload');
                setProgress(75);
              }}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    photoUpload: {
      title: 'Photo Upload',
      content: () => (
        <div className="flex flex-col p-6 space-y-6">
          <h2 className="text-xl font-bold">
            Add a photo of the affected area
          </h2>
          <p className="text-gray-600">
            A photo helps your healthcare provider assess your condition
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <p className="text-center text-gray-500">
              Tap to take a photo or upload from your gallery
            </p>
            <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded">
              Upload Photo
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-700">Privacy Note</h3>
            <p className="text-sm text-blue-800">
              Your photo will only be shared with your healthcare provider and
              stored securely.
            </p>
          </div>

          <div className="pt-6 flex space-x-4">
            <button
              onClick={() => {
                setCurrentScreen('review');
                setProgress(90);
              }}
              className="w-1/2 bg-gray-200 text-gray-700 py-4 px-6 rounded-lg text-lg font-medium"
            >
              Skip
            </button>
            <button
              onClick={() => {
                setCurrentScreen('review');
                setProgress(90);
              }}
              className="w-1/2 bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    review: {
      title: 'Review Your Information',
      content: () => (
        <div className="flex flex-col p-6 space-y-6">
          <h2 className="text-xl font-bold">Review Your Information</h2>
          <p className="text-gray-600">
            Please check that everything is correct before submitting
          </p>

          <div className="border rounded-lg divide-y">
            {Object.entries(responses).map(([key, value]) => {
              // Skip complex objects for simplicity in this demo
              if (
                typeof value === 'object' &&
                value !== null &&
                !Array.isArray(value)
              ) {
                return null;
              }

              // Format the key for display
              const formattedKey = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());

              return (
                <div key={key} className="p-4 flex flex-col">
                  <span className="font-medium text-gray-600">
                    {formattedKey}
                  </span>
                  <span className="text-lg">{String(value)}</span>
                </div>
              );
            })}
          </div>

          {alarmFeatures.length > 0 && (
            <div className="bg-red-100 p-4 rounded-lg border border-red-300">
              <h3 className="font-bold text-red-700">Warning Signs Detected</h3>
              <ul className="list-disc pl-5 text-sm text-red-800 mt-2">
                {alarmFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <p className="text-sm text-red-800 mt-2">
                These symptoms may indicate a serious infection. Please seek
                medical attention promptly.
              </p>
            </div>
          )}

          <div className="pt-6">
            <button
              onClick={() => {
                setCurrentScreen('submitted');
                setProgress(100);
              }}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
            >
              Submit
            </button>
          </div>
        </div>
      ),
    },

    submitted: {
      title: 'Submission Complete',
      content: () => (
        <div className="flex flex-col items-center p-6 space-y-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center">
            Information Submitted
          </h1>
          <p className="text-center text-gray-600">
            Your information has been successfully submitted to your healthcare
            provider.
          </p>

          {alarmFeatures.length > 0 ? (
            <div className="bg-red-100 p-4 rounded-lg border border-red-300 w-full">
              <h3 className="font-bold text-red-700">Warning Signs Detected</h3>
              <p className="text-sm text-red-800">
                Based on your responses, you should seek medical attention
                promptly. Please contact your healthcare provider or visit an
                emergency department.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 w-full">
              <h3 className="font-bold text-blue-700">Next Steps</h3>
              <p className="text-sm text-blue-800">
                Your healthcare provider will review your information and
                contact you if needed. Continue monitoring your symptoms and
                seek immediate care if they worsen.
              </p>
            </div>
          )}

          <button className="w-full bg-gray-200 text-gray-700 py-4 px-6 rounded-lg text-lg font-medium">
            Copy Report
          </button>

          <button
            onClick={() => {
              setCurrentScreen('welcome');
              setProgress(0);
              setResponses({});
              setAlarmFeatures([]);
            }}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium"
          >
            Start New Assessment
          </button>
        </div>
      ),
    },
  };

  // Helper function to update responses
  const updateResponses = (key, value) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* App header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{screens[currentScreen].title}</h1>
          {currentScreen !== 'welcome' && currentScreen !== 'submitted' && (
            <button
              onClick={() => {
                const screenOrder = Object.keys(screens);
                const currentIndex = screenOrder.indexOf(currentScreen);
                if (currentIndex > 0) {
                  setCurrentScreen(screenOrder[currentIndex - 1]);
                  setProgress(Math.max(0, progress - 10));
                }
              }}
              className="text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Progress bar */}
      {currentScreen !== 'welcome' && (
        <div className="w-full bg-gray-200 h-2">
          <div
            className="bg-green-500 h-2 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Screen content */}
      <div className="flex-grow overflow-auto">
        {screens[currentScreen].content()}
      </div>
    </div>
  );
}
