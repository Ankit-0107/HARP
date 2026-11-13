import next from "next";
import http from "node:http";

const PORT = 3100;
const BASE = `http://127.0.0.1:${PORT}`;

async function run() {
  console.log("Initializing programmatic Next.js production server on port", PORT, "...");
  const app = next({ dev: false, dir: process.cwd() });
  await app.prepare();
  const handle = app.getRequestHandler();
  const server = http.createServer((req, res) => handle(req, res));

  await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
  console.log("Server listening at", BASE);

  const cleanup = () => {
    try { server.close(); } catch {}
  };
  process.on("exit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, options);
    const text = await res.text();
    return { status: res.status, text, headers: res.headers };
  }

  try {
    console.log("Running route verification suite...\n");

    const routes = [
      { path: "/", expected: 200, label: "Home" },
      { path: "/about", expected: 200, label: "About" },
      { path: "/capabilities", expected: 200, label: "Capabilities Index" },
      { path: "/capabilities/robotic-assembly", expected: 200, label: "Capability Detail: robotic-assembly" },
      { path: "/capabilities/automated-inspection", expected: 200, label: "Capability Detail: automated-inspection" },
      { path: "/capabilities/precision-machining", expected: 200, label: "Capability Detail: precision-machining" },
      { path: "/capabilities/system-integration", expected: 200, label: "Capability Detail: system-integration" },
      { path: "/careers", expected: 200, label: "Careers" },
      { path: "/contact", expected: 200, label: "Contact" },
      { path: "/newsroom", expected: [307, 308, 200], label: "Newsroom Redirect" },
      { path: "/newsroom/filters/all", expected: 200, label: "Newsroom Filter: All" },
      { path: "/newsroom/filters/article", expected: 200, label: "Newsroom Filter: Article" },
      { path: "/newsroom/filters/case-study", expected: 200, label: "Newsroom Filter: Case Study" },
      { path: "/newsroom/automation-should-fit-your-line", expected: 200, label: "News Article 1" },
      { path: "/newsroom/axlon-two-platforms-one-line", expected: 200, label: "News Article 2" },
      { path: "/newsroom/aerix-every-part-inspection", expected: 200, label: "News Article 3" },
      { path: "/privacy", expected: 200, label: "Privacy Policy" },
      { path: "/robots.txt", expected: 200, label: "Robots" },
      { path: "/sitemap.xml", expected: 200, label: "Sitemap" },
      { path: "/icon.svg", expected: 200, label: "Favicon SVG" },
      { path: "/this-route-does-not-exist-404", expected: 404, label: "404 Error Page" },
    ];

    let passed = 0;
    let failed = 0;

    for (const r of routes) {
      const res = await request(r.path, { redirect: "manual" });
      const exp = Array.isArray(r.expected) ? r.expected : [r.expected];
      const ok = exp.includes(res.status);
      if (ok) {
        console.log(`  ✓ [${res.status}] ${r.label} (${r.path})`);
        passed++;
      } else {
        console.error(`  ✗ [${res.status} != ${exp.join("/")}] ${r.label} (${r.path})`);
        failed++;
      }

      // Check for security / leaks in HTML pages
      if (res.status === 200 && (res.headers.get("content-type") || "").includes("text/html")) {
        const lower = res.text.toLowerCase();
        if (lower.includes("flowit")) { console.error(`    LEAK DETECTED: "flowit" on ${r.path}`); failed++; }
        if (lower.includes("polar.sh")) { console.error(`    LEAK DETECTED: "polar.sh" on ${r.path}`); failed++; }
        if (lower.includes("$99")) { console.error(`    LEAK DETECTED: "$99" on ${r.path}`); failed++; }
        if (lower.includes("buy now")) { console.error(`    LEAK DETECTED: "buy now" on ${r.path}`); failed++; }
        if (lower.includes("precpet")) { console.error(`    TYPO DETECTED: "precpet" on ${r.path}`); failed++; }
        if (lower.includes("realtions")) { console.error(`    TYPO DETECTED: "realtions" on ${r.path}`); failed++; }

        // Accessibility checks
        if (!res.text.includes('id="main"')) { console.error(`    A11Y WARNING: Missing main#main on ${r.path}`); }
      }
    }

    // Test API Route: POST /api/contact
    console.log("\nTesting API Routes:");
    const contactRes = await request("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Host: `127.0.0.1:${PORT}`, Origin: `http://127.0.0.1:${PORT}` },
      body: JSON.stringify({ name: "", email: "not-an-email", message: "hi" }),
    });
    if (contactRes.status === 422) {
      console.log(`  ✓ [422] POST /api/contact rejects invalid input with field validation`);
      passed++;
    } else {
      console.error(`  ✗ [${contactRes.status} != 422] POST /api/contact`);
      failed++;
    }

    // Test Honeypot
    const contactHoneypot = await request("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Host: `127.0.0.1:${PORT}`, Origin: `http://127.0.0.1:${PORT}` },
      body: JSON.stringify({ name: "Spam Bot", email: "bot@spam.com", message: "Buy cheap meds now!", website: "https://spam.com" }),
    });
    if (contactHoneypot.status === 200) {
      console.log(`  ✓ [200] POST /api/contact silent-drops honeypot spam`);
      passed++;
    } else {
      console.error(`  ✗ [${contactHoneypot.status} != 200] POST /api/contact honeypot`);
      failed++;
    }

    // Test Newsletter API
    const newsRes = await request("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json", Host: `127.0.0.1:${PORT}`, Origin: `http://127.0.0.1:${PORT}` },
      body: JSON.stringify({ email: "invalid" }),
    });
    if (newsRes.status === 422) {
      console.log(`  ✓ [422] POST /api/newsletter rejects invalid email`);
      passed++;
    } else {
      console.error(`  ✗ [${newsRes.status} != 422] POST /api/newsletter`);
      failed++;
    }

    console.log(`\n=== Live Server Verification Result: ${passed} passed, ${failed} failed ===\n`);
    cleanup();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Test failed with exception:", err);
    cleanup();
    process.exit(1);
  }
}

run();
