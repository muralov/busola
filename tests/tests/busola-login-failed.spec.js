/// <reference types="cypress" />
import config from '../config';

const ADDRESS = config.localDev
  ? `http://localhost:4200`
  : `https://busola.${config.domain}`;

context('Busola Login Failed', () => {
  it('Use wrong kubeconfig', () => {
    cy.visit(ADDRESS)
      .get('#textarea-kubeconfig')
      .type('wrong_kubeconfig')
      .get('#apply-kubeconfig')
      .click();

    cy.get('#error').shouldHaveTrimmedText('Error reading kubeconfig.');
  });
});