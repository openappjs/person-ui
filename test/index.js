var test = require('tape');
var mercury = require('mercury');
var raf = require('raf');
var fs = require('fs');
// var event = require('synthetic-dom-events');
var document = require('global/document');
var isArray = require('isarray');

var Person = require('../');

var listItemMobile = require('../styles/listItemMobile');

function testElementStyle (t, element, styleSpec) {
  for (prop in styleSpec) {
    t.equal(element.style[prop], styleSpec[prop])
  }
}

test("person creation", function (t) {
  // setup
  var person = Person({
    model: {
      name: "Mikey Williams",
      email: "dinosaur@example.com",
      bio: "a human from planet earth",
      image: fs.readFileSync(__dirname + "/ahdinosaur.jpeg")
    },
  });

  // start app
  mercury.app(document.body, person.state, Person.render);

  // after render
  raf(function () {
    var person = document.getElementsByClassName('person')[0];

    //test styles
    testElementStyle(t, person, listItemMobile.person.style);

    var image = person.childNodes[0];
    t.ok(image);
    testElementStyle(t, image, listItemMobile.person.image.style);

    var properties = person.childNodes[1];
    t.ok(properties);
    testElementStyle(t, properties, listItemMobile.person.properties.style)

    var labels = properties.childNodes.map(function(node) {return node.childNodes[0]});
    t.ok(labels);
    labels.forEach(function(label) {
      testElementStyle(t, label, listItemMobile.person.properties.label.style);
    })


    // cleanup
    document.body.removeChild(person);
    t.end();
  });
});
