import Parchment from 'parchment';

type EmbedBlot = typeof Parchment.Embed;

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
export function imageWithFormats(Image: EmbedBlot): EmbedBlot {
  const STYLES = ['float'];
  const STYLE_VALUES: Record<string, string[]> = {
    float: ['left', 'right'],
  };

  return class ImageWithFormats extends Image {
    static formats(domNode: HTMLElement): { [index: string]: any } {
      // img attributes (width, height, etc)
      const inherited = Image.formats(domNode);

      // CSS styles (float, etc)
      const local = STYLES.reduce((formats, style) => {
        const value = domNode.style[style as any];
        if (value && STYLE_VALUES[style].indexOf(value) >= 0)
          formats[style] = value;
        return formats;
      }, {} as Record<string, string>);
      const formats = Object.assign({}, inherited, local);

      return formats;
    }

    format(name: string, value: string): void {
      if (!this.domNode) return;
      if (STYLES.indexOf(name) >= 0) {
        if (!value || STYLE_VALUES[name].indexOf(value) >= 0)
          this.domNode.style[name] = value;
      } else super.format(name, value);
    }
  };
}
