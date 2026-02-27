import { useEffect, useState } from "react";
import "./footer.scss";
import { ReactComponent as GithubIcon } from "./icons/github.svg";

const Footer = () => {
  const [lastUpdated, setLastUpdated] = useState("Last Updated: --");

  useEffect(() => {
    let active = true;

    fetch("/content/site-meta.json", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || !data?.lastUpdatedLabel) return;
        setLastUpdated(`Last Updated: ${data.lastUpdatedLabel}`);
      })
      .catch(() => {});

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
