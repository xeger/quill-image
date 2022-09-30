import type { Quill as IQuill } from 'quill';
import type Parchment from 'parchment';

type EmbedBlot = typeof Parchment.Embed;

type StyleMap = Partial<{
  [key in keyof CSSStyleDeclaration]: string[];
}>;

function isStyled(node: any): node is HTMLElement {
  return node && !!node.style;
}

/**
 * Creates a class that extends Quill's built-in Image format
 * (or a derived class) with functionality to recognize and
 * apply additional formats known to this package.
 *
 * Relies on the base-class implementation for width and height,
 * so it may break if inheritance is not properly preserved, i.e.
 * if another module completely overrides Image.
 *
 * To avoid import-ordering issues, this is a class factory
 * instead of a statically defined class.
 */
export function imageWithFormats(Quill: typeof IQuill): EmbedBlot {
  const Image: EmbedBlot = Quill.import('formats/image');

  const DOWNCONVERT_STYLES = ['width', 'height'];

  const STYLES = ['float'];

  const STYLE_VALUES: StyleMap = {
    float: ['left', 'right'],
  };

  return class ImageWithFormats extends Image {
    static formats(domNode: HTMLElement): { [index: string]: any } {
      // img attributes (width, height, etc)
      const inherited = Image.formats(domNode);

      // CSS styles (float, etc)
      const local = STYLES.reduce((formats, style) => {
        const value = domNode.style[style];
        if (value && STYLE_VALUES[style].indexOf(value) >= 0)
          formats[style] = value;
        return formats;
      }, {});

      // CSS styles that should be attributes, but might be pasted from
      // noncomformant source -- downconvert them to attributes
      const downconverted = DOWNCONVERT_STYLES.reduce((formats, style) => {
        const value = domNode.style[style];
        if (value && value.endsWith('px'))
          formats[style] = value.replace('px', '');
        return formats;
      }, {});

      return Object.assign({}, inherited, downconverted, local);
    }

    format(name: string, value: string): void {
      if (!this.domNode || !isStyled(this.domNode)) return;
      if (STYLES.indexOf(name) >= 0) {
        if (!value || STYLE_VALUES[name].indexOf(value) >= 0) {
          // quill likes `false` to remove a style; DOM likes `null`
          this.domNode.style[name] = value || null;
        }
      } else super.format(name, value);
    }
  };
}
