"use client";

import { useRef, useState, type ReactNode } from "react";
import { useServerInsertedHTML } from "next/navigation";
import {
  createDOMRenderer,
  FluentProvider,
  renderToStyleElements,
  RendererProvider,
  SSRProvider,
} from "@fluentui/react-components";
import { riseLightTheme } from "@/lib/fluent-theme";
import { DemoRoleProvider } from "./components/demo-role";
import { OnboardingProvider } from "./components/onboarding-tour";

// Fluent's styles are collected during server rendering and inserted into
// the HTML, so the first paint is already styled (no flash, no mismatch).
export default function Providers({ children }: { children: ReactNode }) {
  const [renderer] = useState(() => createDOMRenderer());
  const didInsert = useRef(false);

  useServerInsertedHTML(() => {
    if (didInsert.current) return null;
    didInsert.current = true;
    return <>{renderToStyleElements(renderer)}</>;
  });

  return (
    <RendererProvider renderer={renderer}>
      <SSRProvider>
        {/* Fluent copies the provider's className onto portals (dropdowns,
            dialogs), so page layout classes go on the inner div instead. */}
        <FluentProvider theme={riseLightTheme}>
          <div className="flex min-h-screen flex-col bg-zinc-50">
            <DemoRoleProvider>
              <OnboardingProvider>{children}</OnboardingProvider>
            </DemoRoleProvider>
          </div>
        </FluentProvider>
      </SSRProvider>
    </RendererProvider>
  );
}
