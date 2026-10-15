# HR Master Portal

A mobile-friendly employee resource portal for payroll, IT, medical cover, sales calculators and HR support. Built with static HTML, CSS and JavaScript and published through GitHub Pages. Employees open the link or scan the static QR code without signing in to the portal.

- Portal: https://skullfire07.github.io/hr-master-portal/
- Repository: https://github.com/SKULLFIRE07/hr-master-portal
- QR PNG: https://skullfire07.github.io/hr-master-portal/assets/hr-portal-qr.png
- QR SVG for print: https://skullfire07.github.io/hr-master-portal/assets/hr-portal-qr.svg

## Run locally

There is no build step. Serve the repository root with Python so the browser can fetch the content JSON:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Opening `index.html` directly through a `file:` URL may prevent content loading.

## Maintain content

Edit `data/portal.json` to update links, medical contacts, HR escalation levels, ticket categories and recipient addresses. Update `updated` in `YYYY-MM-DD` format after every content change. Keep phone numbers as strings, preserve verified email spelling, and use JSON `null` for information that has not been supplied. Never substitute invented people or example email addresses.

Review the `contentWarnings` list with the content owner. The supplied medical matrix includes shared phone numbers, possible email spelling errors and an unconfirmed identity match for Naveen Kumar. These values are preserved from the PRD rather than silently corrected. The reimbursement link appears to point to a specific report. Drive video permissions, password-reset access and the GMC handbook must be tested by the owner using a normal employee account and a personal phone on mobile data. External services may require their own company login or network access.

Missing owner inputs include the Incentive Calculator URL, IT point of contact, HR Level 1 contacts for North/South/East, and phone/email details for the corresponding Level 2 contacts. Missing information is identified in the interface. Motor is intentionally absent from HR Level 1, and the removed Sales escalation matrix is not restored.

## Ticket delivery

The PRD supplies no real category recipient mailboxes or HR CC address. These fields remain `null`, and the portal must not claim that a ticket has been sent. A static page cannot send or track email on its own. When real mailboxes are configured, the email-app flow can prepare a draft; the employee must send it using a configured mail application. There is no ticket ID, delivery guarantee, tracker, attachment upload or server-side storage. Long drafts can exceed mailto URL limits.

For automated delivery and tracking, connect an approved backend such as Google Apps Script/Forms, Microsoft Forms/Power Automate or the company's existing helpdesk. This requires the owner's real recipients, service configuration and confirmation of the intended workflow. No backend credentials or invented recipients are bundled here.

## RAP calculator

The original prototype ZIP and standalone Motor calculator were not supplied. This implementation was rebuilt from the supplied `HR-Master-Portal-PRD.md`, including its calculation rules:

| Part | Weight | Minimum achievement |
| --- | ---: | --- |
| R | 20 | Target × 0.8 |
| A | 20 | Target × 0.7 |
| P | 60 | Target × 0.5 |

Each part score is `Achievement / Target × Weight`. The total is `R + A + P` and can exceed 100. Minimum thresholds determine each part's status; they do not zero or cap the score. Targets must be greater than zero and achievements must be nonnegative. Displayed values are rounded to two decimal places; calculations retain full precision until display. Clear all resets the inputs.

PRD examples: achievements/targets of `100/100, 100/100, 100/100` total **100**; `80/100, 70/100, 50/100` total **60**; `120/100, 90/100, 110/100` total **108**.

## Deploy with GitHub Pages

In the repository's **Settings → Pages**, select **Deploy from a branch**, choose `main`, and select `/ (root)`. Save and enable HTTPS. Commit and push updates to `main`; GitHub Pages republishes them. `.nojekyll` keeps this a plain static deployment. Relative asset paths support the repository subpath `/hr-master-portal/`.

The portal and its contact data are public. `noindex, nofollow` requests search-engine exclusion; it does not provide authentication or restrict access to names, phone numbers or email addresses. The PRD requests a public link with no portal login. If the owner later requires private access, migrate to a host with access controls and regenerate the QR if the final URL changes. Use a company-owned repository and stable domain for long-term ownership when available.

## Generate the static QR

Only generate the QR after confirming that the final production URL works:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python make_qr.py https://skullfire07.github.io/hr-master-portal/
```

The script writes `assets/hr-portal-qr.png` and `assets/hr-portal-qr.svg`; use `--output-dir DIRECTORY` to choose another location. Both encode the exact supplied HTTPS URL, use error correction Q, a four-module quiet zone, and black modules on white. The SVG includes a white background. No redirect service or runtime QR dependency is involved.

Commit the generated images and push them to publish the portal's QR. The image continues to work while the encoded URL remains valid. For print, use the SVG at least 2.5 cm square, keep the white margin, and verify scans with iPhone and Android cameras before distributing posters.

## Handoff checks

Open the production portal while signed out; check all five accordion sections and ten sub-tabs, keyboard navigation, narrow mobile layout, light/dark appearance, contact links, and the three RAP examples above. Confirm that missing ticket configuration never produces a false success message. Scan the published static QR and confirm it opens the same production URL. Owner verification of contacts and external access remains required; a successful portal deployment cannot establish whether those third-party accounts and contact details are correct.

## Development verification

The browser smoke test uses Python Playwright and an installed Chrome:

```sh
.venv/bin/python -m pip install playwright
.venv/bin/python tests/browser_check.py
```

It checks all accordions/sub-tabs, keyboard tab movement, calculator arithmetic and invalid inputs, honest unavailable ticket routing, and 360px layouts in both themes. Set `PORTAL_URL` to test another served URL. Screenshots are written under the ignored `.impeccable/review/` directory. Adjust the Chrome executable path in the test on other operating systems.

An unsigned HTTP check on 15 October 2026 reached every supplied external URL. Both Google Drive video links redirected to Google sign-in; their owner must confirm sharing permissions for employees. HTTP success alone does not confirm access behind an employee login.
