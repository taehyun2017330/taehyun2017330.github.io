import { SEASON_THEME_ORDER, THEME_PRESETS } from "../config/themePresets";

const Header = ({
  activeTheme,
  activeThemeKey,
  onThemeChange,
  previousTheme,
}) => {
  const themeOptions = SEASON_THEME_ORDER.map((key) => THEME_PRESETS[key]).filter(Boolean);

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
          <span className="season-grid" role="group" aria-label="Choose seasonal theme">
            {themeOptions.map((theme) => {
              const isActive = theme.id === activeThemeKey;

              return (
                <button
                  key={theme.id}
                  type="button"
                  className={`season-grid-button season-${theme.id}${isActive ? " is-active" : ""}`}
                  onClick={() => onThemeChange(theme.id)}
                  aria-label={
                    isActive
                      ? `Selected season: ${theme.label}`
                      : `Switch to ${theme.label.toLowerCase()} theme`
                  }
                >
                  <img src={theme.assets.switcherIcon} alt="" className="season-grid-icon" />
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
