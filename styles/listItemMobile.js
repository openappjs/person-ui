var mercury = require('mercury');
var Tag = require('meta-tags');

var tag = Tag({
  model: {
    Name: 'viewport',
    content: 'width=device-width, initial-scale=1'
  }
});

mercury.app(document.head, tag.state, Tag.render)

// function inputStyle(propName, readOnly) {
//   var displayed = {
//   'position': 'absolute',
//   'display': 'inline-block',
//   'top': 0 ,
//   'bottom': 0,
//   'margin': 'auto',
//   'height': '20px',
//   'left': '63px'
//   };

//   var hidden = {
//     'display': 'none'
//   };

//   if (propName === 'name') {
//     if (readOnly) {
//       displayed['border'] = 'none';
//       return displayed;   
//     } else {
//       return displayed;
//     }
//   } else {
//     return hidden;
//   };

// };

module.exports = {
  person: {
    'position': 'relative',
    'display': 'block',
    'padding': '10px 15px',
    'margin-bottom': '-1px',
    'height': '50px',
    'cursor': 'pointer'
  },
  image: {
    'position': 'absolute',
    'display':'inline-block',
    'width': '48px',
    'height': '48px',
    'top': 0,
    'bottom': 0,
    'margin': 'auto'
  },
  properties: {
    'display': 'inline-block',
    'padding-left': '8px'
  },
  "prop-name": {
    'position': 'absolute',
    'display': 'inline-block',
    'font-size': '20px',
    'top': '24px',
    'margin': 'auto',
    'height': '20px',
    'left': '75px'
  },
  "prop-email": {
    display: 'none'
  },
  "prop-bio": {
    display: "none"
  },
  label: {
    'display': 'none'
  },
  input: function(readOnly) {
    return readOnly ? { border: 'none', cursor: 'pointer' } : {};
  },
  children: {
    'position': 'relative'
  }

}