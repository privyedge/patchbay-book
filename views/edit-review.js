const { Struct, resolve } = require('mutant')
const isEqual = require('lodash.isequal')
const { buildState } = require('../lib/review-state')
const Form = require('./component/review-form')

module.exports = function ReviewEdit (opts) {
  const {
    bookKey,
    review,
    markdown,
    scuttle,
    afterPublish = console.log,
    onCancel = () => {}
  } = opts

  var state = {
    current: Struct(buildState(review)),
    next: Struct(buildState(review))
  }
  
  return Form({
    state: state.next,
    markdown,
    onCancel,
    publish
  })

  function publish () {
    const n = resolve(state.next)
    const c = resolve(state.current)

    if (!isEqual(c, n)) {
      scuttle.async.update(bookKey, n, (err, data) => {
        if (err) return console.error(err)

        afterPublish(data)
      })
    } else
      afterPublish()
  }
}
