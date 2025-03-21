import React from 'react';

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface PatientInfo {
  name: string;
  dob?: string;
  mrn?: string;
  visitDate?: string;
}

interface SoapNoteDisplayProps {
  soapNote: SoapNote;
  patientInfo: PatientInfo;
  isMobile?: boolean;
}

const SoapNoteDisplay: React.FC<SoapNoteDisplayProps> = ({
  soapNote,
  isMobile = false,
}) => {
  return (
    <div className={`soap-note-display ${isMobile ? 'text-sm' : ''}`}>
      {/* Subjective Section */}
      <div className="mb-6">
        <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
          SUBJECTIVE
        </h3>
        <div className="whitespace-pre-wrap text-sm">
          {soapNote.subjective || 'No subjective data recorded yet.'}
        </div>
      </div>

      {/* Objective Section */}
      <div className="mb-6">
        <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
          OBJECTIVE
        </h3>
        <div className="whitespace-pre-wrap text-sm">
          {soapNote.objective || 'No objective data recorded yet.'}
        </div>
      </div>

      {/* Assessment Section */}
      <div className="mb-6">
        <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
          ASSESSMENT
        </h3>
        <div className="whitespace-pre-wrap text-sm">
          {soapNote.assessment || 'No assessment data recorded yet.'}
        </div>
      </div>

      {/* Plan Section */}
      <div className="mb-6">
        <h3 className="text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
          PLAN
        </h3>
        <div className="whitespace-pre-wrap text-sm">
          {soapNote.plan || 'No plan data recorded yet.'}
        </div>
      </div>
    </div>
  );
};

export default SoapNoteDisplay;
