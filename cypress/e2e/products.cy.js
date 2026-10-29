import InventoryPage from '../pages/InventoryPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';

describe('Products Page (standard_user)', () => {
  beforeEach(() => {
    cy.fixture('users').then(({ standard }) => cy.login(standard.username, standard.password));
    InventoryPage.visit();
  });

  it('lists all 6 products with a name, description, price and image', () => {
    InventoryPage.elements.title().should('have.text', 'Products');
    InventoryPage.elements.items()
      .should('have.length', 6)
      .each(($item) => {
        cy.wrap($item).find('[data-test="inventory-item-name"]').invoke('text').should('not.be.empty');
        cy.wrap($item).find('[data-test="inventory-item-desc"]').invoke('text').should('not.be.empty');
        cy.wrap($item).find('[data-test="inventory-item-price"]').invoke('text').should('match', /^\$\d+\.\d{2}$/);
        cy.wrap($item).find('img').should('be.visible').and('have.attr', 'src').and('not.be.empty');
      });
  });

  context('sorting', () => {
    it('sorts by name A to Z by default', () => {
      InventoryPage.elements.sortDropdown().should('have.value', 'az');
      InventoryPage.getNames().then((names) => {
        expect(names).to.deep.equal([...names].sort());
      });
    });

    it('sorts by name Z to A', () => {
      InventoryPage.sortBy('za');
      InventoryPage.getNames().then((names) => {
        expect(names).to.deep.equal([...names].sort().reverse());
      });
    });

    it('sorts by price low to high', () => {
      InventoryPage.sortBy('lohi');
      InventoryPage.getPrices().then((prices) => {
        expect(prices).to.deep.equal([...prices].sort((a, b) => a - b));
      });
    });

    it('sorts by price high to low', () => {
      InventoryPage.sortBy('hilo');
      InventoryPage.getPrices().then((prices) => {
        expect(prices).to.deep.equal([...prices].sort((a, b) => b - a));
      });
    });
  });

  context('cart badge', () => {
    it('updates the cart badge when products are added and removed', () => {
      InventoryPage.elements.cartBadge().should('not.exist');

      InventoryPage.addToCart('sauce-labs-backpack');
      InventoryPage.elements.cartBadge().should('have.text', '1');

      InventoryPage.addToCart('sauce-labs-bike-light');
      InventoryPage.elements.cartBadge().should('have.text', '2');

      InventoryPage.removeFromCart('sauce-labs-backpack');
      InventoryPage.elements.cartBadge().should('have.text', '1');

      InventoryPage.removeFromCart('sauce-labs-bike-light');
      InventoryPage.elements.cartBadge().should('not.exist');
    });
  });

  context('product details', () => {
    const productName = 'Sauce Labs Backpack';

    it('opens the product details page with matching information', () => {
      cy.contains('[data-test="inventory-item"]', productName)
        .find('[data-test="inventory-item-price"]')
        .invoke('text')
        .then((listPrice) => {
          InventoryPage.openProduct(productName);

          cy.url().should('include', '/inventory-item.html?id=');
          ProductDetailsPage.elements.name().should('have.text', productName);
          ProductDetailsPage.elements.description().should('be.visible');
          ProductDetailsPage.elements.price().should('have.text', listPrice);
          ProductDetailsPage.elements.image().should('be.visible');
        });
    });

    it('adds and removes the product from the details page', () => {
      InventoryPage.openProduct(productName);

      ProductDetailsPage.elements.addToCartButton().click();
      InventoryPage.elements.cartBadge().should('have.text', '1');
      ProductDetailsPage.elements.removeButton().should('be.visible').click();
      InventoryPage.elements.cartBadge().should('not.exist');
    });

    it('navigates back to the products page', () => {
      InventoryPage.openProduct(productName);
      ProductDetailsPage.elements.backButton().click();

      cy.url().should('include', '/inventory.html');
      InventoryPage.elements.items().should('have.length', 6);
    });
  });
});
