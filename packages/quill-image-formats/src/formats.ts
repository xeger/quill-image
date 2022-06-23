import type { Quill as IQuill } from 'quill';
import type Parchment from 'parchment';

// Must rely on return type inference due to bizarre Parchment typings (right?)
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createFormats(Quill: typeof IQuill) {
  const parchment: typeof Parchment = Quill.import('parchment');

  const Float = new parchment.Attributor.Style('float', 'float', {
    scope: parchment.Scope.INLINE_BLOT,
    whitelist: ['left', 'right'],
  });

  const Height = new parchment.Attributor.Attribute('height', 'height', {
    scope: parchment.Scope.INLINE_BLOT,
  });

  const Width = new parchment.Attributor.Attribute('width', 'width', {
    scope: parchment.Scope.INLINE_BLOT,
  });

  return { Float, Height, Width };
}
