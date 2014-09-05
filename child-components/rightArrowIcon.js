var Icon = require('./icon');

module.exports = function(options) {
  var style = options.style || {};
  var screenReaderText = options.screenReaderText || '';

  return Icon({
    model: {
      puaCode: '&#xE600',
      iconName: 'icon-arrow-right',
      screenReaderText: screenReaderText
    },
    style: style
  }).state;
}