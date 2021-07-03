/// <reference types="cypress" />

describe('Application', () => {
  before(() => {
    cy.viewport('macbook-13')
  })

  afterEach(() => {
    cy.wait(2000)
  })

  it('As a User I should be able to visit application', function () {
    cy.visit(Cypress.env('CYPRESS_BASE_URL'))
    cy.get('body').should('not.have.attr', 'unresolved')
  })

  it('Should be able to navigate to Screen 2 (Form)', () => {
    Cypress.$('[data-cy=buttonForm]').click()
  })

  it('Should present error screen', () => {
    Cypress.$('[data-cy=buttonForm]').click()
    Cypress.$('[data-cy=buttonError]').click()
  })

  it('Should present loading screen', () => {
    Cypress.$('[data-cy=buttonLoading]').click()
  })

  it('Should present success screen', () => {
    Cypress.$('[data-cy=buttonSuccess]').click()
  })
})
