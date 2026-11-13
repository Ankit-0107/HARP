from playwright.sync_api import sync_playwright
base="http://localhost:3100"; R=[]
def ok(n,c): R.append(bool(c)); print('PASS' if c else 'FAIL',n)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_context(viewport={'width':1440,'height':900}).new_page()
    pg.goto(base+'/capabilities',wait_until='networkidle')
    hrefs=pg.locator('section[aria-label=Capabilities] a').evaluate_all('e=>e.map(x=>x.getAttribute("href"))')
    ok('4 capability rows link to detail routes',hrefs==['/capabilities/robotic-assembly','/capabilities/automated-inspection','/capabilities/precision-machining','/capabilities/system-integration'])
    ok('6 industries listed',pg.locator('section[aria-labelledby=industries-title] > div > div:last-child > ul > li').count()==6)
    pg.locator('section[aria-label=Capabilities] a').nth(2).click(); pg.wait_for_url('**/precision-machining'); pg.wait_for_timeout(1200)
    ok('detail renders 6 services + 4 systems',pg.locator('ol').nth(0).locator('li').count()==6 and pg.locator('section[aria-label=Systems] ol li').count()==4)
    pg.goto(base+'/capabilities/robotic-assembly',wait_until='networkidle')
    ok('unpublished capability is a designed placeholder, no invented copy',pg.get_by_text('designed placeholder').count()==1 and pg.locator('.tbd').count()>=3)
    r=pg.evaluate("document.querySelector('meta[name=robots]')?.content||''")
    ok('placeholder page is noindex',('noindex' in r))
    resp=pg.goto(base+'/capabilities/does-not-exist'); ok('unknown slug → 404',resp.status==404)
    b.close()
print(sum(R),'/',len(R))
