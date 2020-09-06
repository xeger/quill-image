import BlotSpec from './BlotSpec';
import ImageActions from '../ImageActions';

export default class ImageSpec extends BlotSpec {
  img: HTMLElement | null | undefined;

  constructor(formatter: ImageActions) {
    super(formatter);
    this.img = null;
  }

  init(): void {
    this.formatter.quill.root.addEventListener('click', this.onClick);
  }

  getTargetElement(): HTMLElement | null | undefined {
    return this.img;
  }

  onHide(): void {
    this.img = null;
  }

  onClick = (event: MouseEvent): void => {
    const el = event.target;
    if (!(el instanceof HTMLElement) || el.tagName !== 'IMG') {
      return;
    }

    this.img = el;
    this.formatter.show(this);
  };
}
