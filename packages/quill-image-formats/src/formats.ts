import Quill from 'quill';
import IParchment from 'parchment';

// make sure we get the "real" parchment registry, not a copy
const Parchment: typeof IParchment = Quill.import('parchment');

export const Float = new Parchment.Attributor.Style('float', 'float', {
  scope: Parchment.Scope.INLINE_BLOT,
  whitelist: ['left', 'right'],
});

export const Height = new Parchment.Attributor.Attribute('height', 'height', {
  scope: Parchment.Scope.INLINE_BLOT,
});

export const Width = new Parchment.Attributor.Attribute('width', 'width', {
  scope: Parchment.Scope.INLINE_BLOT,
});
