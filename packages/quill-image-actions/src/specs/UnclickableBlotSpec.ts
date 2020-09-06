import BlotSpec from './BlotSpec';
import ImageActions from '../ImageActions';

const MOUSE_ENTER_ATTRIBUTE = 'data-image-actions-unclickable-bound';
const PROXY_IMAGE_CLASS = 'image-actions__proxy-image';

export default class UnclickableBlotSpec extends BlotSpec {
  selector: string;
  unclickable?: HTMLElement | null;
  nextUnclickable?: HTMLElement | null;
  proxyImage?: HTMLImageElement;

  constructor(formatter: ImageActions, selector: string) {
    super(formatter);
    this.selector = selector;
    this.unclickable = null;
    this.nextUnclickable = null;
  }

  init(): void {
    if (document.body) {
      /*
      it's important that this is attached to the body instead of the root quill element.
      this prevents the click event from overlapping with ImageSpec
       */
      document.body.appendChild(this.createProxyImage());
    }

    this.hideProxyImage();
    this.proxyImage?.addEventListener('click', this.onProxyImageClick);
    this.formatter.quill.on('text-change', this.onTextChange);
  }

  getTargetElement(): HTMLElement | null | undefined {
    return this.unclickable;
  }

  getOverlayElement(): HTMLElement | null | undefined {
    return this.unclickable;
  }

  onHide(): void {
    this.hideProxyImage();
    this.nextUnclickable = null;
    this.unclickable = null;
  }

  createProxyImage(): HTMLElement {
    const canvas = document.createElement('canvas');
    try {
      const context = canvas.getContext('2d');
      if (!context) return canvas;
      context.globalAlpha = 0;
      context.fillRect(0, 0, 1, 1);

      this.proxyImage = document.createElement('img');
      this.proxyImage.src = canvas.toDataURL('image/png');
      this.proxyImage.classList.add(PROXY_IMAGE_CLASS);

      Object.assign(this.proxyImage.style, {
        position: 'absolute',
        margin: '0',
      });

      return this.proxyImage;
    } catch (err) {
      // when using js-dom:
      // Error: Not implemented: ... (without installing the canvas npm package)
      return canvas;
    }
  }

  hideProxyImage(): void {
    if (this.proxyImage)
      Object.assign(this.proxyImage.style, {
        display: 'none',
      });
  }

  repositionProxyImage(unclickable: HTMLElement): void {
    const rect = unclickable.getBoundingClientRect();

    if (this.proxyImage)
      Object.assign(this.proxyImage.style, {
        display: 'block',
        left: `${rect.left + window.pageXOffset}px`,
        top: `${rect.top + window.pageYOffset}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
  }

  onTextChange = (): void => {
    Array.from(
      document.querySelectorAll(
        `${this.selector}:not([${MOUSE_ENTER_ATTRIBUTE}])`
      )
    ).forEach((unclickable) => {
      unclickable.setAttribute(MOUSE_ENTER_ATTRIBUTE, 'true');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:2769
      unclickable.addEventListener('mouseenter', this.onMouseEnter);
    });
  };

  onMouseEnter = (event: MouseEvent): void => {
    const unclickable = event.target;
    if (!(unclickable instanceof HTMLElement)) {
      return;
    }

    this.nextUnclickable = unclickable;
    this.repositionProxyImage(this.nextUnclickable);
  };

  onProxyImageClick = (): void => {
    this.unclickable = this.nextUnclickable;
    this.nextUnclickable = null;
    this.formatter.show(this);
    this.hideProxyImage();
  };
}
