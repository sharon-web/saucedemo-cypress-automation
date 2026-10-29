import LoginPage from '../pages/LoginPage';

/**
 * Logs in through the UI and caches the session between tests.
 * @example cy.login('standard_user', 'secret_sauce')
 */
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    LoginPage.visit();
    LoginPage.login(username, password);
    cy.url().should('include', '/inventory.html');
  });
});
