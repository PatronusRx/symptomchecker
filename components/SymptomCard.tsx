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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <IconComponent size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex justify-end">
          <button className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
            Check Symptoms
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};

export default SymptomCard;
