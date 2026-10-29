class ProductDetailsPage {
  elements = {
    name: () => cy.get('[data-test="inventory-item-name"]'),
    description: () => cy.get('[data-test="inventory-item-desc"]'),
    price: () => cy.get('[data-test="inventory-item-price"]'),
    image: () => cy.get('.inventory_details_img'),
    addToCartButton: () => cy.get('[data-test="add-to-cart"]'),
    removeButton: () => cy.get('[data-test="remove"]'),
    backButton: () => cy.get('[data-test="back-to-products"]'),
  };
}

export default new ProductDetailsPage();
