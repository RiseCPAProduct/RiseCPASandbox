"use client";

import { Button, Dropdown, Field, Option } from "@fluentui/react-components";
import {
  ITEM_TYPES,
  STANDARD_FOLDERS,
  TYPE_LABELS,
  type Department,
  type DocumentItem,
  type ItemType,
  type StandardFolder,
} from "@/lib/placeholder-documents";
import { getDepartments, getYears, type SearchFilters as Filters } from "@/lib/search";

type FilterKey = keyof Filters;

type Props = {
  // Items the current role may see; options are derived from these.
  items: DocumentItem[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
  canClear: boolean;
  fields?: FilterKey[];
};

type Choice = { value: string; label: string };

function FilterDropdown({ label, value, choices, onSelect }: { label: string; value: string; choices: Choice[]; onSelect: (value: string) => void }) {
  const selected = choices.find((c) => c.value === value) ?? choices[0];
  return (
    <Field label={label} className="min-w-0 flex-1">
      <Dropdown
        className="min-w-0! w-full"
        value={selected.label}
        selectedOptions={[selected.value]}
        onOptionSelect={(_, data) => data.optionValue && onSelect(data.optionValue)}
      >
        {choices.map((c) => (
          <Option key={c.value} value={c.value}>
            {c.label}
          </Option>
        ))}
      </Dropdown>
    </Field>
  );
}

export default function FilterBar({ items, filters, onChange, onClear, canClear, fields = ["department", "folder", "type", "year"] }: Props) {
  const dropdowns: Record<FilterKey, React.ReactNode> = {
    department: (
      <FilterDropdown
        key="department"
        label="Department"
        value={filters.department}
        choices={[{ value: "all", label: "All departments" }, ...getDepartments(items).map((d) => ({ value: d, label: d }))]}
        onSelect={(v) => onChange({ ...filters, department: v as Department | "all" })}
      />
    ),
    folder: (
      <FilterDropdown
        key="folder"
        label="Folder"
        value={filters.folder}
        choices={[{ value: "all", label: "All folders" }, ...STANDARD_FOLDERS.map((f) => ({ value: f, label: f }))]}
        onSelect={(v) => onChange({ ...filters, folder: v as StandardFolder | "all" })}
      />
    ),
    type: (
      <FilterDropdown
        key="type"
        label="Type"
        value={filters.type}
        choices={[{ value: "all", label: "All types" }, ...ITEM_TYPES.map((t) => ({ value: t, label: TYPE_LABELS[t] }))]}
        onSelect={(v) => onChange({ ...filters, type: v as ItemType | "all" })}
      />
    ),
    year: (
      <FilterDropdown
        key="year"
        label="Year modified"
        value={String(filters.year)}
        choices={[{ value: "all", label: "All years" }, ...getYears(items).map((y) => ({ value: String(y), label: String(y) }))]}
        onSelect={(v) => onChange({ ...filters, year: v === "all" ? "all" : Number(v) })}
      />
    ),
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-end">
      {fields.map((key) => dropdowns[key])}
      <Button appearance="subtle" onClick={onClear} disabled={!canClear}>
        Clear filters
      </Button>
    </div>
  );
}
