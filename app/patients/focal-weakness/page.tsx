'use client';
import FocalWeaknessTracker from '@/components/patientApproaches/FocalWeakness';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FocalWeaknessPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/patients');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-3 md:px-4 py-2 md:py-3 flex items-center">
        <button
          className="mr-2 md:mr-3 text-blue-500 hover:text-blue-700"
          onClick={handleBackClick}
          aria-label="Back to patients"
        >
          <ArrowLeft size={20} className="md:w-6 md:h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          Focal Weakness Tracker
        </h1>
      </header>

      <FocalWeaknessTracker />
    </div>
  );
}
