import { useEffect, useState } from "react";
import "./footer.scss";
import { ReactComponent as GithubIcon } from "./icons/github.svg";

const REPO_COMMIT_API =
  "https://api.github.com/repos/taehyun2017330/taehyun2017330.github.io/commits/main";

function formatLabel(isoDate) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

const Footer = () => {
  const [lastUpdated, setLastUpdated] = useState("Last Updated: --");

  useEffect(() => {
    let active = true;

    const updateFromGitHub = () =>
      fetch(REPO_COMMIT_API, { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          const iso =
            data?.commit?.committer?.date || data?.commit?.author?.date;
          if (!active || !iso) return false;
          setLastUpdated(`Last Updated: ${formatLabel(iso)}`);
          return true;
        })
        .catch(() => false);

    const updateFromSiteMeta = () =>
      fetch("/content/site-meta.json", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (!active || !data?.lastUpdatedLabel) return;
          setLastUpdated(`Last Updated: ${data.lastUpdatedLabel}`);
        })
        .catch(() => {});

    updateFromGitHub().then((didUpdate) => {
      if (!didUpdate) {
        updateFromSiteMeta();
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="footer-container">
      <div className="custom-container footer-content">
        <div className="footer-created">
          <span>Created by Taehyun</span>
          <a
            className="footer-repo-link"
            target="_blank"
            href="https://github.com/taehyun2017330"
            rel="noreferrer"
            aria-label="GitHub repository"
            title="GitHub repository"
          >
            <GithubIcon />
          </a>
        </div>
        <span>{lastUpdated}</span>
      </div>
    </footer>
  );
};

export default Footer;
