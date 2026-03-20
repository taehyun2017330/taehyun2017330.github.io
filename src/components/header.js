import { THEME_PRESETS } from "../config/themePresets";

const themeSwitcherOrder = ["autumn", "blue"];

const Header = ({ activeTheme, activeThemeKey, onThemeChange, previousTheme }) => {
  const themeOptions = themeSwitcherOrder.map((key) => THEME_PRESETS[key]).filter(Boolean);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="site-header">
      <div className="custom-container d-flex align-items-center justify-content-between">
        <div className="site-brand-avatar-stack">
          <a href="/" className="site-brand" aria-label="Taehyun home">
            <span className="site-brand-avatar-shell" aria-hidden="true">
              <span key={activeTheme.id} className="site-brand-avatar-backplate">
                <svg
                  viewBox="0 0 120 44"
                  className="site-brand-avatar-pool"
                  preserveAspectRatio="none"
                >
                  <ellipse
                    className="site-brand-avatar-pool-glow"
                    cx="60"
                    cy="24"
                    rx="48"
                    ry="16"
                  />
                  <ellipse
                    className="site-brand-avatar-pool-core"
                    cx="60"
                    cy="24"
                    rx="38"
                    ry="12"
                  />
                  <ellipse
                    className="site-brand-avatar-pool-ripple"
                    cx="60"
                    cy="24"
                    rx="38"
                    ry="12"
                  />
                  {previousTheme ? (
                    <>
                      <ellipse
                        className="site-brand-avatar-pool-glow-previous"
                        cx="60"
                        cy="24"
                        rx="48"
                        ry="16"
                        style={{
                          fill: `color-mix(in srgb, ${previousTheme.cssVars["--avatar-floor-color"]} 18%, #ffffff)`,
                        }}
                      />
                      <ellipse
                        className="site-brand-avatar-pool-core-previous"
                        cx="60"
                        cy="24"
                        rx="38"
                        ry="12"
                        style={{ fill: previousTheme.cssVars["--accent-amber-strong"] }}
                      />
                    </>
                  ) : null}
                </svg>
              </span>
              <img
                src={activeTheme.assets.headerAvatar}
                alt="Taehyun avatar"
                className="site-brand-avatar"
              />
            </span>
          </a>
          <span className="site-theme-switcher" aria-label="Seasonal theme switcher">
            {themeOptions.map((theme) => {
              const isActive = theme.id === activeThemeKey;

              return (
                <button
                  key={theme.id}
                  type="button"
                  className={`site-theme-button theme-${theme.id}${isActive ? " is-active" : ""}`}
                  onClick={() => onThemeChange(theme.id)}
                  aria-label={`Switch to ${theme.label.toLowerCase()} theme`}
                  title={theme.label}
                >
                  <img src={theme.assets.switcherIcon} alt="" className="site-theme-button-icon" />
                </button>
              );
            })}
          </span>
        </div>

        <nav className="desktop-nav" aria-label="Main navigation">
          <button type="button" className="desktop-nav-link" onClick={() => scrollToSection("about")}>
            home
          </button>
          <button
            type="button"
            className="desktop-nav-link"
            onClick={() => scrollToSection("publications")}
          >
            publication
          </button>
          <a
            href="/assets/docs/Taehyun_CV.pdf"
            target="_blank"
            rel="noreferrer"
            className="desktop-nav-link"
          >
            cv
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
