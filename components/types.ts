export type Chapter = {
  id: number;
  chapter_number: number;
  title: string;
};

export type Category = {
  id: number;
  category_number: number;
  title: string;
  display_order: number;
};

export type Section = {
  id: number;
  chapter_id: number;
  category_id: number;
  title: string;
  display_order: number;
};

export type ChecklistItem = {
  id: number;
  section_id: number;
  parent_item_id: number | null;
  display_order: number;
  item_text: string;
  has_text_input: boolean;
  input_label: string | null;
  input_placeholder: string | null;
  input_unit: string | null;
  isCompleted?: boolean;
  response?: '+' | '-' | 'NA' | null;
  notes?: string;
  selectedOptions?: { [key: string]: string | string[] };
  detailNotes?: { [key: string]: string };
  childItems?: ChecklistItem[];
};

export type ResponseState = {
  [key: number]: {
    response: '+' | '-' | 'NA' | null;
    notes: string;
    selected_options?: { [key: string]: string | string[] };
  };
};

export interface PatientInfo {
  name: string;
  dob: string;
  mrn: string;
  visitDate: string;
}

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}
