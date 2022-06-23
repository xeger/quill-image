import type { DeltaOperation, Quill } from 'quill';

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('quillGetContents', () => cy.window({log: false}).then(win => win.quill.getContents().ops as DeltaOperation[]));
Cypress.Commands.add('quillSetContents', ops => cy.window({log: false}).then(win =>
  win.quill.setContents(ops as any)
));
Cypress.Commands.add('quillSetHTML', html => cy.get('.ql-editor[contenteditable=true]', {log: false}).then($div => $div.html(html)));

declare global {
  namespace Cypress {
    interface ApplicationWindow {
      quill: Quill;
    }

    interface Chainable {
      quillGetContents(): Chainable<DeltaOperation[]>;
      quillSetContents(ops: DeltaOperation[]);
      quillSetHTML(html: string);
    }
  }
}
