// Render the real React homepage after CRA builds its browser assets.
// The build needs no browser, network requests, or running server.
process.env.NODE_ENV = "production";

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const { parse } = require("yaml");

const root = path.resolve(__dirname, "..");
const buildDir = path.join(root, "build");
const outputDir = path.join(root, "node_modules", ".cache", "homepage-prerender");

function readContent(filename) {
  const value = parse(fs.readFileSync(path.join(buildDir, "content", filename), "utf8"));
  if (!Array.isArray(value)) throw new Error(`${filename} must contain a YAML list.`);
  return value;
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

async function main() {
  const compiler = webpack({
    mode: "production",
    target: "node",
    entry: path.join(root, "src", "prerender.js"),
    output: {
      path: outputDir,
      filename: "render.cjs",
      library: { type: "commonjs2" },
    },
    // Use the same React instance as react-dom/server.
    externals: [/^react(?:\/|$)/, /^react-dom(?:\/|$)/],
    optimization: { minimize: false },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: path.join(root, "src"),
          loader: require.resolve("babel-loader"),
          options: {
            babelrc: false,
            configFile: false,
            presets: [[require.resolve("babel-preset-react-app"), { runtime: "automatic" }]],
          },
        },
        // CSS is already emitted by CRA; Node only needs the component markup.
        { test: /\.(css|scss)$/, type: "asset/source" },
        {
          test: /\.svg$/,
          use: [
            {
              loader: require.resolve("@svgr/webpack"),
              options: { prettier: false, svgo: false, titleProp: true, ref: true },
            },
            { loader: require.resolve("file-loader"), options: { emitFile: false } },
          ],
        },
      ],
    },
  });

  await new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      compiler.close((closeError) => {
        if (error || closeError) return reject(error || closeError);
        if (stats.hasErrors()) return reject(new Error(stats.toString({ all: false, errors: true })));
        resolve();
      });
    });
  });

  const { render } = require(path.join(outputDir, "render.cjs"));
  const content = {
    publications: readContent("publications.yml"),
    news: readContent("news.yml"),
    travelLocations: readContent("travel.yml"),
    travelRoutes: readContent("travel-routes.yml"),
  };
  const metadata = JSON.parse(fs.readFileSync(path.join(buildDir, "content", "site-meta.json"), "utf8"));
  const { markup, initialState, theme } = render(content, metadata.lastUpdatedLabel);
  // Escaping '<' prevents content from terminating this inert JSON script.
  const stateJson = JSON.stringify(initialState).replace(/</g, "\\u003c");
  const themeStyle = Object.entries(theme.cssVars).map(([name, value]) => `${name}:${value}`).join(";");
  const indexPath = path.join(buildDir, "index.html");
  const template = fs.readFileSync(indexPath, "utf8");
  if (!template.includes('<div id="root"></div>')) {
    throw new Error("Expected an empty root in the fresh CRA build. Run npm run build before prerendering.");
  }

  const html = template
    .replace('<html lang="en">', `<html lang="en" data-theme="${theme.id}" style="${escapeAttribute(themeStyle)}">`)
    .replace('<div id="root"></div>', () => `<div id="root">${markup}</div><script id="initial-state" type="application/json">${stateJson}</script>`);

  fs.writeFileSync(indexPath, html);
  console.log(`Prerendered homepage with ${content.publications.length} publications and its full biography.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
