var mercury = require('mercury');
var Tag = require('meta-tags');

var tag = Tag({
  model: {
    Name: 'viewport',
    content: 'width=device-width, initial-scale=1'
  }
});

mercury.app(document.head, tag.state, Tag.render)

function inputStyle(propName, readOnly) {
  var displayed = {
  'position': 'absolute',
  'display': 'inline-block',
  'top': 0 ,
  'bottom': 0,
  'margin': 'auto',
  'height': '20px',
  'left': '63px'
  };

  var hidden = {
    'display': 'none'
  };

  if (propName === 'name') {
    if (readOnly) {
      displayed['border'] = 'none';
      return displayed;   
    } else {
      return displayed;
    }
  } else {
    return hidden;
  };

};

module.exports = {
  person: {
    'position': 'relative',
    'display': 'block',
    'padding': '10px 15px',
    'margin-bottom': '-1px',
    'height': '50px',
  },
  image: {
    'position': 'absolute',
    'display':'inline-block',
    'width': '40px',
    'height': '40px',
    'top': 0,
    'bottom': 0,
    'margin': 'auto'
  },
  properties: {
    'display': 'inline-block',
    'padding-left': '8px'
  },
  label: {
    'display': 'none'          
  },
  input: mercury.value(inputStyle),
  commands: {},
  command: {
    height: '32px'
  }
}