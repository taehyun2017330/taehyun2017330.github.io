import { useEffect } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import "./App.scss";

import Header from "./components/header";
import Home from "./pages/home";
import Footer from "./components/footer";
import { ACTIVE_THEME_KEY, applyThemePreset } from "./config/themePresets";

function App() {
  useEffect(() => {
    applyThemePreset(ACTIVE_THEME_KEY);

    if (!window.location.hash) return;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }, []);

  return (
    <BrowserRouter>
      <div className="light">
        <Header />
        <Switch>
          <Route exact path="/" component={() => <Home />} />
          <Redirect path="*" to="/" />
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
