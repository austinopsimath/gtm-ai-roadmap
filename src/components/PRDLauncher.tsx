import { useNavigate } from 'react-router-dom';
import type { Initiative } from '../types';
import { prdSectionsComplete, PRD_TOTAL_SECTIONS } from '../lib/prdProgress';

export default function PRDLauncher({
  initiative,
}: {
  initiative: Initiative;
}) {
  const navigate = useNavigate();
  const complete = prdSectionsComplete(initiative);
  const total = PRD_TOTAL_SECTIONS;
  const pct = Math.round((complete / total) * 100);

  return (
    <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-md border-2 border-blue-200 bg-blue-50 p-5 md:flex-row md:items-center">
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
          PRD workspace
        </div>
        <div className="mt-1 text-sm text-blue-900">
          <strong className="font-semibold">
            {complete} of {total} sections complete
          </strong>
          {complete > 0 && complete < total && (
            <span className="ml-2 text-blue-700">({pct}%)</span>
          )}
          {complete === 0 && ' · open the PRD to start writing'}
          {complete === total && ' · ready for panel approval'}
        </div>
        <p className="mt-1 text-xs text-blue-800">
          The full edit experience — auto-saving 13-section form with sticky
          section nav.
        </p>
      </div>
      <button
        onClick={() => navigate(`/initiatives/${initiative.id}/prd`)}
        className="shrink-0 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        {complete === 0 ? 'Open the PRD →' : 'Continue editing PRD →'}
      </button>
    </div>
  );
}
