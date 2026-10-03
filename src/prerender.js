import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { getPhdYearLabel } from "./sections/about";
import { getSeasonThemeKeyForDate, getThemePreset } from "./config/themePresets";

export function render(content, lastUpdatedLabel) {
  const now = new Date();
  const initialState = {
    content,
    lastUpdatedLabel,
    themeKey: getSeasonThemeKeyForDate(now),
    phdYearLabel: getPhdYearLabel(now),
  };

  return {
    initialState,
    theme: getThemePreset(initialState.themeKey),
    markup: renderToString(
      <React.StrictMode>
        <App Router={StaticRouter} initialState={initialState} />
      </React.StrictMode>
    ),
  };
}
