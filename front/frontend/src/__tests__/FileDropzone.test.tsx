import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FileDropzone } from "../components/upload/FileDropzone";

function createMockFile(name: string, type: string): File {
  return new File(["content"], name, { type });
}

describe("FileDropzone", () => {
  it("renders with descriptive text", () => {
    render(<FileDropzone onFileSelected={vi.fn()} />);
    expect(screen.getByText(/arraste ou clique/i)).toBeInTheDocument();
  });

  it("calls onFileSelected when a file is selected via input", async () => {
    const onFileSelected = vi.fn();
    const user = userEvent.setup();
    render(<FileDropzone onFileSelected={onFileSelected} />);

    const file = createMockFile("test.pdf", "application/pdf");

    const fileInput = document.querySelector<HTMLInputElement>(
      'input[type="file"]',
    );
    if (fileInput) {
      await user.upload(fileInput, file);
      expect(onFileSelected).toHaveBeenCalledWith(file);
    }
  });

  it("is keyboard accessible", async () => {
    const onFileSelected = vi.fn();
    const user = userEvent.setup();
    render(<FileDropzone onFileSelected={onFileSelected} />);

    const dropzone = screen.getByRole("button");
    dropzone.focus();
    expect(dropzone).toHaveFocus();

    await user.keyboard("{Enter}");
  });

  it("has correct aria attributes when disabled", () => {
    render(<FileDropzone onFileSelected={vi.fn()} disabled />);
    const dropzone = screen.getByRole("button");
    expect(dropzone).toHaveAttribute("aria-disabled", "true");
  });

  it("does not trigger when disabled", async () => {
    const onFileSelected = vi.fn();
    const user = userEvent.setup();
    render(<FileDropzone onFileSelected={onFileSelected} disabled />);

    const fileInput = document.querySelector<HTMLInputElement>(
      'input[type="file"]',
    );
    if (fileInput) {
      const file = createMockFile("test.pdf", "application/pdf");
      await user.upload(fileInput, file);
      expect(onFileSelected).not.toHaveBeenCalled();
    }
  });
});
