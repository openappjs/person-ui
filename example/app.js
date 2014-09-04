var mercury = require('mercury');
var Person = require('../');
var fs = require('fs');

require('../index.css');



var person = Person({
  model: {
    name: "Mikey Williams",
    email: "dinosaur@example.com",
    bio: "a human from planet earth",
    image: 'data:image/png;base64,' + fs.readFileSync(__dirname + "/images/ahdinosaur.jpeg", "base64"),
    '@id': "mikey-williams"
  },

});

mercury.app(document.body, person.state, Person.render);

