const Header = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="site-header">
      <div className="custom-container d-flex align-items-center justify-content-between">
        <a href="/" className="site-brand" aria-label="Taehyun home">
          <img
            src="/assets/images/profile/avatar1.png"
            alt="Taehyun avatar"
            className="site-brand-avatar"
          />
        </a>

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
