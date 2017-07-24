const pug = require('pug')
const Joi = require('joi')

module.exports = function (source) {
  this.cacheable && this.cacheable(true)

  const _opts = this.query || {}
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
    locals: Joi.object()
  })

  // validate options
  const validated = Joi.validate(_opts, schema)
  if (validated.error) { throw validated.error }
  const opts = validated.value

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
