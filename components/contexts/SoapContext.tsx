'use client';
// components/contexts/SoapContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SoapSection {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface ApproachData {
  title: string;
  slug: string;
  soapNote: SoapSection;
  timestamp: string;
}

interface PatientInfo {
  name: string;
  dob: string;
  mrn: string;
  visitDate: string;
}

interface SoapContextType {
  approaches: ApproachData[];
  patientInfo: PatientInfo;
  setPatientInfo: (info: PatientInfo) => void;
  addOrUpdateApproach: (approach: ApproachData) => void;
  clearAllData: () => void;
  removeApproach: (slug: string) => void;
  getCombinedSoapNote: () => SoapSection;
}

const SoapContext = createContext<SoapContextType | undefined>(undefined);

export function SoapProvider({ children }: { children: React.ReactNode }) {
  const [approaches, setApproaches] = useState<ApproachData[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: 'New Patient',
    dob: '',
    mrn: '',
    visitDate: new Date().toISOString().split('T')[0],
  });

  // Load from sessionStorage on mount (use sessionStorage to clear on browser close)
  useEffect(() => {
    const savedData = sessionStorage.getItem('soapData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setApproaches(parsed.approaches || []);
      setPatientInfo(
        parsed.patientInfo || {
          name: 'New Patient',
          dob: '',
          mrn: '',
          visitDate: new Date().toISOString().split('T')[0],
        }
      );
    }
  }, []);

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    sessionStorage.setItem(
      'soapData',
      JSON.stringify({
        approaches,
        patientInfo,
      })
    );
  }, [approaches, patientInfo]);

  const addOrUpdateApproach = (approach: ApproachData) => {
    setApproaches((prev) => {
      // Update existing approach or add new one
      const index = prev.findIndex((a) => a.slug === approach.slug);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = approach;
        return updated;
      }
      return [...prev, approach];
    });
  };

  const clearAllData = () => {
    setApproaches([]);
    setPatientInfo({
      name: 'New Patient',
      dob: '',
      mrn: '',
      visitDate: new Date().toISOString().split('T')[0],
    });
  };

  const removeApproach = (slug: string) => {
    setApproaches((prev) => prev.filter((a) => a.slug !== slug));
  };

  const getCombinedSoapNote = (): SoapSection => {
    if (approaches.length === 0) {
      return {
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
      };
    }

    // Combine all approaches into a single SOAP note
    const combined: SoapSection = {
      subjective: approaches
        .map((a) => {
          if (!a.soapNote.subjective) return '';
          return `### ${a.title}\n${a.soapNote.subjective}`;
        })
        .filter((s) => s)
        .join('\n\n'),

      objective: approaches
        .map((a) => {
          if (!a.soapNote.objective) return '';
          return `### ${a.title}\n${a.soapNote.objective}`;
        })
        .filter((s) => s)
        .join('\n\n'),

      assessment: approaches
        .map((a) => {
          if (!a.soapNote.assessment) return '';
          return `### ${a.title}\n${a.soapNote.assessment}`;
        })
        .filter((s) => s)
        .join('\n\n'),

      plan: approaches
        .map((a) => {
          if (!a.soapNote.plan) return '';
          return `### ${a.title}\n${a.soapNote.plan}`;
        })
        .filter((s) => s)
        .join('\n\n'),
    };

    return combined;
  };

  return (
    <SoapContext.Provider
      value={{
        approaches,
        patientInfo,
        setPatientInfo,
        addOrUpdateApproach,
        clearAllData,
        removeApproach,
        getCombinedSoapNote,
      }}
    >
      {children}
    </SoapContext.Provider>
  );
}

export function useSoap() {
  const context = useContext(SoapContext);
  if (context === undefined) {
    throw new Error('useSoap must be used within a SoapProvider');
  }
  return context;
}
