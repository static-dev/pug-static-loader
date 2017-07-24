# Pug Static Loader

:recycle: Instead of using this plugin, a combination of [pug-loader](https://github.com/pugjs/pug-loader/) and [apply-loader](https://github.com/mogelbrod/apply-loader) produce the same results:

```js
require('apply-loader!pug-loader!./foo.pug')
```

----

[![npm](http://img.shields.io/npm/v/pug-static-loader.svg?style=flat)](https://badge.fury.io/js/pug-static-loader) [![tests](http://img.shields.io/travis/static-dev/pug-static-loader/master.svg?style=flat)](https://travis-ci.org/static-dev/pug-static-loader) [![dependencies](http://img.shields.io/david/static-dev/pug-static-loader.svg?style=flat)](https://david-dm.org/static-dev/pug-static-loader)
[![coverage](http://img.shields.io/coveralls/static-dev/pug-static-loader.svg?style=flat)](https://coveralls.io/github/static-dev/pug-static-loader)

Webpack loader that compiles [pug](https://github.com/pugjs/pug) to static html

> **Note:** This project is in early development, and versioning is a little different. [Read this](http://markup.im/#q4_cRZ1Q) for more details.

### Why should you care?

This loader is intended to be used in situations where you want webpack to render a static html file rather than a client side template. It's written by the authors of [spike](https://github.com/static-dev/spike), a static website engine with webpack at the core.

If you are looking for a simple, solid, and well maintained webpack loader that renders out pug as html, you have come to the right place.

### Installation

`npm i pug-static-loader -S`

### Usage

Use as usual, passing in any options to `options`. Locals can go to a `locals` configuration key. If you were to set up a simple webpack project using this loader, it would look something like this:

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [{
      loader: 'source-loader'
    }, {
      test: /\.pug$/,
      loader: 'pug-static-loader',
      options: {
        pretty: false,
        locals: { foo: 'bar' }
      }
    }]
  }
}
```

The loader returns the raw compiled html, so that it can be further processed by other loaders if necessary. This makes this loader chain-able. However, raw html is also not valid javascript, so if you try to use this loader on its own, you will get a webpack error. We recommend using [source-loader](https://github.com/static-dev/source-loader) to transform the raw source into an exported string so that it can be consumed by webpack.

Now you might also want to extract out the resulting code and write it to an html file, rather than letting it chill in your javascript output, but that's not part of what a loader can do, so use some plugins or maybe [spike](https://spike.cf) for this instead.

This loader also exposes the source of the original pug files internally for plugins to access, using the `_src` property of each webpack module object.

### License & Contributing

- Details on the license [can be found here](LICENSE.md)
- Details on running tests and contributing [can be found here](contributing.md)
