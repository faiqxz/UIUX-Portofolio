import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.tsx";

/** Build-time only: renders the page to static HTML so crawlers that don't run JavaScript
    (most AI search bots, link previews) still see the full content. See scripts/prerender.mjs. */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
