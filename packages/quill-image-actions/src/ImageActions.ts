import deepmerge from 'deepmerge';
import type { Quill } from 'quill';

import { Options } from './Options';
import DefaultOptions from './Options';
import Action from './actions/Action';
import BlotSpec from './specs/BlotSpec';

const dontMerge = (destination: any[], source: any[]) => source;

export default class ImageActions {
  static DefaultOptions = DefaultOptions;

  quill: Quill;
  options: typeof DefaultOptions;
  currentSpec?: BlotSpec | null;
  specs: BlotSpec[];
  overlay: HTMLElement;
  actions: Action[];

  constructor(quill: Quill, options: Options = {}) {
    this.quill = quill;
    this.options = deepmerge(DefaultOptions, options, {
      arrayMerge: dontMerge,
    }) as typeof DefaultOptions;
    this.currentSpec = null;
    this.actions = [];
    this.overlay = document.createElement('div');
    this.overlay.classList.add(this.options.overlay.className);
    if (this.options.overlay.style) {
      Object.assign(this.overlay.style, this.options.overlay.style);
    }

    // disable native image resizing on firefox
    document.execCommand('enableObjectResizing', false, 'false'); // eslint-disable-line no-undef
    const {
      root: {
        parentNode: { style },
      },
    } = this.quill;
    style.position = style.position || 'relative';

    this.quill.root.addEventListener('click', this.onClick);
    this.specs = this.options.specs.map((Class) => new Class(this));
    this.specs.forEach((spec) => spec.init());
  }

  show(spec: BlotSpec): void {
    this.currentSpec = spec;
    this.currentSpec.setSelection();
    this.setUserSelect('none');
    this.quill.root.parentNode.appendChild(this.overlay);
    this.repositionOverlay();
    this.createActions(spec);
  }

  hide(): void {
    if (!this.currentSpec) {
      return;
    }

    this.currentSpec.onHide();
    this.currentSpec = null;
    this.quill.root.parentNode.removeChild(this.overlay);
    this.overlay.style.setProperty('display', 'none');
    this.setUserSelect('');
    this.destroyActions();
  }

  update(): void {
    this.repositionOverlay();
    this.actions.forEach((action) => action.onUpdate());
  }

  createActions(spec: BlotSpec): void {
    const actions = spec
      .getActions()
      .filter(
        (ActionClass: any) =>
          !ActionClass.formats.length ||
          ActionClass.formats.some((f) =>
            this.quill.options.formats.includes(f)
          )
      );
    this.actions = actions.map((ActionClass: any) => {
      const action: Action = new ActionClass(this);
      action.onCreate();
      return action;
    });
  }

  destroyActions(): void {
    this.actions.forEach((action: Action) => action.onDestroy());
    this.actions = [];
  }

  repositionOverlay(): void {
    if (!this.currentSpec) {
      return;
    }

    const overlayTarget = this.currentSpec.getOverlayElement();
    if (!overlayTarget) {
      return;
    }

    const parent: HTMLElement = this.quill.root.parentNode;
    const specRect = overlayTarget.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      display: 'block',
      left: `${specRect.left - parentRect.left - 1 + parent.scrollLeft}px`,
      top: `${specRect.top - parentRect.top + parent.scrollTop}px`,
      width: `${specRect.width}px`,
      height: `${specRect.height}px`,
    });
  }

  setUserSelect(value: string): void {
    const props: string[] = [
      'userSelect',
      'mozUserSelect',
      'webkitUserSelect',
      'msUserSelect',
    ];

    props.forEach((prop: string) => {
      // set on contenteditable element and <html>
      this.quill.root.style.setProperty(prop, value);
      if (document.documentElement) {
        document.documentElement.style.setProperty(prop, value);
      }
    });
  }

  onClick = (): void => {
    this.hide();
  };
}
