# SauceDemo – Cypress E2E Automation

[![Cypress E2E Tests](https://github.com/sharon-web/saucedemo-cypress-automation/actions/workflows/cypress.yml/badge.svg)](https://github.com/sharon-web/saucedemo-cypress-automation/actions/workflows/cypress.yml)
[![Live Test Report](https://img.shields.io/badge/Live%20Test%20Report-View%20on%20GitHub%20Pages-2ea44f)](https://sharon-web.github.io/saucedemo-cypress-automation/)

End-to-end UI test automation for [SauceDemo](https://www.saucedemo.com) built with **Cypress** and **JavaScript**, using the **Page Object Model**, data-driven fixtures, HTML reporting and **GitHub Actions** CI.

> Companion project: [saucedemo-playwright-automation](https://github.com/sharon-web/saucedemo-playwright-automation) – full purchase flow automated with Playwright.

## Scope

| Area | User | Scenarios |
|---|---|---|
| **Sign In** | `standard_user` | Successful login lands on Products page · Logout returns to login page |
| **Sign In** | `locked_out_user` | Locked-out error shown · Input fields flagged invalid · Error can be dismissed · Direct access to `/inventory.html` is blocked |
| **Sign In** | negative | Invalid credentials · Username required · Password required |
| **Products Page** | `standard_user` | 6 products render with name/description/price/image · Sort A→Z, Z→A, price low→high, high→low · Cart badge updates on add/remove · Product details page matches listing · Add/remove from details page · Back to products |

**19 tests** across 2 specs.

## Project Structure

```
├── .github/workflows/cypress.yml   # CI pipeline – runs on every push / PR
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.js             # Sign-in tests (standard & locked-out users)
│   │   └── products.cy.js          # Products page tests
│   ├── fixtures/
│   │   ├── users.json              # Test users / credentials
│   │   └── messages.json           # Expected error messages
│   ├── pages/                      # Page Object Model
│   │   ├── LoginPage.js
│   │   ├── InventoryPage.js
│   │   └── ProductDetailsPage.js
│   └── support/
│       ├── commands.js             # cy.login() with cy.session() caching
│       └── e2e.js
└── cypress.config.js
```

## Design Decisions

- **Page Object Model** – selectors and page actions live in `cypress/pages`, keeping specs readable and maintenance in one place.
- **Stable selectors** – uses the app's `data-test` attributes instead of CSS classes or XPath.
- **Data-driven** – credentials and expected messages are fixtures, not hard-coded in specs.
- **Fast, isolated tests** – `cy.login()` uses `cy.session()` to cache authentication across product tests while each test stays independent.
- **Reliability** – one automatic retry in CI (`runMode: 1`) to absorb network flakiness against a live site.
- **Reporting** – `cypress-mochawesome-reporter` creates a self-contained HTML report with embedded failure screenshots.

## Getting Started

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/sharon-web/saucedemo-cypress-automation.git
cd saucedemo-cypress-automation
npm install
```

| Command | Description |
|---|---|
| `npm test` | Run all tests headless |
| `npm run cy:open` | Open the interactive Cypress runner |
| `npm run test:chrome` | Run headless in Chrome |
| `npm run test:login` | Run sign-in tests only |
| `npm run test:products` | Run products page tests only |

## Test Reports

- **Live report:** [**View the latest test report**](https://sharon-web.github.io/saucedemo-cypress-automation/), published to GitHub Pages after every CI run on `main`.
- **Locally:** after `npm test`, open `cypress/reports/index.html` in a browser.
- **CI artifact:** each run on the [Actions tab](https://github.com/sharon-web/saucedemo-cypress-automation/actions) also includes a downloadable **cypress-html-report**.

> **VS Code users on Windows:** if Cypress fails with `bad option: --smoke-test`, the VS Code terminal has set `ELECTRON_RUN_AS_NODE`. Run `Remove-Item Env:ELECTRON_RUN_AS_NODE` (PowerShell) or `unset ELECTRON_RUN_AS_NODE` (bash) first.

## CI/CD

GitHub Actions runs the full suite in Chrome on every push and pull request to `main`. The HTML report (and screenshots, on failure) are uploaded as build artifacts on the **Actions** tab.

## Author

**Sharon Ogboli** – QA Automation Engineer
