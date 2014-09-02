var mercury = require('mercury');
var Person = require('../');
var Anchor = require('./anchor');
// var Image = require('./image');
var fs = require('fs');

require('../index.css');

var anchorStyle = {
  
  
};

// var icon = Image({
//   style: {
//     'position': 'absolute',
//     'display':'inline-block',
//     'top': 0,
//     'bottom': 0,
//     'right': '10px',
//     'margin': 'auto'
//   },
//   model: {
//     src: 'data:image/png;base64,' + fs.readFileSync(__dirname + "/images/glyphicons_223_chevron-right.png", "base64")
//   }
// }).state;

var icon = {};

var anchor = Anchor({
  model: {
    href: '/mikey-williams',
    content: icon
  },
  style: anchorStyle
}).state;

var person = Person({
  model: {
    name: "Mikey Williams",
    email: "dinosaur@example.com",
    bio: "a human from planet earth",
    image: 'data:image/png;base64,' + fs.readFileSync(__dirname + "/images/ahdinosaur.jpeg", "base64"),
    commands: [
      anchor
    ]
  },

});

mercury.app(document.body, person.state, Person.render);

