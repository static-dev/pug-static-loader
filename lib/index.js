const pug = require('pug')
const Joi = require('joi')

module.exports = function (source) {
  this.cacheable && this.cacheable(true)

  const _opts = parseOptions.call(this, this.query) || {}
  const schema = Joi.object().keys({
    filename: Joi.string().default(this.resourcePath),
    pretty: Joi.boolean().default(true),
    doctype: Joi.string(),
    self: Joi.boolean(),
    debug: Joi.boolean(),
    compileDebug: Joi.boolean(),
    cache: Joi.boolean(),
    compiler: Joi.func(),
    parser: Joi.func(),
    globals: Joi.array().single(),
    locals: [Joi.object(), Joi.func()]
  })

  // validate options
  const validated = Joi.validate(_opts, schema)
  if (validated.error) { throw validated.error }
  const opts = validated.value

  // Allows any option to be passed as a function which gets webpack's context
  // as its first argument, in case some info from the loader context is necessary. Courtesy of Reshape-Loader.
  function parseOptions (opts) {
    return removeEmpty({
      plugins: convertFn.call(this, opts.plugins),
      locals: convertFn.call(this, opts.locals),
      filename: convertFn.call(this, opts.filename),
      parserOptions: convertFn.call(this, opts.parserOptions),
      generatorOptions: convertFn.call(this, opts.generatorOptions),
      runtime: convertFn.call(this, opts.runtime),
      parser: convertFnSpecial.call(this, opts.parser),
      multi: convertFn.call(this, opts.multi)
    })
  }

  //Passes context to functions
  function convertFn (opt) {
    return typeof opt === 'function' ? opt(this) : opt
  }

  //Pass context to function if convert is true.
  function convertFnSpecial (opt) {
    return typeof opt === 'function' && opt.convert ? opt(this) : opt
  }

  //Remove empty elements from objects
  function removeEmpty (obj) {
    Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key])
    return obj
  }

  // compile the template to a function
  const tpl = pug.compile(source, opts)

  // add all dependencies to webpack
  tpl.dependencies.map(this.addDependency.bind(this))

  // render template
  const rendered = tpl(opts.locals)

  // make original source available for plugins
  this._module._src = rendered

  // return raw source for processing by other loaders if needed
  return rendered
}
