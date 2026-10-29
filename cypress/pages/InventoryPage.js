class InventoryPage {
  elements = {
    title: () => cy.get('[data-test="title"]'),
    items: () => cy.get('[data-test="inventory-item"]'),
    itemNames: () => cy.get('[data-test="inventory-item-name"]'),
    itemPrices: () => cy.get('[data-test="inventory-item-price"]'),
    sortDropdown: () => cy.get('[data-test="product-sort-container"]'),
    cartBadge: () => cy.get('[data-test="shopping-cart-badge"]'),
    cartLink: () => cy.get('[data-test="shopping-cart-link"]'),
    menuButton: () => cy.get('#react-burger-menu-btn'),
    logoutLink: () => cy.get('[data-test="logout-sidebar-link"]'),
  };

  visit() {
    cy.visit('/inventory.html', { failOnStatusCode: false });
  }

  sortBy(option) {
    // option values: az | za | lohi | hilo
    this.elements.sortDropdown().select(option);
  }

  addToCart(productSlug) {
    cy.get(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  removeFromCart(productSlug) {
    cy.get(`[data-test="remove-${productSlug}"]`).click();
  }

  openProduct(productName) {
    this.elements.itemNames().contains(productName).click();
  }

  logout() {
    this.elements.menuButton().click();
    this.elements.logoutLink().should('be.visible').click();
  }

  getNames() {
    return this.elements.itemNames().then(($els) => Cypress._.map($els, 'innerText'));
  }

  getPrices() {
    return this.elements
      .itemPrices()
      .then(($els) => Cypress._.map($els, (el) => parseFloat(el.innerText.replace('$', ''))));
  }
}

export default new InventoryPage();
