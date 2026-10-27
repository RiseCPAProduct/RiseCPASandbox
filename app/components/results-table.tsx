"use client";

import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";
import { DocumentPdf20Regular, DocumentText20Regular, Folder20Filled, Table20Regular } from "@fluentui/react-icons";
import { formatMonthYear } from "@/lib/format-date";
import { TYPE_LABELS, type DocumentItem, type ItemType } from "@/lib/placeholder-documents";
import { applyFilter, getYear, type SearchFilters as Filters } from "@/lib/search";

export function TypeIcon({ type }: { type: ItemType }) {
  switch (type) {
    case "folder":
      return <Folder20Filled className="shrink-0 text-brand-green" aria-hidden />;
    case "pdf":
      return <DocumentPdf20Regular className="shrink-0 text-red-600" aria-hidden />;
    case "word":
      return <DocumentText20Regular className="shrink-0 text-blue-600" aria-hidden />;
    case "excel":
      return <Table20Regular className="shrink-0 text-emerald-700" aria-hidden />;
  }
}

type Props = {
  results: DocumentItem[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  selectedId?: string;
  // Opens the file overview panel.
  onSelect: (item: DocumentItem) => void;
};

// Type, Department and Last Update cells are links that apply that filter;
// the name opens the file overview.
export default function ResultsTable({ results, filters, onFilterChange, selectedId, onSelect }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <Table aria-label="Documents and folders" className="min-w-[640px]">
        <TableHeader className="bg-zinc-100">
          <TableRow>
            <TableHeaderCell className="font-semibold">Name</TableHeaderCell>
            <TableHeaderCell className="w-24 font-semibold">Type</TableHeaderCell>
            <TableHeaderCell className="w-32 font-semibold">Department</TableHeaderCell>
            <TableHeaderCell className="w-36 font-semibold">Published</TableHeaderCell>
            <TableHeaderCell className="w-36 font-semibold">Last Update</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((item) => {
            const year = getYear(item);
            const selected = item.id === selectedId;
            return (
              <TableRow key={item.id} aria-selected={selected} className={selected ? "bg-brand-green/15!" : "even:bg-zinc-50 hover:bg-brand-green/10!"}>
                <TableCell className="py-2!">
                  <div className="flex items-start gap-3">
                    <TypeIcon type={item.type} />
                    <div className="min-w-0">
                      <Link as="button" appearance="subtle" className="text-left font-semibold!" onClick={() => onSelect(item)}>
                        {item.name}
                      </Link>
                      <p className="text-xs text-zinc-500">{item.path}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Link as="button" aria-label={`Filter by ${TYPE_LABELS[item.type]}`} onClick={() => onFilterChange(applyFilter(filters, "type", item.type))}>
                    {TYPE_LABELS[item.type]}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link as="button" aria-label={`Filter by ${item.department}`} onClick={() => onFilterChange(applyFilter(filters, "department", item.department))}>
                    {item.department}
                  </Link>
                </TableCell>
                <TableCell className="text-brand-charcoal">{formatMonthYear(item.published)}</TableCell>
                <TableCell>
                  <Link
                    as="button"
                    aria-label={`Filter by year ${year}`}
                    title={`Show items last updated in ${year}`}
                    onClick={() => onFilterChange(applyFilter(filters, "year", year))}
                  >
                    {formatMonthYear(item.modified)}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
