import Quill from 'quill';
const Parchment = Quill.import('parchment');

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
