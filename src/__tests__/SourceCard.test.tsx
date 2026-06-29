import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SourceCard } from "../components/chat/SourceCard";
import type { Source } from "../api/contracts";

describe("SourceCard", () => {
  const baseSource: Source = {
    id: "src-1",
    title: "Política de Entregas",
    excerpt: "Os prazos de entrega variam conforme a região geográfica...",
    relevance: 0.92,
    documentUrl: null,
    filename: null,
  };

  it("renders title", () => {
    render(<SourceCard source={baseSource} />);
    expect(
      screen.getByRole("heading", { name: "Política de Entregas" }),
    ).toBeInTheDocument();
  });

  it("renders excerpt", () => {
    render(<SourceCard source={baseSource} />);
    expect(
      screen.getByText(
        "Os prazos de entrega variam conforme a região geográfica...",
      ),
    ).toBeInTheDocument();
  });

  it("renders relevance badge with percentage", () => {
    render(<SourceCard source={baseSource} />);
    expect(screen.getByText("92%")).toBeInTheDocument();
  });

  it("renders relevance badge with correct aria-label", () => {
    render(<SourceCard source={baseSource} />);
    expect(
      screen.getByLabelText("Relevância: 92%"),
    ).toBeInTheDocument();
  });

  it("renders filename when provided", () => {
    const source = { ...baseSource, filename: "relatorio.pdf" };
    render(<SourceCard source={source} />);
    expect(screen.getByText("relatorio.pdf")).toBeInTheDocument();
  });

  it("renders document link when documentUrl is provided", () => {
    const source = {
      ...baseSource,
      documentUrl: "https://exemplo.com/doc",
    };
    render(<SourceCard source={source} />);
    const link = screen.getByRole("link", { name: /abrir política de entregas em nova aba/i });
    expect(link).toHaveAttribute("href", "https://exemplo.com/doc");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not render link when documentUrl is null", () => {
    render(<SourceCard source={baseSource} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("does not render filename badge when filename is null", () => {
    render(<SourceCard source={baseSource} />);
    expect(screen.queryByText("relatorio.pdf")).not.toBeInTheDocument();
  });
});
