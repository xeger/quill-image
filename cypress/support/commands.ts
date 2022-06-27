/* eslint-disable @typescript-eslint/no-namespace */

/// <reference types="cypress" />

import type { DeltaOperation, Quill } from 'quill';

const LOG = { log: false };

Cypress.Commands.add(
  'drag',
  // @ts-expect-error 2769 bogus; why does it do this?!
  { prevSubject: true },
  (
    $subject: JQuery,
    position: Cypress.PositionType,
    dx: number,
    dy: number
  ) => {
    Cypress.log({ $el: $subject, name: 'drag', message: [position, dx, dy] });

    const { width, height } = $subject[0].getBoundingClientRect();
    const x = position.match(/right/i) ? width - 1 : 0;
    const y = position.match(/bottom/i) ? height - 1 : 0;

    return cy
      .wrap($subject, LOG)
      .trigger('mousedown', position, LOG)
      .trigger('mousemove', { x: x + dx, y: y + dy, ...LOG })
      .wrap($subject, LOG)
      .trigger('mouseup', LOG);
  }
);
Cypress.Commands.add('quillGetContents', () =>
  cy.window(LOG).then((win) => win.quill.getContents().ops as DeltaOperation[])
);
Cypress.Commands.add('quillSetContents', (ops) =>
  cy.window(LOG).then((win) => win.quill.setContents(ops as any))
);
Cypress.Commands.add('quillSetHTML', (html) =>
  cy
    .get('.ql-editor[contenteditable=true]', LOG)
    .then(($div) => $div.html(html))
);

declare global {
  namespace Cypress {
    interface ApplicationWindow {
      quill: Quill;
    }

    interface Chainable {
      drag(
        position: Cypress.PositionType,
        dx: number,
        dy: number
      ): Chainable<Element>;
      quillGetContents(): Chainable<DeltaOperation[]>;
      quillSetContents(ops: DeltaOperation[]);
      quillSetHTML(html: string);
    }
  }
}
