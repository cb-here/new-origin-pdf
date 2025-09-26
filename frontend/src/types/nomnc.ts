export const SERVICE_TYPE_OPTIONS = [
  "Occuptional Therapy",
  "Speech Therapy",
  "Skilled Nursing",
  "Physical Therapy",
];

export const NOMNC_FIELD_SPEC = [
  {
    key: "patient_number",
    label: "Patient number",
    type: "short_text",
    page: 1,
    required: true,
    validation: { max_length: 30 },
  },
  {
    key: "patient_name",
    label: "Patient name",
    type: "short_text",
    page: 1,
    required: true,
  },
  {
    key: "effective_date",
    label: "Effective date (coverage ends)",
    type: "date",
    page: 1,
    required: true,
  },
  {
    key: "current_service_type",
    label: "Current service type",
    type: "select",
    options: SERVICE_TYPE_OPTIONS,
    allow_custom_option: true,
    page: 1,
    required: true,
  },
  {
    key: "plan_contact_info",
    label: "Plan contact information",
    type: "textarea",
    page: 2,
    required: false,
    placeholder: "Plan name, phone, email, address",
  },
  {
    key: "additional_info",
    label: "Additional information (Optional)",
    type: "textarea",
    page: 2,
    required: false,
  },
  {
    key: "sig_patient_or_rep",
    label: "Signature of patient or representative",
    type: "signature",
    page: 2,
    required: true,
  },
  {
    key: "sig_date",
    label: "Date",
    type: "date",
    page: 2,
    required: true,
  },
];
