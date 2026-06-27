import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConversationsProvider } from "./context/ConversationsContext";
import App from "./App";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConversationsProvider>
      <App />
    </ConversationsProvider>
  </StrictMode>,
);
