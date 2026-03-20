import { useEffect, useState } from "react";
import "./footer.scss";
import { ReactComponent as GithubIcon } from "./icons/github.svg";
import {
  getGoatCounterCountUrl,
  getGoatCounterTotalUrl,
} from "../config/analytics";

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
  const [visitorCount, setVisitorCount] = useState(null);

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

  useEffect(() => {
    let active = true;
    const countUrl = getGoatCounterCountUrl();
    const totalUrl = getGoatCounterTotalUrl();
    let retryTimeouts = [];

    if (!countUrl || !totalUrl) return () => {};

    const loadVisitorCount = () =>
      fetch(totalUrl, { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (!active || typeof data?.count !== "string" || !data.count) return false;
          setVisitorCount(data.count);
          return true;
        })
        .catch(() => false);

    const scheduleRetry = (delayMs) => {
      const timeoutId = window.setTimeout(() => {
        loadVisitorCount();
      }, delayMs);
      retryTimeouts.push(timeoutId);
    };

    const existingScript = document.querySelector("script[data-goatcounter]");

    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://gc.zgo.at/count.js";
      script.dataset.goatcounter = countUrl;
      document.body.appendChild(script);

      script.addEventListener("load", () => {
        scheduleRetry(2500);
        scheduleRetry(8000);
      });
    } else {
      scheduleRetry(2500);
    }

    loadVisitorCount().then((didLoad) => {
      if (!didLoad) {
        scheduleRetry(12000);
      }
    });

    return () => {
      active = false;
      retryTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      retryTimeouts = [];
    };
  }, []);

  return (
    <footer className="footer-container">
      <div className="custom-container footer-content">
        <span>{visitorCount ? `Guests Visited: ${visitorCount}` : "Guests Visited: --"}</span>
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
