import { useMemo, useState } from 'react';
import {
  MOTIONS_TAXONOMY,
  findMotion,
  type MotionCategory,
  type MotionFunnel,
  type MotionItem,
  type MotionSubcategory,
} from '../constants/motions';

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
}

const FUNNEL_LABELS: Record<MotionFunnel, string> = {
  acquisition: 'Acquisition',
  expansion: 'Expansion',
  foundations: 'Foundations',
};

const FUNNEL_STYLES: Record<MotionFunnel, string> = {
  acquisition: 'border-yellow-300 bg-yellow-50 text-yellow-900',
  expansion: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  foundations: 'border-gray-300 bg-gray-50 text-gray-700',
};

export default function MotionsPicker({ selected, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const trimmed = query.trim().toLowerCase();
  const isSearching = trimmed.length > 0;

  // When searching, filter motions and auto-show all matching subcategories.
  const filteredTaxonomy = useMemo(() => {
    if (!isSearching) return MOTIONS_TAXONOMY;
    const result: MotionCategory[] = [];
    for (const cat of MOTIONS_TAXONOMY) {
      const subs: MotionSubcategory[] = [];
      for (const sub of cat.subcategories) {
        const motions = sub.motions.filter((m) =>
          m.label.toLowerCase().includes(trimmed),
        );
        if (motions.length > 0) {
          subs.push({ ...sub, motions });
        }
      }
      if (subs.length > 0) {
        result.push({ ...cat, subcategories: subs });
      }
    }
    return result;
  }, [isSearching, trimmed]);

  const totalShown = filteredTaxonomy.reduce(
    (n, c) =>
      n +
      c.subcategories.reduce((m, s) => m + s.motions.length, 0),
    0,
  );

  const toggleMotion = (id: string) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  const removeChip = (id: string) => {
    onChange(selected.filter((s) => s !== id));
  };

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () =>
    setOpenCategories(new Set(MOTIONS_TAXONOMY.map((c) => c.id)));
  const collapseAll = () => setOpenCategories(new Set());

  const isCategoryOpen = (id: string) =>
    isSearching || openCategories.has(id);

  // Selected chips with category context for visual grouping.
  const selectedByCategory = useMemo(() => {
    const map = new Map<
      string,
      { category: string; funnel: MotionFunnel; motions: MotionItem[] }
    >();
    for (const id of selected) {
      const found = findMotion(id);
      if (!found) continue;
      const key = found.category.id;
      if (!map.has(key)) {
        map.set(key, {
          category: found.category.label,
          funnel: found.category.funnel,
          motions: [],
        });
      }
      map.get(key)!.motions.push(found.motion);
    }
    return map;
  }, [selected]);

  return (
    <div className="space-y-3">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Selected ({selected.length})
            </div>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-gray-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-2">
            {Array.from(selectedByCategory.entries()).map(
              ([catId, group]) => (
                <div key={catId}>
                  <div
                    className={`mb-1 inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${FUNNEL_STYLES[group.funnel]}`}
                  >
                    {group.category}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {group.motions.map((m) => (
                      <span
                        key={m.id}
                        className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
                      >
                        {m.label}
                        <button
                          type="button"
                          onClick={() => removeChip(m.id)}
                          className="text-gray-500 hover:text-gray-900"
                          aria-label={`Remove ${m.label}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Search + bulk toggle */}
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white p-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search motions..."
          className="flex-1 min-w-[200px] rounded-md border border-gray-300 px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        {!isSearching && (
          <>
            <button
              type="button"
              onClick={expandAll}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
            >
              Collapse all
            </button>
          </>
        )}
        {isSearching && (
          <span className="text-xs text-gray-500">
            {totalShown} match{totalShown === 1 ? '' : 'es'}
          </span>
        )}
      </div>

      {/* Taxonomy browser */}
      <div className="rounded-md border border-gray-200 bg-white">
        {filteredTaxonomy.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            No motions match "{query}".
          </div>
        )}
        {filteredTaxonomy.map((category) => {
          const open = isCategoryOpen(category.id);
          const selectedInCat = category.subcategories.reduce(
            (n, s) =>
              n + s.motions.filter((m) => selectedSet.has(m.id)).length,
            0,
          );
          return (
            <div
              key={category.id}
              className="border-b border-gray-100 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-semibold text-gray-400"
                    aria-hidden
                  >
                    {open ? '▾' : '▸'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {category.label}
                      </span>
                      <span
                        className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${FUNNEL_STYLES[category.funnel]}`}
                      >
                        {FUNNEL_LABELS[category.funnel]}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {category.subcategories.length} subcategor
                      {category.subcategories.length === 1 ? 'y' : 'ies'}
                      {selectedInCat > 0 && (
                        <span className="ml-2 text-emerald-700">
                          · {selectedInCat} selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
              {open && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    {category.subcategories.map((subcat) => (
                      <div key={subcat.id}>
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
                          {subcat.label}
                        </div>
                        <ul className="space-y-1">
                          {subcat.motions.map((m) => {
                            const checked = selectedSet.has(m.id);
                            return (
                              <li key={m.id}>
                                <label className="flex cursor-pointer items-start gap-2 rounded px-1 py-0.5 text-sm hover:bg-white">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleMotion(m.id)}
                                    className="mt-0.5"
                                  />
                                  <span
                                    className={
                                      checked
                                        ? 'text-gray-900'
                                        : 'text-gray-700'
                                    }
                                  >
                                    {m.label}
                                  </span>
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
