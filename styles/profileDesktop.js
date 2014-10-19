var mercury = require('mercury');
var Tag = require('meta-tags');

var tag = Tag({
  model: {
    Name: 'viewport',
    content: 'width=device-width, initial-scale=1'
  }
});

mercury.app(document.head, tag.state, Tag.render)


module.exports = {
  person: {
    'position': 'relative',
    'display': 'block',

  },
  image: {

  },
  properties: {

  },
  "prop-name": {

  },
  "prop-email": {

  },
  "prop-bio": {

  },
  label: {

  },
  input: function(readOnly) {
    return readOnly ? { border: 'none' } : {};
  },
  children: {

  }

}