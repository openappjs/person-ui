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
  type: "Person-UI",
  className: "person",
  properties: {
    'position': 'relative',
    'display': 'block',
    'padding': '10px 15px',
    'margin-bottom': '-1px',
    'height': '50px',
    'cursor': 'pointer'
  },
  children: [
    {
      type: "childElement",
      className: "image",
      properties: {
        'position': 'absolute',
        'display':'inline-block',
        'width': '40px',
        'height': '40px',
        'top': 0,
        'bottom': 0,
        'margin': 'auto'
      }
    },
    {
      type: "childElement",
      className: "properties",
      properties: {
        'display': 'inline-block',
        'padding-left': '8px'
      },
      children: [
        {
          type: "childElement",
          className: "prop-name",
          properties: {
            'position': 'absolute',
            'display': 'inline-block',
            'top': 0 ,
            'bottom': 0,
            'margin': 'auto',
            'height': '20px',
            'left': '63px'
          },
          children: [
            {
              type: "childElement",
              className: 'label',
              properties: {
                'display': 'none'
              }
            },
            {
              type: "childElement",
              className: 'input',
              properties: {
                'border': 'none'
              }
            },

          ]
        },
        {
          type: "childElement",
          className: {"not": {pattern: "prop-name"}},
          properties: {
            'display': 'none',
          }
        },
      ]
    },
    {
      type: "childElement",
      className: "children",
      properties: {
        'position': 'relative'
      },
      children: [
        {
          type: "childElement",
          className: "child",
          properties: {
            'height': "32px"
          },
          children: [
          {
            type: 'childElement',
            className: "iconDiv",
            properties: {
              position: 'absolute',
              'font-size': '32px',
              'font-weight': 'bold',
              top: '-14px',
              right: '0px',
              color: '#777777'
            }
          }
          ]
        }
      ]
    }
  ]
}