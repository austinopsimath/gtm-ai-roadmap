import { createWorkstream, type Path, type Workstream } from '../types';

interface WorkstreamTemplate {
  name: string;
  description: string;
}

const BUILD_WORKSTREAMS: WorkstreamTemplate[] = [
  {
    name: 'Architecture & Design',
    description: 'Data flow, model selection, system design',
  },
  {
    name: 'Hands-on Development',
    description: 'Writing and testing the core solution',
  },
  {
    name: 'Integration & API Management',
    description:
      'Connecting to CRM, SEP, warehouse, and other systems; managing API keys and credentials',
  },
  {
    name: 'QA & Internal Testing',
    description: 'Functional testing against the pilot plan spec',
  },
  {
    name: 'Enablement Brief',
    description: 'Drafting the rep-facing guide for pilot onboarding',
  },
  {
    name: 'Project Coordination',
    description: 'Timeline tracking, blocker escalation, status communication',
  },
];

const BUY_WORKSTREAMS: WorkstreamTemplate[] = [
  {
    name: 'Vendor Evaluation & Selection',
    description: 'Finalizing vendor choice; completing security and IT review',
  },
  {
    name: 'Legal & Procurement',
    description: 'Contracting, DPA, MSA, order form',
  },
  {
    name: 'Technical Onboarding',
    description:
      'SSO setup, CRM integration, API key provisioning, data connections',
  },
  {
    name: 'Configuration',
    description: 'Customizing the product to the pilot use case',
  },
  {
    name: 'Integration & API Management',
    description: 'Connecting vendor to internal systems; managing credentials',
  },
  {
    name: 'Enablement Brief',
    description: 'Drafting the rep-facing guide for pilot onboarding',
  },
  {
    name: 'Project Coordination',
    description: 'Timeline tracking, blocker escalation, status communication',
  },
];

export function frameworkWorkstreamsFor(path: Path): Workstream[] {
  const templates = path === 'build' ? BUILD_WORKSTREAMS : BUY_WORKSTREAMS;
  return templates.map((t) =>
    createWorkstream({ name: t.name, description: t.description }),
  );
}
