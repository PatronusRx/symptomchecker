import {
  ChecklistItem,
  Chapter,
  Category,
  Section,
} from '../../types/symptomChecker';

import {
  generateSubjectiveSectionWithItems,
  generateObjectiveSectionWithItems,
  generateAssessmentSectionWithItems,
  generatePlanSectionWithItems,
} from './SoapNoteGenerationUtils';

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export class SoapNoteGenerator {
  /**
   * Generate a complete SOAP note from checklist items
   */
  static generateNote(
    items: ChecklistItem[],
    categories: Category[],
    sections: Section[],
    chapter: Chapter | null,
    duration: string
  ): SoapNote {
    // Generate each section of the SOAP note
    const subjective = generateSubjectiveSectionWithItems(
      items,
      categories,
      sections,
      chapter,
      duration
    );

    const objective = generateObjectiveSectionWithItems(
      items,
      categories,
      sections
    );

    const assessment = generateAssessmentSectionWithItems(
      items,
      categories,
      sections,
      chapter,
      duration
    );

    const plan = generatePlanSectionWithItems(items, categories, sections);

    // Return the complete SOAP note
    return {
      subjective,
      objective,
      assessment,
      plan,
    };
  }

  /**
   * Format the SOAP note for clipboard copying
   */
  static formatForClipboard(
    soapNote: SoapNote,
    patientInfo: {
      name: string;
      mrn?: string;
      visitDate?: string;
    }
  ): string {
    return `SOAP NOTE - ${patientInfo.name} ${
      patientInfo.mrn ? `(${patientInfo.mrn})` : ''
    } ${patientInfo.visitDate ? `- ${patientInfo.visitDate}` : ''}
    
SUBJECTIVE:
${soapNote.subjective || 'No subjective data recorded.'}

OBJECTIVE:
${soapNote.objective || 'No objective data recorded.'}

ASSESSMENT:
${soapNote.assessment || 'No assessment data recorded.'}

PLAN:
${soapNote.plan || 'No plan data recorded.'}`;
  }
}
