'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SymptomCategory {
  title: string;
  route: string;
  description: string;
  color: string;
}

const symptomCategories: SymptomCategory[] = [
  {
    title: 'Chest Pain',
    route: 'chest-pain',
    description: 'Discomfort or pain in the chest area',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Headache',
    route: 'headache',
    description: 'Pain or discomfort in the head or scalp',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Abdominal Pain',
    route: 'abdominal-pain',
    description: 'Pain or discomfort in the stomach or belly region',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Breathing Difficulty',
    route: 'breathing-difficulty',
    description: 'Shortness of breath or trouble breathing',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Dizziness',
    route: 'dizziness',
    description: 'Feeling lightheaded, faint, or unsteady',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Fever',
    route: 'fever',
    description: 'Elevated body temperature often with chills',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'GI Bleeding',
    route: 'gi-bleeding',
    description: 'Blood in vomit or stool, potentially severe',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'COPD Exacerbation',
    route: 'copd-exacerbation',
    description: 'Worsening of COPD symptoms such as increased breathlessness',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Spinal Injuries',
    route: 'spinal-injuries',
    description: 'Trauma or pain affecting the spine',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Stroke',
    route: 'stroke',
    description: 'Sudden neurological symptoms affecting one side of the body',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Suicidal Ideation',
    route: 'suicidal-ideation',
    description: 'Thoughts of suicide or self-harm',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Swollen Leg',
    route: 'swollen-leg',
    description: 'Leg swelling, potentially indicating circulation problems',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Syncope',
    route: 'syncope',
    description: 'Fainting or temporary loss of consciousness',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Skin And Soft Tissue Infections',
    route: 'skin-and-soft-tissue-infections',
    description: 'Cellulitis, abscesses, or other skin infections',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Sleep Disorders',
    route: 'sleep-disorders',
    description: 'Problems with sleep quality or duration',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Small Bowel Obstruction',
    route: 'small-bowel-obstruction',
    description: 'Blockage in the intestines causing pain and vomiting',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Sore Throat',
    route: 'sore-throat',
    description: 'Pain or irritation in the throat',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Spinal Cord Compression',
    route: 'spinal-cord-compression',
    description: 'Pressure on the spinal cord causing neurological symptoms',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Seizures',
    route: 'seizures',
    description: 'Episodes of abnormal brain activity causing symptoms',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Sepsis',
    route: 'sepsis',
    description: 'Serious infection causing widespread inflammation',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Sexually Transmitted Infections',
    route: 'sexually-transmitted-infections',
    description: 'Infections spread through sexual contact',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Shoulder Pain',
    route: 'shoulder',
    description: 'Pain or discomfort in the shoulder joint or surrounding area',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Sickle Cell Crisis',
    route: 'sickle-cell-crisis',
    description: 'Acute painful episode in people with sickle cell disease',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Psychosis',
    route: 'psychosis',
    description: 'Loss of contact with reality, hallucinations or delusions',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Pulmonary Embolism',
    route: 'pulmonary-embolism',
    description: 'Blood clot in the lungs causing breathing problems',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Rash',
    route: 'rash',
    description: 'Skin eruption or discoloration',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Respiratory Distress',
    route: 'respiratory-distress',
    description: 'Severe difficulty breathing requiring immediate attention',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Scrotal Pain',
    route: 'scrotal-pain',
    description: 'Pain in the scrotum that may indicate serious conditions',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Peripheral Neuropathy',
    route: 'peripheral-neuropathy',
    description: 'Damage to peripheral nerves causing numbness and pain',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Pneumonia',
    route: 'pneumonia',
    description: 'Lung infection causing cough and breathing difficulty',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Pneumothorax',
    route: 'pneumothorax',
    description: 'Collapsed lung causing chest pain and breathing problems',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Preeclampsia',
    route: 'preeclampsia',
    description:
      'Pregnancy complication with high blood pressure and organ damage',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Preterm Labor',
    route: 'preterm-labor',
    description: 'Labor beginning before 37 weeks of pregnancy',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Pediatric Respiratory Distress',
    route: 'pediatric-respiratory-distress',
    description: 'Breathing difficulties in children',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Pelvic Pain',
    route: 'pelvic-pain',
    description: 'Pain in the lower abdominal or pelvic region',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Penetrating Trauma',
    route: 'penetrating-trauma',
    description: 'Injury from object penetrating the body',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Peripheral Edema',
    route: 'peripheral-edema',
    description: 'Swelling in arms or legs due to fluid buildup',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Pediatric Fever',
    route: 'pediatric-fever',
    description: 'Elevated temperature in children',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Painful Vaginal Bleeding In Pregnancy',
    route: 'painful-vaginal-bleeding-in-pregnancy',
    description: 'Bleeding during pregnancy with associated pain',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Palpitations',
    route: 'palpitations',
    description: 'Awareness of abnormal heartbeat',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Pediatric Abdominal Pain',
    route: 'pediatric-abdominal-pain',
    description: 'Stomach or belly pain in children',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Pediatric Dehydration',
    route: 'pediatric-dehydration',
    description: 'Fluid loss in children causing various symptoms',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Painful Joint',
    route: 'painful-joint',
    description: 'Pain in joints that may limit movement',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Non-Accidental Trauma',
    route: 'non-accidental-trauma',
    description: 'Injuries from abuse or neglect',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Oncologic Emergencies',
    route: 'oncologic-emergencies',
    description: 'Urgent complications related to cancer',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Orbital Cellulitis',
    route: 'orbital-cellulitis',
    description: 'Infection of the tissues around the eye',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Orthopedic Injuries',
    route: 'orthopedic-injuries',
    description: 'Injuries affecting bones, joints, and supporting structures',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Overdose',
    route: 'overdose',
    description: 'Taking excessive amounts of drugs or medications',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Movement Disorders',
    route: 'movement-disorders',
    description: 'Conditions affecting control of movement',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Nausea',
    route: 'nausea',
    description: 'Feeling of sickness with an urge to vomit',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Neck Pain',
    route: 'neck-pain',
    description: 'Pain or discomfort in the neck area',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Neonatal Emergencies',
    route: 'neonatal-emergencies',
    description: 'Critical conditions in newborns',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Neutropenic Fever',
    route: 'neutropenic-fever',
    description: 'Fever in a person with low white blood cell count',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Joint Pain',
    route: 'joint-pain',
    description: 'Pain in the joints affecting mobility',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Knee Pain',
    route: 'knee',
    description: 'Pain or injury affecting the knee joint',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Lacerations',
    route: 'lacerations',
    description: 'Tears or cuts in the skin requiring treatment',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Liver Failure',
    route: 'liver-failure',
    description: 'Severe liver dysfunction causing multiple symptoms',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Meningitis',
    route: 'meningitis',
    description:
      'Inflammation of the membranes surrounding the brain and spinal cord',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Hyperthermia',
    route: 'hyperthermia',
    description: 'Dangerously elevated body temperature',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Hypoglycemia',
    route: 'hypoglycemia',
    description: 'Low blood sugar causing various symptoms',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Hypothermia',
    route: 'hypothermia',
    description: 'Dangerously low body temperature',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Intracranial Hemorrhage',
    route: 'intracranial-hemorrhage',
    description: 'Bleeding within the skull',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Jaundice',
    route: 'jaundice',
    description: 'Yellowing of the skin due to liver problems',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Hemoptysis',
    route: 'hemoptysis',
    description: 'Coughing up blood from the respiratory tract',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'High Altitude Illness',
    route: 'high-altitude-illness',
    description: 'Conditions caused by high elevation exposure',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Hip Pain',
    route: 'hip',
    description: 'Pain or injury affecting the hip joint',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Hyperemesis Gravidarum',
    route: 'hyperemesis-gravidarum',
    description: 'Severe nausea and vomiting during pregnancy',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Hypertensive Emergencies',
    route: 'hypertensive-emergencies',
    description:
      'Dangerously high blood pressure requiring immediate treatment',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Hand Injury',
    route: 'hand',
    description: 'Trauma or pain affecting the hand',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Head Injury',
    route: 'head-injury',
    description: 'Trauma to the head that may affect the brain',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Heart Failure Exacerbation',
    route: 'heart-failure-exacerbation',
    description: 'Worsening of heart failure symptoms',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Hematuria',
    route: 'hematuria',
    description: 'Blood in the urine',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Gout',
    route: 'gout',
    description: 'Type of arthritis causing sudden, severe joint pain',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'First Trimester Bleeding',
    route: 'first-trimester-bleeding',
    description: 'Vaginal bleeding during early pregnancy',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Flank Pain',
    route: 'flank-pain',
    description: 'Pain in the side, between ribs and hip',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Focal Weakness',
    route: 'focal-weakness',
    description: 'Weakness in a specific area of the body',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
  {
    title: 'Forearm Injury',
    route: 'forearm',
    description: 'Pain or trauma affecting the forearm',
    color: 'bg-green-100 border-green-500 hover:bg-green-200',
  },
  {
    title: 'Fractures',
    route: 'fractures',
    description: 'Broken bones requiring medical attention',
    color: 'bg-orange-100 border-orange-500 hover:bg-orange-200',
  },
  {
    title: 'Eye Pain',
    route: 'eye-pain',
    description: 'Pain in or around the eye',
    color: 'bg-red-100 border-red-500 hover:bg-red-200',
  },
  {
    title: 'Eye Redness',
    route: 'eye-redness',
    description: 'Red or bloodshot eyes',
    color: 'bg-blue-100 border-blue-500 hover:bg-blue-200',
  },
  {
    title: 'Facial Trauma',
    route: 'facial-trauma',
    description: 'Injury to the face',
    color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200',
  },
  {
    title: 'Falls In The Elderly',
    route: 'falls-in-the-elderly',
    description: 'Elderly patients who have fallen',
    color: 'bg-purple-100 border-purple-500 hover:bg-purple-200',
  },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  // Handle symptom category click
  const handleCategoryClick = (route: string) => {
    // Special routing for Focal Weakness which is in the approach directory
    if (route === 'focal-weakness') {
      router.push(`/approach/${route}`);
    } else {
      router.push(`/patients/${route}`);
    }
  };

  // Filter categories based on search term
  const filteredCategories = searchTerm.trim()
    ? symptomCategories.filter(
        (category) =>
          category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : symptomCategories;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with title and search */}
      <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Symptom Checker
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search symptoms..."
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto my-8 px-4">
        {/* Welcome message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to the Symptom Checker
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please select a symptom category below to help us understand what
            you&apos;re experiencing. This will guide you through a series of
            questions to better assess your condition.
          </p>
        </div>

        {/* Symptom categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <button
              key={category.route}
              onClick={() => handleCategoryClick(category.route)}
              className={`text-left p-6 rounded-lg shadow-sm border-l-4 transition-colors ${category.color}`}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                {category.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {category.description}
              </p>
            </button>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No symptoms found matching &quot;{searchTerm}&quot;
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <div className="inline-block p-4 bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 rounded-lg max-w-2xl mx-auto shadow">
            <p className="text-sm">
              <strong>Important:</strong> This symptom checker is for
              informational purposes only and does not replace professional
              medical advice. If you are experiencing a medical emergency,
              please call emergency services immediately.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
