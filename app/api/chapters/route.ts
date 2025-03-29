import { NextResponse } from 'next/server';

// Sample chapters data
const chapters = [
  {
    id: 1,
    chapter_number: 1,
    title: 'Cardiovascular System',
    slug: 'cardiovascular',
    description: 'Chest pain, palpitations, hypertension, etc.',
  },
  {
    id: 2,
    chapter_number: 2,
    title: 'Respiratory System',
    slug: 'respiratory',
    description: 'Shortness of breath, cough, wheezing, etc.',
  },
  {
    id: 3,
    chapter_number: 3,
    title: 'Gastrointestinal System',
    slug: 'gastrointestinal',
    description: 'Abdominal pain, vomiting, diarrhea, etc.',
  },
  {
    id: 4,
    chapter_number: 4,
    title: 'Neurological System',
    slug: 'neurological',
    description: 'Headache, dizziness, seizures, etc.',
  },
  {
    id: 5,
    chapter_number: 5,
    title: 'Musculoskeletal System',
    slug: 'musculoskeletal',
    description: 'Joint pain, back pain, muscle weakness, etc.',
  },
  {
    id: 6,
    chapter_number: 6,
    title: 'Genitourinary System',
    slug: 'genitourinary',
    description: 'Urinary symptoms, genital concerns, etc.',
  },
  {
    id: 7,
    chapter_number: 7,
    title: 'Endocrine System',
    slug: 'endocrine',
    description: 'Diabetes, thyroid disorders, etc.',
  },
  {
    id: 8,
    chapter_number: 8,
    title: 'Dermatological System',
    slug: 'dermatological',
    description: 'Skin rashes, lesions, etc.',
  },
  {
    id: 9,
    chapter_number: 9,
    title: 'Psychiatric Conditions',
    slug: 'psychiatric',
    description: 'Anxiety, depression, psychosis, etc.',
  },
  {
    id: 10,
    chapter_number: 10,
    title: 'Infectious Diseases',
    slug: 'infectious',
    description: 'Fevers, infections, sepsis, etc.',
  },
  {
    id: 11,
    chapter_number: 11,
    title: 'Hematologic Conditions',
    slug: 'hematologic',
    description: 'Anemia, bleeding disorders, etc.',
  },
  {
    id: 12,
    chapter_number: 12,
    title: 'Immunologic Conditions',
    slug: 'immunologic',
    description: 'Allergies, autoimmune disorders, etc.',
  },
  {
    id: 13,
    chapter_number: 13,
    title: 'Ophthalmologic Conditions',
    slug: 'ophthalmologic',
    description: 'Eye pain, vision changes, etc.',
  },
  {
    id: 14,
    chapter_number: 14,
    title: 'ENT Conditions',
    slug: 'ent',
    description: 'Ear pain, sore throat, sinus problems, etc.',
  },
  {
    id: 15,
    chapter_number: 15,
    title: 'Gynecologic Conditions',
    slug: 'gynecologic',
    description: 'Menstrual problems, vaginal complaints, etc.',
  },
  {
    id: 16,
    chapter_number: 16,
    title: 'Obstetric Conditions',
    slug: 'obstetric',
    description: 'Pregnancy-related concerns, etc.',
  },
  {
    id: 17,
    chapter_number: 17,
    title: 'Pediatric Conditions',
    slug: 'pediatric',
    description: 'Child and adolescent-specific conditions',
  },
  {
    id: 18,
    chapter_number: 18,
    title: 'Geriatric Conditions',
    slug: 'geriatric',
    description: 'Elderly-specific health concerns',
  },
];

export async function GET() {
  return NextResponse.json(chapters);
}
