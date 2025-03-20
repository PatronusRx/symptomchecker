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
  indent_level: number;
  is_header: boolean;
  header_level: number | null;
  has_text_input: boolean;
  input_label: string | null;
  input_placeholder: string | null;
  input_unit: string | null;
  icd10_code: string | null;
  // UI state properties
  isCompleted?: boolean;
  response?: '+' | '-' | 'NA' | null;
  notes?: string;
  selectedOptions?: { [key: string]: string | string[] };
  detailNotes?: { [key: string]: string };
  childItems?: ChecklistItem[];
  isExpanded?: boolean;
};

export type ResponseState = {
  [key: number]: {
    response: '+' | '-' | 'NA' | null;
    notes: string;
    selected_options?: { [key: string]: string | string[] };
  };
};
