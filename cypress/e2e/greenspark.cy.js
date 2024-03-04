describe("Greenspark challenge Cypress tests", () => {
  beforeEach(() => {
    cy.visit("localhost:3000");
  });

  it("displays 3 widgets", () => {
    cy.get(".CardsContainer").children().should("have.length", 3);
  });

  it("Only one active widget at a time", () => {

    cy.get('input[title="10 trees - Activate badge"]').click({ force: true });
    cy.get('input[title="20 carbon - Activate badge"]').click({ force: true });

    cy.get('input[title="100 plastic bottles - Activate badge"]').should(
      "not.be.checked"
    );

    cy.get('input[title="10 trees - Activate badge"]').should("not.be.checked");
    cy.get('input[title="20 carbon - Activate badge"]').should(
      "be.checked"
    );
  });
});
