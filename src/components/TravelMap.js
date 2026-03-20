import { useEffect, useMemo, useState } from "react";
import { geoGraticule10, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import "./TravelMap.css";

const VIEWBOX_WIDTH = 960;
const VIEWBOX_HEIGHT = 540;
const WORLD_ATLAS_URL = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";
const EARTH_CIRCUMFERENCE_MILES = 24901;
const EARTH_RADIUS_MILES = 3958.8;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function haversineDistance(fromCoord, toCoord) {
  const [lon1, lat1] = fromCoord;
  const [lon2, lat2] = toCoord;
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c * 1.025;
}

function TravelMap({ locations = [], routes = [] }) {
  const [countries, setCountries] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);

  useEffect(() => {
    let active = true;

    fetch(WORLD_ATLAS_URL)
      .then((response) => (response.ok ? response.json() : null))
      .then((world) => {
        if (!active || !world?.objects?.countries) return;
        const geo = feature(world, world.objects.countries);
        const filtered = geo.features.filter((country) => String(country.id) !== "010");
        setCountries(filtered);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const projection = useMemo(() => {
    return geoNaturalEarth1().rotate([170, 0]).fitExtent(
      [
        [12, 12],
        [VIEWBOX_WIDTH - 12, VIEWBOX_HEIGHT - 12],
      ],
      { type: "Sphere" }
    );
  }, []);

  const pathGenerator = useMemo(() => geoPath(projection), [projection]);
  const spherePath = useMemo(() => pathGenerator({ type: "Sphere" }), [pathGenerator]);
  const graticulePath = useMemo(() => pathGenerator(geoGraticule10()), [pathGenerator]);

  const markerPositions = useMemo(
    () =>
      locations
        .map((loc) => {
          const lon = toNumber(loc.lon);
          const lat = toNumber(loc.lat);

          if (lon !== null && lat !== null) {
            const projected = projection([lon, lat]);
            if (!projected) return null;
            return {
              ...loc,
              lon,
              lat,
              leftPercent: (projected[0] / VIEWBOX_WIDTH) * 100,
              topPercent: (projected[1] / VIEWBOX_HEIGHT) * 100,
            };
          }

          const x = toNumber(loc.x);
          const y = toNumber(loc.y);
          if (x === null || y === null) return null;

          return {
            ...loc,
            leftPercent: x,
            topPercent: y,
          };
        })
        .filter(Boolean),
    [locations, projection]
  );

  const locationByName = useMemo(() => {
    const map = new Map();
    markerPositions.forEach((loc) => {
      map.set(loc.name, loc);
    });
    return map;
  }, [markerPositions]);

  const routeMetrics = useMemo(() => {
    const defaultRoutes = markerPositions.slice(1).map((loc, index) => ({
      from: markerPositions[index]?.name,
      to: loc.name,
      count: 1,
    }));

    const activeRoutes = routes.length > 0 ? routes : defaultRoutes;

    const normalizedRoutes = activeRoutes
      .map((route) => {
        const from = locationByName.get(route.from);
        const to = locationByName.get(route.to);

        if (
          !from ||
          !to ||
          from.lon == null ||
          from.lat == null ||
          to.lon == null ||
          to.lat == null
        ) {
          return null;
        }

        const count = Math.max(1, Math.round(toNumber(route.count) || 1));

        return {
          from: route.from,
          to: route.to,
          count,
          fromCoord: [from.lon, from.lat],
          toCoord: [to.lon, to.lat],
          pairKey: [route.from, route.to].sort().join("-"),
        };
      })
      .filter(Boolean);

    const pairCounts = normalizedRoutes.reduce((acc, route) => {
      acc[route.pairKey] = (acc[route.pairKey] || 0) + route.count;
      return acc;
    }, {});

    let totalMiles = 0;
    const geoRoutes = normalizedRoutes.map((route, index) => {
      const line = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [route.fromCoord, route.toCoord],
        },
      };

      totalMiles += haversineDistance(route.fromCoord, route.toCoord) * route.count;

      return {
        from: route.from,
        to: route.to,
        pathD: pathGenerator(line) || "",
        strokeWidth: (0.58 * Math.sqrt(pairCounts[route.pairKey] || 1)).toFixed(2),
        glowWidth: (1.7 + 0.72 * Math.sqrt(pairCounts[route.pairKey] || 1)).toFixed(2),
        delay: `${180 + index * 120}ms`,
        isHighlighted:
          Boolean(activeLocation) &&
          (route.from === activeLocation || route.to === activeLocation),
      };
    });

    const earthLaps = totalMiles > 0 ? totalMiles / EARTH_CIRCUMFERENCE_MILES : 0;

    return {
      routes: geoRoutes,
      totalMiles,
      earthLaps,
    };
  }, [routes, markerPositions, locationByName, pathGenerator, activeLocation]);

  const earthLapsLabel = routeMetrics.earthLaps.toFixed(1);
  const totalMilesLabel = Math.round(routeMetrics.totalMiles).toLocaleString();

  return (
    <figure
      className={`travel-map-wrap${activeLocation ? " is-interacting" : ""}`}
      aria-label="Travel map"
    >
      <div className="travel-map-viewport" onMouseLeave={() => setActiveLocation(null)}>
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="travel-map-svg"
          role="img"
          aria-label="World map"
        >
          <defs>
            <linearGradient id="travel-map-route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "var(--accent-olive)", stopOpacity: 0.4 }} />
              <stop
                offset="52%"
                style={{ stopColor: "var(--map-route-stroke)", stopOpacity: 0.94 }}
              />
              <stop offset="100%" style={{ stopColor: "var(--accent-amber)", stopOpacity: 0.62 }} />
            </linearGradient>
            <linearGradient
              id="travel-map-route-gradient-active"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" style={{ stopColor: "var(--accent-olive)", stopOpacity: 0.52 }} />
              <stop
                offset="48%"
                style={{ stopColor: "var(--accent-amber)", stopOpacity: 0.98 }}
              />
              <stop offset="100%" style={{ stopColor: "var(--accent-amber)", stopOpacity: 0.72 }} />
            </linearGradient>
          </defs>
          <path d={spherePath || undefined} className="travel-map-sphere" />
          <path d={graticulePath || undefined} className="travel-map-graticule" />
          <g>
            {countries.map((country, index) => (
              <path
                key={`country-${country.id ?? "unknown"}-${index}`}
                d={pathGenerator(country) || undefined}
                className="travel-map-country"
              />
            ))}
          </g>
          <g className="travel-map-routes-layer">
            {routeMetrics.routes.map((route, index) => (
              <path
                key={`route-glow-${route.from ?? "from"}-${route.to ?? "to"}-${index}`}
                d={route.pathD}
                pathLength={100}
                className={`travel-map-route travel-map-route-glow${
                  activeLocation ? (route.isHighlighted ? " is-highlighted" : " is-dimmed") : ""
                }`}
                style={{
                  strokeWidth: route.glowWidth,
                  "--route-delay": route.delay,
                }}
              />
            ))}
            {routeMetrics.routes.map((route, index) => (
              <path
                key={`route-trail-${route.from ?? "from"}-${route.to ?? "to"}-${index}`}
                d={route.pathD}
                pathLength={100}
                className={`travel-map-route travel-map-route-trail${
                  activeLocation ? (route.isHighlighted ? " is-highlighted" : " is-dimmed") : ""
                }`}
                style={{
                  strokeWidth: route.strokeWidth,
                  "--route-delay": route.delay,
                  "--route-flow-delay": `${540 + index * 160}ms`,
                }}
              />
            ))}
            {routeMetrics.routes.map((route, index) => (
              <path
                key={`route-${route.from ?? "from"}-${route.to ?? "to"}-${index}`}
                d={route.pathD}
                pathLength={100}
                className={`travel-map-route${
                  activeLocation ? (route.isHighlighted ? " is-highlighted" : " is-dimmed") : ""
                }`}
                style={{
                  strokeWidth: route.strokeWidth,
                  "--route-delay": route.delay,
                }}
              />
            ))}
          </g>
        </svg>

        {markerPositions.map((loc, index) => (
          <button
            key={`marker-${loc.name ?? "loc"}-${index}`}
            type="button"
            className={`travel-map-marker${
              activeLocation === loc.name ? " is-active" : ""
            }${activeLocation && activeLocation !== loc.name ? " is-dimmed" : ""}`}
            style={{
              left: `${loc.leftPercent}%`,
              top: `${loc.topPercent}%`,
              "--marker-delay": `${360 + index * 140}ms`,
            }}
            aria-label={`${loc.name}${loc.when ? `, ${loc.when}` : ""}`}
            onMouseEnter={() => setActiveLocation(loc.name)}
            onFocus={() => setActiveLocation(loc.name)}
            onBlur={() => setActiveLocation(null)}
          >
            <span className="travel-map-marker-core" aria-hidden="true" />
            <span className="travel-map-tooltip" role="tooltip">
              <span className="travel-map-tooltip-where">{loc.name}</span>
              {loc.when ? <span className="travel-map-tooltip-when">{loc.when}</span> : null}
              {loc.description ? (
                <span className="travel-map-tooltip-desc">{loc.description}</span>
              ) : null}
            </span>
          </button>
        ))}
      </div>

      <figcaption className="travel-map-stats">
        <span className="travel-map-stats-metric">{`${totalMilesLabel} mi in the air`}</span>
        <span className="travel-map-stats-divider" aria-hidden="true">
          /
        </span>
        <span className="travel-map-stats-note">{`${earthLapsLabel} laps around earth`}</span>
      </figcaption>
    </figure>
  );
}

export default TravelMap;
