export type AdminFieldType = "text" | "textarea" | "number" | "boolean" | "email";

export type AdminResourceConfig = {
  slug: string;
  title: string;
  description: string;
  table: string;
  mode: "readonly" | "crud";
  idType: "number" | "string";
  navLabel: string;
  orderBy: string;
  orderAscending?: boolean;
  columns: string[];
  editableFields: string[];
  fieldTypes: Record<string, AdminFieldType>;
};

export const adminResourceConfigs: AdminResourceConfig[] = [
  {
    slug: "users",
    title: "Users",
    description: "Read user profiles and admin flags from the profiles table.",
    table: "profiles",
    mode: "readonly",
    idType: "string",
    navLabel: "Users",
    orderBy: "created_datetime_utc",
    columns: [
      "id",
      "email",
      "first_name",
      "last_name",
      "is_superadmin",
      "is_matrix_admin",
      "is_in_study",
      "created_datetime_utc",
    ],
    editableFields: [],
    fieldTypes: {
      email: "email",
      is_superadmin: "boolean",
      is_matrix_admin: "boolean",
      is_in_study: "boolean",
    },
  },
  {
    slug: "terms",
    title: "Terms",
    description: "Create, edit, and delete glossary terms used by the humor system.",
    table: "terms",
    mode: "crud",
    idType: "number",
    navLabel: "Terms",
    orderBy: "priority",
    orderAscending: false,
    columns: ["id", "term", "definition", "example", "priority", "term_type_id"],
    editableFields: ["term", "definition", "example", "priority", "term_type_id"],
    fieldTypes: {
      term: "text",
      definition: "textarea",
      example: "textarea",
      priority: "number",
      term_type_id: "number",
    },
  },
  {
    slug: "humor-flavor-mix",
    title: "Humor Flavor Mix",
    description: "Review and update humor flavor mix rows and caption counts.",
    table: "humor_flavor_mix",
    mode: "crud",
    idType: "number",
    navLabel: "Flavor Mix",
    orderBy: "modified_datetime_utc",
    orderAscending: false,
    columns: [
      "id",
      "humor_flavor_id",
      "caption_count",
      "created_datetime_utc",
      "modified_datetime_utc",
    ],
    editableFields: ["humor_flavor_id", "caption_count"],
    fieldTypes: {
      humor_flavor_id: "number",
      caption_count: "number",
    },
  },
  {
    slug: "captions",
    title: "Captions",
    description: "Read generated captions, visibility flags, and request linkage.",
    table: "captions",
    mode: "readonly",
    idType: "string",
    navLabel: "Captions",
    orderBy: "created_datetime_utc",
    orderAscending: false,
    columns: [
      "id",
      "content",
      "is_public",
      "is_featured",
      "like_count",
      "profile_id",
      "image_id",
      "humor_flavor_id",
      "caption_request_id",
      "llm_prompt_chain_id",
    ],
    editableFields: [],
    fieldTypes: {
      content: "textarea",
      is_public: "boolean",
      is_featured: "boolean",
      like_count: "number",
    },
  },
  {
    slug: "caption-requests",
    title: "Caption Requests",
    description: "Read caption request records and image/profile associations.",
    table: "caption_requests",
    mode: "readonly",
    idType: "number",
    navLabel: "Requests",
    orderBy: "created_datetime_utc",
    orderAscending: false,
    columns: ["id", "profile_id", "image_id", "created_datetime_utc", "modified_datetime_utc"],
    editableFields: [],
    fieldTypes: {},
  },
  {
    slug: "caption-examples",
    title: "Caption Examples",
    description: "Create, edit, and remove example captions used for reference.",
    table: "caption_examples",
    mode: "crud",
    idType: "number",
    navLabel: "Examples",
    orderBy: "created_datetime_utc",
    orderAscending: false,
    columns: ["id", "image_description", "caption", "explanation", "priority", "image_id"],
    editableFields: ["image_description", "caption", "explanation", "priority", "image_id"],
    fieldTypes: {
      image_description: "textarea",
      caption: "textarea",
      explanation: "textarea",
      priority: "number",
      image_id: "text",
    },
  },
  {
    slug: "llm-models",
    title: "LLM Models",
    description: "Manage the available language models and provider model IDs.",
    table: "llm_models",
    mode: "crud",
    idType: "number",
    navLabel: "LLM Models",
    orderBy: "created_datetime_utc",
    orderAscending: false,
    columns: ["id", "name", "llm_provider_id", "provider_model_id", "is_temperature_supported"],
    editableFields: ["name", "llm_provider_id", "provider_model_id", "is_temperature_supported"],
    fieldTypes: {
      name: "text",
      llm_provider_id: "number",
      provider_model_id: "text",
      is_temperature_supported: "boolean",
    },
  },
  {
    slug: "llm-providers",
    title: "LLM Providers",
    description: "Create, edit, and delete model providers.",
    table: "llm_providers",
    mode: "crud",
    idType: "number",
    navLabel: "Providers",
    orderBy: "created_datetime_utc",
    orderAscending: false,
    columns: ["id", "name", "created_datetime_utc", "modified_datetime_utc"],
    editableFields: ["name"],
    fieldTypes: {
      name: "text",
    },
  },
  {
    slug: "llm-prompt-chains",
    title: "LLM Prompt Chains",
    description: "Read prompt-chain records linked to caption requests.",
    table: "llm_prompt_chains",
    mode: "readonly",
    idType: "number",
    navLabel: "Prompt Chains",
    orderBy: "created_datetime_utc",
    orderAscending: false,
    columns: ["id", "caption_request_id", "created_datetime_utc", "modified_datetime_utc"],
    editableFields: [],
    fieldTypes: {},
  },
  {
    slug: "llm-model-responses",
    title: "LLM Model Responses",
    description: "Read raw model responses, prompts, timing, and prompt-chain linkage.",
    table: "llm_model_responses",
    mode: "readonly",
    idType: "string",
    navLabel: "Responses",
    orderBy: "created_datetime_utc",
    orderAscending: false,
    columns: [
      "id",
      "created_datetime_utc",
      "llm_model_response",
      "processing_time_seconds",
      "llm_model_id",
      "profile_id",
      "caption_request_id",
      "humor_flavor_id",
      "llm_prompt_chain_id",
      "humor_flavor_step_id",
      "llm_temperature",
      "llm_system_prompt",
      "llm_user_prompt",
    ],
    editableFields: [],
    fieldTypes: {
      llm_model_response: "textarea",
      processing_time_seconds: "number",
      llm_temperature: "number",
      llm_system_prompt: "textarea",
      llm_user_prompt: "textarea",
    },
  },
  {
    slug: "signup-domains",
    title: "Allowed Signup Domains",
    description: "Manage the apex domains allowed during signup.",
    table: "allowed_signup_domains",
    mode: "crud",
    idType: "number",
    navLabel: "Domains",
    orderBy: "created_datetime_utc",
    orderAscending: false,
    columns: ["id", "apex_domain", "created_datetime_utc", "modified_datetime_utc"],
    editableFields: ["apex_domain"],
    fieldTypes: {
      apex_domain: "text",
    },
  },
  {
    slug: "whitelisted-email-addresses",
    title: "Whitelisted E-mail Addresses",
    description: "Create, edit, and delete individually whitelisted email addresses.",
    table: "whitelist_email_addresses",
    mode: "crud",
    idType: "number",
    navLabel: "Whitelist",
    orderBy: "created_datetime_utc",
    orderAscending: false,
    columns: ["id", "email_address", "created_datetime_utc", "modified_datetime_utc"],
    editableFields: ["email_address"],
    fieldTypes: {
      email_address: "email",
    },
  },
];

export function getAdminResourceConfig(slug: string) {
  return adminResourceConfigs.find((config) => config.slug === slug) ?? null;
}

export function normalizeAdminValue(
  value: unknown,
  fieldType: AdminFieldType | undefined
): string | number | boolean | null {
  if (fieldType === "boolean") {
    return Boolean(value);
  }

  if (fieldType === "number") {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return Number(value);
  }

  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return String(value);
}

export function parseAdminId(id: string, idType: "number" | "string") {
  return idType === "number" ? Number(id) : id;
}
