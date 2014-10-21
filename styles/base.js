var mercury = require('mercury');
var Tag = require('meta-tags');

var tag = Tag({
  model: {
    Name: 'viewport',
    content: 'width=device-width, initial-scale=1'
  }
});



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

  input: mercury.value(inputStyle)
}