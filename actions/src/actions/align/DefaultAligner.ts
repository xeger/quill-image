import Quill, { Quill as IQuill } from 'quill';
import { Aligner } from './Aligner';
import { Alignment } from './Alignment';
import DefaultOptions from '../../Options';

const LEFT_ALIGN = 'left';
const CENTER_ALIGN = 'center';
const RIGHT_ALIGN = 'right';

export default class DefaultAligner implements Aligner {
  alignments: {
    [key: string]: Alignment;
  };
  alignAttribute: string;
  applyStyle: boolean;
  quill: IQuill;

  constructor(quill: IQuill, options: typeof DefaultOptions['align']) {
    this.quill = quill;
    this.applyStyle = options.aligner.applyStyle;
    this.alignAttribute = options.attribute;
    this.alignments = {
      [LEFT_ALIGN]: {
        name: LEFT_ALIGN,
        icon: options.icons.left,
        apply: (el: HTMLElement) => {
          const ctx = this.getContext(el);
          if (!ctx) return;
          this.quill.formatLine(ctx.index, 1, 'align', false, 'user');
          this.quill.formatText(ctx.index, 1, 'float', 'left', 'user');
          if (ctx.precedesNewline) {
            this.quill.deleteText(ctx.index + 1, 1, 'user');
          }
        },
      },
      [CENTER_ALIGN]: {
        name: CENTER_ALIGN,
        icon: options.icons.center,
        apply: (el: HTMLElement) => {
          const ctx = this.getContext(el);
          if (!ctx) return;
          if (!ctx.precedesNewline)
            this.quill.insertText(ctx.index + 1, '\n', 'user');
          this.quill.formatLine(ctx.index, 1, 'align', 'center', 'user');
          this.quill.formatText(ctx.index, 1, 'float', false, 'user');
        },
      },
      [RIGHT_ALIGN]: {
        name: RIGHT_ALIGN,
        icon: options.icons.right,
        apply: (el: HTMLElement) => {
          const ctx = this.getContext(el);
          if (!ctx) return;
          this.quill.formatLine(ctx.index, 1, 'align', false, 'user');
          this.quill.formatText(ctx.index, 1, 'float', 'right', 'user');
          if (ctx.precedesNewline) {
            this.quill.deleteText(ctx.index + 1, 1, 'user');
          }
        },
      },
    };
  }

  getContext(el: HTMLElement) {
    const blot = Quill.find(el);
    if (!blot) return null;
    const index = this.quill.getIndex(blot);
    if (typeof index !== 'number') return null;
    const next = this.quill.getContents(index + 1, 1);
    return {
      blot,
      index,
      precedesNewline:
        typeof next.ops[0]?.insert === 'string' &&
        next.ops[0].insert.startsWith('\n'),
    };
  }

  getAlignments(): Alignment[] {
    return Object.keys(this.alignments).map((k) => this.alignments[k]);
  }

  clear(el: HTMLElement): void {
    const ctx = this.getContext(el);
    if (!ctx) return;
    this.quill.formatLine(ctx.index, 1, 'align', false, 'user');
    this.quill.formatText(ctx.index, 1, 'float', 'left', 'user');
    if (ctx.precedesNewline) this.quill.deleteText(ctx.index + 1, 1, 'user');
  }

  isAligned(el: HTMLElement, alignment: Alignment): boolean {
    const ctx = this.getContext(el);
    if (!ctx) return false;
    const contents = this.quill.getContents(ctx.index);
    const [
      {
        insert: { attributes, image },
      },
    ] = contents.ops;
    if (!image) return false;
    switch (alignment.name) {
      case LEFT_ALIGN:
      case RIGHT_ALIGN:
        return attributes?.float === alignment.name;
      case CENTER_ALIGN:
        // TODO: check line formatting (how?)
        return false;
      default:
        return false;
    }
  }
}
