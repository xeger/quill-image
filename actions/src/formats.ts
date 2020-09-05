import Quill from 'quill';

const Image = Quill.import('formats/image');
const Parchment = Quill.import('parchment');

const STYLES = ['float'];
const STYLE_VALUES: Record<string, string[]> = {
  float: ['left', 'right'],
};

export const Float = new Parchment.Attributor.Style('float', 'float', {
  scope: Parchment.Scope.INLINE_BLOT,
  whitelist: ['left', 'right'],
});

export const Height = new Parchment.Attributor.Attribute('height', 'height', {
  scope: Parchment.Scope.INLINE_BLOT,
});

export const Width = new Parchment.Attributor.Attribute('width', 'width', {
  scope: Parchment.Scope.INLINE_BLOT,
});

export class ImageWithFormats extends Image {
  domNode?: HTMLElement;

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
}
