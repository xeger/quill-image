import ImageActions from '../ImageActions';

export default class Action {
  formatter: ImageActions;

  constructor(formatter: ImageActions) {
    this.formatter = formatter;
  }

  onCreate(): void {
    return;
  }

  onDestroy(): void {
    return;
  }

  onUpdate(): void {
    return;
  }
}
