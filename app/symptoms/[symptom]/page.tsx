// app/symptoms/[symptom]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Import all symptom checkers directly
import ChestPain from '@/components/symptom-checkers/ChestPain';
// As you build more, you'll import them here:
// import Headache from '@/components/symptom-checkers/Headache';
// import Cough from '@/components/symptom-checkers/Cough';

// Map of symptom slugs to their display titles
const symptomTitles: Record<string, string> = {
  'chest-pain': 'Chest Pain',
  headache: 'Headache',
  cough: 'Cough',
  'abdominal-pain': 'Abdominal Pain',
  // Add more as you create them
};

export default function SymptomPage() {
  const { symptom } = useParams();
  const symptomSlug = Array.isArray(symptom) ? symptom[0] : symptom;

  // Get the title of the current symptom
  const symptomTitle = symptomTitles[symptomSlug] || 'Unknown Symptom';

  // Render the appropriate symptom checker component
  const renderSymptomChecker = () => {
    switch (symptomSlug) {
      case 'chest-pain':
        return <ChestPain />;
      // Add more cases as you create them:
      // case 'headache':
      //   return <Headache />;
      // case 'cough':
      //   return <Cough />;
      default:
        return (
          <div className="p-4 text-red-500">
            This symptom checker is not yet available. Please check back later.
          </div>
        );
    }
  };

  // If the symptom doesn't exist in our map, show an error
  if (!symptomTitle || symptomTitle === 'Unknown Symptom') {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Symptom Not Found</h1>
          <p className="mb-4">
            The symptom "{symptomSlug}" does not exist or is not yet supported.
          </p>
          <Link href="/" className="text-blue-500 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Symptoms
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        {symptomTitle} Symptom Checker
      </h1>

      {renderSymptomChecker()}
    </div>
  );
}
