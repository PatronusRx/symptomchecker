// app/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import SymptomCard from '@/components/SymptomCard';
import { Symptom } from '@/types';

// Define symptoms directly in the home page
const symptoms: Symptom[] = [
  {
    slug: 'chest-pain',
    title: 'Chest Pain',
    description: 'Evaluate chest pain, from cardiac to musculoskeletal causes.',
    icon: '❤️',
    keywords: [
      'heart',
      'cardiac',
      'angina',
      'pressure',
      'tightness',
      'discomfort',
    ],
  },
  {
    slug: 'headache',
    title: 'Headache',
    description:
      'Assess different types of headaches and their potential causes.',
    icon: '🧠',
    keywords: ['migraine', 'tension', 'cluster', 'sinus', 'head pain'],
  },
  {
    slug: 'cough',
    title: 'Cough',
    description: 'Evaluate causes of acute and chronic cough.',
    icon: '🫁',
    keywords: [
      'bronchitis',
      'pneumonia',
      'respiratory',
      'throat',
      'phlegm',
      'mucus',
    ],
  },
  {
    slug: 'abdominal-pain',
    title: 'Abdominal Pain',
    description: 'Evaluate different types of abdominal and digestive pain.',
    icon: '🩻',
    keywords: ['stomach', 'gut', 'digestive', 'belly', 'nausea', 'cramps'],
  },
  // Add more symptoms as needed
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Filter symptoms based on search query
  const filteredSymptoms = symptoms.filter(
    (symptom) =>
      symptom.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symptom.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Handle card click - navigate to the symptom page
  const handleCardClick = (slug: string) => {
    router.push(`/symptoms/${slug}`);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Medical Symptom Checker
      </h1>

      <div className="max-w-xl mx-auto mb-8">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search symptoms (e.g., chest pain, headache, cough...)"
        />
      </div>

      {searchQuery && filteredSymptoms.length === 0 ? (
        <p className="text-center text-gray-600">
          No symptoms found matching "{searchQuery}"
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSymptoms.map((symptom) => (
            <SymptomCard
              key={symptom.slug}
              title={symptom.title}
              description={symptom.description}
              icon={symptom.icon}
              onClick={() => handleCardClick(symptom.slug)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
