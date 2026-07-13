# Asana Demo — Data-Driven Playwright Suite

A single, parameterized Playwright spec that drives 6 test cases from
`data/testCases.json`. Adding a 7th case later means adding a JSON entry —
no new code.

## Structure

```
asana-playwright/
├── playwright.config.ts   # base URL, retries, tracing/screenshots/video
├── tsconfig.json
├── data/testCases.json    # the 6 (or more) scenarios — the "data" driving the tests
├── pages/
│   ├── LoginPage.ts        # login form interactions
│   └── BoardPage.ts        # project nav + column/card/tag lookups
└── tests/
    └── board.spec.ts       # loops over testCases.json, one test per entry
```

## Setup

```bash
npm install
npx playwright install chromium
```

## Run

```bash
npm test              # headless
npm run test:headed   # see the browser
npm run test:ui       # Playwright's interactive UI mode (best for debugging selectors)
npm run report        # open the HTML report after a run
```

## Before you submit — 2 things to verify against the live app

I built this from the login credentials in the brief and the two board
screenshots you shared (Web Application / Mobile Application columns and
cards). I could not render the live site directly to confirm real
selectors, so there are two spots to sanity-check locally:

1. **Login form** (`pages/LoginPage.ts`) — I never saw this screen, only the
   post-login board. The selectors use common patterns (input types,
   placeholder text, accessible button names) with fallbacks, but you
   should confirm them once. Fastest way:
   ```bash
   npm run codegen
   ```
   Log in manually; Playwright will print the exact selectors it recorded.
   Swap them into `LoginPage.login()` if different.

2. **Column/card DOM nesting** (`pages/BoardPage.ts`) — I matched columns by
   their heading text (e.g. `To Do (2)`) and cards by task title, then walk
   up the DOM to the enclosing card/column container. I marked the two
   spots with `ADJUSTABLE` comments — if a test fails on the tag assertion
   but the task-visibility assertion passes, that's the signal to widen the
   ancestor level by one (e.g. `xpath=..` → `xpath=../..`).

Everything else (project names, task titles, columns, tag names) is copied
directly from your screenshots, so those values should already be correct.

## Why this satisfies "data-driven"

`tests/board.spec.ts` contains exactly one `test()` body inside a `for`
loop over the imported JSON array — there's no per-case duplication. Run
`npx playwright test --list` to confirm all 6 named cases are generated
from that single block.
