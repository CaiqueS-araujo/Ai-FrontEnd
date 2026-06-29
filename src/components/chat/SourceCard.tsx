import type { Source } from "../../api/contracts";

interface SourceCardProps {
  source: Source;
}

function relevanceColor(relevance: number): string {
  if (relevance > 0.7) return "bg-green-100 text-green-800";
  if (relevance > 0.4) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

function relevancePercent(relevance: number): string {
  return `${Math.round(relevance * 100)}%`;
}

export function SourceCard({ source }: SourceCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
      <h3 className="truncate font-medium text-gray-900">{source.title}</h3>
      <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-gray-600">
        {source.excerpt}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${relevanceColor(source.relevance)}`}
          aria-label={`Relevância: ${relevancePercent(source.relevance)}`}
        >
          {relevancePercent(source.relevance)}
        </span>
        {source.filename && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {source.filename}
          </span>
        )}
        {source.documentUrl && (
          <a
            href={source.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-blue-600 underline hover:text-blue-800"
            aria-label={`Abrir ${source.title} em nova aba`}
          >
            Abrir documento
          </a>
        )}
      </div>
    </article>
  );
}
