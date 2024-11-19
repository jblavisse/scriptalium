/// <reference types="cypress" />

// ***********************************************
// Ce fichier commands.ts montre comment créer
// diverses commandes personnalisées et remplacer
// des commandes existantes.
// Pour des exemples plus complets de commandes
// personnalisées, veuillez lire ici :
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (username: string, password: string) => {
    cy.visit('/login')
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.contains('button', 'Se connecter').click()
    
    cy.url().should('include', '/projects')
  
    cy.get('div.text-center > .inline-flex', { timeout: 10000 }).should('be.visible')
  })
  

  Cypress.Commands.add('createProject', (title: string, description: string) => {
    cy.log('Ouverture du modal de création de projet')
    cy.get('div.text-center > .inline-flex').click()
  
    cy.log('Remplissage du formulaire')
    cy.get('input#title').type(title)
    cy.get('textarea#description').type(description)
  
    cy.log('Soumission du formulaire')
    cy.get('.flex-col-reverse > .shadow').click()
  
    cy.log('Vérification de la redirection')
    cy.url().should('match', /\/editor\/\d+/)
  })
  
  declare global {
    namespace Cypress {
      interface Chainable {
        /**
         * Commande personnalisée pour se connecter
         * @example cy.login('username', 'password')
         */
        login(username: string, password: string): Chainable<void>
        createProject(title: string, description: string): Chainable<void>
      }
    }
  }
  

  export {}
  