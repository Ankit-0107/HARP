from playwright.sync_api import sync_playwright
base="http://localhost:3100"; R=[]
def ok(n,c): R.append(bool(c)); print('PASS' if c else 'FAIL',n)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_context(viewport={'width':1440,'height':900}).new_page()
    pg.goto(base+'/contact',wait_until='networkidle'); pg.wait_for_timeout(1500)
    f=pg.locator('form[aria-label="Contact form"]')
    f.get_by_role('button',name='Join').click(); pg.wait_for_timeout(300)
    ok('empty submit shows 3 field errors',f.locator('[role=alert]:not(:empty)').count()==3)
    ok('invalid fields flagged aria-invalid',f.locator('[aria-invalid=true]').count()==3)
    f.get_by_label('Name').fill('Ada Lovelace'); f.get_by_label('Email').fill('ada@example.com'); f.get_by_label('Message').fill('Hello, I would like to talk about automation.')
    f.get_by_role('button',name='Join').click(); pg.wait_for_timeout(1200)
    st=f.locator('[role=status]').inner_text()
    ok('unconfigured server → honest error, not fake success','not configured' in st.lower())
    ok('form values preserved after failure',f.get_by_label('Name').input_value()=='Ada Lovelace')
    ok('honeypot field hidden from AT',f.locator('input[name=website]').get_attribute('aria-hidden')=='true')
    # newsletter in footer
    nl=pg.locator('footer form'); nl.get_by_placeholder('Your email').fill('ada@example.com'); nl.get_by_role('button').click(); pg.wait_for_timeout(1200)
    ok('newsletter → honest error when not configured','not available' in nl.locator('[role=status]').inner_text().lower())
    pg.screenshot(path='/home/claude/shots/contact-form.png',clip={'x':0,'y':300,'width':1440,'height':800})
    m=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True).new_page(); m.goto(base+'/contact',wait_until='networkidle')
    ok('mobile: no horizontal overflow',m.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"))
    b.close()
print(sum(R),'/',len(R))
