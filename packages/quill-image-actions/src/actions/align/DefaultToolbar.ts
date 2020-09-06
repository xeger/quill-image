import { Toolbar } from './Toolbar';
import { Aligner } from './Aligner';
import { Alignment } from './Alignment';
import ImageActions from '../../ImageActions';

export default class DefaultToolbar implements Toolbar {
  toolbar: HTMLElement | null | undefined;
  buttons: HTMLElement[];

  constructor() {
    this.toolbar = null;
    this.buttons = [];
  }

  create(formatter: ImageActions, aligner: Aligner): HTMLElement {
    const toolbar = document.createElement('div');
    toolbar.classList.add(formatter.options.align.toolbar.mainClassName);
    this.addToolbarStyle(formatter, toolbar);
    this.addButtons(formatter, toolbar, aligner);

    this.toolbar = toolbar;
    return this.toolbar;
  }

  destroy(): void {
    this.toolbar = null;
    this.buttons = [];
  }

  getElement(): HTMLElement | null | undefined {
    return this.toolbar;
  }

  addToolbarStyle(formatter: ImageActions, toolbar: HTMLElement): void {
    if (formatter.options.align.toolbar.mainStyle) {
      Object.assign(toolbar.style, formatter.options.align.toolbar.mainStyle);
    }
  }

  addButtonStyle(
    button: HTMLElement,
    index: number,
    formatter: ImageActions
  ): void {
    if (formatter.options.align.toolbar.buttonStyle) {
      Object.assign(button.style, formatter.options.align.toolbar.buttonStyle);
      if (index > 0) {
        button.style.borderLeftWidth = '0'; // eslint-disable-line no-param-reassign
      }
    }

    if (formatter.options.align.toolbar.svgStyle) {
      Object.assign(
        (button.children[0] as HTMLElement).style,
        formatter.options.align.toolbar.svgStyle
      );
    }
  }

  addButtons(
    formatter: ImageActions,
    toolbar: HTMLElement,
    aligner: Aligner
  ): void {
    aligner.getAlignments().forEach((alignment, i) => {
      const button = document.createElement('span');
      button.classList.add(formatter.options.align.toolbar.buttonClassName);
      button.innerHTML = alignment.icon;
      button.addEventListener('click', () => {
        this.onButtonClick(button, formatter, alignment, aligner);
      });
      this.preselectButton(button, alignment, formatter, aligner);
      this.addButtonStyle(button, i, formatter);
      this.buttons.push(button);
      toolbar.appendChild(button);
    });
  }

  preselectButton(
    button: HTMLElement,
    alignment: Alignment,
    formatter: ImageActions,
    aligner: Aligner
  ): void {
    if (!formatter.currentSpec) {
      return;
    }

    const target = formatter.currentSpec.getTargetElement();
    if (!target) {
      return;
    }

    if (aligner.isAligned(target, alignment)) {
      this.selectButton(formatter, button);
    }
  }

  onButtonClick(
    button: HTMLElement,
    formatter: ImageActions,
    alignment: Alignment,
    aligner: Aligner
  ): void {
    if (!formatter.currentSpec) {
      return;
    }

    const target = formatter.currentSpec.getTargetElement();
    if (!target) {
      return;
    }

    this.clickButton(button, target, formatter, alignment, aligner);
  }

  clickButton(
    button: HTMLElement,
    alignTarget: HTMLElement,
    formatter: ImageActions,
    alignment: Alignment,
    aligner: Aligner
  ): void {
    this.buttons.forEach((b) => {
      this.deselectButton(formatter, b);
    });
    if (aligner.isAligned(alignTarget, alignment)) {
      if (formatter.options.align.toolbar.allowDeselect) {
        aligner.clear(alignTarget);
      } else {
        this.selectButton(formatter, button);
      }
    } else {
      this.selectButton(formatter, button);
      alignment.apply(alignTarget);
    }

    formatter.update();
  }

  selectButton(formatter: ImageActions, button: HTMLElement): void {
    button.classList.add('is-selected');
    if (formatter.options.align.toolbar.addButtonSelectStyle) {
      button.style.setProperty('filter', 'invert(20%)');
    }
  }

  deselectButton(formatter: ImageActions, button: HTMLElement): void {
    button.classList.remove('is-selected');
    if (formatter.options.align.toolbar.addButtonSelectStyle) {
      button.style.removeProperty('filter');
    }
  }
}
