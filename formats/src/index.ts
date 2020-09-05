import Quill from 'quill';
import * as formats from './formats';
export * as formats from './formats';

export class ImageFormats {
  static register(): void {
    Quill.register('formats/float', formats.Float);
    Quill.register('formats/height', formats.Height);
    Quill.register('formats/width', formats.Width);
    // Quill.register('formats/image', formats.ImageWithFormats, true);
  }
}
