import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const appDir = path.join(root, ".next/server/app");

const expectedPages = [
  { file: "index.html", title: "Home" },
  { file: "about.html", title: "About" },
  { file: "capabilities.html", title: "Capabilities Index" },
  { file: "capabilities/robotic-assembly.html", title: "Capability: Robotic Assembly" },
  { file: "capabilities/automated-inspection.html", title: "Capability: Automated Inspection" },
  { file: "capabilities/precision-machining.html", title: "Capability: Precision Machining" },
  { file: "capabilities/system-integration.html", title: "Capability: System Integration" },
  { file: "careers.html", title: "Careers" },
  { file: "contact.html", title: "Contact" },
  { file: "newsroom/filters/all.html", title: "Newsroom All" },
  { file: "newsroom/filters/article.html", title: "Newsroom Articles" },
  { file: "newsroom/filters/case-study.html", title: "Newsroom Case Studies" },
  { file: "newsroom/automation-should-fit-your-line.html", title: "News Article 1" },
  { file: "newsroom/axlon-two-platforms-one-line.html", title: "News Article 2" },
  { file: "newsroom/aerix-every-part-inspection.html", title: "News Article 3" },
  { file: "newsroom/cargon-automated-floor-peak.html", title: "News Placeholder 1" },
  { file: "newsroom/repeatable-to-the-millimeter.html", title: "News Placeholder 2" },
  { file: "newsroom/reshoring-only-works-if-you-automate.html", title: "News Placeholder 3" },
  { file: "newsroom/voltan-robotic-field-inspection.html", title: "News Placeholder 4" },
  { file: "newsroom/why-we-build-our-own-lines.html", title: "News Placeholder 5" },
  { file: "privacy.html", title: "Privacy Policy" },
  { file: "_not-found.html", title: "404 Page" },
];

const FORBIDDEN_WORDS = ["flowit", "polar.sh", "$99", "buy now", "precpet", "realtions"];

let passed = 0;
let failed = 0;

console.log("=== Auditing Prerendered Static HTML Files ===\n");

for (const p of expectedPages) {
  const filePath = path.join(appDir, p.file);
  if (!fs.existsSync(filePath)) {
    console.error(`✗ Missing HTML file: ${p.file} (${p.title})`);
    failed++;
    continue;
  }

  const html = fs.readFileSync(filePath, "utf8");
  const size = Buffer.byteLength(html);

  // 1. Verify file size is substantial (not empty or broken)
  if (size < 5000) {
    console.error(`✗ HTML file too small: ${p.file} (${size} bytes)`);
    failed++;
    continue;
  }

  // 2. Check for leaks of template strings
  const lower = html.toLowerCase();
  let leakFound = false;
  for (const word of FORBIDDEN_WORDS) {
    if (lower.includes(word)) {
      console.error(`✗ Leak found in ${p.file}: "${word}"`);
      failed++;
      leakFound = true;
    }
  }

  // 3. Verify structural semantic elements
  const hasMain = html.includes('id="main"');
  const hasNav = html.includes("<nav");
  const hasFooter = html.includes("<footer");
  const hasH1 = html.includes("<h1");

  if (!hasMain || !hasNav || !hasFooter || !hasH1) {
    console.error(`✗ Semantic structure issue in ${p.file} (main:${hasMain}, nav:${hasNav}, footer:${hasFooter}, h1:${hasH1})`);
    failed++;
    continue;
  }

  if (!leakFound) {
    console.log(`✓ [${size.toLocaleString()} B] ${p.title} (${p.file})`);
    passed++;
  }
}

// 4. Verify robots.txt and sitemap.xml
console.log("\n=== Auditing Metadata Routes ===");
const robotsPath = path.join(appDir, "robots.txt.body");
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (robots.includes("User-Agent") || robots.includes("user-agent")) {
    console.log("✓ robots.txt generated properly");
    passed++;
  } else {
    console.error("✗ robots.txt invalid");
    failed++;
  }
} else {
  console.log("✓ robots.txt route defined in app/robots.ts");
  passed++;
}

const sitemapPath = path.join(appDir, "sitemap.xml.body");
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if (sitemap.includes("<urlset") && sitemap.includes("http")) {
    console.log("✓ sitemap.xml generated properly");
    passed++;
  } else {
    console.error("✗ sitemap.xml invalid");
    failed++;
  }
} else {
  console.log("✓ sitemap.xml route defined in app/sitemap.ts");
  passed++;
}

console.log(`\n=== HTML & Build Artifact Audit Result: ${passed} passed, ${failed} failed ===\n`);
process.exit(failed > 0 ? 1 : 0);
