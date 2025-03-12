// components/SymptomCard.tsx
import React from 'react';
import {
  Activity,
  Heart,
  Brain,
  Stethoscope,
  Thermometer,
  Sparkles,
  Wind,
  Moon,
  Pill,
  Droplets,
  ArrowRight,
} from 'lucide-react';

// Map of icon names to components
const iconMap = {
  heart: Heart,
  brain: Brain,
  lungs: Wind,
  stethoscope: Stethoscope,
  activity: Activity,
  thermometer: Thermometer,
  sparkles: Sparkles,
  wind: Wind,
  moon: Moon,
  pill: Pill,
  droplets: Droplets,
};

interface SymptomCardProps {
  title: string;
  description: string;
  iconName: string;
  onClick: () => void;
}

const SymptomCard: React.FC<SymptomCardProps> = ({
  title,
  description,
  iconName,
  onClick,
}) => {
  // Get the icon component from the map or default to Activity
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Activity;

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <div className="mr-4 text-blue-500">
          <IconComponent size={24} />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 text-right">
        <button className="text-blue-500 font-medium hover:underline flex items-center justify-end">
          Check Symptoms <ArrowRight className="ml-1" size={16} />
        </button>
      </div>
    </div>
  );
};

export default SymptomCard;
