import Action from '../Action';
import ImageActions from '../../ImageActions';
import DefaultAligner from './DefaultAligner';
import { Aligner } from './Aligner';
import { Toolbar } from './Toolbar';
import DefaultToolbar from './DefaultToolbar';

export default class AlignAction extends Action {
  static formats = ['float'];

  toolbar: Toolbar;
  aligner: Aligner;

  constructor(formatter: ImageActions) {
    super(formatter);
    this.aligner = new DefaultAligner(formatter.quill, formatter.options.align);
    this.toolbar = new DefaultToolbar();
  }

  onCreate(): void {
    const toolbar = this.toolbar.create(this.formatter, this.aligner);
    this.formatter.overlay.appendChild(toolbar);
  }

  onDestroy(): void {
    const toolbar = this.toolbar.getElement();
    if (!toolbar) {
      return;
    }

    this.formatter.overlay.removeChild(toolbar);
    this.toolbar.destroy();
  }
}
