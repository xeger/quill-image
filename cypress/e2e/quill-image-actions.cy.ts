const BTN = '.image-actions__toolbar-button';
const EDITOR = '.ql-editor';
const IMG = '.ql-editor img';
const OVL = '#editor >.image-actions__overlay';
const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ';

const givenContents = ({
  center,
  float,
}: { center?: true; float?: 'left' | 'right' } = {}) =>
  beforeEach(() =>
    cy.quillSetContents([
      {
        attributes: { header: true },
        insert: 'De Finibus Bonorum et Malorum\n',
      },
      {
        attributes: float ? { float } : undefined,
        insert: {
          image: '256x256.png',
        },
      },
      center
        ? {
            attributes: { align: 'center' },
            insert: '\nHI HI HI',
          }
        : {
            insert: LOREM.repeat(100) + '\n\n',
          },
      {
        attributes: float ? { float } : undefined,
        insert: {
          image: '256x256.png',
        },
      },
      {
        insert: LOREM.repeat(10) + '\n',
      },
    ])
  );

describe('quill-image-actions', () => {
  beforeEach(() => {
    cy.visit('/assets/e2e.html');
  });

  context('selection rectangle', () => {
    givenContents();

    context('when image clicked', () => {
      beforeEach(() => cy.get(IMG).eq(0).click());

      it('pops up', () => {
        cy.get(IMG)
          .eq(0)
          .then(($img) => {
            cy.get(OVL).then(($ovl) => {
              const { top, right, bottom, left } =
                $img[0].getBoundingClientRect();
              const bounds = $ovl[0].getBoundingClientRect();

              expect(bounds.top).to.be.within(top - 1, top + 1);
              expect(bounds.right).to.be.within(right - 1, right + 1);
              expect(bounds.bottom).to.be.within(bottom - 1, bottom + 1);
              expect(bounds.left).to.be.within(left - 1, left + 1);
            });
          });
      });

      context('and editor scrolled', () => {
        beforeEach(() => {
          cy.wait(100).get(EDITOR).scrollTo('center').scrollTo('top');
        });

        it('disappears', () => {
          cy.get(OVL).should('not.exist');
        });
      });
    });

    context('when dragged', () => {
      beforeEach(() => cy.get(IMG).eq(0).click());

      it('resizes from NE', () => {
        cy.get(OVL).drag('topRight', -32, 32);
        cy.get(OVL).invoke('width').should('be.within', 222, 224);
        cy.get(OVL).invoke('height').should('be.within', 222, 224);
      });

      it('resizes from SE', () => {
        cy.get(OVL).drag('bottomRight', -32, -32);
        cy.get(OVL).invoke('width').should('be.within', 222, 224);
        cy.get(OVL).invoke('height').should('be.within', 222, 224);
      });

      it('resizes from SW', () => {
        cy.get(OVL).drag('bottomLeft', 32, -32);
        cy.get(OVL).invoke('width').should('be.within', 222, 224);
        cy.get(OVL).invoke('height').should('be.within', 222, 224);
      });

      it('resizes from NW', () => {
        cy.get(OVL).drag('topLeft', 32, 32);
        cy.get(OVL).invoke('width').should('be.within', 222, 224);
        cy.get(OVL).invoke('height').should('be.within', 222, 224);
      });
    });
  });

  context('action buttons', () => {
    context('given existing content', () => {
      context('float left', () => {
        givenContents({ float: 'left' });

        it('indicates', () => {
          cy.get(IMG).eq(0).should('have.attr', 'style', 'float: left;');
          cy.get(IMG).eq(0).click();
          cy.get(BTN).eq(0).should('have.class', 'is-selected');
        });

        it('resets when clicked', () => {
          cy.get(IMG).eq(0).click();
          cy.get(BTN).eq(0).click();
          cy.get(BTN).eq(0).should('not.have.class', 'is-selected');
          // TODO: fix this irregularity (remove style entirely)
          cy.get(IMG).eq(0).should('have.attr', 'style', '');
        });
      });

      context('center', () => {
        givenContents({ center: true });

        it('indicates', () => {
          cy.get(IMG)
            .eq(0)
            .closest('p')
            .should('have.class', 'ql-align-center');
          cy.get(IMG).eq(0).click();
          cy.get(BTN).eq(1).should('have.class', 'is-selected');
        });

        it('resets when clicked', () => {
          cy.get(IMG).eq(0).click();
          cy.get(BTN).eq(1).click();
          cy.get(BTN).eq(1).should('not.have.class', 'is-selected');
          cy.get(IMG)
            .eq(0)
            .closest('p')
            .should('not.have.class', 'ql-align-center');
        });
      });

      context('float right', () => {
        givenContents({ float: 'right' });

        it('indicates', () => {
          cy.get(IMG).eq(0).should('have.attr', 'style', 'float: right;');
          cy.get(IMG).eq(0).click();
          cy.get(BTN).eq(2).should('have.class', 'is-selected');
        });

        it('resets when clicked', () => {
          cy.get(IMG).eq(0).click();
          cy.get(BTN).eq(2).click();
          cy.get(BTN).eq(2).should('not.have.class', 'is-selected');
          cy.get(IMG).eq(0).should('not.have.attr', 'style', 'float: right;');
        });
      });
    });

    context('when clicked', () => {
      givenContents();

      it('scrolls reasonably', () => {
        cy.get(EDITOR).scrollTo('bottom');
        cy.get(IMG).eq(1).click();
        cy.get(IMG).eq(1).should('be.visible');
      });

      context('action buttons', () => {
        beforeEach(() => cy.get(IMG).eq(0).click());

        it('float left', () => {
          cy.get(BTN).eq(0).click().should('have.class', 'is-selected');
          cy.get(IMG).eq(0).should('have.attr', 'style', 'float: left;');
        });

        it('center', () => {
          cy.get(BTN).eq(1).click().should('have.class', 'is-selected');
          cy.get(IMG).eq(0).should('not.have.attr', 'style');
          cy.get(IMG)
            .eq(0)
            .closest('p')
            .should('have.class', 'ql-align-center');
        });

        it('float right', () => {
          cy.get(BTN).eq(2).click().should('have.class', 'is-selected');
          cy.get(IMG).eq(0).should('have.attr', 'style', 'float: right;');
        });
      });
    });
  });
});
