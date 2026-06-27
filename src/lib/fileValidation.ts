const ACCEPTED_TYPES = ["text/plain", "application/pdf"] as const;
const ACCEPTED_EXTENSIONS = [".txt", ".pdf"] as const;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export interface FileValidationResult {
  valid: boolean;
  error: string | null;
}

export function validateFile(file: File): FileValidationResult {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  if (!ACCEPTED_EXTENSIONS.includes(ext as typeof ACCEPTED_EXTENSIONS[number])) {
    return {
      valid: false,
      error: `Tipo de arquivo não suportado. Aceitos: ${ACCEPTED_EXTENSIONS.join(", ")}`,
    };
  }

  if (!ACCEPTED_TYPES.includes(file.type as typeof ACCEPTED_TYPES[number])) {
    return {
      valid: false,
      error: `Tipo de conteúdo não suportado: ${file.type}`,
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: "Arquivo excede o limite de 10 MB",
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "Arquivo vazio",
    };
  }

  return { valid: true, error: null };
}

export function getAcceptedExtensions(): string {
  return ACCEPTED_EXTENSIONS.join(", ");
}

export function getMaxSizeMB(): number {
  return MAX_SIZE_BYTES / (1024 * 1024);
}
