import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { filtersFromParams, filtersToParams, type SearchState } from "@/lib/search-params";

// Search state lives in the URL, so links such as
// /search?department=HR&folder=Budget open pre-filtered and Back works.
// Uses the native history API, which Next.js syncs with useSearchParams.
export function useUrlSearchState(): [SearchState, (next: SearchState, options?: { replace?: boolean }) => void] {
  const pathname = usePathname();
  const params = useSearchParams();
  const state = filtersFromParams(new URLSearchParams(params.toString()));

  const setState = useCallback(
    (next: SearchState, options?: { replace?: boolean }) => {
      const query = filtersToParams(next).toString();
      const url = query ? `${pathname}?${query}` : pathname;
      if (options?.replace) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
    },
    [pathname],
  );

  return [state, setState];
}
