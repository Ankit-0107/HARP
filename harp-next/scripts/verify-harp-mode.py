"""HARP-mode audit: no Precept reference content may leak; placeholders must be explicit; every route must render."""
from playwright.sync_api import sync_playwright
import re
base="http://localhost:3100"
routes=['/','/about','/capabilities','/capabilities/precision-machining','/capabilities/robotic-assembly','/capabilities/automated-inspection','/capabilities/system-integration','/careers','/contact','/newsroom/filters/all','/newsroom/filters/article','/newsroom/filters/case-study','/newsroom/automation-should-fit-your-line','/newsroom/axlon-two-platforms-one-line','/newsroom/aerix-every-part-inspection','/newsroom/cargon-automated-floor-peak','/newsroom/voltan-robotic-field-inspection','/newsroom/why-we-build-our-own-lines','/newsroom/reshoring-only-works-if-you-automate','/newsroom/repeatable-to-the-millimeter','/privacy']
LEAK=['Precept','precept','Daniel Hartley','Mara Lindqvist','Sarah Collins','David Reyes','Axlon','Aerix','Cargon','Voltan','99.6','3.2x','40M+','Bush Terminal','Brooklyn','BUILD','Robotics-Driven','Flowit','polar.sh','Lorem','We collect personal data']
bad=0
with sync_playwright() as p:
    b=p.chromium.launch()
    for r in routes+['/nope']:
        pg=b.new_context(viewport={'width':1440,'height':900}).new_page(); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:70])); resp=pg.goto(base+r,wait_until='networkidle'); pg.wait_for_timeout(1300)
        html=pg.content(); txt=pg.evaluate("document.body.innerText")
        leaks=[l for l in LEAK if l in txt or l in re.sub(r'<script.*?</script>','',html,flags=re.S)]
        imgs=pg.evaluate("[...document.querySelectorAll('img')].filter(i=>/original|framerusercontent/.test(i.src)).length")
        tbd=txt.count('[TBD]')+txt.count('TBD')
        status=resp.status; expected=404 if r=='/nope' else 200
        good=(status==expected and not errs and not leaks and imgs==0)
        bad+=0 if good else 1
        print(('ok  ' if good else 'FAIL'),r,status,'| [TBD] markers:',tbd,'| leaks:',leaks[:4],'| errs:',errs[:1])
    b.close()
print('routes with problems:',bad)
