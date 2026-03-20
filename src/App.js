import { useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import "./App.scss";

import Header from "./components/header";
import Home from "./pages/home";
import Footer from "./components/footer";
import {
  DEFAULT_THEME_KEY,
  applyThemePreset,
  getThemePreset,
} from "./config/themePresets";

const THEME_STORAGE_KEY = "taehyun-active-theme";

function getInitialThemeKey() {
  if (typeof window === "undefined") return DEFAULT_THEME_KEY;

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme || DEFAULT_THEME_KEY;
}

function App() {
  const [activeThemeKey, setActiveThemeKey] = useState(getInitialThemeKey);
  const activeTheme = useMemo(() => getThemePreset(activeThemeKey), [activeThemeKey]);
  const [previousTheme, setPreviousTheme] = useState(null);
  const isInitialThemeMount = useRef(true);
  const themeTransitionTimerRef = useRef(null);

  const handleThemeChange = (nextThemeKey) => {
    if (nextThemeKey === activeThemeKey) return;
    setPreviousTheme(activeTheme);
    setActiveThemeKey(nextThemeKey);
  };

  useEffect(() => {
    applyThemePreset(activeThemeKey);
    window.localStorage.setItem(THEME_STORAGE_KEY, activeThemeKey);

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

    if (!window.location.hash) return;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
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
    <BrowserRouter>
      <div className="light">
        <Header
          activeTheme={activeTheme}
          activeThemeKey={activeThemeKey}
          onThemeChange={handleThemeChange}
          previousTheme={previousTheme}
        />
        <Switch>
          <Route exact path="/" render={() => <Home activeTheme={activeTheme} />} />
          <Redirect path="*" to="/" />
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
