import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import {
  calculatePriorityScore,
  computeConsensusScores,
  computeFactorAverage,
  createPanelist,
  factorDivergence,
  isNA,
  NA_SCORE,
  type CARETFactor,
  type CARETNotes,
  type Panelist,
} from '../types';
import { FACTOR_ORDER, FACTORS } from '../constants/caret';

type StepKey = 'intro' | 'roster' | CARETFactor | 'review';

const STEP_ORDER: StepKey[] = [
  'intro',
  'roster',
  'c',
  'a',
  'r',
  'e',
  't',
  'review',
];

const STEP_LABEL: Record<StepKey, string> = {
  intro: 'Intro',
  roster: 'Panel',
  c: 'C',
  a: 'A',
  r: 'R',
  e: 'E',
  t: 'T',
  review: 'Review',
};

export default function ScoreInitiative() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const initiative = useRoadmapStore((s) =>
    s.initiatives.find((i) => i.id === id),
  );
  const updateInitiative = useRoadmapStore((s) => s.updateInitiative);

  const [stepIdx, setStepIdx] = useState(0);
  const [panelists, setPanelists] = useState<Panelist[]>(() =>
    initiative?.panelists && initiative.panelists.length > 0
      ? initiative.panelists.map((p) => ({ ...p, scores: { ...p.scores } }))
      : [createPanelist({ name: '', role: '' })],
  );
  const [notes, setNotes] = useState<CARETNotes>(
    () => initiative?.caretNotes ?? { c: '', a: '', r: '', e: '', t: '' },
  );
  const [scoredBy, setScoredBy] = useState(initiative?.scoredBy ?? '');

  if (!initiative) return <Navigate to="/" replace />;

  const step = STEP_ORDER[stepIdx];
  const isLast = step === 'review';
  const isFirst = step === 'intro';

  const validPanelists = panelists.filter((p) => p.name.trim());
  const canAdvanceFromRoster = validPanelists.length > 0;

  const goNext = () =>
    setStepIdx((idx) => Math.min(STEP_ORDER.length - 1, idx + 1));
  const goPrev = () => setStepIdx((idx) => Math.max(0, idx - 1));

  const handleSave = () => {
    const cleanedPanelists = panelists.filter((p) => p.name.trim());
    updateInitiative(initiative.id, {
      panelists: cleanedPanelists,
      caret: computeConsensusScores(cleanedPanelists),
      caretNotes: notes,
      scoredAt: new Date().toISOString(),
      scoredBy,
    });
    navigate(`/initiatives/${initiative.id}`);
  };

  const setPanelistField = (
    id: string,
    field: 'name' | 'role',
    value: string,
  ) => {
    setPanelists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const setPanelistScore = (
    id: string,
    factor: CARETFactor,
    value: number,
  ) => {
    setPanelists((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, scores: { ...p.scores, [factor]: value } } : p,
      ),
    );
  };

  const addPanelist = () =>
    setPanelists((prev) => [...prev, createPanelist({ name: '', role: '' })]);

  const removePanelist = (id: string) =>
    setPanelists((prev) => prev.filter((p) => p.id !== id));

  const setNote = (factor: CARETFactor, value: string) =>
    setNotes((prev) => ({ ...prev, [factor]: value }));

  const consensus = useMemo(
    () => computeConsensusScores(validPanelists),
    [validPanelists],
  );
  const previewScore = calculatePriorityScore(consensus);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-2">
        <Link
          to={`/initiatives/${initiative.id}`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to initiative
        </Link>
      </div>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Score with CARET
        </h1>
        <p className="mt-1 text-sm text-gray-600">{initiative.name}</p>
      </header>

      <ProgressBar stepIdx={stepIdx} />

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-8">
        {step === 'intro' && (
          <IntroStep
            scoredBy={scoredBy}
            onScoredByChange={setScoredBy}
            hasPriorScores={panelists.some((p) =>
              FACTOR_ORDER.some((f) => p.scores[f] > 0),
            )}
          />
        )}
        {step === 'roster' && (
          <RosterStep
            panelists={panelists}
            onChangeField={setPanelistField}
            onAdd={addPanelist}
            onRemove={removePanelist}
          />
        )}
        {(['c', 'a', 'r', 'e', 't'] as CARETFactor[]).includes(
          step as CARETFactor,
        ) && (
          <FactorStep
            factor={step as CARETFactor}
            panelists={validPanelists}
            note={notes[step as CARETFactor]}
            onScoreChange={setPanelistScore}
            onNoteChange={(v) => setNote(step as CARETFactor, v)}
          />
        )}
        {step === 'review' && (
          <ReviewStep
            panelists={validPanelists}
            notes={notes}
            scoredBy={scoredBy}
            previewScore={previewScore}
          />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => navigate(`/initiatives/${initiative.id}`)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
        <div className="flex gap-2">
          {!isFirst && (
            <button
              onClick={goPrev}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          {!isLast && (
            <button
              onClick={goNext}
              disabled={step === 'roster' && !canAdvanceFromRoster}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === 'intro'
                ? 'Set up panel'
                : step === 'roster'
                  ? 'Begin scoring'
                  : 'Next factor'}
            </button>
          )}
          {isLast && (
            <button
              onClick={handleSave}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Save scores
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ stepIdx }: { stepIdx: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {STEP_ORDER.map((key, idx) => (
          <div
            key={key}
            className={`h-1 flex-1 rounded-full ${
              idx <= stepIdx ? 'bg-gray-900' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
        {STEP_ORDER.map((key, idx) => (
          <div
            key={key}
            className={`flex-1 text-center ${
              idx === stepIdx
                ? 'font-semibold text-gray-900'
                : idx < stepIdx
                  ? 'text-gray-500'
                  : 'text-gray-300'
            }`}
          >
            {STEP_LABEL[key]}
          </div>
        ))}
      </div>
    </div>
  );
}

function IntroStep({
  scoredBy,
  onScoredByChange,
  hasPriorScores,
}: {
  scoredBy: string;
  onScoredByChange: (v: string) => void;
  hasPriorScores: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {hasPriorScores
            ? 'Re-score this initiative'
            : 'Score this initiative with CARET'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          The framework treats CARET as a panel ceremony. You'll set up a panel
          of stakeholders, then walk through five factors capturing each
          panelist's score. The system flags divergence when scores differ by
          two or more points so you can document the discussion.
        </p>
      </div>

      <div className="rounded-lg bg-gray-900 px-6 py-5 text-white">
        <div className="text-xs uppercase tracking-wider text-gray-400">
          Priority Score formula
        </div>
        <div className="mt-2 flex items-center gap-2 font-mono text-sm">
          <span className="text-gray-300">Priority Score =</span>
          <div className="inline-flex flex-col items-center">
            <span className="border-b border-white pb-0.5 text-white">
              A × R
            </span>
            <span className="pt-0.5 text-white">C × E</span>
          </div>
          <span className="text-gray-300">× T</span>
        </div>
        <p className="mt-3 text-xs text-gray-300">
          A (Alignment) and R (Results) push the score up. C (Complexity) and
          E (Effort) push it down. T (Timeline) is a final urgency multiplier.
        </p>
      </div>

      <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <strong className="font-semibold">
          Before you start: canvass the panel.
        </strong>{' '}
        This wizard captures the consensus output of a panel ceremony — it
        doesn't run the panel for you. As initiative owner, gather scores from
        each stakeholder beforehand. Live in a meeting is best — you'll see
        divergence in real time and can capture the discussion. Asynchronous
        is fine too. Tell each panelist to skip any factor outside their
        domain (an AE leader probably can't usefully score Complexity); use
        the <strong className="font-semibold">N/A</strong> button on each
        factor page to mark a panelist as not having scored — it's excluded
        from the average without dragging the score down.
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        {FACTOR_ORDER.map((f) => (
          <div
            key={f}
            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-3"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {FACTORS[f].letter}
            </div>
            <div className="mt-1 text-sm font-medium text-gray-900">
              {FACTORS[f].name}
            </div>
            <div className="text-xs text-gray-500">
              {FACTORS[f].subtitle}
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Scoring panel description (optional)
        </label>
        <input
          type="text"
          value={scoredBy}
          onChange={(e) => onScoredByChange(e.target.value)}
          placeholder="e.g., Q2 panel — AE leadership, RevOps, IT"
          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Free text. Captures the context of who participated for future
          reviewers.
        </p>
      </div>
    </div>
  );
}

function RosterStep({
  panelists,
  onChangeField,
  onAdd,
  onRemove,
}: {
  panelists: Panelist[];
  onChangeField: (id: string, field: 'name' | 'role', value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Panel roster
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Add each stakeholder who scored this initiative. The framework
          recommends at least three distinct functions on the panel — for
          example, a sales perspective, a RevOps / Enablement perspective,
          and a technical / data / IT perspective.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Scoring solo? Just add yourself with one row — the wizard works the
          same way.
        </p>
      </div>

      <div className="space-y-2">
        {panelists.map((p, idx) => (
          <div
            key={p.id}
            className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-3 md:flex-row md:items-center"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
              {idx + 1}
            </div>
            <input
              type="text"
              value={p.name}
              onChange={(e) => onChangeField(p.id, 'name', e.target.value)}
              placeholder="Name"
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              type="text"
              value={p.role}
              onChange={(e) => onChangeField(p.id, 'role', e.target.value)}
              placeholder="Role / function (e.g., RevOps Director)"
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            {panelists.length > 1 && (
              <button
                onClick={() => onRemove(p.id)}
                className="self-start rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 md:self-auto"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onAdd}
        className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        + Add panelist
      </button>
    </div>
  );
}

function FactorStep({
  factor,
  panelists,
  note,
  onScoreChange,
  onNoteChange,
}: {
  factor: CARETFactor;
  panelists: Panelist[];
  note: string;
  onScoreChange: (panelistId: string, factor: CARETFactor, score: number) => void;
  onNoteChange: (v: string) => void;
}) {
  const f = FACTORS[factor];
  const average = computeFactorAverage(panelists, factor);
  const divergence = factorDivergence(panelists, factor);
  const hasDivergence = divergence >= 2;
  const allScored = panelists.every((p) => p.scores[factor] > 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Factor {f.letter}
        </div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
          {f.name}
        </h2>
        <p className="text-sm font-medium text-gray-500">{f.subtitle}</p>
        <p className="mt-3 text-base text-gray-800">{f.question}</p>
        <p className="mt-2 text-sm text-gray-600">{f.definition}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-700">
            <strong className="font-semibold">Position:</strong>{' '}
            {f.formulaPosition}
          </span>
          <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-700">
            {f.role}
          </span>
        </div>
      </div>

      {f.guidance && (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          <strong className="font-medium">Scoring guidance.</strong>{' '}
          {f.guidance}
        </div>
      )}

      <details className="rounded-md border border-gray-200 bg-white">
        <summary className="cursor-pointer list-none px-4 py-2 text-sm font-medium text-gray-700">
          Scale reference — what each value means
        </summary>
        <div className="border-t border-gray-200 px-4 py-3 text-sm">
          <p className="mb-2 text-xs text-gray-500">{f.scaleNotes}</p>
          <ul className="space-y-1.5">
            {f.scaleLabels.map((s) => (
              <li key={s.value} className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 min-w-[2.25rem] items-center justify-center rounded bg-gray-900 px-1 font-mono text-xs font-semibold text-white">
                  {s.short}
                </span>
                <span className="text-gray-700">{s.long}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>

      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">
          Scores from each panelist
        </div>
        {panelists.map((p) => (
          <PanelistScoreRow
            key={p.id}
            panelist={p}
            factor={factor}
            value={p.scores[factor]}
            onChange={(v) => onScoreChange(p.id, factor, v)}
          />
        ))}
      </div>

      {allScored && (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-gray-700">Average</span>
            <span className="font-mono text-lg font-semibold text-gray-900">
              {formatScore(average)}
            </span>
          </div>
          {hasDivergence && (
            <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <strong className="font-medium">
                Divergence ≥ 2 points detected.
              </strong>{' '}
              The framework recommends discussion before finalizing. Capture
              the discussion in the notes below.
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {hasDivergence ? 'Discussion notes' : 'Notes (optional)'}
        </label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          placeholder={
            hasDivergence
              ? 'Capture the discussion that resolved the divergence.'
              : 'Capture rationale, panel discussion, or dissents.'
          }
          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
      </div>
    </div>
  );
}

function PanelistScoreRow({
  panelist,
  factor,
  value,
  onChange,
}: {
  panelist: Panelist;
  factor: CARETFactor;
  value: number;
  onChange: (v: number) => void;
}) {
  const f = FACTORS[factor];
  const naSelected = isNA(value);
  const handleClick = (newValue: number) => {
    // Clicking the currently-selected button toggles it off.
    if (newValue === value) {
      onChange(0);
    } else {
      onChange(newValue);
    }
  };
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-3">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <span className="text-sm font-medium text-gray-900">
            {panelist.name}
          </span>
          {panelist.role && (
            <span className="ml-2 text-xs text-gray-500">
              {panelist.role}
            </span>
          )}
        </div>
        <span className="font-mono text-xs text-gray-500">
          {naSelected
            ? 'N/A — excluded from average'
            : value > 0
              ? formatScore(value)
              : 'No score yet'}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {f.scaleLabels.map((s) => {
          const selected = value === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => handleClick(s.value)}
              title={s.long}
              className={`rounded-md border px-3 py-1.5 font-mono text-sm transition ${
                selected
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {s.short}
            </button>
          );
        })}
        <span className="mx-1 h-6 w-px bg-gray-200" aria-hidden />
        <button
          type="button"
          onClick={() => handleClick(NA_SCORE)}
          title="This panelist did not score this factor — typically because it's outside their domain. Excluded from the average."
          className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
            naSelected
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          N/A
        </button>
      </div>
    </div>
  );
}

function ReviewStep({
  panelists,
  notes,
  scoredBy,
  previewScore,
}: {
  panelists: Panelist[];
  notes: CARETNotes;
  scoredBy: string;
  previewScore: number | null;
}) {
  const consensus = useMemo(
    () => computeConsensusScores(panelists),
    [panelists],
  );
  const allFilled = FACTOR_ORDER.every((f) => consensus[f] > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Review and save</h2>
        <p className="mt-1 text-sm text-gray-600">
          Confirm the panel and the scores below. You can re-score later.
        </p>
      </div>

      <div className="rounded-lg bg-gray-900 px-6 py-5 text-white">
        <div className="text-xs uppercase tracking-wider text-gray-400">
          Priority Score
        </div>
        <div className="mt-1 font-mono text-4xl font-semibold">
          {previewScore === null ? '—' : previewScore.toFixed(2)}
        </div>
        <div className="mt-1 text-xs text-gray-400">(A × R) / (C × E) × T</div>
        {!allFilled && (
          <div className="mt-3 rounded-md bg-amber-500/20 px-3 py-2 text-xs text-amber-200">
            Score is incomplete — at least one factor has no scores. Use Back
            to fill in any missing factors.
          </div>
        )}
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-gray-700">
          Panel ({panelists.length})
        </div>
        <div className="space-y-1 text-sm">
          {panelists.map((p) => (
            <div
              key={p.id}
              className="flex items-baseline justify-between rounded-md bg-gray-50 px-3 py-2"
            >
              <div>
                <span className="font-medium text-gray-900">{p.name}</span>
                {p.role && (
                  <span className="ml-2 text-xs text-gray-500">{p.role}</span>
                )}
              </div>
              <div className="font-mono text-xs text-gray-600">
                {FACTOR_ORDER.map((f) => (
                  <span key={f} className="ml-2">
                    {FACTORS[f].letter}:{' '}
                    {isNA(p.scores[f])
                      ? 'N/A'
                      : p.scores[f] > 0
                        ? formatScore(p.scores[f])
                        : '—'}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-gray-700">
          Consensus scores (averages)
        </div>
        <div className="grid grid-cols-5 gap-2 text-center">
          {FACTOR_ORDER.map((f) => {
            const value = consensus[f];
            const divergence = factorDivergence(panelists, f);
            return (
              <div
                key={f}
                className={`rounded-md border px-2 py-3 ${
                  divergence >= 2
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-xs text-gray-500">{FACTORS[f].letter}</div>
                <div className="font-mono text-lg font-semibold text-gray-900">
                  {value > 0 ? formatScore(value) : '—'}
                </div>
                {divergence >= 2 && (
                  <div className="mt-1 text-[10px] font-medium uppercase text-amber-700">
                    Diverged
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {scoredBy && (
        <div>
          <div className="text-xs text-gray-500">Panel description</div>
          <div className="text-sm text-gray-900">{scoredBy}</div>
        </div>
      )}

      {FACTOR_ORDER.some((f) => notes[f].trim()) && (
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700">
            Discussion notes
          </div>
          <div className="space-y-2">
            {FACTOR_ORDER.map((f) =>
              notes[f].trim() ? (
                <div
                  key={f}
                  className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-gray-900">
                    {FACTORS[f].letter} — {FACTORS[f].name}:
                  </span>{' '}
                  <span className="text-gray-700">{notes[f]}</span>
                </div>
              ) : null,
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatScore(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2);
}
