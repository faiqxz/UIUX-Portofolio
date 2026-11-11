// Post-build step (runs after `vite build` and `vite build --ssr`, see "build" in package.json):
//   1. renders the React app to static HTML and puts it inside <div id="root"> in dist/index.html,
//      so search engines and AI crawlers that don't execute JavaScript still see the whole page;
//   2. fills __SITE_URL__ / __BUILD_DATE__ in index.html, robots.txt, sitemap.xml and llms.txt.
// The site URL comes from "homepage" in package.json: change the domain there only.
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (!pkg.homepage) throw new Error('Set "homepage" in package.json to the site URL.');
const SITE_URL = pkg.homepage.replace(/\/*$/, "/");
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const fill = text => text.replaceAll("__SITE_URL__", SITE_URL).replaceAll("__BUILD_DATE__", BUILD_DATE);

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const appHtml = render();

const indexPath = path.join(dist, "index.html");
const ROOT = '<div id="root"></div>';
let html = await readFile(indexPath, "utf8");
if (html.split(ROOT).length !== 2) throw new Error(`Expected exactly one ${ROOT} in dist/index.html`);
// Function replacer so "$" sequences in the markup are never treated as replacement patterns.
html = fill(html).replace(ROOT, () => `<div id="root">${appHtml}</div>`);
await writeFile(indexPath, html);

for (const file of ["robots.txt", "sitemap.xml", "llms.txt"]) {
  const p = path.join(dist, file);
  await writeFile(p, fill(await readFile(p, "utf8")));
}

await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: ${(appHtml.length / 1024).toFixed(0)} kB of HTML for ${SITE_URL} (${BUILD_DATE})`);
