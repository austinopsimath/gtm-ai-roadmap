import { useRoadmapStore } from '../store';
import { PATH_LABELS, type Initiative, type Path } from '../types';
import { DEFAULT_TECHNOLOGIES } from '../constants/picklists';
import Combobox from './Combobox';

const dedupe = (arr: string[]): string[] => Array.from(new Set(arr));

export default function PathVendorEditor({
  initiative,
}: {
  initiative: Initiative;
}) {
  const updateInitiative = useRoadmapStore((s) => s.updateInitiative);
  const customTechnologies = useRoadmapStore((s) => s.customTechnologies);
  const addCustomOption = useRoadmapStore((s) => s.addCustomOption);

  const setPath = (path: Path | null) => {
    // Clear vendor if switching away from Buy
    const patch: Partial<Initiative> = { path };
    if (path !== 'buy') patch.primaryVendor = '';
    updateInitiative(initiative.id, patch);
  };

  const setVendor = (vendor: string) => {
    updateInitiative(initiative.id, { primaryVendor: vendor });
  };

  const vendorOptions = dedupe([
    ...DEFAULT_TECHNOLOGIES,
    ...customTechnologies,
  ]);

  return (
    <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Path & vendor
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Decide whether this initiative will be a custom build or a vendor
          purchase. Saves automatically.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700">Path</div>
          <div className="flex flex-wrap gap-2">
            {(['build', 'buy'] as Path[]).map((p) => {
              const selected = initiative.path === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPath(p)}
                  className={`rounded-md border px-4 py-1.5 text-sm transition ${
                    selected
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {PATH_LABELS[p]}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPath(null)}
              className={`rounded-md border px-4 py-1.5 text-sm transition ${
                initiative.path === null
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              Not yet decided
            </button>
          </div>
        </div>

        {initiative.path === 'buy' && (
          <div>
            <Combobox
              mode="single"
              label="Primary vendor"
              options={vendorOptions}
              selected={initiative.primaryVendor}
              onChange={setVendor}
              onCreateOption={(v) => addCustomOption('technologies', v)}
              placeholder="Select or add a vendor..."
              help="The single primary vendor whose product this initiative depends on. The full vendor list under evaluation belongs in the PRD when you write it."
            />
          </div>
        )}
      </div>
    </div>
  );
}
