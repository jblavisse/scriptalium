// cypress/e2e/register.spec.js

describe('Page d\'inscription', () => {
    const apiUrl = Cypress.env('NEXT_PUBLIC_API_URL') || 'http://localhost:3000';
  
    beforeEach(() => {
      cy.visit('/register');
    });
  
    it('Devrait s\'inscrire avec des informations valides', () => {
      const username = `user${Date.now()}`;
      const email = `user${Date.now()}@example.com`;
      const password = 'Azerty@123';
  
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('input[name="password2"]').type(password);
      cy.get('button[type="submit"]').should('not.be.disabled').click();
  
      cy.contains('Inscription réussie ! Vous pouvez maintenant vous connecter.').should('be.visible');
  

      cy.url({ timeout: 3000 }).should('include', '/login');
    });
  });