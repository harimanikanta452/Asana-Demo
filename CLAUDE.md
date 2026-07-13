# Asana Demo — Data-Driven Playwright Suite

## What this is
A Playwright + TypeScript test suite for the demo app at
https://create-asana-like-pr-39y5.bolt.host/. Login: `admin` / `password123`.

Six test cases are driven from `data/testCases.json` through a single
parameterized test in `tests/board.spec.ts` (no per-case duplication).
Page objects live in `pages/LoginPage.ts` and `pages/BoardPage.ts`.

## Setup
```bash
npm install
npx playwright install chromium
```

## Run
```bash
npm test              # headless
npm run test:headed   # watch it run
npm run test:ui       # interactive UI mode — best for fixing selectors
npm run codegen       # opens the live app and records real selectors as you click
```

## Known TODOs — please verify against the live app and fix if needed
This suite was written from screenshots, not a live browser session, so two
things are best-guess and need confirming/fixing once you have real
internet access:

1. **`pages/LoginPage.ts`** — the login form itself was never inspected.
   Selectors use common fallback patterns (input type, placeholder,
   accessible button name). Run `npm run test:headed` first; if login
   fails, run `npm run codegen`, log in manually, and copy the exact
   selectors Playwright records into `LoginPage.login()`.

2. **`pages/BoardPage.ts`** — columns are matched by heading text (e.g.
   `To Do (2)`) and cards by task title, then the code walks up the DOM to
   the enclosing container. Both spots are marked `ADJUSTABLE` in comments.
   If a test fails on the tag assertion specifically (task-visibility
   passes but tags don't), widen the ancestor level by one, e.g.
   `xpath=..` → `xpath=../..`.

## Definition of done
`npx playwright test` — all 6 tests in `tests/board.spec.ts` pass headless
against the live app, with `npx playwright test --list` still showing
exactly 6 tests generated from the JSON (i.e. no case got hardcoded/copy-
pasted while debugging). If you edit selectors, fix them in the page
objects, not by adding one-off logic per test case.
