import { Aligner } from './Aligner';
import ImageActions from '../../ImageActions';

export interface Toolbar {
  create(formatter: ImageActions, alignmentHelper: Aligner): HTMLElement;
  destroy(): void;
  getElement(): HTMLElement | null | undefined;
}
