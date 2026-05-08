import { useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import { downloadBackup, readBackupFile } from '../lib/backup';
import { daysSince, formatRelativeTime } from '../lib/time';

export default function AppLayout() {
  const navigate = useNavigate();
  const initiatives = useRoadmapStore((s) => s.initiatives);
  const lastBackedUpAt = useRoadmapStore((s) => s.lastBackedUpAt);
  const replaceAll = useRoadmapStore((s) => s.replaceAll);
  const markBackedUpNow = useRoadmapStore((s) => s.markBackedUpNow);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    downloadBackup(initiatives);
    markBackedUpNow();
  };

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const backup = await readBackupFile(file);
      const proceed = window.confirm(
        `Import will replace your current ${initiatives.length} initiative${initiatives.length === 1 ? '' : 's'} with ${backup.initiatives.length} from the backup. Continue?`,
      );
      if (proceed) {
        replaceAll(backup.initiatives);
      }
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const days = daysSince(lastBackedUpAt);
  const showBackupNudge =
    initiatives.length > 0 && (days === null || days >= 30);

  return (
    <div className="min-h-full bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-gray-900">
              GTM AI Roadmap
            </span>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-600">
              Beta
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Registry
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Import
            </button>
            <button
              onClick={handleExport}
              disabled={initiatives.length === 0}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              title={
                lastBackedUpAt
                  ? `Last backed up ${formatRelativeTime(lastBackedUpAt)}`
                  : 'Never backed up'
              }
            >
              Export backup
            </button>
            <button
              onClick={() => navigate('/initiatives/new')}
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              + New initiative
            </button>
          </div>
        </div>
        {(showBackupNudge || importError) && (
          <div className="mx-auto max-w-6xl px-6 pb-3">
            {importError && (
              <div className="mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                <strong className="font-medium">Import failed:</strong>{' '}
                {importError}
                <button
                  onClick={() => setImportError(null)}
                  className="ml-2 text-red-600 underline hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            )}
            {showBackupNudge && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {days === null
                  ? "You haven't downloaded a backup yet. Your data lives only in this browser — exporting a backup now means you won't lose it if you switch devices."
                  : `Last backup was ${days} days ago. Consider exporting a fresh backup.`}
                <button
                  onClick={handleExport}
                  className="ml-2 underline hover:text-amber-700"
                >
                  Export now
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>

      <footer className="mx-auto mt-12 max-w-6xl px-6 pb-12 text-xs text-gray-400">
        Free and open-source. Your data lives in this browser only — never sent
        to any server.{' '}
        <a
          href="https://github.com/austinopsimath/gtm-ai-roadmap"
          className="underline hover:text-gray-600"
        >
          View source on GitHub
        </a>
        .{' '}
        {lastBackedUpAt && (
          <span>Last backup: {formatRelativeTime(lastBackedUpAt)}.</span>
        )}
      </footer>
    </div>
  );
}
