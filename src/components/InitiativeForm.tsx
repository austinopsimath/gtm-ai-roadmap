import { useState, type FormEvent } from 'react';
import {
  HEALTH_LABELS,
  PATH_LABELS,
  STAGE_LABELS,
  STAGE_ORDER,
  calculatePriorityScore,
  type Health,
  type Initiative,
  type Path,
  type Stage,
} from '../types';

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
  audiencesServed: string;
  technologies: string;
  systemsTouched: string;
  caret: { c: number; a: number; r: number; e: number; t: number };
  level3Metric: string;
  intakeDate: string | null;
  pilotStartDate: string | null;
  gaDate: string | null;
  lastReviewedDate: string | null;
}

export default function InitiativeForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [values, setValues] = useState<InitiativeFormValues>({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    stage: initial?.stage ?? 'prioritize',
    health: initial?.health ?? 'green',
    initiativeOwner: initial?.initiativeOwner ?? '',
    executiveSponsor: initial?.executiveSponsor ?? '',
    path: initial?.path ?? null,
    audiencesServed: initial?.audiencesServed ?? '',
    technologies: initial?.technologies ?? '',
    systemsTouched: initial?.systemsTouched ?? '',
    caret: initial?.caret ?? { c: 0, a: 0, r: 0, e: 0, t: 0 },
    level3Metric: initial?.level3Metric ?? '',
    intakeDate: initial?.intakeDate ?? null,
    pilotStartDate: initial?.pilotStartDate ?? null,
    gaDate: initial?.gaDate ?? null,
    lastReviewedDate: initial?.lastReviewedDate ?? null,
  });

  const priorityScore = calculatePriorityScore(values.caret);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!values.name.trim()) return;
    onSubmit(values);
  };

  const setField = <K extends keyof InitiativeFormValues>(
    key: K,
    value: InitiativeFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const setCARET = (key: keyof InitiativeFormValues['caret'], value: number) =>
    setValues((prev) => ({ ...prev, caret: { ...prev.caret, [key]: value } }));

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
        <Field
          label="Audiences served"
          help="Specific roles and segments — e.g., 'Enterprise AEs, EMEA' or 'All SDRs'"
        >
          <input
            type="text"
            value={values.audiencesServed}
            onChange={(e) => setField('audiencesServed', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field
          label="Technologies / Vendors"
          help="e.g., Gong, custom RAG on Snowflake, Clari"
        >
          <input
            type="text"
            value={values.technologies}
            onChange={(e) => setField('technologies', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field
          label="Systems touched"
          help="Every system this initiative reads from, writes to, or sits alongside"
        >
          <input
            type="text"
            value={values.systemsTouched}
            onChange={(e) => setField('systemsTouched', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field
          label="Level 3 metric targeted"
          help="The executive-level outcome — e.g., 'win rate', 'NRR', 'attainment'"
        >
          <input
            type="text"
            value={values.level3Metric}
            onChange={(e) => setField('level3Metric', e.target.value)}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section
        title="CARET scoring"
        subtitle="Each factor 1–5 (T is 1.0–1.5). Leave at 0 to score later. Phase 2 will replace this with a guided wizard."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {(
            [
              { key: 'c', label: 'C — Complexity', min: 0, max: 5, step: 1 },
              { key: 'a', label: 'A — Alignment', min: 0, max: 5, step: 1 },
              { key: 'r', label: 'R — Results', min: 0, max: 5, step: 1 },
              { key: 'e', label: 'E — Effort', min: 0, max: 5, step: 1 },
              { key: 't', label: 'T — Timeline', min: 0, max: 1.5, step: 0.1 },
            ] as const
          ).map(({ key, label, min, max, step }) => (
            <Field key={key} label={label}>
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={values.caret[key]}
                onChange={(e) =>
                  setCARET(key, parseFloat(e.target.value) || 0)
                }
                className={inputClass}
              />
            </Field>
          ))}
        </div>
        <div className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">
          Priority score:{' '}
          <span className="font-semibold text-gray-900">
            {priorityScore === null ? '—' : priorityScore.toFixed(2)}
          </span>{' '}
          <span className="text-gray-400">{'( (A × R) / (C × E) × T )'}</span>
        </div>
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
  help,
  required,
  children,
}: {
  label: string;
  help?: string;
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
      {help && <p className="text-xs text-gray-500">{help}</p>}
    </div>
  );
}
