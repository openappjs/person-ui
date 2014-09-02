var mercury = require('mercury');

var Person = require('../');

var person = Person({
  model: {
    name: "Mikey Williams",
    email: "dinosaur@example.com",
    bio: "a human from planet earth",
  },
});

mercury.app(document.body, person.state, Person.render);
