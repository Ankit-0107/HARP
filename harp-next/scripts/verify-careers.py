from playwright.sync_api import sync_playwright
from PIL import Image
base="http://localhost:3100"; R=[]
def ok(n,c): R.append(bool(c)); print('PASS' if c else 'FAIL',n)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_context(viewport={'width':1440,'height':900}).new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(base+'/careers',wait_until='networkidle'); pg.wait_for_timeout(1500)
    sel="document.querySelector('[role=group][aria-label^=\"We hire\"]')"
    top=pg.evaluate(f"{sel}.getBoundingClientRect().top+scrollY"); hh=pg.evaluate(f"{sel}.offsetHeight")
    ops=[]
    for f in (0.02,0.5,0.98):
        pg.evaluate(f"window.scrollTo(0,{top}+({hh}-900)*{f})"); pg.wait_for_timeout(700)
        ops.append(pg.evaluate(f"[...{sel}.querySelectorAll('p span')].map(s=>+getComputedStyle(s).opacity)"))
        pg.screenshot(path=f'/home/claude/shots/cs{int(f*100)}.png')
    ok('statement words start dim (<0.5 avg)',sum(ops[0])/len(ops[0])<0.5)
    ok('statement words light up with scroll',sum(ops[1])/len(ops[1])>sum(ops[0])/len(ops[0]) and sum(ops[2])/len(ops[2])>0.9)
    ok('statement exposed as text via aria-label',pg.evaluate(f"{sel}.getAttribute('aria-label').startsWith('We hire')"))
    pg.get_by_role('link',name='See Open Positions').click(); pg.wait_for_timeout(1500)
    ok('CTA anchors to #positions',pg.evaluate("location.hash")=='#positions' and pg.evaluate("document.getElementById('positions').getBoundingClientRect().top")<300)
    ok('12 position cards',pg.locator('#positions li').count()==12)
    ok('open positions count animates to 12',pg.locator('#positions p span.font-mono').inner_text().strip()=='12')
    ok('no template filler "Lorem" rendered',pg.content().count('Lorem')==0)
    ok('no page errors',not errs)
    b.close()
print(sum(R),'/',len(R))
ims=[Image.open(f'/home/claude/shots/cs{n}.png').resize((480,300)) for n in (2,50,98)]
o=Image.new('RGB',(480*3,300));[o.paste(im,(i*480,0)) for i,im in enumerate(ims)]; o.save('/home/claude/shots/careers-scroll.png')
