import { useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import "./App.scss";

import Header from "./components/header";
import Home from "./pages/home";
import Footer from "./components/footer";
import {
  THEME_PRESETS,
  applyThemePreset,
  getSeasonThemeKeyForDate,
  getThemePreset,
} from "./config/themePresets";

function getInitialThemeKey() {
  return getSeasonThemeKeyForDate();
}

function App({ Router = BrowserRouter, initialState = {} }) {
  const [activeThemeKey, setActiveThemeKey] = useState(
    () => initialState.themeKey || getInitialThemeKey()
  );
  const activeTheme = useMemo(() => getThemePreset(activeThemeKey), [activeThemeKey]);
  const [previousTheme, setPreviousTheme] = useState(null);
  const isInitialThemeMount = useRef(true);
  const themeTransitionTimerRef = useRef(null);

  useEffect(() => {
    // Hydrate the build's theme first, then account for a later season.
    setActiveThemeKey(getInitialThemeKey());
  }, []);

  const handleThemeChange = (nextThemeKey) => {
    if (nextThemeKey === activeThemeKey) return;
    setPreviousTheme(activeTheme);
    setActiveThemeKey(nextThemeKey);
  };

  useEffect(() => {
    const assetUrls = Array.from(
      new Set(
        Object.values(THEME_PRESETS).flatMap((theme) => [
          theme.assets.headerAvatar,
          theme.assets.aboutPhoto,
          theme.assets.switcherIcon,
        ])
      )
    );

    const preloadedImages = assetUrls.map((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
      return image;
    });

    return () => {
      preloadedImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, []);

  useEffect(() => {
    applyThemePreset(activeThemeKey);

    if (themeTransitionTimerRef.current) {
      window.clearTimeout(themeTransitionTimerRef.current);
      themeTransitionTimerRef.current = null;
    }

    if (isInitialThemeMount.current) {
      isInitialThemeMount.current = false;
    } else {
      document.documentElement.removeAttribute("data-theme-transition");
      void document.documentElement.offsetWidth;
      document.documentElement.setAttribute("data-theme-transition", "true");
      themeTransitionTimerRef.current = window.setTimeout(() => {
        document.documentElement.removeAttribute("data-theme-transition");
        setPreviousTheme(null);
        themeTransitionTimerRef.current = null;
      }, 780);
    }
  }, [activeThemeKey]);

  useEffect(
    () => () => {
      if (themeTransitionTimerRef.current) {
        window.clearTimeout(themeTransitionTimerRef.current);
      }
      setPreviousTheme(null);
      document.documentElement.removeAttribute("data-theme-transition");
    },
    []
  );

  return (
    <Router>
      <div className="light">
        <Header
          activeTheme={activeTheme}
          activeThemeKey={activeThemeKey}
          onThemeChange={handleThemeChange}
          previousTheme={previousTheme}
        />
        <Switch>
          <Route exact path="/" render={() => <Home activeTheme={activeTheme} initialState={initialState} />} />
          <Redirect path="*" to="/" />
        </Switch>
        <Footer initialLastUpdated={initialState.lastUpdatedLabel} />
      </div>
    </Router>
  );
}

export default App;
