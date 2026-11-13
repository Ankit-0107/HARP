from playwright.sync_api import sync_playwright
base="http://localhost:3100"
R=[]
def ok(name,cond): R.append((name,bool(cond))); print(('PASS' if cond else 'FAIL'),name)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_context(viewport={'width':1440,'height':900}).new_page()
    pg.goto(base+'/',wait_until='networkidle'); pg.wait_for_timeout(2200)
    btn=pg.locator('button[aria-controls=site-menu]')
    btn.click(); pg.wait_for_timeout(900)
    ok('menu opens (aria-expanded)',btn.get_attribute('aria-expanded')=='true')
    ok('menu lists 6 links',pg.locator('#site-menu a').count()==6+0 or pg.locator('#site-menu ul').first.locator('a').count()==6)
    pg.screenshot(path='/home/claude/shots/menu-open.png',clip={'x':0,'y':0,'width':500,'height':520})
    pg.keyboard.press('Escape'); pg.wait_for_timeout(800)
    ok('Esc closes menu',btn.get_attribute('aria-expanded')=='false')
    ok('focus returns to menu button',pg.evaluate("document.activeElement===document.querySelector('button[aria-controls=site-menu]')"))
    # industries slider
    sec=pg.locator('section[aria-label=Industries]'); sec.scroll_into_view_if_needed()
    sec.get_by_label('Next slide').click(); pg.wait_for_timeout(700)
    ok('industries -> 2 / 5',sec.get_by_text('2 / 5').count()>0)
    sec.get_by_label('Previous slide').click(); sec.get_by_label('Previous slide').click(); pg.wait_for_timeout(700)
    ok('industries wraps to 5 / 5',sec.get_by_text('5 / 5').count()>0)
    # testimonials
    t=pg.locator('section[aria-label=Testimonials]'); t.scroll_into_view_if_needed()
    t.get_by_label('Next testimonial').click(); pg.wait_for_timeout(900)
    ok('testimonials -> 2 / 4',t.get_by_text('2 / 4').count()>0)
    # product slider tabs
    s=pg.locator('#hero-slider'); s.scroll_into_view_if_needed()
    s.get_by_role('tab',name='Slide 3').click(); pg.wait_for_timeout(500)
    ok('product slider tab 3 selected',s.get_by_role('tab',name='Slide 3').get_attribute('aria-selected')=='true')
    # stats hover reveal
    card=pg.locator('section[aria-labelledby=stats-title] li').first; card.scroll_into_view_if_needed(); pg.wait_for_timeout(1500)
    panel=card.locator('div.bg-ink'); y0=panel.bounding_box()['y']; card.hover(); pg.wait_for_timeout(900); y1=panel.bounding_box()['y']
    ok('stats panel slides up on hover',y1<y0-20)
    ok('countup renders final value',pg.locator('section[aria-labelledby=stats-title]').inner_text().count('99.6')>=1)
    # skip link
    pg.reload(wait_until='networkidle'); pg.keyboard.press('Tab'); ok('skip link is first focusable',pg.evaluate("document.activeElement.textContent.trim()==='Skip to content'"))
    # reduced motion
    ctx=b.new_context(viewport={'width':1440,'height':900},reduced_motion='reduce'); r=ctx.new_page(); errs=[]
    r.on('pageerror',lambda e:errs.append(str(e))); r.goto(base+'/',wait_until='networkidle'); r.wait_for_timeout(1500)
    ok('reduced-motion: marquee animation none',r.evaluate("getComputedStyle(document.querySelector('.animate-marquee')).animationName")=='none')
    ok('reduced-motion: no page errors',not errs)
    # touch device: stats body readable without hover
    tc=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True); m=tc.new_page(); m.goto(base+'/',wait_until='networkidle')
    ok('touch: stats body visible without hover',m.evaluate("(()=>{const el=document.querySelector('section[aria-labelledby=stats-title] li div.bg-ink');const r=el.getBoundingClientRect();const c=el.parentElement.getBoundingClientRect();return r.top<c.bottom-10})()"))
    b.close()
print(sum(1 for _,c in R if c),'/',len(R),'passed')
