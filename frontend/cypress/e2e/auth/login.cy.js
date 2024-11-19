describe('Page de connexion', () => {
    it('Devrait permettre à un utilisateur de se connecter avec des informations valides', () => {
      cy.login('testt', 'azerty1245')
      cy.url().should('include', '/projects')
  
    })
  })