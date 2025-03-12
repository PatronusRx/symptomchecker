export interface Chapter {
  id: number;
  chapter_number: number;
  title: string;
}

export interface Category {
  id: number;
  category_number: number;
  title: string;
  display_order: number;
}

export interface Section {
  id: number;
  chapter_id: number;
  category_id: number;
  title: string;
  display_order: number;
}

export interface ChecklistItem {
  id: number;
  section_id: number;
  parent_item_id: number | null;
  display_order: number;
  item_text: string;
  has_text_input: boolean;
  input_label: string | null;
  input_placeholder: string | null;
  input_unit: string | null;
}

// State type for tracking responses
export type ResponseState = {
  [key: number]: {
    response: '+' | '-' | 'NA' | null;
    notes: string;
    selected_options?: { [key: string]: string | string[] };
  };
};

// For SOAP note structure
export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}
