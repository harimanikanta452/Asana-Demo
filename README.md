# Asana Demo — Playwright Test Suite

A data-driven Playwright + TypeScript test suite that verifies task cards,
their board columns, and their tags across two projects in the Asana-style
demo app.

## Tech Stack

- [Playwright](https://playwright.dev/) (`@playwright/test`)
- TypeScript
- GitHub Actions (CI)

## Project Structure

```
asana-playwright/
├── playwright.config.ts       # base URL, timeouts, tracing/screenshots/video
├── tsconfig.json
├── data/
│   └── testCases.json         # test scenarios (project, task, column, tags)
├── pages/
│   ├── LoginPage.ts           # login form interactions
│   └── BoardPage.ts           # project navigation, column/card/tag lookups
├── tests/
│   └── board.spec.ts          # test spec, parameterized over testCases.json
└── .github/workflows/
    └── playwright.yml         # CI: runs the suite on every push/PR
```

## Approach

Rather than writing a separate test per scenario, `board.spec.ts` defines a
single parameterized test that loops over `data/testCases.json`. Each entry
in that file describes one scenario:

```json
{
  "id": "TC1",
  "project": "Web Application",
  "task": "Implement user authentication",
  "column": "To Do",
  "tags": ["Feature", "High Priority"]
}
```

Adding, removing, or editing a test case only requires editing the JSON
file — no changes to the test logic itself. Page interactions (login,
navigation, locating a task card, checking its tags) are encapsulated in
`pages/LoginPage.ts` and `pages/BoardPage.ts` using the Page Object Model
pattern, keeping the spec file focused on *what* is being verified rather
than *how*.

## Test Cases

| ID  | Project           | Task                          | Column      | Tags                     |
|-----|-------------------|--------------------------------|-------------|--------------------------|
| TC1 | Web Application   | Implement user authentication  | To Do       | Feature, High Priority   |
| TC2 | Web Application   | Fix navigation bug             | To Do       | Bug                      |
| TC3 | Web Application   | Design system updates          | In Progress | Design                   |
| TC4 | Mobile Application| Push notification system       | To Do       | Feature                  |
| TC5 | Mobile Application| Offline mode                   | In Progress | Feature, High Priority   |
| TC6 | Mobile Application| App icon design                | Done        | Design                   |

## Setup

```bash
npm install
npx playwright install chromium
```

## Running the Tests

```bash
npm test              # headless run
npm run test:headed   # run with a visible browser
npm run test:ui       # Playwright's interactive UI mode
npm run report        # open the HTML report from the last run
```

## Continuous Integration

Every push and pull request to `main` triggers `.github/workflows/playwright.yml`,
which installs dependencies, installs the Chromium browser, runs the full
suite, and uploads the HTML report as a build artifact.

## Configuration

Base URL and other run settings live in `playwright.config.ts`. Login
credentials are passed directly in `tests/board.spec.ts`; for a real
project these would move to environment variables, but they're inlined
here since they're fixed demo credentials.
