const test = require('ava')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const webpack = require('webpack')

const fixturesPath = path.join(__dirname, 'fixtures')

test.cb('compiles a pug template', (t) => {
  const p = path.join(fixturesPath, 'default')
  webpack({
    context: p,
    entry: path.join(p, 'app.js'),
    output: { path: p },
    resolveLoader: { root: path.resolve('..') },
    module: { loaders: [{ test: /\.pug$/, loader: 'lib' }] }
  }, (err, stats) => {
    if (err) { t.end(err) }
    const src = fs.readFileSync(path.join(p, 'bundle.js'), 'utf8')
    t.truthy(src.match('<p>hello world</p>'))
    rimraf(path.join(p, 'bundle.js'), t.end)
  })
})

test.cb('compiles a pug template + tracks dependencies', (t) => {
  const p = path.join(fixturesPath, 'dependencies')
  webpack({
    context: p,
    entry: path.join(p, 'app.js'),
    output: { path: p },
    resolveLoader: { root: path.resolve('..') },
    module: { loaders: [{ test: /\.pug$/, loader: 'lib' }] }
  }, (err, stats) => {
    if (err) { t.end(err) }
    const src = fs.readFileSync(path.join(p, 'bundle.js'), 'utf8')
    t.regex(src, /<p>from partial<\/p>/)
    const dep = stats.compilation.fileDependencies[0]
    t.regex(dep, /_partial.pug/)
    rimraf(path.join(p, 'bundle.js'), t.end)
  })
})

test.cb('accepts locals through options object', (t) => {
  const p = path.join(fixturesPath, 'locals')
  webpack({
    context: p,
    entry: path.join(p, 'app.js'),
    output: { path: p },
    resolveLoader: { root: path.resolve('..') },
    module: { loaders: [{ test: /\.pug$/, loader: 'lib' }] },
    pug: { locals: { foo: () => 'bar' } }
  }, (err, stats) => {
    if (err) { t.end(err) }
    const src = fs.readFileSync(path.join(p, 'bundle.js'), 'utf8')
    t.truthy(src.match('bar'))
    rimraf(path.join(p, 'bundle.js'), t.end)
  })
})

test.cb('throws if options are invalid', (t) => {
  const p = path.join(fixturesPath, 'error')
  webpack({
    context: p,
    entry: path.join(p, 'app.js'),
    output: { path: p },
    resolveLoader: { root: path.resolve('..') },
    module: { loaders: [{ test: /\.pug$/, loader: 'lib' }] },
    pug: { locals: 'wow' }
  }, (_, stats) => {
    if (stats.compilation.errors) {
      const err = stats.compilation.errors[0].toString()
      t.truthy(err.match('"locals" must be an object'))
      t.end()
    } else {
      t.end('no error present with invalid options')
    }
  })
})
