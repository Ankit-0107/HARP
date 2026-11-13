"""Visual/behaviour verification helper (headless Chromium via Python Playwright).
Usage: python3 scripts/verify.py <route> <name> [base_url]
Writes screenshots to /home/claude/shots and prints console errors, failed requests and horizontal-overflow checks."""
import sys, json
from playwright.sync_api import sync_playwright
route, name = sys.argv[1], sys.argv[2]
base = sys.argv[3] if len(sys.argv) > 3 else "http://localhost:3100"
with sync_playwright() as p:
    b = p.chromium.launch()
    for vw, vh, tag in ((1440, 900, "d"), (390, 844, "m")):
        ctx = b.new_context(viewport={"width": vw, "height": vh}); pg = ctx.new_page()
        errs, bad = [], []
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("requestfailed", lambda r: bad.append(r.url[:90]))
        pg.goto(base + route, wait_until="networkidle"); pg.wait_for_timeout(2600)
        pg.screenshot(path=f"/home/claude/shots/{name}-{tag}-top.png")
        h = pg.evaluate("document.documentElement.scrollHeight")
        y = 0
        while y < h:
            pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(180); y += vh // 2
        pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(600)
        pg.screenshot(path=f"/home/claude/shots/{name}-{tag}-full.png", full_page=True)
        overflow = pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        print(json.dumps({"viewport": tag, "height": h, "hOverflowPx": overflow, "consoleErrors": errs[:6], "failedRequests": bad[:6]}))
        ctx.close()
    b.close()
