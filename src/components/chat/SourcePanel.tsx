import { useState, useId } from "react";
import type { Source } from "../../api/contracts";
import { SourceCard } from "./SourceCard";

interface SourcePanelProps {
  sources: Source[];
  initiallyCollapsed?: boolean;
}

export function SourcePanel({
  sources,
  initiallyCollapsed = true,
}: SourcePanelProps) {
  const [isExpanded, setIsExpanded] = useState(!initiallyCollapsed);
  const baseId = useId();
  const toggleId = `source-toggle-${baseId}`;
  const panelId = `source-panel-${baseId}`;

  if (sources.length === 0) return null;

  const label = isExpanded
    ? "Ocultar fontes"
    : `Ver ${sources.length} fonte${sources.length !== 1 ? "s" : ""}`;

  return (
    <div className="mt-3">
      <button
        id={toggleId}
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <span
          className={`inline-block transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
          aria-hidden="true"
        >
          ▶
        </span>
        {label}
      </button>
      {isExpanded && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={toggleId}
          className="mt-2 space-y-2"
        >
          {sources
            .sort((a, b) => b.relevance - a.relevance)
            .map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
        </div>
      )}
    </div>
  );
}
