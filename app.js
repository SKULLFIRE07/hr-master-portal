'use strict';
(() => {
  const portal = document.getElementById('portal');
  let data;
  const iconPaths = {
    payroll: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18m-5 5h2M6 15h3"/>',
    it: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4m-5-9 3-3-3-3m6 6h4"/>',
    medical: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    sales: '<path d="M4 3v17h17M7 14l5-5 4 3 5-7m-5 0h5v5"/>',
    hr: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-16a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5"/>'
  };
  const svg = (paths, cls = '') => `<svg ${cls ? `class="${cls}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const arrow = svg('<path d="M7 17 17 7M7 7h10v10"/>');
  const play = svg('<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; } };
  function link(key, label, primary = false, video = false) {
    const url = safeUrl(data.links[key]);
    return url ? `<a class="button${primary ? ' primary' : ''}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${video ? play : ''}${esc(label)}${video ? '' : arrow}</a>` : `<button class="button" disabled>${esc(label)} — unavailable</button>`;
  }
  const steps = items => `<ol class="steps">${items.map(text => `<li>${esc(text)}</li>`).join('')}</ol>`;
  function contactRows(items, leadership = false) {
    return `<div class="contact-list">${items.map(person => {
      const role = [person.region, person.vertical, person.role].filter(Boolean).join(' · ');
      const phone = person.phone ? `<a href="tel:${esc(String(person.phone).replace(/[^+\d]/g, ''))}">${esc(person.phone)}</a>` : '';
      const email = person.email ? `<a href="mailto:${esc(person.email)}">${esc(person.email)}</a>` : '';
      return `<div class="contact-row"><div class="contact-role">${esc(role)}</div><div>${person.name ? `<div class="contact-name">${esc(person.name)}</div>` : ''}${phone || email ? `<div class="contact-methods">${phone}${email}</div>` : leadership ? '' : '<p class="contact-empty">Contact details awaiting confirmation</p>'}</div></div>`;
    }).join('')}</div>`;
  }
  function group(title, contents, open = false) {
    return `<details class="escalation-group"${open ? ' open' : ''}><summary>${esc(title)}</summary>${contents}</details>`;
  }
  const tabs = {
    'pay-1': () => `<h4 class="panel-title">Your salary slip, a few clicks away.</h4><p class="panel-copy">Download your salary slip from Darwinbox; watch the video for a walkthrough.</p><div class="actions">${link('darwinbox', 'Open Darwinbox', true)}${link('salaryVideo', 'Watch video', false, true)}</div><p class="fine-print">Darwinbox requires your company sign-in. Google sign-in required for videos; access depends on your company sharing permissions.</p>`,
    'pay-2': () => `<h4 class="panel-title">Submit a reimbursement claim</h4>${steps(['Click on the Expenses tab.', 'Click Create Report (name the report, e.g. "Sampark Travel").', 'Click on the Expense tab and upload the bill.', 'Select the appropriate category (e.g. Travel and Accommodation), then select expense type, date, and enter other required details, and submit.', 'Click the 3 dots on the left, add the expense to the report created, and click Submit.'])}<div class="actions">${link('reimbursement', 'Open Reimbursement Portal', true)}${link('reimbursementVideo', 'Watch: How to submit & claim', false, true)}</div><p class="fine-print">Company sign-in required. The supplied entry link is pending admin verification; if it opens a specific report, navigate to Expenses. Google sign-in required for videos; access depends on your company sharing permissions.</p>`,
    'it-1': () => `<h4 class="panel-title">Change or reset your password</h4><h5 class="subheading">Standard change</h5>${steps(['Click the link and open the portal.', 'Enter your username and existing password and log in.', 'Follow the steps and enter and re-enter the new password.', 'Click Submit.'])}<h5 class="subheading">If you forgot your password</h5>${steps(['Once the link is open, click the "Forgot your password?" option.', 'Enter your username and click Continue.', 'Choose Authenticator or Security Question, then click Continue.', 'For Authenticator: enter the code generated on your mobile. For Security Question: answer the question set by you.', 'Click Submit.'])}<div class="actions">${link('passwordReset', 'Password Reset Link', true)}</div><p class="fine-print">This portal may require the company network or VPN.</p>`,
    'it-2': () => data.itContact ? `<h4 class="panel-title">Your IT point of contact</h4>${contactRows([data.itContact])}` : `<div class="empty-state"><span class="pending">Contact pending</span><h4 class="panel-title">IT point of contact</h4><p class="panel-copy">Contact details awaiting confirmation. For help finding the right person, contact your regional HR representative.</p><div class="actions"><button class="button" data-go="hr">Find your HR contact ${arrow}</button></div></div>`,
    'gmc-1': () => `<h4 class="panel-title">Medical support with Doc Prime</h4><p class="panel-copy">Download the Doc Prime app to view your GMC policy, find network hospitals, and raise cashless or reimbursement claims.</p><div class="notice helpline"><div><strong>Policybazaar Claim Support</strong><br>Helpline for your claims</div><a href="tel:18003094876">1800-309-4876</a></div><div class="actions">${link('playStore', 'Play Store', true)}${link('appStore', 'App Store')}${link('gmcHandbook', 'GMC Handbook')}</div><p class="fine-print">The GMC Handbook may require your company sign-in.</p>`,
    'gmc-2': () => `${group('SPOC Structure & Leadership Escalation', contactRows(data.medicalLeadership, true), true)}${group('Claims & Servicing — Contacts', contactRows(data.medicalContacts))}${group('Claims & Servicing — Escalation Levels', contactRows(data.medicalEscalations))}<p class="fine-print">Contacts are reproduced as supplied. Some phone numbers and email spellings await confirmation.</p>`,
    'sales-1': () => data.links.incentive ? `<h4 class="panel-title">Incentive Calculator</h4><p class="panel-copy">Open the calculator to work out your incentive.</p><div class="actions">${link('incentive', 'Open Incentive Calculator', true)}</div>` : `<div class="empty-state"><span class="pending">Link pending</span><h4 class="panel-title">Incentive Calculator</h4><p class="panel-copy">The calculator link is awaiting confirmation from the Sales team. You can use the RAP Calculator in the next tab.</p><div class="actions"><button class="button primary" disabled>Incentive Calculator unavailable</button></div></div>`,
    'sales-3': () => `<h4 class="panel-title">RAP Calculator · Motor</h4><p class="panel-copy">Check your R, A and P performance against your targets.</p><iframe class="rap-frame" id="rap-frame" src="calculators/rap-motor.html" title="Motor RAP performance calculator" loading="lazy" scrolling="no"></iframe>`,
    'hr-1': () => `${data.hrLevels.map((level, index) => group(`Level ${level.level}${level.title ? ` — ${level.title}` : ""}`, contactRows(level.contacts), index === 0)).join('')}<p class="fine-print">Start with Level 1 for your region and vertical, then escalate if needed.</p>`,
    'hr-2': () => `<h4 class="panel-title">Prepare a support request</h4><p class="panel-copy">Choose a category and describe what you need help with. An email draft opens when team routing is available.</p><form id="ticket-form" novalidate><div class="form-grid"><div class="field"><label for="category">Category</label><select id="category" name="category" required><option value="">Select category</option>${Object.keys(data.categories).map(cat => `<option>${esc(cat)}</option>`).join('')}</select></div><div class="field"><label for="subcategory">Sub-Category</label><select id="subcategory" name="subcategory" required disabled><option value="">Select sub-category</option></select></div><div class="field full"><label for="comments">Comments <span>(required)</span></label><textarea id="comments" name="comments" required maxlength="1000" placeholder="Tell us how we can help…" aria-describedby="comments-help comments-count"></textarea><div class="field-help"><span id="comments-help">Do not include passwords, financial or medical details.</span><span id="comments-count">0 / 1000</span></div></div></div><p id="ticket-error" class="error-message" role="alert" hidden></p><div class="actions"><button class="button primary" type="submit">Prepare email ${arrow}</button><button class="button" id="copy-request" type="button">Copy request</button></div><p class="fine-print">Opens your own email app. No request is sent or stored by this portal.</p><p id="ticket-status" class="form-status" role="status"></p><textarea id="request-preview" class="request-preview" aria-label="Support request — select and copy" readonly hidden></textarea></form>${routingConfigured() ? '' : '<div class="notice">Email routing is not configured yet. Contact your regional HR representative. You can copy your request and share it with them.</div>'}`
  };
  const sections = [
    {id:'pay',icon:'payroll',title:'Payroll',description:'Salary slips, reimbursements & claims',tabs:[['pay-1','Salary Slip'],['pay-2','Reimbursement & Claims']]},
    {id:'it',icon:'it',title:'IT Help Desk',description:'Password resets & IT support',tabs:[['it-1','Password Reset'],['it-2','IT POC']]},
    {id:'gmc',icon:'medical',title:'Medical (GMC)',description:'Your health cover, claims & contacts',tabs:[['gmc-1','Doc Prime App'],['gmc-2','Escalation Matrix']]},
    {id:'sales',icon:'sales',title:'Sales Related Issues',description:'Incentive & RAP calculators',tabs:[['sales-1','Incentive Calculator'],['sales-3','RAP Calculator']]},
    {id:'hr',icon:'hr',title:'HR Helpdesk',description:'Regional contacts & support requests',tabs:[['hr-1','Escalation Matrix'],['hr-2','Create Ticket']]}
  ];
  function validEmail(value) { return typeof value === 'string' && /^[^\s@\[\]<>]+@[^\s@\[\]<>]+\.[^\s@\[\]<>]+$/.test(value) && !/@company\.com$/i.test(value); }
  function routingConfigured() { return validEmail(data.ticket?.hrCc) && Object.keys(data.categories).every(cat => validEmail(data.ticket?.teams?.[cat])); }
  function render() {
    portal.removeAttribute('aria-live');
    portal.innerHTML = sections.map((section, index) => `<section class="service" id="section-${section.id}"><h3 class="section-heading"><button class="section-toggle" id="heading-${section.id}" aria-expanded="${index === 0}" aria-controls="content-${section.id}"><span class="service-icon">${svg(iconPaths[section.icon])}</span><span class="section-label"><span class="section-name">${section.title}</span><span class="section-description">${section.description}</span></span>${svg('<path d="m6 9 6 6 6-6"/>', 'chevron')}</button></h3><div class="section-content" id="content-${section.id}" role="region" aria-labelledby="heading-${section.id}"${index === 0 ? '' : ' hidden'}><div class="tablist" role="tablist" aria-label="${section.title}">${section.tabs.map(([id, title], tabIndex) => `<button class="tab" id="tab-${id}" role="tab" aria-selected="${tabIndex === 0}" aria-controls="${id}" tabindex="${tabIndex === 0 ? '0' : '-1'}">${title}</button>`).join('')}</div>${section.tabs.map(([id], tabIndex) => `<div class="tabpanel" id="${id}" role="tabpanel" aria-labelledby="tab-${id}" tabindex="0"${tabIndex === 0 ? '' : ' hidden'}>${tabs[id]()}</div>`).join('')}</div></section>`).join('') + (data.contentWarnings?.length ? `<details class="verification"><summary>About links & contact information</summary><p>Some information is awaiting confirmation by the content owner.</p><ul>${data.contentWarnings.map(warning => `<li>${esc(typeof warning === 'string' ? warning : warning.message || warning.detail || JSON.stringify(warning))}</li>`).join('')}</ul></details>` : '');
    document.getElementById('updated').textContent = `Last updated: ${data.updated}`;
    bind();
  }
  function openSection(id) {
    sections.forEach(section => {
      const active = section.id === id;
      document.getElementById(`heading-${section.id}`).setAttribute('aria-expanded', String(active));
      document.getElementById(`content-${section.id}`).hidden = !active;
    });
    requestRapResize();
  }
  function selectTab(button, focus = false) {
    const section = button.closest('.section-content');
    section.querySelectorAll('[role="tab"]').forEach(tab => { const active = tab === button; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; document.getElementById(tab.getAttribute('aria-controls')).hidden = !active; });
    if (focus) button.focus();
    requestRapResize();
  }
  function requestRapResize() {
    const frame = document.getElementById('rap-frame');
    if (frame && !frame.closest('.section-content').hidden && !frame.closest('.tabpanel').hidden) requestAnimationFrame(() => frame.contentWindow?.postMessage({type:'rap-request-resize'}, location.origin));
  }
  function requestData() {
    const category = document.getElementById('category').value;
    const subcategory = document.getElementById('subcategory').value;
    const comments = document.getElementById('comments').value.trim();
    const error = document.getElementById('ticket-error');
    const valid = Boolean(category && subcategory && comments);
    error.hidden = valid;
    error.textContent = valid ? '' : 'Please select category, sub-category and add a comment.';
    if (!valid) return null;
    return {category,subcategory,subject:`Ticket: ${category} - ${subcategory}`,body:`Category: ${category}\nSub-Category: ${subcategory}\n\nComments:\n${comments}`};
  }
  function bind() {
    portal.querySelectorAll('.section-toggle').forEach(button => button.addEventListener('click', () => {
      if (button.getAttribute('aria-expanded') === 'true') { button.setAttribute('aria-expanded', 'false'); document.getElementById(button.getAttribute('aria-controls')).hidden = true; }
      else openSection(button.id.replace('heading-', ''));
    }));
    portal.querySelectorAll('[role="tab"]').forEach(button => {
      button.addEventListener('click', () => selectTab(button));
      button.addEventListener('keydown', event => {
        const list = Array.from(button.parentElement.querySelectorAll('[role="tab"]'));
        const index = list.indexOf(button);
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % list.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + list.length) % list.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = list.length - 1;
        else return;
        event.preventDefault(); selectTab(list[next], true);
      });
    });
    portal.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => { openSection(button.dataset.go); document.getElementById(`heading-${button.dataset.go}`).scrollIntoView({block:'start'}); document.getElementById(`heading-${button.dataset.go}`).focus({preventScroll:true}); }));
    document.getElementById('category').addEventListener('change', event => {
      const select = document.getElementById('subcategory');
      const options = data.categories[event.target.value] || [];
      select.innerHTML = '<option value="">Select sub-category</option>' + options.map(value => `<option>${esc(value)}</option>`).join(''); select.disabled = !options.length;
      document.getElementById('ticket-status').textContent = '';
    });
    document.getElementById('comments').addEventListener('input', event => { document.getElementById('comments-count').textContent = `${event.target.value.length} / 1000`; });
    document.getElementById('ticket-form').addEventListener('submit', event => {
      event.preventDefault(); const request = requestData(); if (!request) return;
      const status = document.getElementById('ticket-status');
      const recipient = data.ticket?.teams?.[request.category];
      const cc = data.ticket?.hrCc;
      if (!validEmail(recipient) || !validEmail(cc)) { status.textContent = 'Email routing is not configured yet. Contact your regional HR representative.'; return; }
      const url = `mailto:${encodeURIComponent(recipient)}?cc=${encodeURIComponent(cc)}&subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(request.body)}`;
      if (url.length > 2000) { status.textContent = 'This request is too long for an email link. Copy your request and paste it into your email app.'; return; }
      status.textContent = 'Your email draft is ready. Send it from your email app to contact the team.';
      window.location.href = url;
    });
    document.getElementById('copy-request').addEventListener('click', async () => {
      const request = requestData(); if (!request) return;
      const text = `${request.subject}\n\n${request.body}`;
      const status = document.getElementById('ticket-status');
      try { await navigator.clipboard.writeText(text); status.textContent = 'Request copied. Share it with your regional HR representative.'; }
      catch { const preview = document.getElementById('request-preview'); preview.hidden = false; preview.value = text; preview.focus(); preview.select(); status.textContent = 'Select and copy the request below, then share it with your HR representative.'; }
    });
    document.getElementById('rap-frame').addEventListener('load', requestRapResize);
  }
  window.addEventListener('message', event => {
    const frame = document.getElementById('rap-frame');
    if (!frame || event.origin !== location.origin || event.source !== frame.contentWindow || event.data?.type !== 'rap-resize') return;
    const height = Number(event.data.height);
    if (Number.isFinite(height) && height >= 100 && height <= 10000) frame.style.height = `${Math.ceil(height)}px`;
  });
  async function load() {
    try { const response = await fetch('data/portal.json', {cache:'no-cache'}); if (!response.ok) throw new Error('Content unavailable'); data = await response.json(); render(); }
    catch { portal.innerHTML = '<div class="load-state"><div><h3 class="panel-title">We couldn’t load the directory.</h3><p class="panel-copy">Check your connection and try again.</p><div class="actions"><button class="button primary" id="retry">Try again</button></div></div></div>'; document.getElementById('retry').addEventListener('click', load); }
  }
  load();
})();
