// AI GTM Motions Taxonomy
// Categories map to the Bowtie funnel stages plus cross-cutting foundations.
// IDs are path-based (category.subcategory.motion-slug) to avoid collisions
// between identically-named motions in different categories
// (e.g., "Account Planning" appears in both Awareness and Education).

export type MotionFunnel = 'acquisition' | 'expansion' | 'foundations';

export interface MotionItem {
  id: string;
  label: string;
}

export interface MotionSubcategory {
  id: string;
  label: string;
  motions: MotionItem[];
}

export interface MotionCategory {
  id: string;
  label: string;
  funnel: MotionFunnel;
  subcategories: MotionSubcategory[];
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const motion = (categoryId: string, subId: string, label: string): MotionItem => ({
  id: `${categoryId}.${subId}.${slug(label)}`,
  label,
});

const sub = (
  categoryId: string,
  label: string,
  motions: string[],
): MotionSubcategory => {
  const id = slug(label);
  return {
    id,
    label,
    motions: motions.map((m) => motion(categoryId, id, m)),
  };
};

const cat = (
  id: string,
  label: string,
  funnel: MotionFunnel,
  subcategories: MotionSubcategory[],
): MotionCategory => ({ id, label, funnel, subcategories });

export const MOTIONS_TAXONOMY: MotionCategory[] = [
  cat('awareness', 'Awareness', 'acquisition', [
    sub('awareness', 'Market Strategy', [
      'Annual / Strategic Planning',
      'ICP Definition & Refinement',
      'Market Segmentation',
      'TAM Analysis',
      'Territory Design',
      'Account Planning',
      'Persona Targeting',
      'Buying Committee Discovery',
    ]),
    sub('awareness', 'Demand Generation', [
      'Marketing Campaign Mgmt',
      'Event Planning',
      'Advertising Optimization',
      'SEO / Content Strategy',
      'Social Engagement',
      'Conversational Marketing',
      'Form Capture',
      'Inbound Conversion Optimization',
      'Partner / Channel Sourcing',
    ]),
    sub('awareness', 'Outbound Prospecting', [
      'Sequencing',
      'Cold Calling',
      'Social Selling',
      'Outbound Personalization',
      'Email Personalization',
      'Sales Cadence Optimization',
    ]),
    sub('awareness', 'Signal Intelligence', [
      'Account Scoring & Prioritization',
      'Intent Signal Monitoring',
      'Website Visitor Identification',
      'Trigger Event Detection',
      'Lead Enrichment',
      'Lead-to-Account Matching',
      'Account Positioning',
      'Pipeline Generation Analytics',
      'Competitive Intelligence',
    ]),
  ]),

  cat('education', 'Education', 'acquisition', [
    sub('education', 'Lead Mgmt', [
      'Lead Routing',
      'SDR-to-AE Handoff',
      'Meeting Scheduling Coordination',
      'Qualification Enforcement',
      'Opportunity Qualification',
      'MEDDICC Guidance',
    ]),
    sub('education', 'Discovery Preparation', [
      'Pre-Discovery Preparation',
      'Buyer Research',
      'Persona Research',
      'Stakeholder Mapping',
      'Account Planning',
      'Account Positioning',
      'Competitive Positioning',
    ]),
    sub('education', 'Discovery Execution', [
      'Discovery Call Mgmt',
      'In-Call Tips',
      'Objection Handling',
      'Pain Point Identification',
      'Technical Discovery',
      'Use Case Discovery',
      'Mutual Action Plan Initiation',
    ]),
    sub('education', 'Conversation Intelligence', [
      'Call Summarization',
      'Conversation Intelligence',
      'Methodology Adherence',
      'Post-Call Follow-up',
      'Discovery Gap Identification',
      'Action Item Extraction',
      'Internal Rep Coaching',
    ]),
    sub('education', 'Opportunity Qualification', [
      'Buying Process Mapping',
      'Stakeholder Consensus Mapping',
      'Qualification Scoring',
      'Fit Scoring',
      'Buying Committee Analysis',
      'Consensus Building',
      'RFP Mgmt',
    ]),
  ]),

  cat('selection', 'Selection', 'acquisition', [
    sub('selection', 'Solution Validation', [
      'Demos',
      'Technical Validations',
      'POCs',
      'Proof-of-Value Tracking',
      'Security Reviews',
      'Reference Architectures',
    ]),
    sub('selection', 'Deal Strategy', [
      'Opportunity Risk Analysis',
      'Next Best Action Tips',
      'Champion Development',
      'Multithreading',
      'Competitive Deal Strategy',
      'Deal Coaching',
      'Close Plan Mgmt',
      'Stakeholder Consensus Analysis',
      'Red Flag Detection',
      'Decision Criteria Tracking',
      'Mutual Action Plan Tracking',
      'Mutual Evaluation Mgmt',
    ]),
    sub('selection', 'Executive Alignment', [
      'Business Case Narratives',
      'ROI Modeling',
      'Executive Presentations',
      'Case Study Mgmt',
      'Reference Customer Mgmt',
      'Buying Committee Sentiment Analysis',
      'Reference Management',
    ]),
    sub('selection', 'Commercial Mgmt', [
      'Quotes & Proposals',
      'Pricing Optimization',
      'Negotiation Support',
      'Procurement Mgmt',
      'CPQ / Contract Mgmt',
      'Forecast Inspection',
      'Pipeline Confidence Analysis',
    ]),
    sub('selection', 'Contracting', [
      'Legal Review Mgmt',
      'Redlining Mgmt',
      'Contract Workflow Mgmt',
      'Approval Orchestration',
    ]),
  ]),

  cat('onboard', 'Onboard', 'expansion', [
    sub('onboard', 'Implementation Mgmt', [
      'CS Handoff',
      'Sales-to-CS Handoff',
      'Customer Success Planning',
      'Professional Services Mgmt',
      'Implementation Planning',
      'Project Mgmt',
      'Resource Coordination',
      'Escalation Mgmt',
    ]),
    sub('onboard', 'Technical Onboarding', [
      'Integration Deployment',
      'Data Migration',
      'User Provisioning',
      'Environment Configuration',
      'Security Configuration',
    ]),
    sub('onboard', 'Training & Enablement', [
      'Customer Onboarding',
      'Admin Enablement',
      'Training Delivery',
      'Stakeholder Training',
      'Adoption Guidance',
      'Change Management',
    ]),
    sub('onboard', 'Go-Live Mgmt', [
      'Go-Live Readiness',
      'Launch Coordination',
      'Deployment Tracking',
      'Time-to-Value Monitoring',
      'Adoption Tracking',
    ]),
  ]),

  cat('impacting', 'Impacting', 'expansion', [
    sub('impacting', 'Adoption Monitoring', [
      'Product Adoption Monitoring',
      'Usage Pattern Analysis',
      'Feature Recommendation',
      'Adoption Scoring',
      'Usage Gap Analysis',
    ]),
    sub('impacting', 'Customer Health', [
      'Customer Health Scoring',
      'Customer Account Risk Mgmt',
      'Renewal Risk Detection',
      'Churn Risk Mgmt',
      'Support Escalation Prediction',
      'Customer Sentiment Analysis',
    ]),
    sub('impacting', 'Value Realization', [
      'Value Realization & ROI',
      'Value Realization Tracking',
      'KPI Tracking',
      'Outcome Benchmarking',
      'Success Plan Tracking',
    ]),
    sub('impacting', 'Customer Engagement', [
      'QBRs',
      'Executive Business Reviews',
      'Customer Success Orchestration',
      'Advocacy Identification',
      'Lifecycle Engagement Mgmt',
      'Voice of Customer Analysis',
      'Customer Journey Orchestration',
    ]),
    sub('impacting', 'Renewal Mgmt', [
      'Renewal Mgmt',
      'Renewal Readiness Assessment',
      'Renewal Forecasting',
      'Renewal Negotiation Support',
    ]),
  ]),

  cat('growth', 'Growth', 'expansion', [
    sub('growth', 'Expansion Identification', [
      'Upsell Identification',
      'Cross-Sell Identification',
      'Expansion Opportunity Scoring',
      'White Space Mapping',
    ]),
    sub('growth', 'Commercial Expansion', [
      'Seat Expansion',
      'Product Expansion',
      'Division / Geographic Expansion',
      'Renewal Expansion Strategy',
      'Expansion Forecasting',
    ]),
    sub('growth', 'Executive Expansion', [
      'Executive Relationship Expansion',
      'Strategic Account Expansion',
      'Multi-Business-Unit Expansion',
      'Installed Base Intelligence',
    ]),
    sub('growth', 'Advocacy & Community', [
      'Annual Reviews',
      'Customer Advocacy Programs',
      'Referral Programs',
      'Community Engagement',
      'Customer Marketing',
      'Customer Reference Programs',
    ]),
  ]),

  cat('operational-foundations', 'Operational Foundations', 'foundations', [
    sub('operational-foundations', 'Revenue Operations', [
      'Compensation Plans',
      'Forecasting',
      'Capacity Planning',
      'Revenue Attribution',
      'Workflow Automation',
      'SLA Monitoring',
      'Territory Operations',
    ]),
    sub('operational-foundations', 'Data & Infrastructure', [
      'CRM Hygiene / Enrichment',
      'Systems Integrations',
      'Identity Resolution',
      'Warehouse Mgmt',
      'Data Governance',
      'System Administration',
      'Master Data Mgmt',
      'Identity & Access Mgmt',
    ]),
    sub('operational-foundations', 'Analytics & Forecasting', [
      'Revenue Analytics',
      'Pipeline Analytics',
      'Pipeline Coverage Analysis',
      'Data Visualization',
      'Executive Reporting',
      'Predictive Analytics',
    ]),
    sub('operational-foundations', 'AI Governance', [
      'AI Governance',
      'Prompt Governance',
      'Model Governance',
      'Compliance Monitoring',
      'Risk Mgmt',
      'AI Vendor Management',
      'Model Evaluation & QA',
    ]),
    sub('operational-foundations', 'Knowledge Systems', [
      'Knowledge Mgmt',
      'Knowledge Retrieval',
      'Contextual Assistance',
      'Workspace Copilots',
      'Agent Orchestration',
    ]),
  ]),

  cat('enablement-foundations', 'Enablement Foundations', 'foundations', [
    sub('enablement-foundations', 'Learning Systems', [
      'Learning Mgmt',
      'Certification Programs',
      'AI-Assisted Training',
      'New Hire Onboarding Mgmt',
    ]),
    sub('enablement-foundations', 'Coaching', [
      'Role Plays',
      'Skill Coaching',
      'Call Coaching',
      'Manager Coaching',
      'Conversation Review',
      'Just-in-Time Enablement',
    ]),
    sub('enablement-foundations', 'Methodology Reinforcement', [
      'Playbook Reinforcement',
      'Messaging Governance',
      'Best Practice Dissemination',
      'Rep Benchmarking',
      'Win/Loss Analysis',
      'Behavioral Reinforcement',
    ]),
    sub('enablement-foundations', 'Performance Optimization', [
      'Skill Gap Analysis',
      'Performance Benchmarking',
      'Coaching Recommendation Systems',
      'Rep Productivity Analysis',
      'Manager Inspection Systems',
    ]),
    sub('enablement-foundations', 'Knowledge & Content', [
      'Content / Knowledge Mgmt',
      'Battlecard Mgmt',
      'Sales Asset Mgmt',
      'Content Recommendation Systems',
      'Knowledge Retrieval Systems',
    ]),
  ]),
];

export const MOTIONS_BY_ID: Map<string, { motion: MotionItem; category: MotionCategory; subcategory: MotionSubcategory }> =
  (() => {
    const map = new Map<
      string,
      {
        motion: MotionItem;
        category: MotionCategory;
        subcategory: MotionSubcategory;
      }
    >();
    for (const c of MOTIONS_TAXONOMY) {
      for (const s of c.subcategories) {
        for (const m of s.motions) {
          map.set(m.id, { motion: m, category: c, subcategory: s });
        }
      }
    }
    return map;
  })();

export function findMotion(id: string) {
  return MOTIONS_BY_ID.get(id);
}
