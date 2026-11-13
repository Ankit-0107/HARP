from playwright.sync_api import sync_playwright
import sys
base="http://localhost:3100"; mode=sys.argv[1] if len(sys.argv)>1 else 'reference'; R=[]
def ok(n,c): R.append(bool(c)); print('PASS' if c else 'FAIL',n)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_context(viewport={'width':1440,'height':900}).new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(base+'/privacy',wait_until='networkidle'); pg.wait_for_timeout(1500)
    if mode=='reference':
        ok('privacy: 9 paragraphs, date fixed to "June 5, 2026"',pg.locator('section p.mb-6').count()==9 and pg.get_by_text('June 5, 2026').count()==1)
        top=pg.evaluate("document.querySelector('header').getBoundingClientRect().top+scrollY")
    else:
        ok('privacy (HARP): legal-review notice shown, reference legal text NOT reused',pg.get_by_text('Legal review required').count()==1 and pg.get_by_text('We collect personal data').count()==0)
    ok('privacy: title column sticky','sticky' in pg.evaluate("getComputedStyle(document.querySelector('section header')).position"))
    r=pg.goto(base+'/this-page-does-not-exist'); pg.wait_for_timeout(1500)
    ok('404 status code is real 404',r.status==404)
    ok('404 heading exposes "404"',pg.locator('h1 > span[aria-label]').get_attribute('aria-label')=='404')
    ok('404 has noindex','noindex' in pg.evaluate("document.querySelector('meta[name=robots]')?.content||''"))
    pg.get_by_role('link',name='Back to home').click(); pg.wait_for_url(base+'/'); ok('404 CTA returns home',True)
    ok('footer has NO "404" menu item (removed per blueprint)',pg.locator('footer a',has_text='404').count()==0)
    ok('no template promo / Flowit.Supply / polar.sh anywhere',all(s not in pg.content() for s in ['Flowit','flowit.supply','polar.sh','Buy Now','$99']))
    ok('no page errors '+str(errs[:2]),not errs); b.close()
print(sum(R),'/',len(R))
