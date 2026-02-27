import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import TravelMap from "../components/TravelMap";
import { loadYamlContent } from "../utils/contentLoader";
import "./updates.css";

function getSortableTime(dateValue) {
  if (typeof dateValue === "number") return dateValue;

  if (typeof dateValue === "string") {
    const numeric = Number(dateValue);
    if (!Number.isNaN(numeric)) return numeric;

    const timestamp = Date.parse(dateValue);
    if (!Number.isNaN(timestamp)) return timestamp;
  }

  return 0;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderNewsTitle(item) {
  if (!item.logo || !item.title) {
    return <span>{item.title}</span>;
  }

  const logoWord = item.logoWord || "Adobe";
  const match = item.title.match(new RegExp(`\\b${escapeRegex(logoWord)}\\b`));
  if (!match || typeof match.index !== "number") {
    return <span>{item.title}</span>;
  }

  const before = item.title.slice(0, match.index);
  const after = item.title.slice(match.index + match[0].length);

  return (
    <span>
      {before}
      <span className="inline-logo-word">
        <img src={item.logo} alt={item.logoAlt || `${logoWord} logo`} className="inline-logo-icon" />
        <span>{logoWord}</span>
      </span>
      {after}
    </span>
  );
}

function Updates() {
  const [newsItems, setNewsItems] = useState([]);
  const [travelLocations, setTravelLocations] = useState([]);
  const [travelRoutes, setTravelRoutes] = useState([]);

  useEffect(() => {
    let active = true;

    loadYamlContent("/content/news.yml", []).then((items) => {
      if (!active || !Array.isArray(items)) return;

      const sorted = items
        .map((item, index) => ({ ...item, _originalIndex: index }))
        .sort((a, b) => {
          const timeDiff = getSortableTime(b.date) - getSortableTime(a.date);
          if (timeDiff !== 0) return timeDiff;
          return a._originalIndex - b._originalIndex;
        })
        .slice(0, 3);

      setNewsItems(sorted);
    });

    loadYamlContent("/content/travel.yml", []).then((items) => {
      if (!active || !Array.isArray(items)) return;
      setTravelLocations(items);
    });

    loadYamlContent("/content/travel-routes.yml", []).then((items) => {
      if (!active || !Array.isArray(items)) return;
      setTravelRoutes(items);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="updates" className="custom-section updates-section">
      <Row className="gx-3 gy-4 updates-layout-row">
        <Col xs={12} md={7} className="updates-news-col">
          <h2 className="m-0 mb-3">news</h2>
          {newsItems.map((item, idx) => (
            <div key={item.title} className="updates-row">
              <p className="updates-title mb-0">{renderNewsTitle(item)}</p>
              <p className="updates-date mb-1">{item.date}</p>
              <p className="updates-desc mb-0">{item.description}</p>
              {idx !== newsItems.length - 1 && <hr />}
            </div>
          ))}
        </Col>

        <Col xs={12} md={5} className="updates-travel-col">
          <h2 className="m-0 mb-3">travel</h2>
          <p className="updates-travel-note mb-2">Research-related travels.</p>
          <TravelMap locations={travelLocations} routes={travelRoutes} />
        </Col>
      </Row>
    </section>
  );
}

export default Updates;
