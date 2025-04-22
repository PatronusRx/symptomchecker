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

/**
 * SoapNoteDisplay component
 * Renders a formatted SOAP note with Subjective, Objective, Assessment, and Plan sections
 * Displays patient information and medical notes in a clean, readable format
 */
const SoapNoteDisplay: React.FC<SoapNoteDisplayProps> = ({
  soapNote,
  isMobile = false,
}) => {
  return (
    <div className={`soapNoteContainer ${isMobile ? 'text-sm' : ''}`}>
      {/* Subjective Section - Patient's history, symptoms, and complaints */}
      <div className="soapNoteSection subjectiveSection mb-6">
        <h3 className="sectionHeading text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
          SUBJECTIVE
        </h3>
        <div className="sectionContent whitespace-pre-wrap text-sm">
          {soapNote.subjective || 'No subjective data recorded yet.'}
        </div>
      </div>

      {/* Objective Section - Measurable, observable findings */}
      <div className="soapNoteSection objectiveSection mb-6">
        <h3 className="sectionHeading text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
          OBJECTIVE
        </h3>
        <div className="sectionContent whitespace-pre-wrap text-sm">
          {soapNote.objective || 'No objective data recorded yet.'}
        </div>
      </div>

      {/* Assessment Section - Diagnosis and clinical impressions */}
      <div className="soapNoteSection assessmentSection mb-6">
        <h3 className="sectionHeading text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
          ASSESSMENT
        </h3>
        <div className="sectionContent whitespace-pre-wrap text-sm">
          {soapNote.assessment || 'No assessment data recorded yet.'}
        </div>
      </div>

      {/* Plan Section - Treatment plans and next steps */}
      <div className="soapNoteSection planSection mb-6">
        <h3 className="sectionHeading text-md font-bold text-gray-700 mb-2 pb-1 border-b border-gray-200">
          PLAN
        </h3>
        <div className="sectionContent whitespace-pre-wrap text-sm">
          {soapNote.plan || 'No plan data recorded yet.'}
        </div>
      </div>
    </div>
  );
};

export default SoapNoteDisplay;
