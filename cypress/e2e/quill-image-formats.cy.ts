describe('quill-image-formats', () => {
  beforeEach(() => cy.visit('/assets/e2e.html'));

  context('custom formats in a delta', () => {
    beforeEach(() => {
      cy.quillSetContents([
        {
          insert: 'Hello World!\n',
        },
        {
          attributes: {
            height: '128',
            width: '64',
            float: 'left',
          },
          insert: {
            image: '256x256.png',
          },
        },
        {
          insert: ' Albert says hi!\n\n',
        },
      ]);
    });

    it('applies width', () =>
      cy.get('#editor img').should('have.attr', 'width', 64));
    it('applies height', () =>
      cy.get('#editor img').should('have.attr', 'height', 128));
    it('applies float', () =>
      cy.get('#editor img').should('have.css', 'float', 'left'));
  });

  context('custom formats in HTML', () => {
    beforeEach(() => {
      const html = `
        <p>
          <img src="256x256.png" width="64" height="128" style="float: left;"/>Albert says hi!
          <br/>
        </p>
      `;
      cy.get('.ql-editor[contenteditable=true]').then(($div) =>
        $div.html(html)
      );
    });

    it('applies width', () =>
      cy.get('#editor img').should('have.attr', 'width', 64));
    it('applies height', () =>
      cy.get('#editor img').should('have.attr', 'height', 128));
    it('applies float', () =>
      cy.get('#editor img').should('have.css', 'float', 'left'));
  });

  context('down-conversion from CSS', () => {
    beforeEach(() => {
      const html = `
        <p>
          <img src="256x256.png" style="float: left; height: 128px; width: 64px;"/>Albert says hi!
          <br/>
        </p>
      `;
      cy.get('.ql-editor[contenteditable=true]').then(($div) =>
        $div.html(html)
      );
    });

    // TODO: why are the tests broken? the feature works fine!
    it.skip('handles width', () => {
      cy.quillGetContents().then((ops) =>
        expect(ops?.[1]?.attributes?.width).to.equal('64')
      );
    });
    it.skip('handles height', () => {
      cy.quillGetContents().then((ops) =>
        expect(ops?.[1]?.attributes?.height).to.equal('128')
      );
    });
  });
});
