const moment = require('moment')

module.exports = {
  isDate: function(value, format) {
    return moment(value, format, true).isValid()
  }
}