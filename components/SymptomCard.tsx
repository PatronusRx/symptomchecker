// components/SymptomCard.tsx
import React from 'react';

interface SymptomCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

const SymptomCard: React.FC<SymptomCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <div className="mr-4 text-blue-500 text-3xl">
          {/* Render icon - this assumes you're using an icon font or SVG */}
          <span dangerouslySetInnerHTML={{ __html: icon }} />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 text-right">
        <button className="text-blue-500 font-medium hover:underline">
          Check Symptoms →
        </button>
      </div>
    </div>
  );
};

export default SymptomCard;
