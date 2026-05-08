export const DEFAULT_AUDIENCES = [
  'SDRs',
  'BDRs',
  'AEs',
  'SEs',
  'CSMs',
  'AMs',
  'Sales Managers',
  'Frontline Managers',
  'Sales Leaders',
  'RevOps',
  'Enablement',
  'Marketing',
];

export const DEFAULT_TECHNOLOGIES = [
  'OpenAI / ChatGPT',
  'Claude',
  'Claude CoWork',
  'Claude Code',
  'Google Gemini',
  'Custom RAG',
  'Internal LLM gateway',
  'Cursor',
  'GitHub',
  'Neon',
  'Railway',
  'Salesforce Einstein',
  'HubSpot AI',
  'Gong',
  'Chorus',
  'Avoma',
  'Clari',
  'Outreach',
  'Salesloft',
  'Apollo',
  'Snowflake',
  'Databricks',
  'BigQuery',
  'n8n',
  'Zapier',
  'Make',
  'Other',
];

export const DEFAULT_SYSTEMS = [
  'Salesforce',
  'HubSpot CRM',
  'Microsoft Dynamics',
  'Outreach',
  'Salesloft',
  'Apollo',
  'Gong',
  'Chorus',
  'Avoma',
  'Clari',
  'Slack',
  'Microsoft Teams',
  'GitHub',
  'Google Workspace',
  'Microsoft 365',
  'Zoom',
  'Snowflake',
  'Looker',
  'Tableau',
  'Other',
];

export const DEFAULT_LEVEL3_METRICS = [
  'ARR growth',
  'Net New ARR',
  'Expansion ARR',
  'Net Revenue Retention',
  'Gross Revenue Retention',
  'Logo Retention',
  'Win Rate',
  'Sales Cycle Length',
  'Average Deal Size',
  'Pipeline Coverage',
  'CAC',
  'CAC Payback',
  'Quota Attainment',
  'Productivity per Rep',
];

export type PicklistKind =
  | 'audiences'
  | 'technologies'
  | 'systems'
  | 'level3Metrics';

export const DEFAULTS_BY_KIND: Record<PicklistKind, string[]> = {
  audiences: DEFAULT_AUDIENCES,
  technologies: DEFAULT_TECHNOLOGIES,
  systems: DEFAULT_SYSTEMS,
  level3Metrics: DEFAULT_LEVEL3_METRICS,
};
