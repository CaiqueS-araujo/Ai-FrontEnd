import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { SourcePanel } from "../components/chat/SourcePanel";
import type { Source } from "../api/contracts";

const mockSources: Source[] = [
  {
    id: "src-1",
    title: "Documento A",
    excerpt: "Trecho do documento A",
    relevance: 0.92,
    documentUrl: null,
    filename: "doc-a.pdf",
  },
  {
    id: "src-2",
    title: "Documento B",
    excerpt: "Trecho do documento B",
    relevance: 0.45,
    documentUrl: "https://exemplo.com/doc-b",
    filename: null,
  },
];

describe("SourcePanel", () => {
  it("renders nothing when sources array is empty", () => {
    const { container } = render(<SourcePanel sources={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders toggle button with source count", () => {
    render(<SourcePanel sources={mockSources} />);
    expect(
      screen.getByRole("button", { name: /ver 2 fontes/i }),
    ).toBeInTheDocument();
  });

  it("is collapsed by default", () => {
    render(<SourcePanel sources={mockSources} />);
    expect(screen.queryByText("Documento A")).not.toBeInTheDocument();
  });

  it("expands when toggle is clicked", async () => {
    const user = userEvent.setup();
    render(<SourcePanel sources={mockSources} />);

    const toggle = screen.getByRole("button", { name: /ver 2 fontes/i });
    await user.click(toggle);

    expect(screen.getByText("Documento A")).toBeInTheDocument();
    expect(screen.getByText("Documento B")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ocultar fontes/i }),
    ).toBeInTheDocument();
  });

  it("has correct aria attributes on toggle", () => {
    render(<SourcePanel sources={mockSources} />);

    const toggle = screen.getByRole("button", { name: /ver 2 fontes/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls");
  });

  it("starts expanded when initiallyCollapsed is false", () => {
    render(
      <SourcePanel sources={mockSources} initiallyCollapsed={false} />,
    );
    expect(screen.getByText("Documento A")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ocultar fontes/i }),
    ).toBeInTheDocument();
  });

  it("sorts sources by relevance descending", async () => {
    const user = userEvent.setup();
    render(<SourcePanel sources={mockSources} />);

    await user.click(screen.getByRole("button", { name: /ver 2 fontes/i }));

    const cards = screen.getAllByRole("article");
    expect(cards[0]).toHaveTextContent("Documento A");
    expect(cards[1]).toHaveTextContent("Documento B");
  });

  it("uses aria-labelledby to associate panel with toggle", async () => {
    const user = userEvent.setup();
    render(<SourcePanel sources={mockSources} />);

    await user.click(screen.getByRole("button", { name: /ver 2 fontes/i }));

    const panel = screen.getByRole("region");
    const toggle = screen.getByRole("button", { name: /ocultar fontes/i });
    expect(panel).toHaveAttribute(
      "aria-labelledby",
      toggle.getAttribute("id"),
    );
  });
});
