interface HealthBadgeProps {
  status: "UP" | "DOWN" | "UNKNOWN";
  lastCheckedAt: string | null;
}

export function HealthBadge({ status, lastCheckedAt: _lastCheckedAt }: HealthBadgeProps) {
  const colors: Record<string, string> = {
    UP: "bg-green-100 text-green-800",
    DOWN: "bg-red-100 text-red-800",
    UNKNOWN: "bg-gray-100 text-gray-500",
  };

  const labels: Record<string, string> = {
    UP: "Online",
    DOWN: "Offline",
    UNKNOWN: "Verificando…",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}
      role="status"
      aria-label={`Servidor: ${labels[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "UP"
            ? "bg-green-500"
            : status === "DOWN"
              ? "bg-red-500"
              : "bg-gray-400"
        }`}
        aria-hidden="true"
      />
      {labels[status]}
    </div>
  );
}
