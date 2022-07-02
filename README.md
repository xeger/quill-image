# Quill Image

This is a set of Quill modules, designed to be used together, that fully integrate with the Quill Delta format to provide resizable, floatable images that cleanly "round trip" between HTML and JSON.

![Image actions overlay](assets/screenshot.png)

Visit our [code sandbox](https://8fn0sp.csb.app/) to try it out yourself.

## History

This project is a fork and rewrite of [quill-blot-formatter](https://www.npmjs.com/package/quill-blot-formatter), which is itself a fork of [an earlier work](https://github.com/kensnyder/quill-image-resize-module). This project makes the following improvements:

1. Functionality is decomposed into two packages: `@xeger/quill-image-formats` which extends Quill's built-in `Image` blot with new formats; and `@xeger/quill-image-actions` which contains the UI for applying and removing those formats.
1. Instead of applying `align` (an existing block format) to images, we define a new `float` format which allows text to wrap naturally around images.
1. For the "centered image" case, we reuse Quill's existing support for aligning whole lines of text, with the image being part of the line.
1. The packages have been ported from [Flow](https://flow.org/) to [TypeScript](https://www.typescriptlang.org/).
1. The packages do not statically import the `quill` or `parchment` packages, making them more portable and compatible with a wider range of transpilation environments, including "no transpilation" i.e. direct embedding in an HTML page alongside the Quill distribution bundle.

## Getting Started

**Note:** these packages are pure Node modules and do not have default exports. They are distributed with both a CommonJS bundle and an ES module. The primary export from each package is a Quill module, but
additional, nested exports provide access to the implementation details
to facilitate customization. Typings are provided for all exports.

### With a Plain HTML Page

See the [demo page](assets/demo.html) or the [code sandbox](https://8fn0sp.csb.app/) for a complete, working example.

Whenever you `new Quill`, make sure to include the formats _and the modules_ in its configuration; otherwise things will not work right.

### With a React Project

Add the `quill-image` packages to your project's dependencies.

```shell
npm install @xeger/quill-image-actions --save-prod
npm install @xeger/quill-image-formats --save-prod
```

At startup, import the extension modules and register them with `react-quill`'s wrapper of the Quill framework.

```typescript
import { Quill } from 'react-quill';
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';

Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);
```

Whenever you `new ReactQuill`, make sure to include the formats _and the modules_ in its configuration; otherwise things will not work right.

```typescript
import React from 'react';
import ReactQuill from 'react-quill';

const formats = ['align', 'float'];
const modules = {
  imageActions: {},
  imageFormats: {},
  toolbar: [
    [{ 'align': [] }],
    ['clean']
  ]
};

export const Editor(): React.FC = () => (
  <ReactQuill
    formats={formats}
    modules={modules}
    theme="snow"
  />
);
```
