from playwright.sync_api import sync_playwright
base="http://localhost:3100"; R=[]
def ok(n,c): R.append(bool(c)); print('PASS' if c else 'FAIL',n)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_context(viewport={'width':1440,'height':900}).new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    r=pg.goto(base+'/newsroom',wait_until='networkidle'); ok('/newsroom redirects to /newsroom/filters/all',pg.url.endswith('/newsroom/filters/all'))
    pg.wait_for_timeout(1200)
    ok('All: 8 cards',pg.locator('section[aria-live] li').count()==8)
    pg.get_by_role('link',name='Case Study',exact=True).click(); pg.wait_for_url('**/case-study'); pg.wait_for_timeout(800)
    ok('Case Study: 4 cards',pg.locator('section[aria-live] li').count()==4)
    ok('active filter has aria-current',pg.locator('nav[aria-label="Newsroom categories"] a[aria-current=page]').inner_text().strip().lower()=='case study')
    pg.goto(base+'/newsroom/filters/article',wait_until='networkidle'); pg.wait_for_timeout(800)
    ok('Article: 4 cards',pg.locator('section[aria-live] li').count()==4)
    # published article
    pg.goto(base+'/newsroom/axlon-two-platforms-one-line',wait_until='networkidle'); pg.wait_for_timeout(1500)
    ok('published article renders MDX headings',pg.locator('h2:has-text("What we built")').count()==1 and pg.locator('h2:has-text("The result")').count()==1)
    ok('author + date shown',pg.get_by_text('Sarah Collins').count()>0 and pg.get_by_text('March 10, 2026').count()>0)
    ok('published article is indexable-flag aware (reference=noindex)','noindex' in (pg.evaluate("document.querySelector('meta[name=robots]')?.content||''")))
    # sticky aside
    top=pg.evaluate("document.querySelector('aside').getBoundingClientRect().top+scrollY"); pg.evaluate(f"window.scrollTo(0,{int(top)+100})"); pg.wait_for_timeout(500); y2=pg.locator('aside').bounding_box()['y']
    ok('author column is sticky on desktop (pinned 96px from top once its natural position is scrolled past)',pg.evaluate("getComputedStyle(document.querySelector('aside')).position")=='sticky' and 80<=y2<=112)
    # placeholder article
    pg.goto(base+'/newsroom/cargon-automated-floor-peak',wait_until='networkidle'); pg.wait_for_timeout(1200)
    ok('placeholder story shows pending panel + [TBD] body marker',pg.get_by_text('designed placeholder').count()==1 and pg.get_by_text('[TBD] article body').count()==1)
    ok('placeholder story has no MDX section headings (nothing invented)',pg.locator('h2:has-text("The result")').count()==0 and pg.locator('h2:has-text("The challenge")').count()==0)
    ok('placeholder has noindex','noindex' in (pg.evaluate("document.querySelector('meta[name=robots]')?.content||''")))
    ok('all 8 article routes resolve',all(pg.goto(base+f'/newsroom/{s}').status==200 for s in ['automation-should-fit-your-line','axlon-two-platforms-one-line','aerix-every-part-inspection','cargon-automated-floor-peak','voltan-robotic-field-inspection','why-we-build-our-own-lines','reshoring-only-works-if-you-automate','repeatable-to-the-millimeter']))
    ok('unknown slug 404',pg.goto(base+'/newsroom/nope').status==404 and pg.goto(base+'/newsroom/filters/nope').status==404)
    ok('legacy /…/index.html redirects',pg.goto(base+'/about/index.html').url.endswith('/about'))
    m=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True).new_page()
    for path in ['/newsroom/filters/all','/newsroom/axlon-two-platforms-one-line']:
        m.goto(base+path,wait_until='networkidle'); ok(f'mobile no h-overflow {path}',m.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"))
    ok('no page errors',not errs); b.close()
print(sum(R),'/',len(R))
