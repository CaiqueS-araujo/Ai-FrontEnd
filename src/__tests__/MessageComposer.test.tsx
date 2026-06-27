import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MessageComposer } from "../components/chat/MessageComposer";

describe("MessageComposer", () => {
  it("renders textarea and send button", () => {
    render(<MessageComposer onSend={vi.fn()} />);
    expect(screen.getByLabelText("Mensagem")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
  });

  it("calls onSend with trimmed content on Enter", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<MessageComposer onSend={onSend} />);

    const textarea = screen.getByLabelText("Mensagem");
    await user.type(textarea, "Hello{Enter}");

    expect(onSend).toHaveBeenCalledWith("Hello");
    expect(textarea).toHaveValue("");
  });

  it("does not call onSend with empty content", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<MessageComposer onSend={onSend} />);

    const button = screen.getByRole("button", { name: "Enviar" });
    await user.click(button);

    expect(onSend).not.toHaveBeenCalled();
  });

  it("inserts newline on Shift+Enter instead of sending", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<MessageComposer onSend={onSend} />);

    const textarea = screen.getByLabelText("Mensagem");
    await user.type(textarea, "Line1");
    await user.keyboard("{Shift>}{Enter}{/Shift}");
    await user.type(textarea, "Line2{Enter}");

    expect(onSend).toHaveBeenCalledWith("Line1\nLine2");
  });

  it("disables button and textarea when disabled", () => {
    render(<MessageComposer onSend={vi.fn()} disabled />);
    expect(screen.getByLabelText("Mensagem")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
  });
});
