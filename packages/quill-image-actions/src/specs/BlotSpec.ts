import ImageActions from '../ImageActions';
import AlignAction from '../actions/align/AlignAction';
import ResizeAction from '../actions/ResizeAction';
import DeleteAction from '../actions/DeleteAction';

interface Action {
  onCreate(): void;
  onDestroy(): void;
  onUpdate(): void;
}

interface ExtendsAction {
  new (...rest: any): Action;
}

export default class BlotSpec {
  formatter: ImageActions;

  constructor(formatter: ImageActions) {
    this.formatter = formatter;
  }

  init(): void {
    return;
  }

  getActions(): ExtendsAction[] {
    return [AlignAction, ResizeAction, DeleteAction];
  }

  getTargetElement(): HTMLElement | null | undefined {
    return null;
  }

  getOverlayElement(): HTMLElement | null | undefined {
    return this.getTargetElement();
  }

  setSelection(): void {
    this.formatter.quill.setSelection(null as any);
  }

  onHide(): void {
    return;
  }
}
