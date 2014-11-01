var _ = require('lodash');


module.exports = {
  person: {
    'position': 'relative',
    'flex-direction': 'column',
    'display': 'inline-flex',
    'margin-right': '137px',
    'margin-left': '137px',
    'margin-top': '110px'
  },
  image: {
    order: '0',
    'flex-shrink': 0,
    'display':'inline-block',
    'top': 0,
    'bottom': 0,
    background: "#fff",
    border: "5px solid #fff",
    "border-radius": "12px",
    "box-shadow": "0 1px 1px rgba(136,153,166,0.15)",
    height: "200px",
    position: "relative",
    width: "200px"
  },
  img : {
    "border-radius": "8px"
  },
  properties: {
    display: 'flex',
    "flex-direction": "column",
    'margin': '10px 5px 10px'
  },
  "name": {
  },
  "handle": {
    "margin-top": "-3p"
  },
  "email": {

  },
  "bio": {
    "max-width": "275px",
    "font-size": "14px",
    "font-weight": "400",
    "line-height": "20px",
    "margin-bottom": "10px",
    "margin-right": "10px",
    "word-wrap": "break-word"
  },
  label: {
    display: 'none'
  },
  input: {

  },
  input: function(readOnly, propName) {
    var display = readOnly ? 'none' : 'inline-block';
    var border = readOnly ? 'none' : 'solid';

    var name = {
      "font-weight": "700",
      "font-size": "22px",
      "line-height": "1",
      "word-wrap": "break-word",
      'border': border
    };

    var handle = {
      color: "#707070",
      "margin-top": "2px",
      "font-weight": "700",
      "font-size": "14px",
      "line-height": "1",
      "word-wrap": "break-word",
      'border': border
    };

    var blank = { 
      display: display,
      border: border
    }

    switch(propName) {
      case 'name':
        return name;
      case 'handle':
        return handle;
      // case  'bio':
      //   return bio;
      default:
        return blank;
    }; 
  },
  children: {

  },
  classList : {
    'location': ['test']
  }

}

