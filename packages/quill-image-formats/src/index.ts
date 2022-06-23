import type { Quill as IQuill } from 'quill';
import * as extend from './extend';
export * as extend from './extend';
import * as formats from './formats';
export * as formats from './formats';

/**
 * Perform one-time setup of Quill registry.
 *
 * Ideally we could do this in a static ImageFormats.register, but Quill
 * doesn't pass a reference to the Quill class when it calls the static
 * function, so there's no way for us to access the "right" Quill class
 * and its singleton Parchment registry.
 *
 * As a workaround, we defer registration until our module is constructed,
 * at which point we can reference the editor's constructor to obtain
 * whichever instance of the Quill class we're being used with.
 */
function register(Quill: typeof IQuill) {
  const ImageWithFormats = extend.imageWithFormats(Quill);
  const { Float, Height, Width } = formats.createFormats(Quill);
  Quill.register('formats/float', Float);
  Quill.register('formats/height', Height);
  Quill.register('formats/image', ImageWithFormats, true);
  Quill.register('formats/width', Width);
}

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
  static registered = false;

  constructor(quill: IQuill) {
    if (!ImageFormats.registered) {
      register(quill.constructor as typeof IQuill);
      ImageFormats.registered = true;
    }
  }
}
