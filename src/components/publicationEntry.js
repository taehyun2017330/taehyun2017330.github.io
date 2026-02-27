import "./publicationEntry.css";

function ActionIcon({ kind }) {
  if (kind === "pdf") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 3.75h7.5l3.75 3.75V20.25H7z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M14.5 3.75V7.5h3.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="12" y="16.5" textAnchor="middle" fontSize="5.2" fontWeight="700" fill="currentColor">
          PDF
        </text>
      </svg>
    );
  }

  if (kind === "arxiv") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="4.5"
          y="5.5"
          width="15"
          height="13"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text x="12" y="14.7" textAnchor="middle" fontSize="5" fontWeight="700" fill="currentColor">
          arXiv
        </text>
      </svg>
    );
  }

  if (kind === "website") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 12h16M12 4a12.4 12.4 0 0 0 0 16M12 4a12.4 12.4 0 0 1 0 16" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 .8C5.93.8 1 5.73 1 11.8c0 4.86 3.15 8.98 7.52 10.43.55.1.75-.24.75-.53 0-.26-.01-.96-.02-1.88-3.06.67-3.7-1.47-3.7-1.47-.5-1.26-1.22-1.6-1.22-1.6-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.97 1.67 2.56 1.18 3.18.9.1-.71.38-1.18.69-1.46-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.43.11-2.97 0 0 .93-.3 3.05 1.13a10.5 10.5 0 0 1 5.56 0c2.12-1.44 3.05-1.13 3.05-1.13.6 1.54.23 2.69.11 2.97.7.77 1.13 1.75 1.13 2.95 0 4.22-2.58 5.14-5.03 5.42.39.34.74 1.01.74 2.03 0 1.47-.01 2.65-.01 3.01 0 .29.2.64.76.53A10.99 10.99 0 0 0 23 11.8C23 5.73 18.07.8 12 .8z"
        fill="currentColor"
      />
    </svg>
  );
}

function PublicationEntry({ publication, showDivider = true }) {
  const buttonItems = [
    { label: "GitHub", kind: "code", href: publication.code || null },
    { label: "Website", kind: "website", href: publication.website || null },
    { label: "PDF", kind: "pdf", href: publication.pdf || null },
  ].filter((button) => Boolean(button.href));

  const hasCoFirst = publication.authors.some((author) => author.name.includes("*"));

  return (
    <article className="publication-item">
      <p className="publication-title mb-1">
        <span className="publication-title-text">{publication.title}</span>
      </p>

      <p className="mb-1 publication-author-list">
        {publication.authors.map((author, index) => (
          <span key={`${publication.title}-${author.name}`}>
            {author.url ? (
              <a className={author.name.includes("Taehyun Yang") ? "my-name" : ""} href={author.url}>
                {author.name}
              </a>
            ) : (
              <span className={author.name.includes("Taehyun Yang") ? "my-name" : "publication-coauthor"}>
                {author.name}
              </span>
            )}
            {index !== publication.authors.length - 1 ? ", " : ""}
          </span>
        ))}
        {hasCoFirst ? <span className="publication-cofirst ms-2">(* co-first authorship)</span> : null}
      </p>

      <div className="publication-detail-row">
        <p className="publication-venue-line">
          <span className="publication-venue">{publication.conference}</span>
          
          {publication.workshop ? <span className="publication-note"> · {publication.workshop}</span> : null}
        </p>

        <div className="publication-actions" aria-label="Publication links">
          {buttonItems.length > 0 ? (
            buttonItems.map((button) => (
              <a
                key={`${publication.title}-${button.label}`}
                href={button.href}
                className="pub-action-button"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={button.label}
                title={button.label}
              >
                <ActionIcon kind={button.kind} />
              </a>
            ))
          ) : (
            <span className="publication-links-empty">to appear</span>
          )}
        </div>
      </div>

      {publication.award ? <p className="mb-2 publication-award">{publication.award}</p> : null}

      {showDivider ? <hr /> : null}
    </article>
  );
}

export default PublicationEntry;
