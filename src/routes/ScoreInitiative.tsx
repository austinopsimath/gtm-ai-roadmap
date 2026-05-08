import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import {
  calculatePriorityScore,
  type CARETFactor,
  type CARETNotes,
  type CARETScores,
} from '../types';
import { FACTOR_ORDER, FACTORS } from '../constants/caret';

type StepKey = 'intro' | CARETFactor | 'review';

const STEP_ORDER: StepKey[] = ['intro', 'c', 'a', 'r', 'e', 't', 'review'];

export default function ScoreInitiative() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const initiative = useRoadmapStore((s) =>
    s.initiatives.find((i) => i.id === id),
  );
  const updateInitiative = useRoadmapStore((s) => s.updateInitiative);

  const [stepIdx, setStepIdx] = useState(0);
  const [draft, setDraft] = useState<CARETScores>(
    () => initiative?.caret ?? { c: 0, a: 0, r: 0, e: 0, t: 0 },
  );
  const [notes, setNotes] = useState<CARETNotes>(
    () => initiative?.caretNotes ?? { c: '', a: '', r: '', e: '', t: '' },
  );
  const [scoredBy, setScoredBy] = useState(initiative?.scoredBy ?? '');

  if (!initiative) return <Navigate to="/" replace />;

  const step = STEP_ORDER[stepIdx];
  const isLast = step === 'review';
  const isFirst = step === 'intro';

  const goNext = () => setStepIdx((idx) => Math.min(STEP_ORDER.length - 1, idx + 1));
  const goPrev = () => setStepIdx((idx) => Math.max(0, idx - 1));

  const handleSave = () => {
    updateInitiative(initiative.id, {
      caret: draft,
      caretNotes: notes,
      scoredAt: new Date().toISOString(),
      scoredBy,
    });
    navigate(`/initiatives/${initiative.id}`);
  };

  const setScore = (factor: CARETFactor, value: number) => {
    setDraft((prev) => ({ ...prev, [factor]: value }));
  };

  const setNote = (factor: CARETFactor, value: string) => {
    setNotes((prev) => ({ ...prev, [factor]: value }));
  };

  const previewScore = calculatePriorityScore(draft);

  return (
    <div className="mx-auto max-w-3xl">
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
            existing={initiative.caret}
          />
        )}
        {(['c', 'a', 'r', 'e', 't'] as CARETFactor[]).includes(
          step as CARETFactor,
        ) && (
          <FactorStep
            factor={step as CARETFactor}
            value={draft[step as CARETFactor]}
            note={notes[step as CARETFactor]}
            onValueChange={(v) => setScore(step as CARETFactor, v)}
            onNoteChange={(v) => setNote(step as CARETFactor, v)}
          />
        )}
        {step === 'review' && (
          <ReviewStep
            draft={draft}
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
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              {step === 'intro' ? 'Start scoring' : 'Next'}
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
  const total = STEP_ORDER.length;
  return (
    <div className="flex items-center gap-1.5">
      {STEP_ORDER.map((key, idx) => (
        <div
          key={key}
          className={`h-1 flex-1 rounded-full ${
            idx <= stepIdx ? 'bg-gray-900' : 'bg-gray-200'
          }`}
        />
      ))}
      <span className="ml-2 text-xs text-gray-500">
        {stepIdx + 1} of {total}
      </span>
    </div>
  );
}

function IntroStep({
  scoredBy,
  onScoredByChange,
  existing,
}: {
  scoredBy: string;
  onScoredByChange: (v: string) => void;
  existing: CARETScores;
}) {
  const hasExistingScores = existing.c > 0 || existing.a > 0 || existing.r > 0;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {hasExistingScores ? 'Re-score this initiative' : 'Score this initiative'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          You'll score this initiative on five factors:{' '}
          <strong>Complexity, Alignment, Results, Effort, Timeline</strong>.
          Each factor has a 1–5 scale (T is 1.0–1.5). The framework computes a
          Priority Score using <code className="rounded bg-gray-100 px-1">(A × R) / (C × E) × T</code>{' '}
          — higher = higher priority.
        </p>
      </div>
      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong className="font-medium">A note on panel scoring.</strong> The
        framework treats CARET as a multi-person panel ceremony where each
        scorer scores independently before discussion. This tool captures the
        consensus output. If your panel had divergence ≥ 2 on any factor,
        capture the discussion in the notes for that factor.
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Scoring panel (optional)
        </label>
        <input
          type="text"
          value={scoredBy}
          onChange={(e) => onScoredByChange(e.target.value)}
          placeholder="e.g., AE leadership, RevOps, IT — Q2 panel"
          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Free text. Capture who participated so future reviewers know the
          provenance of these scores.
        </p>
      </div>
    </div>
  );
}

function FactorStep({
  factor,
  value,
  note,
  onValueChange,
  onNoteChange,
}: {
  factor: CARETFactor;
  value: number;
  note: string;
  onValueChange: (v: number) => void;
  onNoteChange: (v: string) => void;
}) {
  const f = FACTORS[factor];
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Factor {f.letter}
        </div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
          {f.name}
        </h2>
        <p className="mt-2 text-base text-gray-700">{f.question}</p>
        <p className="mt-3 text-sm text-gray-500">{f.role}</p>
      </div>

      {f.guidance && (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          <strong className="font-medium">Scoring guidance.</strong>{' '}
          {f.guidance}
        </div>
      )}

      <div>
        <div className="mb-2 text-sm font-medium text-gray-700">
          {f.scaleNotes}
        </div>
        <div className="space-y-2">
          {f.scaleLabels.map((s) => {
            const selected = value === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => onValueChange(s.value)}
                className={`flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left text-sm transition ${
                  selected
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`flex h-7 w-12 shrink-0 items-center justify-center rounded font-mono text-sm font-semibold ${
                    selected ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {s.short}
                </span>
                <span className="flex-1 leading-relaxed">{s.long}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          placeholder="Capture panel discussion, divergence, dissents, or rationale for the score."
          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Especially valuable when scorers diverged by 2+ points and worked it
          out in discussion.
        </p>
      </div>
    </div>
  );
}

function ReviewStep({
  draft,
  notes,
  scoredBy,
  previewScore,
}: {
  draft: CARETScores;
  notes: CARETNotes;
  scoredBy: string;
  previewScore: number | null;
}) {
  const allFilled = useMemo(
    () => draft.c > 0 && draft.a > 0 && draft.r > 0 && draft.e > 0 && draft.t > 0,
    [draft],
  );
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Review and save</h2>
        <p className="mt-1 text-sm text-gray-600">
          Confirm the scores below. You can re-score later.
        </p>
      </div>

      <div className="rounded-lg bg-gray-900 px-6 py-5 text-white">
        <div className="text-xs uppercase tracking-wider text-gray-400">
          Priority Score
        </div>
        <div className="mt-1 font-mono text-4xl font-semibold">
          {previewScore === null ? '—' : previewScore.toFixed(2)}
        </div>
        <div className="mt-1 text-xs text-gray-400">
          (A × R) / (C × E) × T
        </div>
        {!allFilled && (
          <div className="mt-3 rounded-md bg-amber-500/20 px-3 py-2 text-xs text-amber-200">
            Score is incomplete — at least one factor is still 0. Use Back to
            fill in any missing factors.
          </div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 text-center">
        {FACTOR_ORDER.map((f) => {
          const value = draft[f];
          return (
            <div
              key={f}
              className="rounded-md border border-gray-200 bg-white px-2 py-3"
            >
              <div className="text-xs text-gray-500">{FACTORS[f].letter}</div>
              <div className="text-lg font-semibold text-gray-900">
                {value || '—'}
              </div>
            </div>
          );
        })}
      </div>

      {scoredBy && (
        <div>
          <div className="text-xs text-gray-500">Scoring panel</div>
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
