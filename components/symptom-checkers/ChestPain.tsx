'use client';
import React, { useState, useEffect } from 'react';

const SOAPNoteGenerator = () => {
  // Template data structure
  const chestPainTemplate = {
    'Cardiac Chest Pain': {
      intro:
        'Patient presents with chest pain of {duration} duration. Approximately 20-30% of patients diagnosed with ACS report atypical symptoms without chest pain.',
      symptoms: {
        // Classical cardiac symptoms
        'retrosternal pain': {
          positive:
            'Patient reports retrosternal pain in the left anterior chest.',
          negative:
            'Patient denies retrosternal pain in the left anterior chest.',
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
            onset: {
              options: ['sudden', 'gradual'],
              text: 'Onset was {value}.',
            },
            severity: {
              options: ['mild', 'moderate', 'severe', 'worst pain of life'],
              text: 'Pain is described as {value} in intensity.',
            },
            pattern: {
              options: ['intermittent', 'constant', 'waxing and waning'],
              text: 'Pain pattern is {value}.',
            },
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
                'altered mental status',
                'shoulder discomfort',
                'arm discomfort',
                'jaw discomfort',
                'back pain',
                'abdominal pain',
                'dizziness',
                'palpitations',
                'pallor',
              ],
              multiSelect: true,
              text: 'Associated symptoms include {value}.',
            },
          },
        },
        'duration pattern': {
          positive: 'Duration of pain was noted.',
          negative: 'Duration pattern not established.',
          details: {
            pattern: {
              options: [
                '2-10 minutes (typical for angina)',
                '10-30 minutes (typical for unstable angina)',
                'greater than 30 minutes (concerning for AMI)',
              ],
              text: 'Pain typically lasts {value}.',
            },
          },
        },
        'pain characteristics': {
          positive: 'Additional pain characteristics were noted.',
          negative: 'No additional pain characteristics noted.',
          details: {
            features: {
              options: [
                'pleuritic (worsens with breathing)',
                'positional (changes with position)',
                'sharp',
                'reproducible with palpation/positioning',
              ],
              multiSelect: true,
              text: 'Pain is {value}.',
            },
          },
        },
        // Risk factors
        'cardiac risk factors': {
          positive: 'Patient has cardiac risk factors.',
          negative: 'Patient has no known cardiac risk factors.',
          details: {
            'traditional factors': {
              options: [
                'hypertension',
                'hypercholesterolemia',
                'diabetes',
                'smoking',
                'family history of CAD',
                'obesity',
                'sedentary lifestyle',
                'male gender',
                'advanced age (>50 years)',
              ],
              multiSelect: true,
              text: 'Traditional risk factors include {value}.',
            },
            'additional factors': {
              options: [
                'cocaine abuse (recent or long history)',
                'HIV infection',
                'autoimmune disorders',
                'chronic kidney disease',
                'history of radiation therapy to chest',
              ],
              multiSelect: true,
              text: 'Additional risk factors include {value}.',
            },
            note: {
              options: [
                'Risk factors alone poorly predict likelihood of MI with acute symptoms',
              ],
              text: '{value}.',
            },
          },
        },
        // Non-classical presentations
        'atypical presentation': {
          positive: 'Patient presents with atypical features for ACS.',
          negative: 'Patient does not have atypical features for ACS.',
          details: {
            demographic: {
              options: [
                'premenopausal woman',
                'early menopausal woman',
                'racial minority',
                'diabetic',
                'elderly',
                'psychiatric history',
                'altered mental status',
              ],
              multiSelect: true,
              text: 'Patient is {value}, which may contribute to atypical presentation.',
            },
            symptoms: {
              options: [
                'isolated dyspnea',
                'predominant nausea',
                'predominant weakness',
                'unexplained fatigue',
                'isolated shoulder/arm/jaw discomfort without chest pain',
              ],
              multiSelect: true,
              text: 'Atypical symptoms include {value}.',
            },
          },
        },
        // Heart Failure Symptoms
        'heart failure symptoms': {
          positive: 'Patient has symptoms suggestive of heart failure.',
          negative: 'Patient denies symptoms suggestive of heart failure.',
          details: {
            'high sensitivity findings': {
              options: [
                'dyspnea on exertion (84% sensitivity)',
                'history of acute heart failure (most useful historical parameter)',
              ],
              multiSelect: true,
              text: 'High sensitivity findings include {value}.',
            },
            'high specificity findings': {
              options: [
                'paroxysmal nocturnal dyspnea (77-84% specificity)',
                'orthopnea (77-84% specificity)',
                'edema (77-84% specificity)',
              ],
              multiSelect: true,
              text: 'High specificity findings include {value}.',
            },
          },
        },
        // Cardiomyopathies
        cardiomyopathies: {
          positive:
            'Patient has symptoms or signs suggestive of cardiomyopathy.',
          negative:
            'Patient does not have symptoms or signs of cardiomyopathy.',
          details: {
            'dilated cardiomyopathy': {
              options: [
                'dyspnea on exertion',
                'orthopnea',
                'paroxysmal nocturnal dyspnea',
                'rales',
                'dependent edema',
                'enlarged liver',
                'holosystolic murmur',
                'chest pain (from limited coronary vascular reserve)',
                'enlarged cardiac silhouette on CXR',
                'biventricular enlargement on CXR',
                'pulmonary vascular congestion on CXR',
                'LVH on ECG',
                'left atrial enlargement on ECG',
                'Q or QS waves on ECG',
                'poor R wave progression on ECG',
                'decreased ejection fraction on echo',
                'ventricular enlargement on echo',
                'increased systolic/diastolic volumes on echo',
              ],
              multiSelect: true,
              text: 'Dilated cardiomyopathy features include {value}.',
            },
            myocarditis: {
              options: [
                'systemic symptoms (myalgias, headache, rigors, fever)',
                'tachycardia',
                'chest pain with coexisting pericarditis',
                'pericardial friction rub',
                'progressive heart failure',
                'dyspnea on exertion',
                'pulmonary rales',
                'pedal edema',
                'cardiogenic shock',
              ],
              multiSelect: true,
              text: 'Myocarditis features include {value}.',
            },
            'hypertrophic cardiomyopathy': {
              options: [
                'dyspnea on exertion (most common)',
                'chest pain',
                'palpitations',
                'syncope',
                'awareness of forceful ventricular contractions',
                'fourth heart sound',
                'systolic ejection murmur at lower left sternal border/apex',
                'murmur that increases with Valsalva/standing',
                'murmur that decreases with squatting/leg elevation',
                'LVH on ECG',
                'left atrial enlargement on ECG',
                'deep S waves with large septal Q waves',
                'upright T waves',
                'inverted T waves (suggesting ischemia)',
                'normal chest radiograph',
                'disproportionate septal hypertrophy on echo',
              ],
              multiSelect: true,
              text: 'Hypertrophic cardiomyopathy features include {value}.',
            },
          },
        },
        // Valvular Disease Findings
        'valvular disease findings': {
          positive:
            'Patient has symptoms or signs suggestive of valvular heart disease.',
          negative:
            'Patient does not have symptoms or signs of valvular heart disease.',
          details: {
            'mitral regurgitation': {
              options: [
                'new onset marked pulmonary edema without significant cardiomegaly',
                'acute inferior wall MI/ischemia on ECG (suggestive of papillary muscle rupture)',
                'minimally enlarged left atrium with pulmonary edema on CXR (acute)',
                'left atrial and ventricular hypertrophy on ECG (chronic)',
                'valvular regurgitation on echocardiography',
              ],
              multiSelect: true,
              text: 'Mitral regurgitation features include {value}.',
            },
            'aortic stenosis': {
              options: [
                'classic triad: dyspnea, chest pain, and syncope',
                'exertional dyspnea as first symptom',
                'paroxysmal nocturnal dyspnea',
                'syncope on exertion',
                'angina',
                'normal or low blood pressure',
                'narrow pulse pressure',
                'brachioradial delay',
                'worsened by atrial fibrillation',
                'LVH on ECG',
                'bundle branch block on ECG',
              ],
              multiSelect: true,
              text: 'Aortic stenosis features include {value}.',
            },
            'aortic regurgitation acute': {
              options: [
                'pulmonary edema with dyspnea',
                'fever and chills (if endocarditis)',
                'tearing chest pain radiating between shoulder blades (if aortic dissection)',
                'tachycardia',
                'cardiogenic shock',
                'widened mediastinum on CXR (if dissection)',
                'inferior MI pattern on ECG (if RCA involvement)',
              ],
              multiSelect: true,
              text: 'Acute aortic regurgitation features include {value}.',
            },
            'aortic regurgitation chronic': {
              options: [
                'gradually worsening fatigue',
                'exertional dyspnea',
                'wide pulse pressure',
                'prominent ventricular impulse',
                'head bobbing',
                'water hammer pulse',
                'accentuated precordial apical thrust',
                'pulsus bisferiens',
                'to-and-fro femoral murmur (Duroziez sign)',
                'capillary pulsations at nailbed (Quincke sign)',
                'LVH on ECG',
                'aortic dilation on CXR',
                'CHF on CXR',
              ],
              multiSelect: true,
              text: 'Chronic aortic regurgitation features include {value}.',
            },
            'tricuspid disease': {
              options: [
                'acute endocarditis (often Staphylococcus aureus)',
                'rapid valve destruction',
                'right heart failure signs (jugular venous distension, peripheral edema, hepatomegaly, splenomegaly, ascites)',
              ],
              multiSelect: true,
              text: 'Tricuspid valve disease features include {value}.',
            },
            'pulmonic valve disease': {
              options: [
                'congenital etiology (most common)',
                'pulmonary hypertension',
                'rheumatic heart disease',
                'carcinoid syndrome',
                'dyspnea with exertion (first symptom with pulmonary hypertension)',
                'syncope',
                'chest pain',
                'right heart failure signs',
              ],
              multiSelect: true,
              text: 'Pulmonic valve disease features include {value}.',
            },
            'recommended studies': {
              options: [
                'transthoracic echocardiography (may underestimate lesion severity)',
                'transesophageal echocardiography (for definitive diagnosis)',
                'bedside echo (for unstable patients)',
              ],
              multiSelect: true,
              text: 'Valvular disease evaluation includes {value}.',
            },
          },
        },
        // Differential diagnoses
        'other chest pain etiologies': {
          positive:
            'Features of other potential chest pain etiologies are present.',
          negative: 'No features suggesting alternate chest pain etiologies.',
          details: {
            'pulmonary embolism': {
              options: [
                'sudden onset pleuritic pain',
                'dyspnea',
                'tachypnea',
                'tachycardia',
                'hypoxemia',
                'prolonged immobilization',
                'active cancer',
                'recent surgery/trauma',
                'procoagulant syndrome',
                'exogenous estrogen use',
                'previous thromboembolic disease',
              ],
              multiSelect: true,
              text: 'PE features include {value}.',
            },
            'aortic dissection': {
              options: [
                'sudden onset severe tearing pain',
                'intrascapular radiation',
                'male sex',
                'age >50',
                'uncontrolled hypertension',
                'connective tissue disorder',
                'cocaine use',
                'bicuspid valve',
                'aortic valve replacement',
                'pregnancy',
                'unilateral pulse deficit',
                'focal neurologic deficit',
                'ischemic stroke',
                'AMI from coronary involvement',
                'limb ischemia',
              ],
              multiSelect: true,
              text: 'Aortic dissection features include {value}.',
            },
            pericarditis: {
              options: [
                'sharp severe constant retrosternal pain',
                'radiation to back/neck/jaw',
                'worse when supine',
                'relieved by sitting forward',
                'radiation to left trapezial ridge (distinctive)',
                'pericardial friction rub',
                'aggravated by movement/swallowing/inspiration',
                'low-grade intermittent fever',
                'dyspnea',
                'dysphagia',
                'PR-segment depression on ECG',
                'diffuse ST-segment elevation on ECG',
                'T-wave inversions on ECG',
              ],
              multiSelect: true,
              text: 'Pericarditis features include {value}.',
            },
            pneumothorax: {
              options: [
                'sudden onset sharp pain',
                'pleuritic',
                'dyspnea',
                'tall slender male patient',
                'history of smoking',
                'COPD',
                'asthma',
                'decreased breath sounds on affected side',
              ],
              multiSelect: true,
              text: 'Pneumothorax features include {value}.',
            },
            'esophageal rupture': {
              options: [
                'sudden onset sharp substernal pain',
                'follows forceful vomiting',
                'ill-appearing',
                'tachycardia',
                'fever',
                'dyspnea',
                'diaphoresis',
              ],
              multiSelect: true,
              text: "Esophageal rupture (Boerhaave's syndrome) features include {value}.",
            },
            musculoskeletal: {
              options: [
                'reproducible with palpation',
                'worsened with movement',
                'costochondritis',
                'xiphodynia (inflammation of xiphoid process)',
                'precordial catch syndrome',
                'intercostal strain from coughing',
                'pectoralis muscle strain',
                'recent physical exertion',
              ],
              multiSelect: true,
              text: 'Musculoskeletal features include {value}.',
            },
            gastrointestinal: {
              options: [
                'burning pain',
                'gnawing pain',
                'postprandial discomfort',
                'esophageal spasm',
                'dull boring epigastric pain',
                'precipitated by cold liquids',
                'relieved by nitroglycerin',
                'relieved by antacids',
                'history of reflux',
                'dyspepsia',
                'esophageal motility disorder',
              ],
              multiSelect: true,
              text: 'Gastrointestinal features include {value}.',
            },
          },
        },
        // Clinical decision aids
        'clinical decision aids': {
          positive:
            'Clinical decision aids were utilized to risk stratify the patient.',
          negative: 'No clinical decision aids were utilized.',
          details: {
            'PE risk scores': {
              options: [
                'Wells Score',
                'Revised Geneva Score',
                'PERC (Pulmonary Embolism Rule-Out Criteria)',
              ],
              multiSelect: true,
              text: 'Pulmonary embolism risk was assessed using {value}.',
            },
            'lab tests': {
              options: [
                'D-dimer',
                'Troponin',
                'BNP/NT-proBNP (useful when diagnostic uncertainty for heart failure exists)',
                'CK-MB',
              ],
              multiSelect: true,
              text: 'Relevant lab tests include {value}.',
            },
            imaging: {
              options: [
                'Chest X-ray (CXR showed pulmonary venous congestion/cardiomegaly/interstitial edema highly specific for heart failure)',
                'CT aortogram',
                'Transesophageal echocardiogram',
                'CT pulmonary angiogram',
                'V/Q scan',
                'Bedside cardiac ultrasound (useful for LV function, volume status, pulmonary congestion, or tamponade)',
              ],
              multiSelect: true,
              text: 'Imaging studies include {value}.',
            },
            note: {
              options: [
                'Up to 20% of heart failure patients may have initially negative CXR',
                'ECG not useful for heart failure diagnosis but may reveal underlying cause',
              ],
              multiSelect: true,
              text: 'Additional notes: {value}.',
            },
          },
        },
        // ECG findings
        'ECG findings': {
          positive: 'ECG findings were noted.',
          negative: 'No significant ECG findings noted.',
          details: {
            changes: {
              options: [
                'ST-segment elevation',
                'ST-segment depression',
                'T-wave inversions',
                'PR-segment depression',
                'nonspecific ST/T-wave changes',
                'pathologic Q waves',
                'left bundle branch block',
                'right bundle branch block',
              ],
              multiSelect: true,
              text: 'ECG shows {value}.',
            },
          },
        },
        // Physical Examination
        'physical examination findings': {
          positive:
            'Physical examination reveals findings of hemodynamic significance.',
          negative:
            'Physical examination is unremarkable for hemodynamic compromise.',
          details: {
            'hemodynamic dysfunction': {
              options: [
                'pallor',
                'diaphoresis',
                'altered mental status',
                'elevated jugular venous pressure',
                'tachycardia',
                'hypotension',
                'bradycardia',
                'peripheral edema',
                'pulmonary edema',
                'S3/S4 heart sounds',
                'new murmur',
              ],
              multiSelect: true,
              text: 'Examination shows signs of hemodynamic dysfunction including {value}.',
            },
          },
        },
      },
      assessment:
        'Chest pain, {duration} duration, with features {consistentWith/inconsistentWith} for cardiac etiology.',
      plan: 'Recommend {recommendations} for further evaluation and management.',
    },
  };

  // State for the selected complaint and duration
  const [selectedComplaint, setSelectedComplaint] =
    useState('Cardiac Chest Pain');
  const [duration, setDuration] = useState('');

  // State for symptoms and details
  const [symptoms, setSymptoms] = useState({});
  const [details, setDetails] = useState({});

  // State for the generated note
  const [generatedNote, setGeneratedNote] = useState('');

  // Helper functions to clean medical text
  const cleanText = (text) => {
    // Remove any parenthetical explanations for cleaner output
    return text
      .replace(/\([^)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Join text into natural sentences
  const joinWithCommas = (items) => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;

    const lastItem = items.pop();
    return `${items.join(', ')}, and ${lastItem}`;
  };

  // Initialize the symptoms state
  useEffect(() => {
    if (selectedComplaint) {
      const template = chestPainTemplate[selectedComplaint];
      const initialSymptoms = {};
      const initialDetails = {};
      const initialDetailSymptomStatus = {};
      const initialDetailNotes = {};

      Object.keys(template.symptoms).forEach((symptom) => {
        initialSymptoms[symptom] = 'not_mentioned';

        // Initialize details if they exist
        if (template.symptoms[symptom].details) {
          initialDetails[symptom] = {};
          Object.keys(template.symptoms[symptom].details).forEach((detail) => {
            const detailObj = template.symptoms[symptom].details[detail];
            if (detailObj.multiSelect) {
              initialDetails[symptom][detail] = [];

              // Initialize status for each option
              detailObj.options.forEach((option) => {
                initialDetailSymptomStatus[`${symptom}-${detail}-${option}`] =
                  'not_mentioned';
                initialDetailNotes[`${symptom}-${detail}-${option}`] = '';
              });
            } else {
              initialDetails[symptom][detail] = '';
            }
          });
        }
      });

      setSymptoms(initialSymptoms);
      setDetails(initialDetails);
      setDetailSymptomStatus(initialDetailSymptomStatus);
      setDetailNotes(initialDetailNotes);
    }
  }, [selectedComplaint]);

  // Handle symptom selection changes
  const handleSymptomChange = (symptom, value) => {
    setSymptoms((prev) => ({
      ...prev,
      [symptom]: value,
    }));
  };

  // Handle detail selection changes
  const handleDetailChange = (symptom, detail, value) => {
    setDetails((prev) => ({
      ...prev,
      [symptom]: {
        ...prev[symptom],
        [detail]: value,
      },
    }));
  };

  // Handle multi-select detail changes
  const handleMultiDetailChange = (symptom, detail, option, isChecked) => {
    setDetails((prev) => {
      const currentOptions = [...(prev[symptom][detail] || [])];
      if (isChecked) {
        if (!currentOptions.includes(option)) {
          currentOptions.push(option);
        }
      } else {
        const index = currentOptions.indexOf(option);
        if (index !== -1) {
          currentOptions.splice(index, 1);
        }
      }
      return {
        ...prev,
        [symptom]: {
          ...prev[symptom],
          [detail]: currentOptions,
        },
      };
    });
  };

  // State for detail symptom status (positive/negative/not mentioned)
  const [detailSymptomStatus, setDetailSymptomStatus] = useState({});

  // State for detail notes
  const [detailNotes, setDetailNotes] = useState({});

  // Handle individual symptom status changes
  const handleDetailSymptomStatusChange = (symptom, detail, option, status) => {
    setDetailSymptomStatus((prev) => ({
      ...prev,
      [`${symptom}-${detail}-${option}`]: status,
    }));
  };

  // Handle detail notes changes
  const handleDetailNotesChange = (symptom, detail, option, value) => {
    setDetailNotes((prev) => ({
      ...prev,
      [`${symptom}-${detail}-${option}`]: value,
    }));
  };

  // Generate the SOAP note
  const generateNote = () => {
    const template = chestPainTemplate[selectedComplaint];
    let note = '';

    // Add intro
    note +=
      template.intro.replace('{duration}', duration || 'unspecified') + '\n\n';

    // Add symptoms section
    note += 'SYMPTOMS:\n';
    Object.keys(template.symptoms).forEach((symptom) => {
      if (symptoms[symptom] === 'positive') {
        let symptomText = cleanText(template.symptoms[symptom].positive);
        note += '- ' + symptomText;

        // Add details if applicable
        if (template.symptoms[symptom].details) {
          Object.keys(template.symptoms[symptom].details).forEach((detail) => {
            const detailObj = template.symptoms[symptom].details[detail];
            if (detailObj.multiSelect) {
              if (
                details[symptom][detail] &&
                details[symptom][detail].length > 0
              ) {
                // Filter options by their positive/negative status
                const positiveOptions = details[symptom][detail].filter(
                  (opt) =>
                    detailSymptomStatus[`${symptom}-${detail}-${opt}`] ===
                    'positive'
                );

                const negativeOptions = details[symptom][detail].filter(
                  (opt) =>
                    detailSymptomStatus[`${symptom}-${detail}-${opt}`] ===
                    'negative'
                );

                if (positiveOptions.length > 0) {
                  const cleanedOptions = positiveOptions.map((opt) =>
                    cleanText(opt)
                  );
                  const detailText = detailObj.text.replace(
                    '{value}',
                    joinWithCommas(cleanedOptions)
                  );
                  note += ' ' + cleanText(detailText);
                }

                if (negativeOptions.length > 0) {
                  note +=
                    ' Patient denies ' +
                    joinWithCommas(
                      negativeOptions.map((opt) => cleanText(opt))
                    ) +
                    '.';
                }
              }
            } else if (details[symptom][detail]) {
              const detailText = detailObj.text.replace(
                '{value}',
                cleanText(details[symptom][detail])
              );
              note += ' ' + cleanText(detailText);
            }
          });
        }
        note += '\n';
      } else if (symptoms[symptom] === 'negative') {
        note += '- ' + cleanText(template.symptoms[symptom].negative) + '\n';
      }
    });

    // Assessment - determine if symptoms are consistent with cardiac origin
    let consistency = 'inconsistentWith';
    const cardiacIndicators = [
      'retrosternal pain',
      'exertional component',
      'associated symptoms',
    ];
    const positiveCardiacIndicators = cardiacIndicators.filter(
      (indicator) => symptoms[indicator] === 'positive'
    );
    if (positiveCardiacIndicators.length >= 2) {
      consistency = 'consistentWith';
    }

    // Add assessment
    note += '\nASSESSMENT:\n';
    note += template.assessment
      .replace('{duration}', duration || 'unspecified')
      .replace('{consistentWith/inconsistentWith}', consistency);

    // Add plan
    note += '\n\nPLAN:\n';
    let recommendations = [];
    if (consistency === 'consistentWith') {
      recommendations.push('ECG', 'cardiac enzymes', 'cardiac monitoring');
    } else {
      recommendations.push('observe', 'consider alternative diagnoses');
    }
    note += template.plan.replace(
      '{recommendations}',
      joinWithCommas(recommendations)
    );

    setGeneratedNote(note);
  };

  // Copy note to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedNote);
    alert('Note copied to clipboard!');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Cardiac Chest Pain SOAP Note Generator
      </h1>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Chief Complaint:</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedComplaint}
          onChange={(e) => setSelectedComplaint(e.target.value)}
        >
          {Object.keys(chestPainTemplate).map((complaint) => (
            <option key={complaint} value={complaint}>
              {complaint}
            </option>
          ))}
        </select>
      </div>

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

        {selectedComplaint &&
          Object.keys(chestPainTemplate[selectedComplaint].symptoms).map(
            (symptom) => (
              <div key={symptom} className="mb-4 p-4 border rounded">
                <div className="font-semibold mb-2">{symptom}:</div>
                <div className="flex space-x-4 mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`symptom-${symptom}`}
                      value="positive"
                      checked={symptoms[symptom] === 'positive'}
                      onChange={() => handleSymptomChange(symptom, 'positive')}
                      className="mr-1"
                    />
                    Positive
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`symptom-${symptom}`}
                      value="negative"
                      checked={symptoms[symptom] === 'negative'}
                      onChange={() => handleSymptomChange(symptom, 'negative')}
                      className="mr-1"
                    />
                    Negative
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`symptom-${symptom}`}
                      value="not_mentioned"
                      checked={symptoms[symptom] === 'not_mentioned'}
                      onChange={() =>
                        handleSymptomChange(symptom, 'not_mentioned')
                      }
                      className="mr-1"
                    />
                    Not Mentioned
                  </label>
                </div>

                {/* Show details if the symptom is positive */}
                {symptoms[symptom] === 'positive' &&
                  chestPainTemplate[selectedComplaint].symptoms[symptom]
                    .details && (
                    <div className="ml-6 p-2 bg-gray-50 rounded">
                      {Object.keys(
                        chestPainTemplate[selectedComplaint].symptoms[symptom]
                          .details
                      ).map((detail) => {
                        const detailObj =
                          chestPainTemplate[selectedComplaint].symptoms[symptom]
                            .details[detail];

                        if (detailObj.multiSelect) {
                          // Multiple select options
                          return (
                            <div key={detail} className="mb-2">
                              <div className="font-medium mb-1">{detail}:</div>
                              <div className="grid grid-cols-1 gap-0">
                                {detailObj.options.map((option) => (
                                  <div
                                    key={option}
                                    className="flex flex-wrap items-center mb-2"
                                  >
                                    <label className="inline-flex items-center mr-2 md:mr-4 min-w-[180px] md:min-w-[250px]">
                                      <input
                                        type="checkbox"
                                        checked={
                                          details[symptom][detail]?.includes(
                                            option
                                          ) || false
                                        }
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
                                      <label className="inline-flex items-center">
                                        <input
                                          type="radio"
                                          name={`detail-${symptom}-${detail}-${option}`}
                                          value="positive"
                                          checked={
                                            detailSymptomStatus[
                                              `${symptom}-${detail}-${option}`
                                            ] === 'positive'
                                          }
                                          onChange={() =>
                                            handleDetailSymptomStatusChange(
                                              symptom,
                                              detail,
                                              option,
                                              'positive'
                                            )
                                          }
                                          className="mr-1 h-3 w-3"
                                        />
                                        <span className="text-xs">+</span>
                                      </label>
                                      <label className="inline-flex items-center">
                                        <input
                                          type="radio"
                                          name={`detail-${symptom}-${detail}-${option}`}
                                          value="negative"
                                          checked={
                                            detailSymptomStatus[
                                              `${symptom}-${detail}-${option}`
                                            ] === 'negative'
                                          }
                                          onChange={() =>
                                            handleDetailSymptomStatusChange(
                                              symptom,
                                              detail,
                                              option,
                                              'negative'
                                            )
                                          }
                                          className="mr-1 h-3 w-3"
                                        />
                                        <span className="text-xs">-</span>
                                      </label>
                                      <label className="inline-flex items-center">
                                        <input
                                          type="radio"
                                          name={`detail-${symptom}-${detail}-${option}`}
                                          value="not_mentioned"
                                          checked={
                                            detailSymptomStatus[
                                              `${symptom}-${detail}-${option}`
                                            ] === 'not_mentioned' ||
                                            !detailSymptomStatus[
                                              `${symptom}-${detail}-${option}`
                                            ]
                                          }
                                          onChange={() =>
                                            handleDetailSymptomStatusChange(
                                              symptom,
                                              detail,
                                              option,
                                              'not_mentioned'
                                            )
                                          }
                                          className="mr-1 h-3 w-3"
                                        />
                                        <span className="text-xs">NM</span>
                                      </label>
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="Additional notes..."
                                      className="flex-grow p-1 text-sm border rounded mt-1 md:mt-0"
                                      value={
                                        detailNotes[
                                          `${symptom}-${detail}-${option}`
                                        ] || ''
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
                            </div>
                          );
                        } else {
                          // Single select options
                          return (
                            <div key={detail} className="mb-2">
                              <div className="font-medium mb-1">{detail}:</div>
                              <select
                                className="w-full p-1 border rounded"
                                value={details[symptom][detail] || ''}
                                onChange={(e) =>
                                  handleDetailChange(
                                    symptom,
                                    detail,
                                    e.target.value
                                  )
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
                        }
                      })}
                    </div>
                  )}
              </div>
            )
          )}
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

      <div>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 opacity-50 cursor-not-allowed"
          disabled
        >
          Generate AI Differential Diagnoses (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default SOAPNoteGenerator;
