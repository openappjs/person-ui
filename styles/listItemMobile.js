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
    // TODO add next arrow icon
    style: {
      'position': 'relative',
      'display': 'block',
      'padding': '10px 15px',
      'margin-bottom': '-1px',
      'height': '50px'
    },
    image: {
      style: {
        'position': 'absolute',
        'display':'inline-block',
        'width': '40px',
        'height': '40px',
        'top': 0,
        'bottom': 0,
        'margin': 'auto'
      }
    },
    properties: {
      style: {
        'display': 'inline-block',
        'padding-left': '8px'
      },
      label: {
        style: {
          'display': 'none'          
        }
      },
      input: {
        style: inputStyle
      }
    }
  }
}