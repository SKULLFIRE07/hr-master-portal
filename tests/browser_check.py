"""Smoke checks against the actual portal; run with a Playwright-enabled Python."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('PORTAL_URL','http://127.0.0.1:8765/').rstrip('/')+'/'
ROOT=Path(__file__).resolve().parents[1]
SHOTS=ROOT/'.impeccable/review'
SHOTS.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1050})
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    response=page.goto(BASE,wait_until='networkidle')
    assert response.status==200
    page.get_by_role('link',name='Open Darwinbox',exact=True).wait_for()
    assert page.locator('meta[name="robots"]').get_attribute('content')=='noindex,nofollow' or 'noindex' in page.locator('meta[name="robots"]').get_attribute('content')
    sections=page.locator('button[aria-expanded]')
    assert sections.count()==5,sections.count()
    assert sections.nth(0).get_attribute('aria-expanded')=='true'
    # All 10 tabs work and only one section stays open.
    for i in range(5):
        if sections.nth(i).get_attribute('aria-expanded')!='true':sections.nth(i).click()
        assert page.locator('button[aria-expanded="true"]').count()==1
        tabs=page.locator('[role="tab"]:visible')
        assert tabs.count()==2
        for j in range(2):
            tabs.nth(j).click()
            assert tabs.nth(j).get_attribute('aria-selected')=='true'
        tabs.nth(0).click()
        tabs.nth(0).focus()
        page.keyboard.press('ArrowRight')
        assert tabs.nth(1).get_attribute('aria-selected')=='true'
    # Calculator documented cases, validation, and clearing.
    sections.nth(3).click()
    page.get_by_role('tab',name='RAP Calculator',exact=False).click()
    frame=page.frame_locator('#rap-frame')
    for achievements,total in [([100,100,100],'100.00'),([80,70,50],'60.00'),([120,90,110],'108.00'),([79,69,49],'59.00')]:
        for key,achievement in zip('rap',achievements):
            frame.locator('#'+key+'-target').fill('100')
            frame.locator('#'+key+'-achievement').fill(str(achievement))
        frame.get_by_role('button',name='Calculate RAP').click()
        assert frame.locator('.total').inner_text()==total
    frame.locator('#r-target').fill('0')
    frame.get_by_role('button',name='Calculate RAP').click()
    assert frame.locator('#r-target-error').inner_text()=='Target must be greater than 0.'
    frame.locator('#r-target').fill('100')
    frame.locator('#a-achievement').fill('-1')
    frame.get_by_role('button',name='Calculate RAP').click()
    assert frame.locator('#a-achievement-error').inner_text()=='Achievement cannot be negative.'
    frame.get_by_role('button',name='Clear all').click()
    assert frame.locator('#r-target').input_value()==''
    assert frame.locator('#results').is_hidden()
    # Ticket validation and absence of fabricated routing.
    sections.nth(4).click()
    page.get_by_role('tab',name='Create Ticket',exact=False).click()
    page.get_by_role('button',name='Prepare email',exact=False).click()
    assert page.get_by_text('Please select category, sub-category and add a comment.',exact=True).is_visible()
    selects=page.locator('select:visible')
    selects.nth(0).select_option(label='IT Help Desk')
    assert 'Hardware / Access Request' in selects.nth(1).inner_text()
    selects.nth(0).select_option(label='Payroll')
    selects.nth(1).select_option(label='Salary Slip')
    page.locator('textarea:visible').fill('Please help me download my salary slip.')
    page.get_by_role('button',name='Prepare email',exact=False).click()
    assert 'not configured' in page.locator('body').inner_text().lower()
    assert page.locator('a[href*="@company.com"]').count()==0
    # Capture the initial viewport once per device/theme, and check every panel at 360px.
    sections.nth(0).click()
    page.get_by_role('tab',name='Salary Slip',exact=True).click()
    page.screenshot(path=str(SHOTS/'desktop.png'),full_page=True,animations='disabled')
    for scheme in ['light','dark']:
        page.emulate_media(color_scheme=scheme,reduced_motion='reduce')
        page.set_viewport_size({'width':360,'height':900})
        page.screenshot(path=str(SHOTS/('mobile'+('-dark' if scheme=='dark' else '')+'.png')),full_page=True,animations='disabled')
        for i in range(5):
            if sections.nth(i).get_attribute('aria-expanded')!='true':sections.nth(i).click()
            for tab in page.locator('[role="tab"]:visible').all():
                tab.click()
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'Overflow section {i}, {scheme}'
    assert not errors,errors
    browser.close()
print(json.dumps({'status':'passed','url':BASE,'checks':['5 accordions / 10 tabs','keyboard tabs','RAP 100 / 60 / 108 / 59','invalid and clear inputs','dependent ticket categories and unavailable routing','360px all panels light/dark without overflow','no JavaScript errors']}))
