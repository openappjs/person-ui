
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
    'margin': 'auto',
    border: "2px solid #fff",
    "border-radius": "4px",
    "box-shadow": "0 1px 1px rgba(136,153,166,0.15)",
  },
  properties: {
    'display': 'inline-block',
    'padding-left': '8px'
  },
  "name": {
    'position': 'absolute',
    'display': 'inline-block',
    'top': 0 ,
    'bottom': 0,
    'margin': 'auto',
    'height': '20px',
    'left': '75px'
  },
  "email": {
    display: 'none'
  },
  "bio": {
    display: "none"
  },
  "handle": {
    display: "none"
  },
  label: {
    'display': 'none'
  },
  img : {
    "border-radius": "3px"
  },
  input: function(readOnly, propName) {
    return readOnly ? { border: 'none', cursor: 'pointer' } : {};
  },
  children: {
    'position': 'relative'
  },
  classList: {
    "prop-location": ['test']
  }

}