const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function getLastCommitIso() {
  try {
    return execSync("git log -1 --format=%cI", { encoding: "utf8" }).trim();
  } catch (error) {
    return new Date().toISOString();
  }
}

function formatLabel(isoDate) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

const iso = getLastCommitIso();
const payload = {
  lastUpdatedISO: iso,
  lastUpdatedLabel: formatLabel(iso),
};

const contentDir = path.join(process.cwd(), "public", "content");
fs.mkdirSync(contentDir, { recursive: true });
fs.writeFileSync(
  path.join(contentDir, "site-meta.json"),
  `${JSON.stringify(payload, null, 2)}\n`,
  "utf8"
);
