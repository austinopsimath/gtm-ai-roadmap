import { useEffect, useMemo, useRef, useState } from 'react';

type BaseProps = {
  label: string;
  options: string[];
  placeholder?: string;
  help?: string;
  onCreateOption?: (value: string) => void;
};

type MultiProps = BaseProps & {
  mode: 'multi';
  selected: string[];
  onChange: (value: string[]) => void;
};

type SingleProps = BaseProps & {
  mode: 'single';
  selected: string;
  onChange: (value: string) => void;
};

type Props = MultiProps | SingleProps;

export default function Combobox(props: Props) {
  const { label, options, placeholder, help } = props;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on click-outside or Escape
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery('');
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  // Focus the search input when popover opens
  useEffect(() => {
    if (open) requestAnimationFrame(() => searchRef.current?.focus());
  }, [open]);

  const isSelected = (value: string) =>
    props.mode === 'multi'
      ? props.selected.includes(value)
      : props.selected === value;

  const toggle = (value: string) => {
    if (props.mode === 'multi') {
      const next = props.selected.includes(value)
        ? props.selected.filter((v) => v !== value)
        : [...props.selected, value];
      props.onChange(next);
    } else {
      props.onChange(value);
      setOpen(false);
      setQuery('');
    }
  };

  const removeChip = (value: string) => {
    if (props.mode === 'multi') {
      props.onChange(props.selected.filter((v) => v !== value));
    } else {
      props.onChange('');
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const exactMatch = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.some((o) => o.toLowerCase() === q);
  }, [options, query]);

  const createValue = query.trim();
  const canCreate =
    !!props.onCreateOption && createValue.length > 0 && !exactMatch;

  const handleCreate = () => {
    if (!canCreate || !props.onCreateOption) return;
    props.onCreateOption(createValue);
    if (props.mode === 'multi') {
      if (!props.selected.includes(createValue)) {
        props.onChange([...props.selected, createValue]);
      }
    } else {
      props.onChange(createValue);
      setOpen(false);
    }
    setQuery('');
  };

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (canCreate) {
        handleCreate();
      } else if (filtered.length > 0) {
        toggle(filtered[0]);
      }
    }
  };

  const selectedArr =
    props.mode === 'multi'
      ? props.selected
      : props.selected
        ? [props.selected]
        : [];

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[38px] w-full flex-wrap items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-left text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        >
          {selectedArr.length === 0 && (
            <span className="px-1 text-gray-400">
              {placeholder ?? 'Select...'}
            </span>
          )}
          {selectedArr.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
            >
              {v}
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  removeChip(v);
                }}
                className="cursor-pointer text-gray-500 hover:text-gray-900"
                aria-label={`Remove ${v}`}
              >
                ×
              </span>
            </span>
          ))}
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-100 p-2">
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKey}
                placeholder="Search or type to add..."
                className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="max-h-60 overflow-auto py-1">
              {filtered.length === 0 && !canCreate && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No matches
                </div>
              )}
              {filtered.map((opt) => {
                const selected = isSelected(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggle(opt)}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                      selected ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded ${
                        props.mode === 'multi'
                          ? 'border border-gray-300'
                          : 'border-0'
                      } ${selected && props.mode === 'multi' ? 'border-gray-900 bg-gray-900' : ''}`}
                    >
                      {selected && props.mode === 'multi' && (
                        <svg
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {selected && props.mode === 'single' && (
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                      )}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
              {canCreate && (
                <button
                  type="button"
                  onClick={handleCreate}
                  className="flex w-full items-center gap-2 border-t border-gray-100 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-gray-500">+ Create</span>
                  <span className="font-medium text-gray-900">
                    "{createValue}"
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {help && <p className="text-xs text-gray-500">{help}</p>}
    </div>
  );
}
