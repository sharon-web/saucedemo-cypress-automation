class LoginPage {
  elements = {
    username: () => cy.get('[data-test="username"]'),
    password: () => cy.get('[data-test="password"]'),
    loginButton: () => cy.get('[data-test="login-button"]'),
    error: () => cy.get('[data-test="error"]'),
    errorCloseButton: () => cy.get('[data-test="error-button"]'),
    logo: () => cy.get('.login_logo'),
  };

  visit() {
    cy.visit('/');
  }

  login(username, password) {
    if (username) this.elements.username().clear().type(username);
    if (password) this.elements.password().clear().type(password, { log: false });
    this.elements.loginButton().click();
  }

  assertError(message) {
    this.elements.error().should('be.visible').and('have.text', message);
  }
}

export default new LoginPage();
