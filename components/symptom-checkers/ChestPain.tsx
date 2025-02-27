// components/symptom-checkers/ChestPain.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { SymptomAttribute, SymptomDetail } from '@/types';

// Define the template directly in the component
interface ChestPainTemplate {
  intro: string;
  symptoms: Record<string, SymptomAttribute>;
  assessment: string;
  plan: string;
}

// Chest pain template data
const chestPainTemplate: ChestPainTemplate = {
  intro:
    'Patient presents with chest pain of {duration} duration. Approximately 20-30% of patients diagnosed with ACS report atypical symptoms without chest pain.',
  symptoms: {
    'retrosternal pain': {
      positive: 'Patient reports retrosternal pain in the left anterior chest.',
      negative: 'Patient denies retrosternal pain in the left anterior chest.',
      details: {
        character: {
          options: ['crushing', 'tightness', 'squeezing', 'pressure'],
          text: 'The pain is described as {value}.',
        },
        location: {
          options: ['substernal', 'left-sided chest', 'diffuse'],
          text: 'Pain is primarily {value}.',
        },
        radiation: {
          options: [
            'left shoulder',
            'right shoulder',
            'both shoulders',
            'left arm',
            'right arm',
            'both arms',
            'jaw',
            'left hand',
            'back',
          ],
          text: 'Pain radiates to the {value}.',
        },
        // Add remaining details from your original code
      },
    },
    'exertional component': {
      positive: 'Pain is brought on by exertion.',
      negative: 'Pain is not related to exertion.',
      details: {
        'relieved with rest': {
          options: ['yes', 'no'],
          text: 'Pain is {value} relieved with rest.',
        },
      },
    },
    'associated symptoms': {
      positive: 'Patient has associated symptoms with the chest pain.',
      negative: 'Patient denies any associated symptoms with chest pain.',
      details: {
        symptoms: {
          options: [
            'dyspnea at rest',
            'dyspnea with exertion',
            'paroxysmal nocturnal dyspnea',
            'orthopnea',
            'diaphoresis',
            'nausea',
            'vomiting',
            'light-headedness',
            'generalized weakness',
            // Add remaining options from your original code
          ],
          multiSelect: true,
          text: 'Associated symptoms include {value}.',
        },
      },
    },
    // Add remaining symptoms from your original code
  },
  assessment:
    'Chest pain, {duration} duration, with features {consistentWith/inconsistentWith} for cardiac etiology.',
  plan: 'Recommend {recommendations} for further evaluation and management.',
};

const ChestPain: React.FC = () => {
  const [duration, setDuration] = useState<string>('');
  const [symptoms, setSymptoms] = useState<
    Record<string, 'positive' | 'negative' | 'not_mentioned'>
  >({});
  const [details, setDetails] = useState<
    Record<string, Record<string, string | string[]>>
  >({});
  const [detailSymptomStatus, setDetailSymptomStatus] = useState<
    Record<string, 'positive' | 'negative' | 'not_mentioned'>
  >({});
  const [detailNotes, setDetailNotes] = useState<Record<string, string>>({});
  const [generatedNote, setGeneratedNote] = useState<string>('');

  // Initialize symptoms and details state
  useEffect(() => {
    const initialSymptoms: Record<
      string,
      'positive' | 'negative' | 'not_mentioned'
    > = {};
    const initialDetails: Record<
      string,
      Record<string, string | string[]>
    > = {};
    const initialDetailSymptomStatus: Record<
      string,
      'positive' | 'negative' | 'not_mentioned'
    > = {};
    const initialDetailNotes: Record<string, string> = {};

    Object.keys(chestPainTemplate.symptoms).forEach((symptom) => {
      initialSymptoms[symptom] = 'not_mentioned';
      if (chestPainTemplate.symptoms[symptom].details) {
        initialDetails[symptom] = {};
        Object.keys(chestPainTemplate.symptoms[symptom].details!).forEach(
          (detail) => {
            const detailObj =
              chestPainTemplate.symptoms[symptom].details![detail];
            initialDetails[symptom][detail] = detailObj.multiSelect ? [] : '';
            if (detailObj.multiSelect) {
              detailObj.options.forEach((option) => {
                initialDetailSymptomStatus[`${symptom}-${detail}-${option}`] =
                  'not_mentioned';
                initialDetailNotes[`${symptom}-${detail}-${option}`] = '';
              });
            }
          }
        );
      }
    });

    setSymptoms(initialSymptoms);
    setDetails(initialDetails);
    setDetailSymptomStatus(initialDetailSymptomStatus);
    setDetailNotes(initialDetailNotes);
  }, []);

  // Handlers
  const handleSymptomChange = (
    symptom: string,
    value: 'positive' | 'negative' | 'not_mentioned'
  ) => {
    setSymptoms((prev) => ({ ...prev, [symptom]: value }));
  };

  const handleDetailChange = (
    symptom: string,
    detail: string,
    value: string
  ) => {
    setDetails((prev) => ({
      ...prev,
      [symptom]: { ...prev[symptom], [detail]: value },
    }));
  };

  const handleMultiDetailChange = (
    symptom: string,
    detail: string,
    option: string,
    isChecked: boolean
  ) => {
    setDetails((prev) => {
      const currentOptions = [...(prev[symptom][detail] as string[])];
      if (isChecked) {
        if (!currentOptions.includes(option)) currentOptions.push(option);
      } else {
        const index = currentOptions.indexOf(option);
        if (index !== -1) currentOptions.splice(index, 1);
      }
      return {
        ...prev,
        [symptom]: { ...prev[symptom], [detail]: currentOptions },
      };
    });
  };

  const handleDetailSymptomStatusChange = (
    symptom: string,
    detail: string,
    option: string,
    status: 'positive' | 'negative' | 'not_mentioned'
  ) => {
    setDetailSymptomStatus((prev) => ({
      ...prev,
      [`${symptom}-${detail}-${option}`]: status,
    }));
  };

  const handleDetailNotesChange = (
    symptom: string,
    detail: string,
    option: string,
    value: string
  ) => {
    setDetailNotes((prev) => ({
      ...prev,
      [`${symptom}-${detail}-${option}`]: value,
    }));
  };

  // Helper functions (from your original code)
  const cleanText = (text: string): string =>
    text
      .replace(/\([^)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const joinWithCommas = (items: string[]): string => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    const lastItem = items.pop();
    return `${items.join(', ')}, and ${lastItem}`;
  };

  // Generate SOAP note (from your original code)
  const generateNote = () => {
    let note = `${chestPainTemplate.intro.replace(
      '{duration}',
      duration || 'unspecified'
    )}\n\nSYMPTOMS:\n`;

    Object.keys(chestPainTemplate.symptoms).forEach((symptom) => {
      if (symptoms[symptom] === 'positive') {
        let symptomText = cleanText(
          chestPainTemplate.symptoms[symptom].positive
        );
        note += `- ${symptomText}`;
        if (chestPainTemplate.symptoms[symptom].details) {
          Object.keys(chestPainTemplate.symptoms[symptom].details!).forEach(
            (detail) => {
              const detailObj =
                chestPainTemplate.symptoms[symptom].details![detail];
              if (
                detailObj.multiSelect &&
                (details[symptom][detail] as string[]).length > 0
              ) {
                const positiveOptions = (
                  details[symptom][detail] as string[]
                ).filter(
                  (opt) =>
                    detailSymptomStatus[`${symptom}-${detail}-${opt}`] ===
                    'positive'
                );
                const negativeOptions = (
                  details[symptom][detail] as string[]
                ).filter(
                  (opt) =>
                    detailSymptomStatus[`${symptom}-${detail}-${opt}`] ===
                    'negative'
                );
                if (positiveOptions.length > 0) {
                  note += ` ${cleanText(
                    detailObj.text.replace(
                      '{value}',
                      joinWithCommas(positiveOptions.map(cleanText))
                    )
                  )}`;
                }
                if (negativeOptions.length > 0) {
                  note += ` Patient denies ${joinWithCommas(
                    negativeOptions.map(cleanText)
                  )}.`;
                }
              } else if (details[symptom][detail]) {
                note += ` ${cleanText(
                  detailObj.text.replace(
                    '{value}',
                    cleanText(details[symptom][detail] as string)
                  )
                )}`;
              }
            }
          );
        }
        note += '\n';
      } else if (symptoms[symptom] === 'negative') {
        note += `- ${cleanText(
          chestPainTemplate.symptoms[symptom].negative
        )}\n`;
      }
    });

    const consistency =
      Object.keys(symptoms).filter(
        (s) =>
          symptoms[s] === 'positive' &&
          [
            'retrosternal pain',
            'exertional component',
            'associated symptoms',
          ].includes(s)
      ).length >= 2
        ? 'consistentWith'
        : 'inconsistentWith';

    note += `\nASSESSMENT:\n${chestPainTemplate.assessment
      .replace('{duration}', duration || 'unspecified')
      .replace('{consistentWith/inconsistentWith}', consistency)}\n\nPLAN:\n`;
    const recommendations =
      consistency === 'consistentWith'
        ? ['ECG', 'cardiac enzymes', 'cardiac monitoring']
        : ['observe', 'consider alternative diagnoses'];
    note += chestPainTemplate.plan.replace(
      '{recommendations}',
      joinWithCommas(recommendations)
    );

    setGeneratedNote(note);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedNote)
      .then(() => alert('Note copied to clipboard!'));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <label className="block mb-2 font-semibold">
          Duration of Symptoms:
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g., 2 hours, 3 days"
        />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Symptom Checklist:</h2>
        {Object.keys(chestPainTemplate.symptoms).map((symptom) => (
          <div key={symptom} className="mb-4 p-4 border rounded">
            <div className="font-semibold mb-2">{symptom}:</div>
            <div className="flex space-x-4 mb-2">
              {['positive', 'negative', 'not_mentioned'].map((status) => (
                <label key={status} className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`symptom-${symptom}`}
                    value={status}
                    checked={symptoms[symptom] === status}
                    onChange={() =>
                      handleSymptomChange(
                        symptom,
                        status as 'positive' | 'negative' | 'not_mentioned'
                      )
                    }
                    className="mr-1"
                  />
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace('_', ' ')}
                </label>
              ))}
            </div>
            {symptoms[symptom] === 'positive' &&
              chestPainTemplate.symptoms[symptom].details && (
                <div className="ml-6 p-2 bg-gray-50 rounded">
                  {Object.keys(
                    chestPainTemplate.symptoms[symptom].details!
                  ).map((detail) => {
                    const detailObj =
                      chestPainTemplate.symptoms[symptom].details![detail];
                    return detailObj.multiSelect ? (
                      <div key={detail} className="mb-2">
                        <div className="font-medium mb-1">{detail}:</div>
                        {detailObj.options.map((option) => (
                          <div key={option} className="flex items-center mb-2">
                            <label className="inline-flex items-center mr-4 min-w-[250px]">
                              <input
                                type="checkbox"
                                checked={(
                                  details[symptom][detail] as string[]
                                ).includes(option)}
                                onChange={(e) =>
                                  handleMultiDetailChange(
                                    symptom,
                                    detail,
                                    option,
                                    e.target.checked
                                  )
                                }
                                className="mr-1"
                              />
                              {option}
                            </label>
                            <div className="flex space-x-2 mr-2">
                              {['positive', 'negative', 'not_mentioned'].map(
                                (status) => (
                                  <label
                                    key={status}
                                    className="inline-flex items-center"
                                  >
                                    <input
                                      type="radio"
                                      name={`detail-${symptom}-${detail}-${option}`}
                                      value={status}
                                      checked={
                                        detailSymptomStatus[
                                          `${symptom}-${detail}-${option}`
                                        ] === status
                                      }
                                      onChange={() =>
                                        handleDetailSymptomStatusChange(
                                          symptom,
                                          detail,
                                          option,
                                          status as
                                            | 'positive'
                                            | 'negative'
                                            | 'not_mentioned'
                                        )
                                      }
                                      className="mr-1 h-3 w-3"
                                    />
                                    <span className="text-xs">
                                      {status === 'positive'
                                        ? '+'
                                        : status === 'negative'
                                        ? '-'
                                        : 'NM'}
                                    </span>
                                  </label>
                                )
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="Additional notes..."
                              className="flex-grow p-1 text-sm border rounded"
                              value={
                                detailNotes[`${symptom}-${detail}-${option}`] ||
                                ''
                              }
                              onChange={(e) =>
                                handleDetailNotesChange(
                                  symptom,
                                  detail,
                                  option,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div key={detail} className="mb-2">
                        <div className="font-medium mb-1">{detail}:</div>
                        <select
                          className="w-full p-1 border rounded"
                          value={(details[symptom][detail] as string) || ''}
                          onChange={(e) =>
                            handleDetailChange(symptom, detail, e.target.value)
                          }
                        >
                          <option value="">Select {detail}</option>
                          {detailObj.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        ))}
      </div>
      <div className="mb-6">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={generateNote}
        >
          Generate SOAP Note
        </button>
      </div>
      {generatedNote && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Generated Note:</h2>
          <div className="p-4 border rounded bg-white">
            <pre className="whitespace-pre-wrap font-sans">{generatedNote}</pre>
          </div>
          <button
            className="mt-2 bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
            onClick={copyToClipboard}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default ChestPain;
