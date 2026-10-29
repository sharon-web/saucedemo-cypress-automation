import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

describe('Sign In', () => {
  let users;
  let messages;

  before(() => {
    cy.fixture('users').then((data) => (users = data));
    cy.fixture('messages').then((data) => (messages = data));
  });

  beforeEach(() => {
    LoginPage.visit();
  });

  it('displays the login form', () => {
    LoginPage.elements.logo().should('have.text', 'Swag Labs');
    LoginPage.elements.username().should('be.visible');
    LoginPage.elements.password().should('be.visible').and('have.attr', 'type', 'password');
    LoginPage.elements.loginButton().should('be.visible');
  });

  context('standard_user', () => {
    it('signs in successfully and lands on the products page', () => {
      LoginPage.login(users.standard.username, users.standard.password);

      cy.url().should('include', '/inventory.html');
      InventoryPage.elements.title().should('have.text', 'Products');
      InventoryPage.elements.items().should('have.length', 6);
    });

    it('signs out and is returned to the login page', () => {
      LoginPage.login(users.standard.username, users.standard.password);
      InventoryPage.logout();

      cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
      LoginPage.elements.loginButton().should('be.visible');
    });
  });

  context('locked_out_user', () => {
    it('is blocked from signing in with a locked-out error', () => {
      LoginPage.login(users.lockedOut.username, users.lockedOut.password);

      LoginPage.assertError(messages.lockedOut);
      cy.url().should('not.include', '/inventory.html');
    });

    it('highlights both input fields as invalid', () => {
      LoginPage.login(users.lockedOut.username, users.lockedOut.password);

      LoginPage.elements.username().should('have.class', 'input_error');
      LoginPage.elements.password().should('have.class', 'input_error');
    });

    it('can dismiss the error message', () => {
      LoginPage.login(users.lockedOut.username, users.lockedOut.password);
      LoginPage.elements.errorCloseButton().click();

      LoginPage.elements.error().should('not.exist');
    });

    it('cannot reach the products page directly', () => {
      LoginPage.login(users.lockedOut.username, users.lockedOut.password);
      InventoryPage.visit();

      LoginPage.assertError(messages.inventoryAccessDenied);
    });
  });

  context('negative validation', () => {
    it('shows an error for invalid credentials', () => {
      LoginPage.login(users.invalid.username, users.invalid.password);
      LoginPage.assertError(messages.invalidCredentials);
    });

    it('requires a username', () => {
      LoginPage.login('', users.standard.password);
      LoginPage.assertError(messages.usernameRequired);
    });

    it('requires a password', () => {
      LoginPage.login(users.standard.username, '');
      LoginPage.assertError(messages.passwordRequired);
    });
  });
});
