describe('Gestion des projets', () => {
    beforeEach(() => {
      cy.login('testt', 'azerty1245')
    })
  
    it('Devrait afficher la liste des projets', () => {
      cy.url().should('include', '/projects')
      cy.get('[id^="project-"]').should('have.length.at.least', 1)
    })
  
    it('Devrait permettre de créer un nouveau projet', () => {
      cy.url().should('include', '/projects')
  
      const projectTitle = 'Projet de Test Cypress'
      const projectDescription = 'Description du projet de test Cypress'
  
      cy.createProject(projectTitle, projectDescription)
      cy.contains(projectTitle).should('be.visible')
    })
  })
  