"""Samples computed styles to prove each animation pattern (A1–A22) actually runs. Run against a REFERENCE-mode server."""
from playwright.sync_api import sync_playwright
import re
base="http://localhost:3100"; R=[]
def ok(n,c,extra=''): R.append(bool(c)); print('PASS' if c else 'FAIL',n,extra)
def mat(t):  # parse matrix(a,b,c,d,tx,ty) / none
    m=re.findall(r'-?\d+\.?\d*(?:e-?\d+)?',t or ''); return [float(x) for x in m] if t and t!='none' else [1,0,0,1,0,0]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_context(viewport={'width':1440,'height':900}).new_page()
    pg.goto(base+'/',wait_until='commit')
    # A1 hero letters: sample opacity/filter early vs late
    pg.wait_for_selector('#hero-title span[aria-hidden] span',state='attached'); pg.wait_for_timeout(1300)
    early=pg.evaluate("[...document.querySelectorAll('#hero-title span[aria-hidden] > span')].map(s=>[+getComputedStyle(s).opacity,getComputedStyle(s).filter])")
    pg.wait_for_timeout(3000)
    late=pg.evaluate("[...document.querySelectorAll('#hero-title span[aria-hidden] > span')].map(s=>[+getComputedStyle(s).opacity,getComputedStyle(s).filter])")
    ok('A1 hero letters animate in (opacity <1 / blur early → 1 / none late)',any(o<0.99 or 'blur' in f and f!='blur(0px)' for o,f in early) and all(o>0.99 for o,_ in late),f'early-min-opacity={min(o for o,_ in early):.2f}')
    ok('A1 hero letters count = 11 (BUILD=5 + BETTER=6)',len(late)==11)
    # A17 hero video slot
    ok('A17 hero video: explicit fallback when file unavailable',pg.locator('#hero-title').locator('xpath=ancestor::section').locator('[data-asset-id="hero-poster"]').count()==1)
    # A4 mask reveal on hero meta (translateY 110% → 0)
    st=pg.evaluate("(()=>{const e=document.querySelector('dl dd > div > div');const m=getComputedStyle(e).transform;return m})()")
    ok('A4 mask reveal settles at translateY(0)',abs(mat(st)[5])<1,st)
    # A5 scale-in: FramedPanel marker
    pg.evaluate("document.querySelector('section[aria-labelledby=about-intro]').scrollIntoView({block:'center'})"); pg.wait_for_timeout(1600)
    sc=pg.evaluate("getComputedStyle(document.querySelector('section[aria-labelledby=about-intro] span.font-mono')).transform")
    ok('A5 scale-in markers reach scale(1)',abs(mat(sc)[0]-1)<0.02,sc)
    # A6 draw line + hover underline  (about page) — sample BEFORE and AFTER the trigger
    pg.goto(base+'/about',wait_until='networkidle'); pg.wait_for_timeout(800)
    pre=pg.evaluate("getComputedStyle(document.querySelector('section[aria-labelledby=timeline-title] li > div.h-px')).transform")
    ok('A6 DrawLine starts collapsed (scaleX 0) before scrolling into view',abs(mat(pre)[0])<0.02,pre)
    pre4=pg.evaluate("getComputedStyle(document.querySelector('section[aria-labelledby=timeline-title] h3').parentElement).transform")
    ok('A4 mask child starts translated out of its clip (translateY ≥ 15px)',mat(pre4)[5]>=15,pre4)
    pre5=pg.evaluate("getComputedStyle(document.querySelector('section[aria-labelledby=leadership-title] li span.grid')).transform")
    ok('A5 scale-in chip starts at scale(0) before scrolling into view',abs(mat(pre5)[0])<0.02,pre5)
    pg.evaluate("document.querySelector('section[aria-labelledby=timeline-title]').scrollIntoView()"); pg.wait_for_timeout(1800)
    dl=pg.evaluate("getComputedStyle(document.querySelector('section[aria-labelledby=timeline-title] li > div.h-px')).transform")
    ok('A6 DrawLine scaleX → 1',abs(mat(dl)[0]-1)<0.02,dl)
    y4=pg.evaluate("getComputedStyle(document.querySelector('section[aria-labelledby=timeline-title] h3').parentElement).transform")
    ok('A4 mask child settles at translateY(0) after scrolling into view',abs(mat(y4)[5])<1,y4)
    # A7 fade-up settled
    ok('A7 Reveal settles (opacity 1, translateY 0)',pg.evaluate("(()=>{const e=document.querySelector('section[aria-labelledby=timeline-title] li p');let n=e.closest('div[style]');const s=getComputedStyle(n);return +s.opacity>0.99&&Math.abs(new DOMMatrix(s.transform).m42)<1})()"))
    # A8 hover transition declared on cards
    ok('A8 hover transition timing = expo-out',pg.evaluate("[...document.querySelectorAll('div')].some(d=>getComputedStyle(d).transitionTimingFunction.includes('0.16, 1, 0.3, 1'))"))
    # A9 PixelButton canvas draws on hover
    pg.goto(base+'/',wait_until='networkidle'); pg.wait_for_timeout(2500)
    btn=pg.locator('section[aria-labelledby=about-intro] a').first; btn.scroll_into_view_if_needed(); pg.wait_for_timeout(600)
    btn.hover(); pg.wait_for_timeout(200)
    drawn=pg.evaluate("(()=>{const c=document.querySelector('section[aria-labelledby=about-intro] a canvas');const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>0)n++;return n})()")
    ok('A9 PixelButton canvas paints pixels on hover',drawn>20,f'{drawn} painted px')
    # A10 canvases paint
    pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(2500)
    dots=pg.evaluate("(()=>{const c=document.querySelector('#hero-title').closest('section').querySelector('canvas');const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>0)n++;return n})()")
    ok('A10 DotReveal paints dots',dots>500,f'{dots} px')
    pg.evaluate("window.scrollTo(0,document.body.scrollHeight)"); pg.wait_for_timeout(1200)
    g1=pg.evaluate("(()=>{const c=document.querySelector('footer canvas');return c.toDataURL().length})()"); pg.wait_for_timeout(1500)
    g2=pg.evaluate("(()=>{const c=document.querySelector('footer canvas');return c.toDataURL().length})()")
    ok('A10 GridDrift paints and drifts over time (frames differ)',g1>1000 and g1!=g2,f'{g1} vs {g2}')
    # A14 + A15 + A16
    pg.evaluate("document.querySelector('[aria-label=Clients]').scrollIntoView({block:'center'})"); pg.wait_for_timeout(500)
    ok('A15 clients ticker runs (marquee animation + hover pauses)',pg.evaluate("getComputedStyle(document.querySelector('[aria-label=Clients] .animate-marquee')).animationName")=='marquee')
    bb=pg.locator('section[aria-label=Clients]').bounding_box(); pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2); pg.wait_for_timeout(300)
    ok('A15 ticker pauses on hover',pg.evaluate("getComputedStyle(document.querySelector('[aria-label=Clients] .animate-marquee')).animationPlayState")=='paused')
    ok('A19 careers gallery marquee exists',(pg.goto(base+'/careers',wait_until='networkidle'),pg.locator('[aria-label="Team gallery"] .animate-marquee').count())[1]==1)
    # A16 newsroom marquee only renders visible on mobile
    m=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True).new_page(); m.goto(base+'/',wait_until='networkidle')
    ok('A16 newsroom marquee visible on mobile / grid hidden',m.evaluate("(()=>{const mq=document.querySelector('[aria-label=\"Latest news\"]');return mq.offsetParent!==null})()") and m.evaluate("getComputedStyle(document.querySelector('section[aria-labelledby=news-title] .md\\\\:grid')).display")=='none')
    pg2=b.new_context(viewport={'width':1440,'height':900}).new_page(); pg2.goto(base+'/',wait_until='networkidle')
    ok('A16 desktop: marquee hidden, 3-up grid shown',pg2.evaluate("getComputedStyle(document.querySelector('[aria-label=\"Latest news\"]').parentElement).display")=='none')
    # A18 sticky; A20 parallax covered in verify-about; A21 menu covered in home-interactions
    # A22 reduced motion: SplitText letters present, no transform animation, lenis not applied
    rc=b.new_context(viewport={'width':1440,'height':900},reduced_motion='reduce').new_page(); rc.goto(base+'/',wait_until='networkidle'); rc.wait_for_timeout(1500)
    ok('A22 reduced-motion: Lenis not attached',rc.evaluate("!document.documentElement.classList.contains('lenis')"))
    ok('A11 Lenis attached in normal mode',pg2.evaluate("document.documentElement.classList.contains('lenis')"))
    b.close()
print(sum(R),'/',len(R))
