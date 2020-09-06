import Quill from 'quill';
import * as extend from './extend';
export * as extend from './extend';
import * as formats from './formats';
export * as formats from './formats';

/**
 * Quill module that registers some new formats to enhance image editing.
 * Adds support for width, height and float attributes in Quill Delta and
 * HTML.
 *
 * For basic use, just register this class with Quill; its static register()
 * callback registers all supported formats and the module provides no other
 * functionality.
 *
 * For advanced use, you can skip registering the plugin; import the
 * formats directly from `formats` or `extend` and register them yourself
 * (potentially after providing tweaks or overrides).
 */
export class ImageFormats {
  static register(): void {
    Quill.register('formats/float', formats.Float);
    Quill.register('formats/height', formats.Height);
    Quill.register('formats/width', formats.Width);

    const ImageWithFormats = extend.imageWithFormats(
      Quill.import('formats/image')
    );
    Quill.register('formats/image', ImageWithFormats, true);
  }
}
