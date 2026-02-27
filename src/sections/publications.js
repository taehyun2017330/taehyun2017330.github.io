import { useEffect, useMemo, useState } from "react";
import PublicationEntry from "../components/publicationEntry";
import { loadYamlContent } from "../utils/contentLoader";
import "./publications.css";

const TYPE_ORDER = {
  publication: 0,
  poster: 1,
  preprint: 2,
};

function extractYear(publication) {
  if (publication.year) {
    return Number(publication.year);
  }

  const source = `${publication.conference || ""} ${publication.workshop || ""}`;
  const matches = source.match(/\b(19|20)\d{2}\b/g);
  if (!matches || matches.length === 0) return "Other";
  return Number(matches[matches.length - 1]);
}

function normalizePublicationItem(item = {}, index = 0) {
  const normalizedAuthors = Array.isArray(item.authors)
    ? item.authors.map((author) =>
        typeof author === "string" ? { name: author } : { name: author.name || "", url: author.url || "" }
      )
    : [];

  return {
    type: item.type || "publication",
    year: item.year || null,
    title: item.title || "",
    conference: item.conference || "",
    workshop: item.workshop || "",
    toappear: Boolean(item.toappear),
    award: item.award || "",
    url: item.url || "",
    pdf: item.pdf || "",
    arxiv: item.arxiv || "",
    website: item.website || item.page || "",
    code: item.code || "",
    video: item.video || "",
    authors: normalizedAuthors,
    _index: index,
  };
}

function Publications() {
  const [allPublications, setAllPublications] = useState([]);

  useEffect(() => {
    let active = true;

    loadYamlContent("/content/publications.yml", []).then((items) => {
      if (!active || !Array.isArray(items)) return;
      setAllPublications(items.map((item, index) => normalizePublicationItem(item, index)));
    });

    return () => {
      active = false;
    };
  }, []);

  const groupedPublications = useMemo(() => {
    const groups = new Map();

    allPublications.forEach((publication) => {
      const year = extractYear(publication);
      if (!groups.has(year)) {
        groups.set(year, []);
      }
      groups.get(year).push(publication);
    });

    const sortedYears = Array.from(groups.keys()).sort((a, b) => {
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return b - a;
    });

    return sortedYears.map((year) => ({
      year,
      items: groups
        .get(year)
        .slice()
        .sort((a, b) => {
          const typeOrderDiff = TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
          if (typeOrderDiff !== 0) return typeOrderDiff;
          return a._index - b._index;
        }),
    }));
  }, [allPublications]);

  return (
    <div id="publications" className="custom-section justify-content-center">
      <h2 className="m-0 mb-3">Publication</h2>
      <div className="publication-list">
        <div className="publication-groups">
          {groupedPublications.map((group) => (
            <div key={group.year} className="publication-year-block">
              <p className="publication-year">{group.year}</p>
              {group.items.map((pub, index) => (
                <PublicationEntry
                  key={`${group.year}-${pub.type}-${pub.title}`}
                  publication={pub}
                  showDivider={index !== group.items.length - 1}
                />
              ))}
            </div>
          ))}
          {groupedPublications.length === 0 ? (
            <p className="text-muted mt-2">No publications found.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Publications;
