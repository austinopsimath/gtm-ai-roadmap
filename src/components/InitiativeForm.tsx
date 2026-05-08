import { useState, type FormEvent } from 'react';
import {
  HEALTH_LABELS,
  PATH_LABELS,
  STAGE_LABELS,
  STAGE_ORDER,
  todayISO,
  type Health,
  type Initiative,
  type Path,
  type Stage,
} from '../types';
import { useRoadmapStore } from '../store';
import {
  DEFAULT_AUDIENCES,
  DEFAULT_LEVEL3_METRICS,
  DEFAULT_SYSTEMS,
  DEFAULT_TECHNOLOGIES,
} from '../constants/picklists';
import Combobox from './Combobox';

interface Props {
  initial?: Partial<Initiative>;
  submitLabel: string;
  onSubmit: (values: InitiativeFormValues) => void;
  onCancel: () => void;
}

export interface InitiativeFormValues {
  name: string;
  description: string;
  stage: Stage;
  health: Health;
  initiativeOwner: string;
  executiveSponsor: string;
  path: Path | null;
  audiencesServed: string[];
  technologies: string[];
  systemsTouched: string[];
  level3Metric: string;
  intakeDate: string | null;
  deployStartDate: string | null;
  pilotStartDate: string | null;
  gaDate: string | null;
  lastReviewedDate: string | null;
}

const dedupe = (arr: string[]): string[] => Array.from(new Set(arr));

export default function InitiativeForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const customAudiences = useRoadmapStore((s) => s.customAudiences);
  const customTechnologies = useRoadmapStore((s) => s.customTechnologies);
  const customSystems = useRoadmapStore((s) => s.customSystems);
  const customLevel3Metrics = useRoadmapStore((s) => s.customLevel3Metrics);
  const addCustomOption = useRoadmapStore((s) => s.addCustomOption);

  const [values, setValues] = useState<InitiativeFormValues>({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    stage: initial?.stage ?? 'prioritize',
    health: initial?.health ?? 'green',
    initiativeOwner: initial?.initiativeOwner ?? '',
    executiveSponsor: initial?.executiveSponsor ?? '',
    path: initial?.path ?? null,
    audiencesServed: initial?.audiencesServed ?? [],
    technologies: initial?.technologies ?? [],
    systemsTouched: initial?.systemsTouched ?? [],
    level3Metric: initial?.level3Metric ?? '',
    intakeDate: initial?.intakeDate ?? todayISO(),
    deployStartDate: initial?.deployStartDate ?? null,
    pilotStartDate: initial?.pilotStartDate ?? null,
    gaDate: initial?.gaDate ?? null,
    lastReviewedDate: initial?.lastReviewedDate ?? null,
  });

  const audienceOptions = dedupe([...DEFAULT_AUDIENCES, ...customAudiences]);
  const technologyOptions = dedupe([
    ...DEFAULT_TECHNOLOGIES,
    ...customTechnologies,
  ]);
  const systemOptions = dedupe([...DEFAULT_SYSTEMS, ...customSystems]);
  const level3Options = dedupe([
    ...DEFAULT_LEVEL3_METRICS,
    ...customLevel3Metrics,
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!values.name.trim()) return;
    onSubmit(values);
  };

  const setField = <K extends keyof InitiativeFormValues>(
    key: K,
    value: InitiativeFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Section title="Basics">
        <Field label="Name" required>
          <input
            type="text"
            required
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="e.g., AE call summarization with action items"
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={values.description}
            onChange={(e) => setField('description', e.target.value)}
            rows={2}
            placeholder="One-sentence plain-language summary"
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Current stage">
            <select
              value={values.stage}
              onChange={(e) => setField('stage', e.target.value as Stage)}
              className={inputClass}
            >
              {STAGE_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STAGE_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Health">
            <select
              value={values.health}
              onChange={(e) => setField('health', e.target.value as Health)}
              className={inputClass}
            >
              {(['green', 'yellow', 'red'] as Health[]).map((h) => (
                <option key={h} value={h}>
                  {HEALTH_LABELS[h]}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Ownership">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Initiative Owner">
            <input
              type="text"
              value={values.initiativeOwner}
              onChange={(e) => setField('initiativeOwner', e.target.value)}
              placeholder="Named individual"
              className={inputClass}
            />
          </Field>
          <Field label="Executive Sponsor">
            <input
              type="text"
              value={values.executiveSponsor}
              onChange={(e) => setField('executiveSponsor', e.target.value)}
              placeholder="Named leader"
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Scope">
        <Field label="Path">
          <div className="flex gap-3 text-sm">
            {(['build', 'buy'] as Path[]).map((p) => (
              <label key={p} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="path"
                  checked={values.path === p}
                  onChange={() => setField('path', p)}
                />
                {PATH_LABELS[p]}
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="path"
                checked={values.path === null}
                onChange={() => setField('path', null)}
              />
              Not yet decided
            </label>
          </div>
        </Field>
        <Combobox
          mode="multi"
          label="Audiences served"
          options={audienceOptions}
          selected={values.audiencesServed}
          onChange={(v) => setField('audiencesServed', v)}
          onCreateOption={(v) => addCustomOption('audiences', v)}
          help="Specific roles and segments. Pick all that apply, or add your own."
          placeholder="Select audiences..."
        />
        <Combobox
          mode="multi"
          label="Technologies / Vendors for Build"
          options={technologyOptions}
          selected={values.technologies}
          onChange={(v) => setField('technologies', v)}
          onCreateOption={(v) => addCustomOption('technologies', v)}
          help="Tools used to build or power this initiative — LLM platforms, vendor products, dev tooling, infrastructure."
          placeholder="Select technologies..."
        />
        <Combobox
          mode="multi"
          label="Systems Touched During Operation"
          options={systemOptions}
          selected={values.systemsTouched}
          onChange={(v) => setField('systemsTouched', v)}
          onCreateOption={(v) => addCustomOption('systems', v)}
          help="Where this initiative lives in ongoing operations — CRM, SEP, conversation intelligence, communication, and data systems reps use day-to-day."
          placeholder="Select systems..."
        />
        <Combobox
          mode="single"
          label="Level 3 metric targeted"
          options={level3Options}
          selected={values.level3Metric}
          onChange={(v) => setField('level3Metric', v)}
          onCreateOption={(v) => addCustomOption('level3Metrics', v)}
          help="The single executive-level outcome this initiative was funded to move."
          placeholder="Select a metric..."
        />
      </Section>

      <Section title="Key dates">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Intake date">
            <input
              type="date"
              value={values.intakeDate ?? ''}
              onChange={(e) =>
                setField('intakeDate', e.target.value || null)
              }
              className={inputClass}
            />
          </Field>
          <Field label="Deploy start date">
            <input
              type="date"
              value={values.deployStartDate ?? ''}
              onChange={(e) =>
                setField('deployStartDate', e.target.value || null)
              }
              className={inputClass}
            />
          </Field>
          <Field label="Pilot start date">
            <input
              type="date"
              value={values.pilotStartDate ?? ''}
              onChange={(e) =>
                setField('pilotStartDate', e.target.value || null)
              }
              className={inputClass}
            />
          </Field>
          <Field label="GA date">
            <input
              type="date"
              value={values.gaDate ?? ''}
              onChange={(e) => setField('gaDate', e.target.value || null)}
              className={inputClass}
            />
          </Field>
          <Field label="Last reviewed">
            <input
              type="date"
              value={values.lastReviewedDate ?? ''}
              onChange={(e) =>
                setField('lastReviewedDate', e.target.value || null)
              }
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!values.name.trim()}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500';

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        )}
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
