export const THEME_PRESETS = {
  autumn: {
    id: "autumn",
    label: "Autumn",
    assets: {
      headerAvatar: "/assets/images/profile/avatar-autumn.png",
      aboutPhoto: "/assets/images/profile/profile-autumn.png",
    },
    cssVars: {
      "--element-primary-color": "#2b2a23",
      "--element-secondary-color": "#636553",
      "--background-primary-color": "#ffffff",
      "--border-color": "#d8d2c6",
      "--highlight-color": "rgba(224, 138, 65, 0.3)",
      "--accent-olive": "#6f7b4b",
      "--accent-forest": "#55603b",
      "--accent-amber": "#e69147",
      "--accent-amber-strong": "rgba(249, 149, 62, 0.82)",
      "--accent-amber-soft": "rgba(238, 172, 113, 0.45)",
      "--accent-border-strong": "rgba(224, 138, 65, 0.68)",
      "--accent-olive-soft": "rgba(111, 123, 75, 0.6)",
      "--map-sphere-stroke": "rgba(66, 58, 44, 0.16)",
      "--map-country-fill": "#d2ccb9",
      "--map-country-stroke": "rgba(255, 255, 255, 0.6)",
      "--map-route-stroke": "#8f836a",
      "--map-marker-color": "#6f7b4b",
      "--map-marker-border": "#f8f5ee",
      "--map-tooltip-bg": "rgba(250, 247, 240, 0.98)",
      "--map-tooltip-border": "rgba(66, 58, 44, 0.2)",
    },
  },
  blue: {
    id: "blue",
    label: "Blue",
    assets: {
      headerAvatar: "/assets/images/profile/avatar-blue.png",
      aboutPhoto: "/assets/images/profile/profile-blue.png",
    },
    cssVars: {
      "--element-primary-color": "#1d1f24",
      "--element-secondary-color": "#606572",
      "--background-primary-color": "#ffffff",
      "--border-color": "#c9ced8",
      "--highlight-color": "rgba(64, 111, 221, 0.2)",
      "--accent-olive": "#2f6dff",
      "--accent-forest": "#0f327f",
      "--accent-amber": "#2f6dff",
      "--accent-amber-strong": "rgba(64, 111, 221, 0.72)",
      "--accent-amber-soft": "rgba(120, 154, 235, 0.42)",
      "--accent-border-strong": "rgba(67, 112, 220, 0.6)",
      "--accent-olive-soft": "rgba(47, 109, 255, 0.6)",
      "--map-sphere-stroke": "rgba(0, 0, 0, 0.12)",
      "--map-country-fill": "#d2d7de",
      "--map-country-stroke": "rgba(255, 255, 255, 0.6)",
      "--map-route-stroke": "#8a96a6",
      "--map-marker-color": "#2f6dff",
      "--map-marker-border": "#ffffff",
      "--map-tooltip-bg": "rgba(255, 255, 255, 0.98)",
      "--map-tooltip-border": "rgba(32, 35, 42, 0.14)",
    },
  },
};

export const ACTIVE_THEME_KEY = "autumn";

export function getThemePreset(key = ACTIVE_THEME_KEY) {
  return THEME_PRESETS[key] || THEME_PRESETS[ACTIVE_THEME_KEY];
}

export function applyThemePreset(key = ACTIVE_THEME_KEY) {
  const preset = getThemePreset(key);
  if (typeof document === "undefined") return preset;

  const root = document.documentElement;
  root.setAttribute("data-theme", preset.id);

  Object.entries(preset.cssVars).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });

  return preset;
}
